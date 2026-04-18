# Weekly Micro-Mission Roadmap

Last updated: 2026-04-17
Status: active

## How To Use This File

Future agents should read this roadmap first, then the matching worklog, then the latest checkpoint, then verify git status/diff.

## Product Thesis

SoloSync should not begin as a friend-making, dating, meetup, or therapy product. Its first wedge is a weekly low-pressure social re-entry mission for 수도권 20대 1인 가구 사무직 users whose after-work routine has little safe social contact.

The product earns trust by helping users create small counterexamples to "나는 인생 노답이다", especially after skipped or awkward attempts.

## Strategic Decisions

- Start with Approach A: Weekly Micro-Mission MVP.
- Graduate to Approach B: Social Recovery Loop only after V1 shows failed/skipped users returning the next week.
- Do not build in-app matching in this slice.
- Do not optimize for paid conversion in the first slice.
- Avoid ads in vulnerable reflection moments.
- Treat failure reflection as a success path for learning and return behavior.
- Korean copy quality is a launch prerequisite because garbled or awkward copy breaks trust.

## Product Guardrails

- Do not diagnose, treat, or imply clinical authority.
- Do not shame users for skipped missions.
- Do not label small outcomes as too trivial; the minimum win is intentionally small.
- Do not overbuild personalization before mission quality is validated.
- Do not conflate "completed mission" with "product success"; the primary signal is failed-user return.

## Current Implementation State

The V1 micro-social mission path is implemented in the existing challenge surfaces:

- Supabase migration adds explicit nullable mission fields on `challenges` and `outcome` on `challenge_reflections`.
- Demo mode now includes a Korean micro-social mission for a routine-life space.
- Challenge list and detail screens render the micro-mission context, safe line, minimum win, fear, and reframe.
- Reflection supports `greeted`, `said_line`, and `could_not_do_it`.
- Existing standard challenges continue to render through the same challenge model.

See the worklog for detailed execution state.

## Priority Stack

### Slice 1: Engineering Review And Copy Repair Scope

Status: completed 2026-04-16.

Goal: Decide the smallest safe implementation shape before code edits.

Rationale: The feature touches emotional UX, challenge state semantics, and Korean copy trust. A small wrong abstraction could make retention metrics noisy.

Candidate work:

- Review existing challenge schema and reflection flow.
- Decide whether mission outcome belongs in status or reflection.
- Define touched Korean copy cleanup scope.
- Confirm demo-mode behavior.

Acceptance criteria:

- Approved implementation shape for V1.
- Clear non-goals for schema and UI.
- Known verification commands.

### Slice 2: Weekly Micro-Mission Data And Demo Foundation

Status: implemented 2026-04-17.

Goal: Add optional mission fields while preserving existing challenges.

Rationale: V1 needs context, safe line, minimum win, fear, and reframe without breaking current challenge data.

Candidate work:

- Extend types.
- Add migration or app-level optional fields.
- Update mapping and demo data.
- Add tests for fallback/model helpers if applicable.

Acceptance criteria:

- Add nullable `challenges` fields for `mission_kind`, `mission_context`, `safe_line`, `minimum_win`, `fear`, and `reframe`.
- Add nullable `challenge_reflections.outcome` with `greeted`, `said_line`, and `could_not_do_it`.
- Existing challenges still render.
- Demo micro-mission renders with no Supabase env vars.
- Typecheck passed in local verification.

### Slice 3: Mission Card And Detail UX

Status: implemented 2026-04-17.

Goal: Show the mission as "이번 주 작은 접촉" and make the minimum win obvious.

Rationale: The core UX is trust and smallness, not productivity.

Candidate work:

- Add micro-mission card variant.
- Update challenge detail layout.
- Add Korean/English copy.
- Keep design within existing SoloSync UI patterns.

Acceptance criteria:

- User sees context, safe line, minimum win, fear, and reframe.
- Existing generic challenge cards remain intact.
- Mobile layout still needs browser QA because local dev server startup hung.

### Slice 4: Reflection Outcome And Return Signal

Status: implemented 2026-04-17.

Goal: Make "could not do it" a supported reflection path.

Rationale: The primary metric is failed/skipped users returning next week.

Candidate work:

- Add outcome choices.
- Add supportive reframe after non-completion.
- Store enough data to distinguish completed, skipped, failed-but-reflected, and return.

Acceptance criteria:

- User can reflect after not doing the mission.
- The UI does not treat this as shameful failure.
- Data can support the V1 retention metric by joining failed/skipped reflection outcomes to next-week activity.

### Slice 5: Phase B Readiness

Status: next.

Goal: Prepare the next loop without building it.

Rationale: Approach B should wait for evidence, but V1 should not block it.

Candidate work:

- Add a derived retention query/report for "failed/skipped users who return the following week".
- Apply and verify the Supabase migration in the target environment.
- Run browser QA once the dev server issue is resolved.
- Decide whether routine-space and fear data should become selectable fields in Phase B.

Acceptance criteria:

- Phase B can be planned from V1 data.
- No Phase B UI is built prematurely.

## Deferred

- In-app matching: deferred due to moderation, safety, cold start, and trust risks.
- Paid subscription: deferred until repeated value is proven.
- In-app ads: deferred due to trust risk in vulnerable reflection moments.
- Full social recovery loop: deferred until failed/skipped users return.
- Broad redesign: deferred; reuse existing app shell and challenge surfaces.

## Validation Plan

Primary:

- Mission failed/skipped users who return the following week.

Secondary:

- Mission start rate.
- Reflection after non-completion rate.
- Alternate/smaller mission requests.
- Weekend/holiday reopen rate.
- Qualitative responses: "부담이 낮다", "다시 해볼 수 있다", "내가 이상한 건 아니구나."

## Handoff Rule

Use this file for product priority, the worklog for execution state, checkpoints for dated snapshots, and git status/diff for actual code truth.
