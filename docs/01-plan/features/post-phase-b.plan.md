# Post-Phase-B Implementation Plan

Last updated: 2026-04-23
Status: active

## Goal

Turn Phase B from "good product shape" into "measurable weekly improvement loop."

After Phase B, SoloSync can:

- inspect the failed/skipped return metric
- shrink or swap an overwhelming mission
- remember routine spaces and social fears

The next step is not matching or community. It is proving that these new controls actually improve recovery and next-week return.

## Product Question

When a user skips, freezes, or downgrades a mission, can SoloSync help them come back the next week with less dread and more trust?

## Strategic Direction

Post-Phase-B should focus on three things in order:

1. **Observability**
   - know whether adjustment and personalization are being used
   - know whether they correlate with next-week return

2. **Recovery loop quality**
   - make the "come back next week" path feel intentional, not accidental

3. **Preview/ship confidence**
   - make preview QA and deploy verification repeatable enough that iteration stays fast

## Not In Scope

- matching
- public community or anonymous comments
- paid subscription experiments
- ad-based monetization
- admin web dashboard with role-based access
- full mission ladder or heavy recommendation engine

## Candidate Slice Sequence

### Slice 6A: Post-Phase-B Analytics Layer

Goal: make Phase B outcomes inspectable without manual SQL spelunking.

Detailed plan: `docs/01-plan/features/post-phase-b-analytics.plan.md`

Status: implemented locally on `codex/phase-b-analytics`, merge pending.

What to add:

- report expansion for:
  - mission adjustment usage by type
  - profile personalization completion rate
  - next-week return split by adjusted vs not adjusted
- one stable script or report entrypoint for Phase B metrics
- optional JSON output for later dashboarding

Acceptance criteria:

- operator can answer "are people using the new controls?"
- operator can answer "do adjusted users come back next week more often?"
- no new in-app admin surface is required

Observed repo gap to fix first:

- docs reference a micro-mission report flow, but the current `main` branch does not expose a visible package script or report runner file for it

Current implementation note:

- the working branch now adds both `npm run report:phase-b` and `npm run report:micro-missions` so the documented operator flow exists again

### Slice 6B: Weekly Recovery Check-In

Goal: make week-to-week re-entry explicit after a rough mission week.

Detailed plan: `docs/01-plan/features/post-phase-b-recovery-checkin.plan.md`

Status: implemented locally on `codex/weekly-recovery-checkin`, review/merge pending.

What to add:

- a lightweight weekly check-in before or alongside the next mission
- copy branches based on:
  - completed
  - greeted / partial success
  - could_not_do_it
  - mission adjusted last week
- challenge generation seed that uses the prior week's outcome plus saved preferences

Acceptance criteria:

- user sees that last week's difficulty was noticed
- next mission feels like a continuation, not a reset
- copy remains non-clinical and non-shaming

### Slice 6C: Preview QA Hardening

Goal: make product iteration less dependent on local-only QA hacks.

Detailed plan: `docs/01-plan/features/post-phase-b-preview-qa.plan.md`

Status: implemented locally on `codex/preview-qa-hardening`, review/merge pending.

What to add:

- repeatable preview QA checklist
- preview-safe auth bypass or equivalent tester access strategy
- one documented flow for smoke testing after merge/deploy

Acceptance criteria:

- preview verification can be rerun without rediscovering setup
- the highest-risk flows have a stable QA path
- local and preview verification expectations are documented

## Proposed Data Flow

```text
challenge reflection / mission adjustment / profile personalization
  -> reporting scripts and RPCs
    -> operator sees return and usage deltas

last week's outcome + adjustment history + saved preferences
  -> next weekly check-in seed
    -> next mission framing

merge/deploy
  -> preview QA checklist
    -> faster confidence in iteration
```

## Engineering Notes

- prefer extending the existing reporting script path before creating any admin UI
- keep the recovery loop deterministic first; defer LLM-heavy branching unless the copy quality clearly needs it
- reuse existing challenge/reflection/profile data instead of adding parallel storage
- add tests around any week-over-week branching logic because silent regressions would be easy here

## Design Notes

- the recovery check-in should feel like "we noticed, let's make this easier" rather than "explain your failure"
- no guilt language, no streak pressure, no red danger framing for missed missions
- the most important visual outcome is calm continuity from last week to this week

## Validation Questions

- does mission adjustment increase next-week return?
- does profile personalization increase mission start rate?
- do users who could not do it last week return more when the next mission acknowledges that outcome?
- can the team verify preview behavior quickly enough to keep shipping weekly?

## Recommended First Move

Current recommended move: **Slice 6C: Preview QA Hardening**.

Reason:

- Phase B analytics is already on `main`, and 6B now closes the user-facing recovery loop locally.
- The next leverage point is reducing preview/deploy QA friction so iteration stays fast.
- 6C will make weekly shipping less dependent on local-only memory and auth bypass setup.
