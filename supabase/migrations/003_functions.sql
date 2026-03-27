create or replace function public.current_week_start_for_timezone(tz text)
returns timestamptz
language sql
stable
as $$
  select date_trunc('week', now() at time zone tz) at time zone tz;
$$;

create or replace function public.is_monday_midnight_for_timezone(tz text)
returns boolean
language sql
stable
as $$
  select extract(isodow from now() at time zone tz) = 1
     and extract(hour from now() at time zone tz) = 0;
$$;

create or replace function public.is_sunday_2359_for_timezone(tz text)
returns boolean
language sql
stable
as $$
  select extract(isodow from now() at time zone tz) = 7
     and extract(hour from now() at time zone tz) = 23;
$$;

comment on function public.is_monday_midnight_for_timezone is 'Used by the hourly Edge Function scan to identify users due for new weekly challenges.';
comment on function public.is_sunday_2359_for_timezone is 'Used by the hourly Edge Function scan to identify users due for score rollups.';

-- Example cron wiring once function URLs and secrets are configured in project vault:
-- select cron.schedule(
--   'solosync-hourly-social-jobs',
--   '0 * * * *',
--   $$
--   select net.http_post(
--     url := 'https://<project-ref>.supabase.co/functions/v1/generate-challenges',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
--     ),
--     body := '{"scheduled":true}'::jsonb
--   );
--   $$
-- );
