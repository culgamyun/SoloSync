create extension if not exists pgcrypto;
create extension if not exists pg_net;
create extension if not exists pg_cron;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, avatar_url, locale, timezone, onboarding_completed)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce((new.raw_user_meta_data ->> 'locale')::text, 'ko'),
    coalesce((new.raw_user_meta_data ->> 'timezone')::text, 'UTC'),
    false
  )
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(excluded.display_name, public.users.display_name),
      avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
      updated_at = now();

  insert into public.streaks (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  locale text not null default 'ko' check (locale in ('ko', 'en')),
  timezone text not null default 'UTC',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  living_situation text check (living_situation in ('alone', 'with_partner', 'with_family', 'with_roommates')),
  city text,
  social_satisfaction_score int check (social_satisfaction_score between 1 and 10),
  introversion_level int check (introversion_level between 1 and 10),
  relationship_map jsonb not null default '{}'::jsonb,
  barriers text[] not null default '{}'::text[],
  goals text[] not null default '{}'::text[],
  comfort_level text not null default 'medium' check (comfort_level in ('very_low', 'low', 'medium', 'high', 'very_high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_number int not null,
  week_start_date timestamptz not null,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null check (category in ('reach_out', 'deepen', 'explore', 'maintain')),
  estimated_time text not null default '30min' check (estimated_time in ('10min', '30min', '1hr', '2hr+')),
  conversation_starters text[] not null default '{}'::text[],
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'skipped')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start_date, title)
);

create table if not exists public.challenge_reflections (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  mood_before int check (mood_before between 1 and 5),
  mood_after int check (mood_after between 1 and 5),
  difficulty_felt int check (difficulty_felt between 1 and 5),
  reflection_text text,
  ai_feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.social_health_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  score int not null check (score between 0 and 100),
  insight text,
  breakdown jsonb not null,
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.coaching_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_type text not null check (session_type in ('coaching', 'reflection', 'check_in', 'crisis_redirect')),
  summary text,
  turn_count int not null default 0,
  last_message_at timestamptz,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.coaching_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.coaching_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  total_challenges_completed int not null default 0,
  level text not null default 'bronze' check (level in ('bronze', 'silver', 'gold', 'platinum')),
  xp int not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, endpoint)
);

create table if not exists public.weekly_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_start_date timestamptz not null,
  satisfaction_score int not null check (satisfaction_score between 1 and 5),
  energy_score int not null check (energy_score between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start_date)
);

create index if not exists idx_challenges_user_status on public.challenges(user_id, status);
create index if not exists idx_challenges_user_week on public.challenges(user_id, week_start_date desc);
create index if not exists idx_coaching_messages_session on public.coaching_messages(session_id, created_at);
create index if not exists idx_scores_user_date on public.social_health_scores(user_id, measured_at desc);
create index if not exists idx_push_subscriptions_user on public.push_subscriptions(user_id, enabled);

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

create trigger set_challenges_updated_at
before update on public.challenges
for each row execute function public.set_updated_at();

create trigger set_streaks_updated_at
before update on public.streaks
for each row execute function public.set_updated_at();

create trigger set_push_subscriptions_updated_at
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

create trigger set_weekly_check_ins_updated_at
before update on public.weekly_check_ins
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
