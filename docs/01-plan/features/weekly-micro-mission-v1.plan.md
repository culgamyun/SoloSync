# Weekly Micro-Mission V1 Implementation Plan

Last updated: 2026-04-16
Status: engineering reviewed
Source design: ../../../.gstack/projects/solosync/culga-main-design-20260416-221409.md

## Goal

Ship the first Approach A slice from the approved Office Hours design:

```text
Every week, SoloSync gives a low-pressure lifestyle-space social mission,
helps the user rehearse one safe line,
and reframes success or failure so failed users still return next week.
```

The MVP must test the wedge, not the full long-term product. Do not build matching, friend discovery, therapy-style diagnosis, paid subscriptions, or a full personalization engine in V1.

## Target User

수도권 20대 1인 가구 일반 사무직. The user works in-office, often goes home through a routine space such as a convenience store, cafe, gym front desk, salon, or small restaurant, and has little low-pressure contact outside work.

## Product Slice

V1 should create one new mission shape:

```text
Context: where this happens
Line: the safest one-sentence opener
Minimum win: what counts as enough
Fear: what the user is worried about
Reframe: what to believe if it goes awkwardly or does not happen
```

Example:

```text
Context: 자주 가는 편의점 또는 카페
Line: "안녕하세요. 오늘도 늦게까지 하시네요."
Minimum win: 눈 마주치고 인사만 해도 성공
Fear: 상대가 이상하게 볼까 봐
Reframe: 상대가 짧게 대답해도 실패가 아니다. 낯선 사람에게 예의를 건넨 것만으로 이번 주의 반례는 생겼다.
```

## Existing Code To Reuse

- `src/types/challenge.ts`: existing challenge categories/statuses and record shape.
- `src/actions/challenges.ts`: status update and reflection server actions.
- `src/components/challenges/challenge-list.tsx`: mission cards and status actions.
- `src/app/[locale]/(main)/challenges/[id]/page.tsx`: challenge detail surface.
- `src/app/[locale]/(main)/challenges/[id]/reflect/page.tsx`: reflection surface.
- `src/lib/server/app-data.ts`: demo fallback and Supabase mapping.
- `supabase/migrations/*`: schema source of truth for challenge/reflection fields.

## Proposed Implementation

1. Repair Korean copy encoding before presenting the feature.
   - Existing source strings in some files render as garbled Korean.
   - This is a trust blocker for a sensitive product.

2. Extend the challenge model for micro-missions.
   - Add optional fields rather than replacing existing challenge behavior:
     - `mission_context`
     - `safe_line`
     - `minimum_win`
     - `fear`
     - `reframe`
     - `reflection_outcome`
   - Keep existing generic challenges working.

3. Add an MVP mission card variant.
   - On home/challenges, show the weekly micro-mission as "이번 주 작은 접촉".
   - Emphasize the minimum win and safe line.
   - Avoid shame-heavy labels.

4. Update the challenge detail screen.
   - Show context, line, minimum win, fear, and reframe.
   - Add actions:
     - "오늘 해볼게요"
     - "너무 부담돼요"
     - "다른 장소로 바꾸기" can be deferred unless easy with existing data.

5. Update reflection to support non-completion.
   - Outcomes:
     - `greeted`
     - `said_line`
     - `could_not_do_it`
   - Treat `could_not_do_it` plus reflection as a valuable event, not a failure-only terminal state.

6. Add analytics-friendly state.
   - Track mission started, completed, skipped, reflected after not doing it, and next-week return.
   - V1 can begin with database fields and server-side events if analytics infrastructure is not ready.

7. Add demo data.
   - The app should show a convincing micro-mission with Supabase env vars absent.
   - Demo copy should be polished Korean plus English fallback.

## Non-Goals

- No in-app matching.
- No friend search.
- No therapy framing.
- No subscription/paywall.
- No ads inside reflection or reframe moments.
- No broad Phase B personalization loop.
- No large redesign of the app shell.

## Edge Cases

