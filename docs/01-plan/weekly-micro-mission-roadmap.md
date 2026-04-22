# Weekly Micro-Mission Roadmap

Last updated: 2026-04-21
Status: active

## How To Use This File

Future agents should read this roadmap first, then `docs/weekly-micro-mission-worklog.md`, then the latest relevant checkpoint in `docs/checkpoints/`, then verify `git status` and any relevant diff.

This roadmap is the product-priority source of truth. The worklog is the execution-state source of truth. Git is the final truth for what is actually implemented.

## Product Thesis

SoloSync should not begin as a friend-making, dating, meetup, or therapy product. Its first wedge is a weekly low-pressure social re-entry mission for 수도권 20대 1인 가구 직장인 whose after-work routine has little safe social contact.

The product earns trust by helping users create small counterexamples to "나는 인생 노답이다", especially after skipped or awkward attempts.

## Strategic Decisions

- Start with Approach A: Weekly Micro-Mission MVP.
- Graduate to Approach B: Social Recovery Loop only after V1 shows failed/skipped users returning the next week.
- Do not build in-app matching in this slice.
- Do not optimize for paid conversion in the first slice.
- Avoid ads in vulnerable reflection moments.
- Treat failure reflection as a success path for learning and return behavior.
- Korean copy quality is a launch prerequisite because garbled or awkward copy breaks trust.
- Keep public journal/community comments as a future candidate only; moderation and anti-engagement guardrails must come first.
- Phase B Readiness starts with visibility and control: make return data inspectable, then let users make a mission smaller or safer, then let preferences guide future missions.

## Product Guardrails

- Do not diagnose, treat, or imply clinical authority.
- Do not shame users for skipped missions.
- Do not label small outcomes as too trivial; the minimum win is intentionally small.
- Do not overbuild personalization before mission quality is validated.
- Do not conflate "completed mission" with "product success"; the primary signal is failed-user return.
- Do not use public comments, likes, rankings, or streak pressure to exploit vulnerability.
- Do not make "smaller mission" feel like demotion, failure, or punishment.

## Current Implementation State

The V1 micro-social mission path is implemented in the existing challenge surfaces:

- Supabase migrations add optional mission fields on `challenges`.
- `challenge_reflections.outcome` records `greeted`, `said_line`, or `could_not_do_it`.
- `challenge_reflections` is idempotent per `(user_id, challenge_id)` and XP is only awarded on first reflection creation.
- Demo mode includes a Korean routine-space micro-social mission.
- Challenge list and detail screens render context, safe line, minimum win, fear, and reframe.
- Reflection supports non-completion without shame.
- `public.micro_mission_return_report()` derives the V1 return metric.
- Playwright e2e runs against a QA auth-bypass dev server on port `3100`.
- Post-merge QA fixed the coach icon button rendering and accessibility label.
- Profile settings now store routine spaces and social fears, and challenge generation can use them in Gemini context plus deterministic fallback copy.

See the worklog for detailed execution state.

## Priority Stack

### Slice 1: Engineering Review And Copy Repair Scope

Status: completed 2026-04-16.

Goal: Decide the smallest safe implementation shape before code edits.

Acceptance criteria:

- Approved implementation shape for V1.
- Clear non-goals for schema and UI.
- Known verification commands.

### Slice 2: Weekly Micro-Mission Data And Demo Foundation

Status: shipped 2026-04-18.

Goal: Add optional mission fields while preserving existing challenges.

Acceptance criteria:

- Nullable `challenges` fields for `mission_kind`, `mission_context`, `safe_line`, `minimum_win`, `fear`, and `reframe`.
- Nullable `challenge_reflections.outcome` with `greeted`, `said_line`, and `could_not_do_it`.
- Existing challenges still render.
- Demo micro-mission renders with no Supabase env vars.

### Slice 3: Mission Card And Detail UX

Status: shipped 2026-04-18.

Goal: Show the mission as a small weekly social contact experiment and make the minimum win obvious.

Acceptance criteria:

- User sees context, safe line, minimum win, fear, and reframe.
- Existing generic challenge cards remain intact.
- Mobile layouts pass visual QA for score ring, chips, action buttons, and bottom navigation.

### Slice 4: Reflection Outcome And Return Signal

Status: shipped 2026-04-18.

Goal: Make "could not do it" a supported reflection path and derive the failed-user return metric.

Acceptance criteria:

- User can reflect after not doing the mission.
- The UI does not treat non-completion as shameful failure.
- Data supports the V1 retention metric by joining failed/skipped outcomes to next-week activity.
- Duplicate reflection submissions do not grant infinite XP.

### Slice 5: Phase B Readiness Bundle

Status: implemented locally 2026-04-21. Ship pending.

Plan: `docs/01-plan/features/phase-b-readiness.plan.md`

Goal: Prepare the next loop without building matching or community.

Sub-slices:

1. **5A Retention report visibility**
   - Add an internal/local report command for `micro_mission_return_report()`.
   - No in-app admin page until admin roles exist.

2. **5B Smaller mission and swap mission**
   - Let users request a smaller mission, a different routine space, or a safer line.
   - Update the current challenge row in place.
   - Log before/after payloads in `challenge_mission_adjustments`.

3. **5C Routine space and fear personalization**
   - Add `routine_spaces` and `social_fears` to `user_profiles`.
   - Add lightweight chips to profile settings.
   - Feed preferences into future challenge generation and deterministic fallbacks.

Already done:

- `micro_mission_return_report()` SQL RPC exists.
- Remote Supabase migrations through `007_profile_personalization.sql` were applied and verified.
- Sample-data probe returned `failed_or_skipped_users=3`, `returned_next_week_users=2`, and `next_week_return_rate=0.6667`.
- Playwright e2e passed across desktop and mobile Chromium.
- Mission adjustments are live in the local app flow and backed by adjustment event logging.
- Routine-space and social-fear preferences are live in profile settings and feed future challenge generation.

Acceptance criteria:

- A human can inspect the V1 return metric without re-reading migration SQL.
- A user can make a current micro-mission smaller or safer without feeling judged.
- A user can set practical routine-space and fear preferences.
- Future mission generation can use those preferences.
- No matching, public community, or therapy-style surface is built prematurely.

## Deferred

- In-app matching: deferred due to moderation, safety, cold start, and trust risks.
- Paid subscription: deferred until repeated value is proven.
- In-app ads: deferred due to trust risk in vulnerable reflection moments.
- Full social recovery loop: deferred until failed/skipped users return.
- Public anonymous journal/comments: deferred until moderation, reporting, and anti-engagement guardrails are designed.
- Admin web dashboard: deferred until admin roles exist.
- Broad redesign: deferred; reuse existing app shell and challenge surfaces.

## Validation Plan

Primary:

- Mission failed/skipped users who return the following week.

Secondary:

- Mission start rate.
- Smaller/swap mission request rate.
- Reflection after non-completion rate.
- Alternate/smaller mission users who return next week.
- Routine-space/fear preference completion rate.
- Weekend/holiday reopen rate.
- Qualitative responses such as "부담이 덜하다", "다시 해볼 수 있겠다", "내가 이상한 게 아니구나."

## Handoff Rule

Use this file for product priority, the worklog for execution state, checkpoints for dated snapshots, and git status/diff for actual code truth.
