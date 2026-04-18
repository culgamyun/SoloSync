alter table public.challenges
  add column if not exists mission_kind text not null default 'standard'
    check (mission_kind in ('standard', 'micro_social')),
  add column if not exists mission_context text,
  add column if not exists safe_line text,
  add column if not exists minimum_win text,
  add column if not exists fear text,
  add column if not exists reframe text;

alter table public.challenge_reflections
  add column if not exists outcome text
    check (outcome in ('greeted', 'said_line', 'could_not_do_it'));

create index if not exists idx_challenges_micro_mission_week_status
  on public.challenges(user_id, mission_kind, week_start_date, status);

create index if not exists idx_challenge_reflections_user_outcome
  on public.challenge_reflections(user_id, outcome, created_at);

create or replace function public.micro_mission_return_report()
returns table (
  failed_week_start_date timestamptz,
  failed_or_skipped_users bigint,
  returned_next_week_users bigint,
  next_week_return_rate numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  with failed_attempts as (
    select distinct
      challenges.user_id,
      challenges.week_start_date as failed_week_start_date
    from public.challenges
    left join public.challenge_reflections
      on challenge_reflections.challenge_id = challenges.id
     and challenge_reflections.user_id = challenges.user_id
    where challenges.mission_kind = 'micro_social'
      and (
        challenges.status = 'skipped'
        or challenge_reflections.outcome = 'could_not_do_it'
      )
  ),
  next_week_activity as (
    select distinct
      failed_attempts.user_id,
      failed_attempts.failed_week_start_date
    from failed_attempts
    where exists (
      select 1
      from public.challenges next_challenge
      where next_challenge.user_id = failed_attempts.user_id
        and next_challenge.week_start_date >= failed_attempts.failed_week_start_date + interval '7 days'
        and next_challenge.week_start_date < failed_attempts.failed_week_start_date + interval '14 days'
        and (
          next_challenge.status in ('in_progress', 'completed', 'skipped')
          or next_challenge.started_at is not null
          or next_challenge.completed_at is not null
          or exists (
            select 1
            from public.challenge_reflections next_reflection
            where next_reflection.challenge_id = next_challenge.id
              and next_reflection.user_id = next_challenge.user_id
          )
        )
    )
    or exists (
      select 1
      from public.weekly_check_ins next_check_in
      where next_check_in.user_id = failed_attempts.user_id
        and next_check_in.week_start_date >= failed_attempts.failed_week_start_date + interval '7 days'
        and next_check_in.week_start_date < failed_attempts.failed_week_start_date + interval '14 days'
    )
  )
  select
    failed_attempts.failed_week_start_date,
    count(distinct failed_attempts.user_id)::bigint as failed_or_skipped_users,
    count(distinct next_week_activity.user_id)::bigint as returned_next_week_users,
    coalesce(
      round(
        count(distinct next_week_activity.user_id)::numeric
        / nullif(count(distinct failed_attempts.user_id), 0),
        4
      ),
      0
    ) as next_week_return_rate
  from failed_attempts
  left join next_week_activity
    on next_week_activity.user_id = failed_attempts.user_id
   and next_week_activity.failed_week_start_date = failed_attempts.failed_week_start_date
  group by failed_attempts.failed_week_start_date
  order by failed_attempts.failed_week_start_date desc;
$$;

comment on function public.micro_mission_return_report() is
  'Reports, by failed/skipped micro-mission week, how many users returned with next-week challenge activity or a weekly check-in. Authenticated users see rows allowed by RLS; service role can aggregate across all users.';

grant execute on function public.micro_mission_return_report() to authenticated, service_role;
