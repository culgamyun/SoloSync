# Post-Phase-B Analytics Implementation Plan

Last updated: 2026-04-22
Status: implemented locally on `codex/phase-b-analytics`, merge pending

## Goal

Give the operator one reliable way to answer whether Phase B is being used and whether it appears to improve next-week return.

This slice should make the following questions cheap to answer:

1. Are users actually using mission adjustments?
2. Which adjustment type is used most often?
3. Do adjusted users return the following week more often than non-adjusted users?
4. How many active users have filled out routine spaces or social fears?

## Current Observed State

What already exists in `main`:

- `public.micro_mission_return_report()` reports failed/skipped-user next-week return.
- `public.challenge_mission_adjustments` logs `smaller`, `different_space`, and `safer_line` requests.
- `public.user_profiles` stores `routine_spaces` and `social_fears`.
- `weekly_check_ins` already exists and is used as a sign of next-week activity.

Observed gap in the current repo state:

- Docs mention a `report:micro-missions` operator flow, but `package.json` does not currently expose that script and there is no visible report runner file in the repo.

6A should fix that by restoring a stable operator report entrypoint instead of assuming one already exists.

## Current Implementation Status

Implemented on the working branch:

- `supabase/migrations/008_phase_b_analytics.sql`
  - adds `public.phase_b_usage_report()`
  - adds `public.phase_b_return_delta_report()`
- `scripts/phase-b-analytics-report.mjs`
- `scripts/micro-mission-return-report.mjs`
- `package.json`
  - `npm run report:phase-b`
  - `npm run report:micro-missions`
- `tests/unit/phase-b-reporting.test.ts`

Validated in this branch:

- `npm run check`
- `npm run build`
- `npx supabase db push`
- `npm run report:phase-b -- --week=2026-04-20`
- `npm run report:micro-missions -- --week=2026-04-20`

Current live output is an empty-state report on the connected dataset, which is acceptable and confirms the commands work end to end.

## Scope Decision

Build 6A as an operator-only reporting slice.

Do:

- add SQL RPCs for Phase B usage and return comparisons
- add one local CLI report entrypoint
- document the command and expected output

Do not:

- build an in-app admin dashboard
- add charts to the product UI
- overclaim causal lift from personalization history we do not actually store

## Key Measurement Decisions

### Adjustment analytics

This is fully measurable now because `challenge_mission_adjustments` exists.

We can report:

- adjustment users by week
- adjustment requests by type and week
- adjusted-user next-week return vs non-adjusted-user next-week return

### Personalization analytics

This is only partially measurable now.

What we can measure honestly in 6A:

- how many active users currently have at least one `routine_space` or `social_fear`
- current profile personalization completion rate

What we should not claim yet:

- historical mission-start or return lift for personalized vs non-personalized cohorts

Reason:

- we do not yet store a time-versioned snapshot of whether a given challenge was generated with personalization turned on

If that historical split becomes necessary, add generation audit metadata in a later slice instead of inferring it from today's profile rows.

## Deliverables

### 1. SQL RPC: `public.phase_b_usage_report()`

Purpose:

- summarize weekly Phase B usage without needing ad-hoc SQL

Proposed output columns:

- `week_start_date`
- `micro_mission_users`
- `adjusted_users`
- `adjustment_rate`
- `smaller_requests`
- `different_space_requests`
- `safer_line_requests`
- `users_with_profile_preferences`
- `profile_preference_completion_rate`

Definition notes:

- `micro_mission_users`: distinct users with a `micro_social` challenge in the week
- `adjusted_users`: distinct users with at least one adjustment row linked to a challenge from that week
- `users_with_profile_preferences`: distinct active users whose profile has at least one routine space or social fear

### 2. SQL RPC: `public.phase_b_return_delta_report()`

Purpose:

- compare next-week return for adjusted vs non-adjusted micro-mission users

Proposed output columns:

- `week_start_date`
- `adjusted_users`
- `adjusted_returned_next_week_users`
- `adjusted_next_week_return_rate`
- `non_adjusted_users`
- `non_adjusted_returned_next_week_users`
- `non_adjusted_next_week_return_rate`

Definition notes:

- reuse the same "returned next week" logic already established in `micro_mission_return_report()`
- keep the comparison scoped to users who had a `micro_social` challenge in the given week

### 3. CLI report runner

Add a single local operator entrypoint, for example:

- `scripts/phase-b-analytics-report.mjs`
- `npm run report:phase-b`

Behavior:

- reads `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- prints a readable markdown-like console report by default
- supports `--json`
- optionally supports `--week YYYY-MM-DD` to focus on one week

Output sections:

1. Phase B usage summary
2. Adjustment mix
3. Adjusted vs non-adjusted return delta
4. Current profile preference coverage

### 4. Documentation

Update:

- `ENV_LOCAL_SETUP.md` or `README.md`
- `docs/phase-b-readiness-report.md`
- roadmap/worklog if scope decisions changed

## Candidate Files

- `supabase/migrations/008_phase_b_analytics.sql`
- `scripts/phase-b-analytics-report.mjs`
- `package.json`
- `tests/unit/phase-b-analytics-report.test.mjs`
- optional SQL assertion or fixture test helpers if the repo already has a pattern

## Implementation Order

1. Add SQL RPCs in one migration.
2. Regenerate/update Supabase types if needed.
3. Build the local report runner against the new RPCs.
4. Add `package.json` script entry.
5. Add unit tests for CLI formatting and env-var failure behavior.
6. Update docs.
7. Run the report once against remote after `db push` to validate the output shape.

## Query Design Notes

### Return logic

Do not invent a new return definition for 6A.

Reuse the current rule:

- next-week challenge activity counts
- next-week weekly check-in counts

This keeps 6A comparable to the existing V1 retention report.

### Week anchor

Use `challenges.week_start_date` as the anchor for weekly aggregates.

For adjustment rows:

- join back to the challenge row to avoid relying on adjustment `created_at` alone

### Current profile coverage

Treat a profile as "filled" when either of these is true:

- `cardinality(routine_spaces) > 0`
- `cardinality(social_fears) > 0`

The denominator should be weekly active micro-mission users, not all users in the database.

## Tests

Minimum required coverage:

### SQL / report behavior

- missing env vars returns a clear non-zero error
- RPC output renders readable tables
- `--json` prints machine-readable output
- focused week mode filters the output correctly

### Metric correctness

- user with multiple adjustments in one week counts once for `adjusted_users`
- request-type counts still reflect total requests by type
- users without adjustments stay in the non-adjusted cohort
- next-week return counts follow the existing challenge/check-in definition
- profile preference coverage ignores users with empty arrays

## Failure Modes

| Area | Failure mode | Expected handling |
| --- | --- | --- |
| CLI | missing env vars | clear non-zero error |
| SQL RPC | remote migration drift | explicit error naming the missing RPC |
| usage report | double-counting multi-adjust users | distinct-user aggregation |
| return delta | mismatch with V1 report logic | reuse the same return predicate |
| personalization coverage | overstated historical lift | report current coverage only |

## Non-Goals

- no admin route
- no charting library work
- no cron job or scheduled email summary
- no historical personalization backfill

## Acceptance Criteria

- operator can run one command and see Phase B usage + return deltas
- adjusted vs non-adjusted next-week return is visible by week
- current profile preference completion is visible for active micro-mission users
- docs tell a future agent exactly how to rerun the report

## Recommended Follow-On

If 6A shows that adjustments are used but return does not improve, prioritize 6B Weekly Recovery Check-In.

If 6A shows strong local behavior but QA is still fragile, prioritize 6C Preview QA Hardening next.