- User cannot do the mission but returns to reflect.
- User thinks the line is too awkward.
- User wants a smaller mission.
- User wants a different routine space.
- Existing non-micro challenges lack the new optional fields.
- Supabase is not configured and demo data is used.
- Locale is Korean or English.

## Acceptance Criteria

- A user can see a weekly micro-mission card with context, safe line, minimum win, fear, and reframe.
- A user can start the mission.
- A user can mark the outcome as greeted, said the line, or could not do it.
- A user who could not do it still receives a supportive reframe.
- Existing challenge flows still work for non-micro challenges.
- Demo mode shows the feature without Supabase configuration.
- Korean copy is not garbled on the touched screens.
- Unit/type checks pass for the modified model and helper logic.

## Verification Plan

- Run `npm run typecheck`.
- Run `npm run test`.
- Run `npm run lint`.
- Run `npm run build` if the feature touches Next route rendering or generated types.
- Manually inspect Korean and English routes in the browser.
- Verify demo mode without Supabase env vars.

## Open Engineering Questions

- Should `could_not_do_it` be a challenge status, a reflection outcome, or both?
- Should `minimum_win` and `reframe` live on `challenges`, `challenge_reflections`, or a separate `micro_missions` table?
- Does weekly return need an explicit analytics table, or can it be derived from challenge/reflection timestamps for V1?
- Should the first V1 scope repair all garbled Korean strings or only the touched feature path?

## Recommended Next Review

Engineering review completed on 2026-04-16. The implementation direction is accepted with the amendments below.

## Engineering Review Result

### Step 0: Scope Challenge

Scope accepted with one mandatory sequencing change:

```text
Korean copy repair for the touched challenge/detail/reflection path must happen before or inside Slice 1 implementation.
```

Reason: the current source contains garbled Korean strings in `src/lib/constants/social.ts`, `src/app/[locale]/(main)/challenges/[id]/page.tsx`, `src/app/[locale]/(main)/challenges/[id]/reflect/page.tsx`, and related demo copy. For this feature, broken Korean is not cosmetic. It destroys trust in exactly the moment where the product is asking the user to try a vulnerable behavior.

The plan is still appropriately small. It should touch more than a trivial number of files, but the work stays inside existing challenge/reflection/demo surfaces and does not introduce new infrastructure.

### Architecture Decision

Use explicit nullable columns on `public.challenges` for the mission prompt, and a reflection outcome on `public.challenge_reflections`.

Recommended schema shape:

```sql
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
```

Why:

- Explicit columns beat JSONB for V1 because the fields are core product copy, not arbitrary metadata.
- Keeping `status` unchanged avoids mixing "could not do it" with `skipped` or `completed`.
- Putting outcome on reflections lets the product count "failed but reflected" as a meaningful event.
- Existing RLS policies continue to work because both tables already use row ownership.

Do not add a separate `micro_missions` table yet. That is a Phase B move if mission ladders, templates, or evidence logs become rich enough to justify it.

### Data Flow

```text
Supabase / demo source
  -> mapChallenge(row)
    -> ChallengeRecord
      -> ChallengeList card
      -> ChallengeDetail page
        -> Start action updates challenge.status
        -> Reflection page
          -> submitReflectionAction(outcome, mood, difficulty, text)
            -> challenge_reflections row
            -> revalidate challenge/progress routes
```

The important distinction:

```text
challenge.status = lifecycle of the weekly mission card
reflection.outcome = what happened in the social attempt
```

This keeps retention analysis honest:

```text
failed/skipped but reflected in week N
  -> any challenge start/reflection/check-in in week N+1
  -> counted as returned after failure
```

### What Already Exists

- Challenge lifecycle and XP server action: reuse.
- Reflection insertion action: reuse and extend.
- Demo fallback data: reuse and update with micro-social mission data.
- Challenge list/detail routes: reuse and add micro-mission presentation.
- Push subscriptions/service worker: available later; do not use in V1 unless already cheap.
- `messages/ko.json` and `messages/en.json`: have clean strings and should be preferred over hardcoded garbled copy where practical.

