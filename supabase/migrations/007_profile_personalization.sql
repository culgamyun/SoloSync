alter table public.user_profiles
  add column if not exists routine_spaces text[] not null default '{}'::text[],
  add column if not exists social_fears text[] not null default '{}'::text[];
