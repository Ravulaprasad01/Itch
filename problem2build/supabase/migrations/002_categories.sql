-- Migration 002: categories + seed data

create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  name        text unique not null,
  slug        text unique not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Seed the 8 V1 categories (from architecture.md §4.2)
insert into public.categories (name, slug, description) values
  ('Health',    'health',    'Physical and mental wellbeing, healthcare, fitness'),
  ('Money',     'money',     'Personal finance, banking, budgeting, expenses'),
  ('Work',      'work',      'Workplace, productivity, career, freelance'),
  ('Home',      'home',      'Home management, utilities, maintenance, renting'),
  ('Education', 'education', 'Learning, courses, schools, skill-building'),
  ('Travel',    'travel',    'Transport, navigation, accommodation, commuting'),
  ('Family',    'family',    'Parenting, relationships, household coordination'),
  ('Other',     'other',     'Problems that don''t fit the above categories')
on conflict (slug) do nothing;