### NOT In Scope

- In-app matching: deferred due to moderation, safety, cold start, and trust risk.
- New analytics vendor: derive the first metric from database rows for V1.
- Paid subscription: deferred until repeated value is proven.
- Ads: deferred because they can break trust in reflection moments.
- Full Phase B personalization engine: deferred until failed/skipped users return.
- Full app-wide Korean copy cleanup: valuable, but V1 should at minimum fix the touched challenge/detail/reflection paths.

### Test Review

Test framework detected:

- Unit/component: Vitest with jsdom.
- E2E: Playwright.

Coverage diagram:

```text
Weekly Micro-Mission V1
├── data model
│   ├── [GAP] standard challenge maps without optional mission fields
│   ├── [GAP] micro_social challenge maps all mission fields
│   └── [GAP] reflection outcome accepts greeted / said_line / could_not_do_it
├── demo mode
│   ├── [GAP] /ko/home renders a micro mission with readable Korean
│   ├── [GAP] /ko/challenges/challenge-1 renders context + safe line + minimum win
│   └── [GAP] /en/challenges/challenge-1 renders readable English fallback
├── user flow
│   ├── [GAP] start mission keeps existing in_progress behavior
│   ├── [GAP] completed mission keeps existing XP behavior
│   ├── [GAP] could_not_do_it reflection saves without completing challenge
│   └── [GAP] generic non-micro challenge still renders conversation starters
└── copy/trust
    ├── [GAP] touched Korean strings are not mojibake
    └── [GAP] reflection copy avoids shame language
```

Required test additions:

- Unit test for mapping standard and micro-social challenge rows.
- Unit test for the reflection action payload shape if action helpers are extracted.
- Component or route-level test for micro mission fields rendering when present and generic challenge rendering when absent.
- Playwright smoke assertion for `/ko/challenges/challenge-1` and `/ko/challenges/challenge-1/reflect` once demo copy is repaired.

### Performance Review

No material performance risk. The feature adds nullable text fields and small conditional UI. Avoid client-only state or new chart/animation dependencies in V1.

### Failure Modes

- Garbled Korean reaches production: trust failure. Covered by copy repair plus E2E text assertions.
- AI-generated challenge omits mission fields: UI must gracefully fall back to generic challenge layout.
- User submits reflection without a known outcome: default to `could_not_do_it` only if the UI path makes that intent clear; otherwise reject or omit outcome.
- Multiple reflections for one challenge: current schema permits this. V1 should decide whether that is acceptable. Recommendation: allow it for now because repeated reflection is not harmful, but compute latest or any non-completion carefully.
- Next-week return metric is silently wrong if based only on `completed`: derive it from reflections/check-ins/started challenges, not completed status.

### Completion Summary

- Step 0 Scope Challenge: accepted with mandatory touched-path Korean copy repair.
- Architecture Review: explicit challenge columns plus reflection outcome selected.
- Code Quality Review: reuse existing challenge/reflection flows; avoid new service/table in V1.
- Test Review: diagram produced, 10 gaps identified.
- Performance Review: no material risk.
- NOT in scope: written.
- What already exists: written.
- Lake Score: complete V1 path recommended over a partial UI-only spike.

## Locked Implementation Notes

Before implementation, update the checklist:

- schema shape,
- status/outcome semantics,
- retention metric derivation,
- backwards compatibility with existing demo and Supabase flows,
- and the minimum safe Korean copy cleanup required for launch.

All five are now resolved at plan level:

- Schema: nullable `challenges` mission fields plus `challenge_reflections.outcome`.
- Status/outcome: `challenge.status` remains lifecycle; `reflection.outcome` records social attempt result.
- Retention metric: derive V1 failed-return signal from week N non-completion reflection plus week N+1 activity.
- Backwards compatibility: optional fields and fallback generic rendering.
- Korean copy: fix touched challenge/detail/reflection paths before exposing V1.
