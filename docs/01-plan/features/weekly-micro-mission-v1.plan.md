# Weekly Micro-Mission V1 Implementation Plan

Last updated: 2026-04-19
Status: shipped

## Goal

Ship the first Approach A slice from the approved Office Hours design:

```text
Every week, SoloSync gives a low-pressure lifestyle-space social mission,
helps the user rehearse one safe line,
and reframes success or failure so failed users still return next week.
```

The MVP tests the wedge, not the full long-term product. V1 does not include matching, friend discovery, therapy-style diagnosis, paid subscriptions, ads, or a full personalization engine.

## Target User

수도권에 사는 20대 1인 가구 일반 사무직 직장인. 출근 근무를 하고, 퇴근 후 루틴은 헬스장, 유튜브, 잠으로 좁아져 있다. 회사 밖 친구가 적고 모임 앱은 부담스럽다. 상담까지 받으면 문제가 있는 사람처럼 느껴질까 봐 선택하지 않는다.

The first persona has tried YouTube/SNS, dating apps, and meetup apps, but each option made the problem feel worse or too heavy:

- YouTube/SNS fills two to three hours but leaves more emptiness.
- Dating apps feel noisy, bait-like, or unsafe.
- Meetup apps require entering an already-formed group too abruptly.
- Weekends, holidays, and 명절 periods carry the highest emotional cost.

## Product Slice

V1 creates one mission shape:

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
Reframe: 상대가 짧게 반응해도 실패가 아니다. 낯선 사람에게 예의를 건넨 것만으로 이번 주의 반례가 생겼다.
```

## Existing Code Reused

- `src/types/challenge.ts`: challenge category/status and record shape.
- `src/actions/challenges.ts`: status update and reflection server actions.
- `src/components/challenges/challenge-list.tsx`: mission cards and status actions.
- `src/app/[locale]/(main)/challenges/[id]/page.tsx`: challenge detail surface.
- `src/app/[locale]/(main)/challenges/[id]/reflect/page.tsx`: reflection surface.
- `src/lib/server/app-data.ts`: demo fallback and Supabase mapping.
- `supabase/migrations/*`: schema source of truth.
- `tests/e2e/smoke.spec.ts`: browser smoke coverage.

## Final Implementation

### Schema

`public.challenges` has optional micro-mission fields:

- `mission_kind`
- `mission_context`
- `safe_line`
- `minimum_win`
- `fear`
- `reframe`

`public.challenge_reflections` has:

- `outcome`
- unique index/constraint behavior for `(user_id, challenge_id)` so repeated submissions are idempotent.

### Status And Outcome Semantics

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

### UI

- Challenge list card shows the micro-mission context, safe line, minimum win, and XP without awkward wrapping.
- Detail page shows context, safe line, minimum win, fear, and reframe.
- Reflection page supports:
  - greeted
  - said the line
  - could not do it
- Non-completion is treated as a valid reflection path.
- Coach page includes a back/home affordance and an accessible send button.

### AI Generation

Gemini-generated challenge values are validated and normalized before database insert/upsert. This prevents enum/check-constraint failures when the model returns unexpected values for fields such as `mission_kind`, `difficulty`, `category`, or `estimated_time`.

### QA Auth Bypass

Development/test-only route:

```text
/api/qa/auth-bypass?next=/ko/home
```

The route rejects production use and blocks protocol-relative redirects such as `//example.com`.

### Retention Report

`public.micro_mission_return_report()` reports weekly failed/skipped cohorts and next-week return behavior.

Sample verification result:

```json
{
  "failed_week_start_date": "2026-04-06T00:00:00+00:00",
  "failed_or_skipped_users": 3,
  "returned_next_week_users": 2,
  "next_week_return_rate": 0.6667
}
```

## Non-Goals

- No in-app matching.
- No friend search.
- No therapy framing.
- No subscription/paywall.
- No ads inside reflection or reframe moments.
- No public anonymous journal/comments in V1.
- No broad Phase B personalization loop.
- No large redesign of the app shell.

## Edge Cases Covered

- User cannot do the mission but returns to reflect.
- User thinks the line is too awkward.
- Existing non-micro challenges lack optional mission fields.
- Supabase is not configured and demo data is used.
- Locale is Korean or English.
- Reflection submit is retried or double-submitted.
- LLM returns unexpected enum-like values.
- QA redirect receives an unsafe `next` value.

## Acceptance Criteria

- A user can see a weekly micro-mission card with context, safe line, minimum win, fear, and reframe.
- A user can start the mission.
- A user can mark the outcome as greeted, said the line, or could not do it.
- A user who could not do it still receives a supportive reframe.
- Existing challenge flows still work for non-micro challenges.
- Demo mode shows the feature without Supabase configuration.
- Touched Korean copy is not garbled.
- Unit, type, build, and e2e checks pass.
- Remote Supabase schema includes the needed migrations.

## Verification Completed

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run check`
- `npm run build`
- `npm run test:e2e`
- Remote Supabase migration push through `001`-`005`
- Service-role probe for schema/RPC existence
- Sample-data verification for `micro_mission_return_report()`
- Browser QA for mobile and desktop routes

Known warnings:

- ESLint 9 warns that `.eslintignore` is deprecated.
- Next build shows an existing Sentry/OpenTelemetry dynamic require warning.

Both warnings currently exit 0 and are not blockers.

## Recommended Next Work

1. Make deployment/preview QA repeatable.
2. Add or document a human-readable way to inspect `micro_mission_return_report()`.
3. Clean up `.eslintignore` into `eslint.config.mjs`.
4. Plan Phase B only after V1 return data is available.
5. Keep public journal/community features deferred until moderation design is ready.
