# Post-Phase-B Recovery Check-In Plan

Last updated: 2026-04-23
Status: planned

## Goal

Make the week-to-week comeback experience feel intentional after a hard, skipped, or adjusted micro-mission week.

This slice should help the user feel:

- "The app noticed where I got stuck."
- "This week is a continuation, not a reset."
- "I do not need to be doing great for the app to stay useful."

## Product Shape

Implement 6B as two connected pieces:

1. a lightweight recovery check-in card on Home
2. challenge generation context that includes last week's recovery signal

This should reuse existing data rather than adding a new table.

## Existing Data To Reuse

- `challenges`
  - previous week's micro-social challenge
  - status
- `challenge_reflections`
  - `outcome`
  - reflection text
- `challenge_mission_adjustments`
  - whether the user asked to make the mission smaller/safer
- `user_profiles`
  - `routine_spaces`
  - `social_fears`
- `weekly_check_ins`
  - current-week check-in form already exists on Home

## Scope Decision

Do:

- derive a deterministic "recovery signal" from last week's micro-mission
- show recovery copy on Home before or alongside this week's mission/check-in
- pass last week's signal into Gemini generation context
- use the same signal to soften deterministic fallback generation

Do not:

- add another onboarding step
- add a new standalone recovery page
- add a new persistent recovery table
- add clinical framing or journaling depth

## Recovery Signals

Define one small shared helper that classifies the previous week into a stable signal:

- `rough_week`
  - skipped challenge or reflection outcome `could_not_do_it`
- `adjusted_week`
  - user changed the mission and did not complete it
- `steady_week`
  - user greeted someone or made partial progress
- `strong_week`
  - completed or said the line without needing recovery framing
- `fresh_start`
  - no prior micro-mission data

These signals should drive both UI copy and generation context.

## UX Plan

### Home recovery card

Placement:

- above "This week's challenges" or directly above the existing weekly check-in section

Content:

- short label: `Recovery check-in`
- dynamic headline based on signal
- one paragraph of calm interpretation
- small continuation cue toward this week's challenge
- optional button to open this week's micro-mission detail

Examples of intended tone:

- rough week: "지난주는 여기까지였어요. 이번 주는 더 작게 가도 괜찮아요."
- adjusted week: "지난주는 이미 잘 줄였어요. 이번 주도 그 감각을 이어가면 돼요."
- steady week: "작게라도 연결이 있었어요. 이번 주는 그 리듬을 이어가면 충분해요."
- strong week: "지난주의 감각을 이번 주에도 무리 없이 이어가볼까요?"

### Weekly check-in form

Keep the existing form, but adjust surrounding copy so it feels like part of the same recovery loop instead of a generic score update.

## Generation Plan

In `supabase/functions/generate-challenges/index.ts`:

- fetch the previous micro-social challenge before generating the current week
- fetch its latest reflection outcome, if any
- count adjustment rows for that previous challenge
- derive a recovery signal
- include it in the Gemini context
- when fallback generation is used, soften the first micro-mission copy based on the signal

Important:

- keep this deterministic first
- do not require LLM reasoning to classify last week's outcome

## Candidate Files

- `src/lib/challenges/recovery-check-in.ts`
- `src/lib/server/app-data.ts`
- `src/app/[locale]/(main)/home/page.tsx`
- `supabase/functions/generate-challenges/index.ts`
- `tests/unit/recovery-check-in.test.ts`
- `tests/e2e/smoke.spec.ts`

## Implementation Order

1. Add shared recovery helper module.
2. Extend `getHomeSnapshot()` with previous-week recovery state.
3. Render recovery card on Home.
4. Extend challenge generation context and fallback behavior.
5. Add helper tests.
6. Extend smoke coverage for Home recovery UI.

## Test Requirements

### Unit

- skipped or `could_not_do_it` maps to `rough_week`
- adjusted but not completed maps to `adjusted_week`
- greeted maps to `steady_week`
- completed / said_line maps to `strong_week`
- no prior data maps to `fresh_start`
- fallback copy changes appropriately for rough vs strong signals

### E2E / smoke

- Home renders a recovery section in demo mode
- Home still renders challenge list and weekly check-in together

## Acceptance Criteria

- user can see that last week's outcome was noticed
- the Home screen feels like this week's mission follows from last week
- generation logic now knows whether last week was rough, adjusted, steady, or strong
- deterministic fallback generation uses that signal, not just profile preferences

## Non-Goals

- no database migration unless implementation reveals a hard blocker
- no new analytics in this slice
- no public community or comments

## Recommended Follow-On

After 6B lands, the next likely slice is 6C Preview QA hardening unless 6B reveals a new need for more detailed recovery analytics.
