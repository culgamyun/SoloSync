# Phase B Readiness Implementation Plan

Last updated: 2026-04-22
Status: shipped on `main`

## Goal

Prepare SoloSync for the next loop after Weekly Micro-Mission V1 without jumping into matching, community, or therapy-like features.

This plan bundles the next three implementation priorities:

1. Make the failed/skipped next-week return report easy to inspect.
2. Let users request a smaller or safer version of the current mission.
3. Let users set routine spaces and social fears so future missions feel less generic.

The product goal is simple: if a user thinks "this is too much", SoloSync should reduce the mission instead of letting the user disappear.

## Implementation Sequence

### Slice 5A: Retention Report Visibility

Status: implemented 2026-04-20.

Goal: Make `public.micro_mission_return_report()` inspectable without opening migration SQL or writing ad-hoc Supabase queries.

Decision: implement a local/internal script first, not an in-app admin page.

Why:

- The app does not yet have admin roles or staff-only routing.
- A public app page could leak aggregate user behavior.
- A script is enough for the current solo-operator phase and keeps the blast radius small.

Candidate files:

- `scripts/micro-mission-return-report.mjs`
- `package.json`
- `README.md` or `ENV_LOCAL_SETUP.md`
- `tests/unit/micro-mission-return-report.test.mjs`

Behavior:

- Reads `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Calls `micro_mission_return_report()`.
- Prints a readable table by default.
- Supports `--json` for raw output.
- Exits with a clear message if env vars are missing.

Acceptance criteria:

- Running the command prints week, failed/skipped users, returned users, and return rate.
- Missing env vars produce a clear non-zero error.
- No browser or app route is needed.
- No user-facing data is exposed in the product UI.
- `--json` prints raw RPC output.

### Slice 5B: Smaller Mission And Swap Mission

Status: implemented locally 2026-04-21. Remote Supabase migration applied 2026-04-21.

Goal: Let the user reduce friction on the current micro-mission before they abandon it.

Decision: update the existing challenge row in place, but log every adjustment in a dedicated event table.

Why:

- The current challenge should stay as the visible weekly mission.
- Updating in place keeps the UI simple.
- Logging the before/after payload preserves analytics and makes future debugging possible.
- This avoids overloading `challenge_reflections`, which should remain about what happened after trying.

Schema:

```sql
create table public.challenge_mission_adjustments (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  request_type text not null check (request_type in ('smaller', 'different_space', 'safer_line')),
  previous_mission jsonb not null,
  next_mission jsonb not null,
  created_at timestamptz not null default now()
);
```

Server action:

```text
adjustMicroMissionAction(formData)
  -> validate locale, challengeId, requestType
  -> no-op in demo mode except revalidate
  -> fetch owned challenge
  -> require mission_kind = micro_social
  -> block completed challenges
  -> compute next mission with deterministic templates
  -> insert adjustment event with previous_mission and next_mission
  -> update challenge fields in place
  -> redirect back with ?adjusted=<requestType>
```

Adjustment types:

- `smaller`: keep the same routine space, reduce the minimum win to eye contact or standing near the counter, and keep `estimated_time='10min'`.
- `different_space`: choose another preferred routine space, or fallback to convenience store/cafe.
- `safer_line`: keep the same space, replace the line with a shorter greeting or silent nod.

Do not use LLM generation in this action for the first pass. Deterministic templates are safer, faster to test, and less likely to create awkward or over-intimate copy.

Acceptance criteria:

- Micro-mission detail page shows a low-pressure "too much today?" adjustment section.
- User can request smaller, different space, or safer line.
- Completed challenges cannot be adjusted.
- Each adjustment logs previous and next mission payloads.
- Current challenge fields update in place.
- Tests cover deterministic transformation and action authorization/validation.
- Demo/QA mode can still preview the adjusted mission after redirect.

### Slice 5C: Routine Space And Fear Personalization

Status: implemented locally 2026-04-21. Remote Supabase migration applied 2026-04-21.

Goal: Let the user set practical preferences that improve future mission quality.

Decision: add explicit profile fields, not a generic JSON blob.

Schema:

```sql
alter table public.user_profiles
  add column if not exists routine_spaces text[] not null default '{}'::text[],
  add column if not exists social_fears text[] not null default '{}'::text[];
