-- Migration 003: problems

create type problem_status as enum (
  'open', 'validating',
  -- later phases — defined now for forward compat (architecture.md ADR-003)
  'challenge_open', 'proposal_review', 'selected',
  'being_built', 'beta', 'live', 'solved',
  -- terminal
  'expired', 'archived', 'cancelled'
);

create type problem_frequency as enum ('daily', 'weekly', 'monthly', 'rarely');
create type urgency_level as enum ('low', 'medium', 'high', 'critical');

create table if not exists public.problems (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  user_id             uuid not null references public.profiles(id) on delete cascade,

  -- required fields (PRD §8.2)
  title               text not null,
  description         text not null,
  category_id         bigint not null references public.categories(id),
  frequency           problem_frequency not null,

  -- optional fields
  audience            text,
  location_scope      text,
  current_workaround  text,
  urgency_level       urgency_level,

  -- lifecycle
  status              problem_status not null default 'open',

  -- denormalized counters (signal rows are authoritative)
  me_too_count        integer not null default 0,
  want_this_count     integer not null default 0,
  dev_interest_count  integer not null default 0,

  -- score columns (architecture.md §4.3)
  -- V1 active: demand_score, frequency_score, recency_score, priority_score
  -- Deferred: dev_interest_score, urgency_score, quality_score (schema compat only)
  demand_score        numeric(5,2) not null default 0,
  frequency_score     numeric(5,2) not null default 0,
  recency_score       numeric(5,2) not null default 0,
  dev_interest_score  numeric(5,2) not null default 0,  -- NOT used in V1 ranking
  urgency_score       numeric(5,2) not null default 0,  -- NOT used in V1 ranking
  quality_score       numeric(5,2) not null default 0,  -- NOT used in V1 ranking
  priority_score      numeric(5,2) not null default 0,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Input validation constraints (PRD §8.2)
alter table public.problems
  add constraint problems_title_length    check (char_length(title) between 10 and 120),
  add constraint problems_desc_length     check (char_length(description) between 20 and 600),
  add constraint problems_audience_length check (audience is null or char_length(audience) <= 200),
  add constraint problems_workaround_len  check (current_workaround is null or char_length(current_workaround) <= 400);

-- Full-text search index (architecture.md §10)
alter table public.problems add column search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(audience, '') || ' ' ||
      coalesce(current_workaround, '')
    )
  ) stored;

create index problems_search_idx on public.problems using gin(search_vector);
create index problems_priority_idx on public.problems (priority_score desc) where status in ('open', 'validating');
create index problems_created_idx  on public.problems (created_at desc);
create index problems_user_idx     on public.problems (user_id);
create index problems_category_idx on public.problems (category_id);

-- updated_at trigger
create trigger problems_updated_at
  before update on public.problems
  for each row execute function public.handle_updated_at();

-- Slug generation helper
create or replace function public.generate_slug(title text)
returns text language plpgsql as $$
declare
  base_slug text;
  final_slug text;
  counter   int := 0;
begin
  base_slug := lower(regexp_replace(trim(title), '[^a-z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  base_slug := left(base_slug, 80);
  final_slug := base_slug;
  loop
    if not exists (select 1 from public.problems where slug = final_slug) then
      return final_slug;
    end if;
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
end;
$$;
