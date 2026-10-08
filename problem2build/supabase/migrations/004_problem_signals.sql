-- Migration 004: problem_signals + counter triggers + priority score

-- NOTE: No 'upvote' type exists. The canonical types are me_too, want_this, dev_interest.
-- (architecture.md §4.4, rules.md §3)
create type signal_type as enum ('me_too', 'want_this', 'dev_interest');

create table if not exists public.problem_signals (
  id          uuid primary key default gen_random_uuid(),
  problem_id  uuid not null references public.problems(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        signal_type not null,
  created_at  timestamptz not null default now(),

  -- one signal per user per problem per type (rules.md §3.1-3.3)
  unique (problem_id, user_id, type)
);

create index signals_problem_idx on public.problem_signals (problem_id);
create index signals_user_idx    on public.problem_signals (user_id);

-- ─────────────────────────────────────────────────────────────
-- Priority Score calculation (V1 formula — PRD §9, rules.md §4)
--
-- Priority Score = 50% Demand + 25% Frequency + 25% Recency
-- Demand = normalize(0.60 * me_too + 0.40 * want_this)
-- Frequency: daily=1.0, weekly=0.75, monthly=0.5, rarely=0.25
-- Recency: exponential decay, half-life 14 days, anchored to updated_at
--
-- dev_interest_score / urgency_score / quality_score are NOT used in V1 ranking.
-- ─────────────────────────────────────────────────────────────
create or replace function public.recalculate_priority(p_id uuid)
returns void language plpgsql as $$
declare
  p                public.problems%rowtype;
  total_problems   int;
  max_demand_raw   numeric;
  demand_raw       numeric;
  demand_norm      numeric;
  freq_score       numeric;
  recency_score    numeric;
  days_since       numeric;
  new_priority     numeric;
begin
  select * into p from public.problems where id = p_id;
  if not found then return; end if;

  -- Raw demand (weighted combination — architecture.md §11)
  demand_raw := 0.60 * p.me_too_count + 0.40 * p.want_this_count;

  -- Normalize demand: simple log-scale (log2(1 + raw) / log2(1 + 100)) capped at 1
  -- Denominator calibrates to ~100 signals = full demand. Adjust after real data.
  demand_norm := least(1.0, ln(1 + demand_raw) / ln(1 + 100));

  -- Frequency score
  freq_score := case p.frequency
    when 'daily'   then 1.00
    when 'weekly'  then 0.75
    when 'monthly' then 0.50
    when 'rarely'  then 0.25
    else 0.25
  end;

  -- Recency score: exponential decay, half-life 14 days from last update
  days_since := extract(epoch from (now() - p.updated_at)) / 86400.0;
  recency_score := power(0.5, days_since / 14.0);

  -- V1 priority score (0–100)
  new_priority := round(
    (0.50 * demand_norm + 0.25 * freq_score + 0.25 * recency_score) * 100,
    2
  );

  update public.problems set
    demand_score   = round(demand_norm * 100, 2),
    frequency_score = round(freq_score * 100, 2),
    recency_score  = round(recency_score * 100, 2),
    priority_score = new_priority,
    updated_at     = now()
  where id = p_id;
end;
$$;

-- Counter + score update after signal INSERT/DELETE
create or replace function public.handle_signal_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    update public.problems set
      me_too_count       = me_too_count       + case when NEW.type = 'me_too'       then 1 else 0 end,
      want_this_count    = want_this_count    + case when NEW.type = 'want_this'    then 1 else 0 end,
      dev_interest_count = dev_interest_count + case when NEW.type = 'dev_interest' then 1 else 0 end
    where id = NEW.problem_id;
    perform public.recalculate_priority(NEW.problem_id);
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.problems set
      me_too_count       = greatest(0, me_too_count       - case when OLD.type = 'me_too'       then 1 else 0 end),
      want_this_count    = greatest(0, want_this_count    - case when OLD.type = 'want_this'    then 1 else 0 end),
      dev_interest_count = greatest(0, dev_interest_count - case when OLD.type = 'dev_interest' then 1 else 0 end)
    where id = OLD.problem_id;
    perform public.recalculate_priority(OLD.problem_id);
    return OLD;
  end if;
  return null;
end;
$$;

create trigger on_signal_change
  after insert or delete on public.problem_signals
  for each row execute function public.handle_signal_change();