```

Why:

- These are core product concepts, not arbitrary metadata.
- Existing `user_profiles` already stores arrays for `barriers` and `goals`.
- App-level allow-lists are enough for V1; future DB constraints can be added if these harden into stable enums.

UI location:

- Add to `/settings/profile` first.
- Do not add another onboarding step in this slice; that would make first-run heavier.
- Later, the onboarding result page can suggest filling these if mission generation quality needs it.

Generation behavior:

- `generate-challenges` should fetch `user_profiles.routine_spaces` and `social_fears`.
- Gemini context should include those values.
- Fallback challenge should prefer the first selected routine space/fear if present.
- If no preferences exist, current cafe/convenience-store fallback remains.

Acceptance criteria:

- Profile settings lets users select routine spaces and fears.
- Saved preferences appear again when returning to profile settings.
- Challenge generation includes selected preferences.
- Fallback generation uses preferences without requiring Gemini.
- UI stays lightweight and does not feel like a therapy intake form.

## Data Flow

```text
Profile settings
  -> updateProfileAction
    -> user_profiles.routine_spaces / social_fears
      -> generate-challenges context
        -> weekly micro-mission copy

Challenge detail
  -> "Too much today?" adjustment form
    -> adjustMicroMissionAction
      -> challenge_mission_adjustments event row
      -> challenges current row updated
      -> challenge detail/list/home revalidated

Ops
  -> npm run report:micro-missions
    -> Supabase RPC micro_mission_return_report()
      -> readable table or JSON
```

## Eng Review

Step 0 scope accepted with one sequencing decision:

```text
Implement report visibility first, then mission adjustment, then profile preferences feeding generation.
```

Architecture decisions:

1. Admin report UI would require an auth/role model that the app does not have, so use a service-role local script first.
2. Updating a challenge in place loses the original mission unless logged, so add `challenge_mission_adjustments`.
3. Preference fields should not be shoved into `barriers` or `goals`, so add explicit `routine_spaces` and `social_fears`.

Code quality decisions:

- Reuse server actions in `src/actions`.
- Reuse profile snapshot mapping in `src/lib/server/app-data.ts`.
- Reuse existing form/action patterns in challenge detail and profile settings.
- Add one pure helper module for micro-mission options and adjustment logic.
- Avoid LLM calls in the adjustment action.

Test requirements:

- `tests/unit/micro-mission-adjustment.test.ts`
- `tests/unit/challenge-adjustment-action.test.ts`
- `tests/unit/settings-profile-action.test.ts`
- `tests/e2e/smoke.spec.ts`

Performance risk: low. The report script is operator-triggered; adjustment and profile saves are small single-user writes.

## Design Review

Initial design completeness: 6/10. Final design completeness after plan fixes: 9/10.

Information hierarchy:

```text
Challenge detail page
  1. Current mission and minimum win
  2. Safe line and reframe
  3. "Too much today?" adjustment strip
  4. Start/complete/reflect actions

Profile settings
  1. Identity basics
  2. Comfort level
  3. Routine spaces
  4. Social fears
  5. Save
```

Copy rules:

- Use "오늘은 더 작게 줄여요", "장소를 바꿔도 괜찮아요", and "한마디를 더 안전하게 바꿀게요".
- Avoid "포기", "실패", "난이도 하향", "못 했을 때", or any copy that sounds like punishment.

Accessibility and responsive rules:

- Adjustment buttons must be at least 44px tall.
- Chip labels must not wrap internally; groups may wrap between chips.
- Radio/checkbox chips need visible focus states.
- Icon-only controls need `aria-label`; prefer text labels where possible.
- Success/error messages should be text, not color-only.

## Test Coverage Diagram

```text
CODE PATH COVERAGE
==================
[+] report script
    -> [GAP] missing env vars exits clearly
    -> [GAP] RPC rows print as table
    -> [GAP] --json prints raw JSON

