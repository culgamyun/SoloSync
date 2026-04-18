create unique index if not exists idx_challenge_reflections_user_challenge_unique
  on public.challenge_reflections(user_id, challenge_id);
