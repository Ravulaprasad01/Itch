-- Migration 001: profiles
-- Linked 1:1 to auth.users

create type user_role as enum ('problem_poster', 'developer', 'both', 'admin');

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  role        user_role not null default 'problem_poster',
  bio         text,
  avatar_url  text,
  github_url  text,
  website_url text,
  verified_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- username constraints
alter table public.profiles
  add constraint profiles_username_length check (char_length(username) between 3 and 30),
  add constraint profiles_username_format check (username ~ '^[a-z0-9_-]+$');

-- auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    -- derive initial username from email prefix; ensure uniqueness via suffix
    split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