[+] micro-mission adjustment helper
    -> [GAP] smaller keeps space and reduces minimum win
    -> [GAP] different_space chooses next preferred space
    -> [GAP] safer_line shortens line without changing status
    -> [GAP] unknown request type rejected

[+] adjustMicroMissionAction
    -> [GAP] rejects unauthenticated user
    -> [GAP] rejects non-owned challenge
    -> [GAP] rejects non-micro challenge
    -> [GAP] blocks completed challenge
    -> [GAP] logs previous/next mission payload
    -> [GAP] updates current challenge row

[+] profile preferences
    -> [GAP] updateProfileAction stores routine_spaces/social_fears
    -> [GAP] getProfileSnapshot maps new fields
    -> [GAP] generate-challenges passes preferences to Gemini context
    -> [GAP] fallback generation uses selected preferences

USER FLOW COVERAGE
==================
[+] challenge detail adjustment
    -> [GAP] [E2E] controls visible for active micro mission
    -> [GAP] [E2E] completed mission hides adjustment controls
    -> [GAP] [E2E] adjusted success message appears after action

[+] profile settings personalization
    -> [GAP] [E2E] routine/fear chips render and can be toggled
```

## Failure Modes

| Code path | Failure mode | Test required | Result |
| --- | --- | --- | --- |
| report script | env vars missing | yes | clear CLI error |
| report script | RPC missing after migration drift | yes/manual | clear CLI error naming migration/RPC |
| adjustment action | challenge not owned | yes | no data leak, no update |
| adjustment action | completed challenge adjusted | yes | action blocked |
| adjustment helper | preference arrays empty | yes | safe fallback mission |
| profile action | invalid option posted | yes | allow-list filters unknown values |
| generate-challenges | Gemini ignores preferences | yes | fallback/normalization keeps valid mission |

Critical silent gaps: none after planned tests and error states.

## NOT In Scope

- In-app matching: still deferred because moderation, cold start, and trust risks are too high.
- Public anonymous journal/comments: deferred until moderation and reporting exist.
- Paid subscription or ads: deferred until repeated value is proven.
- Admin web dashboard: deferred until admin roles exist.
- Full mission ladder engine: deferred until adjustment usage data exists.
- New onboarding step: deferred to avoid increasing first-run friction.
- LLM-powered instant mission rewriting: deferred for safety and testability.

## What Already Exists

- `micro_mission_return_report()` RPC: reuse via script.
- `challenges` micro-mission fields: update in place for current visible mission.
- `challenge_reflections.outcome`: keep for after-attempt reflection, not adjustment events.
- `user_profiles`: extend with routine/fear arrays.
- `generate-challenges` fallback and normalization: extend with preferences.
- Challenge detail/profile settings forms: reuse existing server action form pattern.
- Playwright QA auth bypass: reuse for e2e.

## Implementation Checklist

- [x] Add migration `006_phase_b_readiness.sql`.
- [x] Update Supabase TS types.
- [x] Add micro-mission option and adjustment helper module.
- [x] Add `adjustMicroMissionAction`.
- [x] Add adjustment controls and success/error copy to challenge detail.
- [x] Add profile routine/fear chip fields.
- [x] Update `updateProfileAction` and `getProfileSnapshot`.
- [x] Update `generate-challenges` profile context and fallback.
- [x] Add report script and package script.
- [x] Add unit tests for helpers/actions.
- [x] Extend Playwright smoke coverage.
- [x] Run `npm run check`, `npm run build`, `npm run test:e2e`.
- [x] Apply and verify Supabase migration before ship.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
| --- | --- | --- | --- | --- | --- |
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | Not run | Not required; scope follows prior Office Hours/V1 direction |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | Not run | Run after implementation if diff is non-trivial |
| Eng Review | `/plan-eng-review` | Architecture & tests | 1 | Clear | 3 architecture decisions resolved, 22 planned test paths |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | Clear | Design completeness 6/10 -> 9/10, no blocking decisions |

**UNRESOLVED:** 0

**VERDICT:** ENG + DESIGN CLEARED. Ready to implement in the order 5A -> 5B -> 5C.
