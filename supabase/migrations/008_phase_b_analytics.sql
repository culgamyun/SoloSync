create or replace function public.phase_b_usage_report()
returns table (
  week_start_date timestamptz,
  micro_mission_users bigint,
  adjusted_users bigint,
  adjustment_rate numeric,
  smaller_requests bigint,
  different_space_requests bigint,
  safer_line_requests bigint,
  users_with_profile_preferences bigint,
  profile_preference_completion_rate numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  with weekly_micro_mission_users as (
    select distinct
      challenges.user_id,
      challenges.week_start_date
    from public.challenges
    where challenges.mission_kind = 'micro_social'
  ),
  weekly_adjustment_requests as (
    select
      challenges.week_start_date,
      challenge_mission_adjustments.user_id,
      challenge_mission_adjustments.request_type,
      challenge_mission_adjustments.id
    from public.challenge_mission_adjustments
    join public.challenges
      on challenges.id = challenge_mission_adjustments.challenge_id
    where challenges.mission_kind = 'micro_social'
  ),
  weekly_adjusted_users as (
    select distinct
      weekly_adjustment_requests.week_start_date,
      weekly_adjustment_requests.user_id
    from weekly_adjustment_requests
  ),
  users_with_profile_preferences as (
    select distinct
      user_profiles.user_id
    from public.user_profiles
    where coalesce(cardinality(user_profiles.routine_spaces), 0) > 0
       or coalesce(cardinality(user_profiles.social_fears), 0) > 0
  )
  select
    weekly_micro_mission_users.week_start_date,
    count(distinct weekly_micro_mission_users.user_id)::bigint as micro_mission_users,
    count(distinct weekly_adjusted_users.user_id)::bigint as adjusted_users,
    coalesce(
      round(
        count(distinct weekly_adjusted_users.user_id)::numeric
        / nullif(count(distinct weekly_micro_mission_users.user_id), 0),
        4
      ),
      0
    ) as adjustment_rate,
    count(weekly_adjustment_requests.id) filter (where weekly_adjustment_requests.request_type = 'smaller')::bigint as smaller_requests,
    count(weekly_adjustment_requests.id) filter (where weekly_adjustment_requests.request_type = 'different_space')::bigint as different_space_requests,
    count(weekly_adjustment_requests.id) filter (where weekly_adjustment_requests.request_type = 'safer_line')::bigint as safer_line_requests,
    count(
      distinct case
        when users_with_profile_preferences.user_id is not null then weekly_micro_mission_users.user_id
        else null
      end
    )::bigint as users_with_profile_preferences,
    coalesce(
      round(
        count(
          distinct case
            when users_with_profile_preferences.user_id is not null then weekly_micro_mission_users.user_id
            else null
          end
        )::numeric
        / nullif(count(distinct weekly_micro_mission_users.user_id), 0),
        4
      ),
      0
    ) as profile_preference_completion_rate
  from weekly_micro_mission_users
  left join weekly_adjusted_users
    on weekly_adjusted_users.user_id = weekly_micro_mission_users.user_id
   and weekly_adjusted_users.week_start_date = weekly_micro_mission_users.week_start_date
  left join weekly_adjustment_requests
    on weekly_adjustment_requests.user_id = weekly_micro_mission_users.user_id
   and weekly_adjustment_requests.week_start_date = weekly_micro_mission_users.week_start_date
  left join users_with_profile_preferences
    on users_with_profile_preferences.user_id = weekly_micro_mission_users.user_id
  group by weekly_micro_mission_users.week_start_date
  order by weekly_micro_mission_users.week_start_date desc;
$$;

comment on function public.phase_b_usage_report() is
  'Reports weekly Phase B usage for micro-social mission users, including adjustment mix and current profile preference coverage.';

grant execute on function public.phase_b_usage_report() to authenticated, service_role;

create or replace function public.phase_b_return_delta_report()
returns table (
  week_start_date timestamptz,
  adjusted_users bigint,
  adjusted_returned_next_week_users bigint,
  adjusted_next_week_return_rate numeric,
  non_adjusted_users bigint,
  non_adjusted_returned_next_week_users bigint,
  non_adjusted_next_week_return_rate numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  with weekly_micro_mission_users as (
    select distinct
      challenges.user_id,
      challenges.week_start_date
    from public.challenges
    where challenges.mission_kind = 'micro_social'
  ),
  weekly_adjusted_users as (
    select distinct
      challenges.week_start_date,
      challenge_mission_adjustments.user_id
    from public.challenge_mission_adjustments
    join public.challenges
      on challenges.id = challenge_mission_adjustments.challenge_id
    where challenges.mission_kind = 'micro_social'
  ),
  next_week_returns as (
    select distinct
      weekly_micro_mission_users.user_id,
      weekly_micro_mission_users.week_start_date
    from weekly_micro_mission_users
    where exists (
      select 1
      from public.challenges next_challenge
      where next_challenge.user_id = weekly_micro_mission_users.user_id
        and next_challenge.week_start_date >= weekly_micro_mission_users.week_start_date + interval '7 days'
        and next_challenge.week_start_date < weekly_micro_mission_users.week_start_date + interval '14 days'
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
      where next_check_in.user_id = weekly_micro_mission_users.user_id
        and next_check_in.week_start_date >= weekly_micro_mission_users.week_start_date + interval '7 days'
        and next_check_in.week_start_date < weekly_micro_mission_users.week_start_date + interval '14 days'
    )
  )
  select
    weekly_micro_mission_users.week_start_date,
    count(
      distinct case
        when weekly_adjusted_users.user_id is not null then weekly_micro_mission_users.user_id
        else null
      end
    )::bigint as adjusted_users,
    count(
      distinct case
        when weekly_adjusted_users.user_id is not null and next_week_returns.user_id is not null then weekly_micro_mission_users.user_id
        else null
      end
    )::bigint as adjusted_returned_next_week_users,
    coalesce(
      round(
        count(
          distinct case
            when weekly_adjusted_users.user_id is not null and next_week_returns.user_id is not null then weekly_micro_mission_users.user_id
            else null
          end
        )::numeric
        / nullif(
          count(
            distinct case
              when weekly_adjusted_users.user_id is not null then weekly_micro_mission_users.user_id
              else null
            end
          ),
          0
        ),
        4
      ),
      0
    ) as adjusted_next_week_return_rate,
    count(
      distinct case
        when weekly_adjusted_users.user_id is null then weekly_micro_mission_users.user_id
        else null
      end
    )::bigint as non_adjusted_users,
    count(
      distinct case
        when weekly_adjusted_users.user_id is null and next_week_returns.user_id is not null then weekly_micro_mission_users.user_id
        else null
      end
    )::bigint as non_adjusted_returned_next_week_users,
    coalesce(
      round(
        count(
          distinct case
            when weekly_adjusted_users.user_id is null and next_week_returns.user_id is not null then weekly_micro_mission_users.user_id
            else null
          end
        )::numeric
        / nullif(
          count(
            distinct case
              when weekly_adjusted_users.user_id is null then weekly_micro_mission_users.user_id
              else null
            end
          ),
          0
        ),
        4
      ),
      0
    ) as non_adjusted_next_week_return_rate
  from weekly_micro_mission_users
  left join weekly_adjusted_users
    on weekly_adjusted_users.user_id = weekly_micro_mission_users.user_id
   and weekly_adjusted_users.week_start_date = weekly_micro_mission_users.week_start_date
  left join next_week_returns
    on next_week_returns.user_id = weekly_micro_mission_users.user_id
   and next_week_returns.week_start_date = weekly_micro_mission_users.week_start_date
  group by weekly_micro_mission_users.week_start_date
  order by weekly_micro_mission_users.week_start_date desc;
$$;

comment on function public.phase_b_return_delta_report() is
  'Reports weekly next-week return comparisons for adjusted versus non-adjusted micro-social mission users.';

grant execute on function public.phase_b_return_delta_report() to authenticated, service_role;
