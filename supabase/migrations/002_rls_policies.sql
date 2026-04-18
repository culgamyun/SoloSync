alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_reflections enable row level security;
alter table public.social_health_scores enable row level security;
alter table public.coaching_sessions enable row level security;
alter table public.coaching_messages enable row level security;
alter table public.streaks enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.weekly_check_ins enable row level security;

create policy "users_own_row" on public.users
for all using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_own_row" on public.user_profiles
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "challenges_own_row" on public.challenges
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "reflections_own_row" on public.challenge_reflections
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "scores_own_row" on public.social_health_scores
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "sessions_own_row" on public.coaching_sessions
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "messages_via_session_owner" on public.coaching_messages
for all using (
  exists (
    select 1
    from public.coaching_sessions sessions
    where sessions.id = coaching_messages.session_id
      and sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.coaching_sessions sessions
    where sessions.id = coaching_messages.session_id
      and sessions.user_id = auth.uid()
  )
);

create policy "streaks_own_row" on public.streaks
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "push_subscriptions_own_row" on public.push_subscriptions
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "weekly_check_ins_own_row" on public.weekly_check_ins
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
