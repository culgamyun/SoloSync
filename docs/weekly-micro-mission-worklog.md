# Weekly Micro-Mission Worklog

Last updated: 2026-04-19

## How To Resume

Read these in order:

1. `docs/01-plan/weekly-micro-mission-roadmap.md`
2. this worklog
3. `docs/01-plan/features/phase-b-readiness.plan.md`
4. the latest relevant checkpoint in `docs/checkpoints/`
5. `git status --short`
6. relevant diffs

Related documents:

- Roadmap: `docs/01-plan/weekly-micro-mission-roadmap.md`
- V1 implementation plan: `docs/01-plan/features/weekly-micro-mission-v1.plan.md`
- Phase B readiness plan: `docs/01-plan/features/phase-b-readiness.plan.md`
- Design system: `DESIGN.md`
- Local environment guide: `ENV_LOCAL_SETUP.md`

## Current Slice Status

Active slice: Slice 5, Phase B Readiness Bundle.

The bundle is planned and reviewed, but not implemented yet.

Implementation order is locked:

1. **5A Retention report visibility**
2. **5B Smaller mission and swap mission**
3. **5C Routine space and fear personalization**

The next branch should implement 5A first unless the user explicitly asks to batch all three.

## Implemented

- Office Hours established the product wedge: weekly low-pressure social micro-missions before matching, meetups, dating, or therapy.
- V1 implementation plan and engineering review were written.
- Roadmap and worklog were created.
- `DESIGN.md` was created with the Urban Field Notes / Data-Driven Accent system.
- `supabase/migrations/004_micro_social_missions.sql` added micro-social mission fields:
  - `mission_kind`
  - `mission_context`
  - `safe_line`
  - `minimum_win`
  - `fear`
  - `reframe`
  - `challenge_reflections.outcome`
- `supabase/migrations/005_challenge_reflection_idempotency.sql` added idempotency for reflections.
- Supabase types and app challenge models were updated for micro-mission fields.
- Demo mode includes a Korean micro-social mission for a routine-life space.
- Challenge list, detail, and reflection pages render the mission context, safe line, minimum win, fear, and reframe.
- Reflection supports:
  - `greeted`
  - `said_line`
  - `could_not_do_it`
- `submitReflectionAction` now handles duplicate reflection submissions idempotently so XP is awarded only once.
- AI-generated challenge values are validated/normalized before hitting DB constraints.
- QA auth bypass exists at `/api/qa/auth-bypass` for non-production test flows and rejects unsafe protocol-relative redirects.
- `/coach` has a back/home affordance so users are not trapped on the page.
- Coach send button icon rendering and accessibility label were fixed after preview QA.
- Playwright managed Chromium is configured with a QA bypass dev server on port `3100`.
- E2E smoke tests cover localized routes and micro-mission detail/reflection copy.
- `public.micro_mission_return_report()` derives the failed/skipped user next-week return report.
- Remote Supabase migrations `001` through `005` were applied and verified.
- Sample-data probe verified the return report numbers:
  - `failed_or_skipped_users=3`
  - `returned_next_week_users=2`
  - `next_week_return_rate=0.6667`
- Temporary sample users/data were cleaned up after verification.
- Core docs were restored from mojibake into readable Korean/English on 2026-04-19.
- Phase B Readiness plan was created and reviewed on 2026-04-19.

## Verification Status

Recent passing checks:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run check`
- `npm run build`
- `npm run test:e2e`
- `git diff --check`

Browser/design QA:

- Home, challenges, challenge detail, reflection, coach, progress, and settings were checked at mobile and desktop sizes.
- Score ring overlap, chip wrapping, action button wrapping, and coach navigation issues were fixed.
- Post-merge QA found the coach send icon squeezed to 2px because `Button size="icon"` kept primary horizontal padding; this was fixed by removing icon padding and adding an accessible label.

Known non-blocking warnings:

- `npm run lint` prints an ESLint 9 `.eslintignore` deprecation warning but exits 0.
- `npm run build` prints an existing Sentry/OpenTelemetry dynamic require warning but exits 0.

Environment caveats:

- Vercel project configuration was not detected locally. `vercel_list_projects` returned no projects for the visible team.
- Production/preview deployment QA is therefore not yet repeatable from repo config alone.
- `SOLOSYNC_QA_AUTH_BYPASS=true` is for local/test only; production rejects the bypass route.

## Active Backlog

### Ready To Implement

1. **5A Retention report visibility**
   - Add `scripts/micro-mission-return-report.mjs`.
   - Add `npm run report:micro-missions`.
   - Document env requirements and output.

2. **5B Smaller mission and swap mission**
   - Add migration `006_phase_b_readiness.sql`.
   - Add `challenge_mission_adjustments`.
   - Add deterministic micro-mission adjustment helper.
   - Add `adjustMicroMissionAction`.
   - Add challenge detail adjustment controls.

3. **5C Routine space and fear personalization**
   - Add `routine_spaces` and `social_fears` to `user_profiles`.
   - Add profile settings chips.
   - Update profile action and snapshot mapping.
   - Feed preferences into `generate-challenges`.

### Still Deferred

- Deployment setup and preview QA configuration.
- ESLint `.eslintignore` cleanup.
- Journal/community idea.
- Admin dashboard visualization.
- Matching/community/social graph features.

## Decisions Since Roadmap

- Reflection outcome is required on the micro-mission reflection UI; there is no silent default success outcome.
- Duplicate reflection submissions should be safe and idempotent.
- LLM challenge generation must validate and normalize enum-like fields before database insert/upsert.
- QA auth bypass accepts only local/test use and must block protocol-relative open redirects.
- `.gstack/` in the repo is generated local workflow output, not the Codex skill installation directory.
- Skill definitions live under `C:\Users\culga\.codex\skills\...`.
- Phase B Readiness should be one bundle with three ordered sub-slices: report visibility, mission adjustment, preference personalization.
- Retention report visibility should start as an internal/local script, not an in-app admin page.
- Mission adjustments should update the visible challenge row in place and log before/after payloads in a dedicated event table.
- Instant mission adjustment should use deterministic templates, not LLM generation.
- Routine spaces and fears should be explicit `user_profiles` arrays, not overloaded `barriers` or `goals`.
- Personalization UI belongs in profile settings first, not onboarding.

## Tracking Rule

Immediately record future idea candidates here. If an idea changes priority, update the roadmap too.
