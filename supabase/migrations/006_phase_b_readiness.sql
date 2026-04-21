create table public.challenge_mission_adjustments (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  request_type text not null check (request_type in ('smaller', 'different_space', 'safer_line')),
  previous_mission jsonb not null,
  next_mission jsonb not null,
  created_at timestamptz not null default now()
);

create index idx_challenge_mission_adjustments_user_created_at
  on public.challenge_mission_adjustments(user_id, created_at desc);

create index idx_challenge_mission_adjustments_challenge_created_at
  on public.challenge_mission_adjustments(challenge_id, created_at desc);

alter table public.challenge_mission_adjustments enable row level security;

create policy "mission_adjustments_own_row" on public.challenge_mission_adjustments
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
