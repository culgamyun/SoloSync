# Weekly Micro-Mission Worklog

Last updated: 2026-04-29

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
- Portfolio visual/motion polish plan: `docs/01-plan/features/portfolio-visual-motion-polish.plan.md`
- Portfolio accessibility/functional/security plan: `docs/01-plan/features/portfolio-accessibility-functional-security.plan.md`
- Design system: `DESIGN.md`
- Local environment guide: `ENV_LOCAL_SETUP.md`
- Preview QA playbook: `docs/preview-qa-playbook.md`

## Current Slice Status

Active slice: Portfolio readiness accessibility, functional demo hardening, and security/ops proof implemented locally on `codex/portfolio-readiness-audit`.

Phase B is merged to `main`. Remote Supabase migrations through `008_phase_b_analytics.sql` are applied.

Implementation order is locked:

1. **5A Retention report visibility** - implemented 2026-04-20
2. **5B Smaller mission and swap mission** - merged to `main` 2026-04-22
3. **5C Routine space and fear personalization** - merged to `main` 2026-04-22
4. **7A Portfolio visual identity assets** - implemented and verified locally 2026-04-29
5. **7B Expressive motion polish** - implemented and verified locally 2026-04-29
6. **7C Accessibility and usability polish** - implemented and verified locally 2026-04-29
7. **7D Portfolio demo flow hardening** - implemented and verified locally 2026-04-29
8. **7E Security and ops proof** - implemented and verified locally 2026-04-29

Slice 6A and 6B are merged to `main`. Slice 6C Preview QA hardening is implemented and verified locally on `codex/preview-qa-hardening`, pending review/merge.

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
- `npm run report:micro-missions` was added on 2026-04-20.
  - It calls `micro_mission_return_report()` with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - It prints a readable table by default.
  - `--json` prints raw RPC output.
  - Missing env vars return a clear non-zero error.
- 5B mission adjustment flow was implemented locally on 2026-04-21.
  - `challenge_mission_adjustments` migration was added in `006_phase_b_readiness.sql`.
  - Micro-social missions can be changed to a smaller version, a different space, or a safer line.
  - Adjustments update the visible challenge in place and log previous/next mission payloads.
  - Challenge detail shows success/error feedback after adjustment redirects.
  - Demo mode previews the adjusted mission so Playwright smoke coverage can verify the flow without a live write.
- 5C profile personalization was implemented locally on 2026-04-21.
  - `user_profiles` now stores `routine_spaces` and `social_fears`.
  - `/settings/profile` includes lightweight checkbox chips for routine spaces and social fears.
  - `updateProfileAction` filters and stores those arrays and revalidates challenge surfaces.
  - `getProfileSnapshot` maps the new fields for demo and live profile rendering.
  - `generate-challenges` includes those preferences in Gemini context and deterministic fallback generation.
  - `007_profile_personalization.sql` was applied to the remote Supabase project.
- Phase B was merged to `main` on 2026-04-22.
- `docs/phase-b-readiness-report.md` now summarizes Phase B outcomes for quick handoff/reference.
- `docs/01-plan/features/post-phase-b.plan.md` now defines the next planning frame after Phase B.
- Slice 6A Phase B analytics was implemented locally on 2026-04-22.
  - `008_phase_b_analytics.sql` adds `phase_b_usage_report()` and `phase_b_return_delta_report()`.
  - `npm run report:phase-b` prints a combined operator report.
  - `npm run report:micro-missions` restores the documented micro-mission return-only report entrypoint.
  - The report scripts accept `--week=YYYY-MM-DD` and `--json`.
  - Live execution against the connected dataset currently returns empty-state tables, confirming the path works even with no qualifying rows.
- Slice 6B planning started on 2026-04-23.
  - `docs/01-plan/features/post-phase-b-recovery-checkin.plan.md` locks the intended shape.
  - The current plan is to reuse previous challenge/reflection/adjustment data rather than add a new table.
- Slice 6B weekly recovery check-in was implemented locally on 2026-04-23.
  - `src/lib/challenges/recovery-check-in.ts` derives prior-week recovery signals and shared copy for app plus edge generation.
  - `src/lib/server/app-data.ts` loads the prior micro-mission, latest reflection outcome, and adjustment count to build a recovery card on Home.
  - `src/app/[locale]/(main)/home/page.tsx` now shows the recovery check-in card and reuses recovery-specific copy in the weekly check-in form.
  - `supabase/functions/generate-challenges/index.ts` now passes prior-week recovery context into Gemini and adjusts deterministic fallbacks.
  - `tests/unit/recovery-check-in.test.ts` and `tests/e2e/smoke.spec.ts` cover the new recovery behavior.
- Slice 6C planning started on 2026-04-23.
  - `docs/01-plan/features/post-phase-b-preview-qa.plan.md` locks the intended preview QA hardening shape.
  - The implementation target is preview-safe QA bypass plus an external-base smoke path.
- Slice 6C preview QA hardening was implemented locally on 2026-04-23.
  - `src/lib/qa/runtime.ts` now distinguishes local/test, preview, and real production QA-bypass runtimes.
  - `src/lib/env.ts`, `src/lib/server/demo-mode.ts`, and `src/app/api/qa/auth-bypass/route.ts` now treat QA bypass as cookie-based request access instead of global demo mode whenever the flag is present.
  - `playwright.config.ts` now supports `PLAYWRIGHT_BASE_URL` so smoke tests can target an existing preview URL.
  - `tests/e2e/global.setup.ts` establishes the QA bypass cookie before the smoke suite and fails clearly when the route is unavailable.
  - `scripts/preview-qa-smoke.mjs` and `npm run qa:preview -- --url https://...` add a stable preview smoke entrypoint.
  - `docs/preview-qa-playbook.md`, `README.md`, `.env.example`, and `ENV_LOCAL_SETUP.md` document the new flow.
  - `tests/unit/qa-runtime.test.ts` and `tests/unit/preview-qa-script.test.ts` cover the new runtime and script behavior.
- Portfolio visual identity and motion polish was implemented and verified locally on 2026-04-29.
  - `public/images/field-notes/` contains four field-note WebP assets for welcome, micro-mission context, progress stamp, and empty state.
  - `FieldNoteImage` standardizes decorative image treatment, border, radius, aspect ratio, and sizing.
  - `MotionReveal` adds reduced-motion-safe page and section reveal motion.
  - Welcome, home, challenge detail, reflection, progress, and settings now use field-note assets or section reveal motion.
  - Bottom navigation keeps lucide icons and uses a Framer Motion active indicator instead of generated raster decoration.
  - `ScoreRing` animates stroke dashoffset while respecting reduced motion.
  - Verified with lint, typecheck, unit tests, build, check, smoke E2E, and mobile/desktop Playwright visual QA.
- Portfolio accessibility, demo flow, and security proof were implemented and verified locally on 2026-04-29.
  - Bottom navigation now exposes `aria-current="page"` and a navigation label, while keeping 44px+ touch targets.
  - Common buttons, bottom navigation, mobile header back button, and reflection radio cards have clearer focus-visible states.
  - Reflection submission now redirects to `/ko/progress` so the portfolio path closes the loop from mission record to growth view.
  - `tests/e2e/accessibility.spec.ts` covers nav semantics, touch target sizing, and keyboard radio selection.
  - `tests/e2e/portfolio-demo.spec.ts` covers mission adjustment, reflection submit, and repeated reflection submit in demo mode.
  - `src/lib/ai/client.ts` imports `server-only` before using `SUPABASE_SERVICE_ROLE_KEY`.
  - `npm run security:check` now verifies service role key usage, RLS coverage for 11 user-owned tables, and production dependency audit.
  - `docs/security-ops-proof.md` records the security and operations proof for portfolio review.

## Verification Status

Recent passing checks:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run check`
- `npm run build`
- `npx playwright test tests/e2e/smoke.spec.ts --project=chromium`
- `npm run test:e2e:smoke`
- `npm run test:e2e:portfolio`
- `npm run security:check`
- `git diff --check`
- `npx supabase db push`
- `npm run report:phase-b -- --week=2026-04-20`
- `npm run report:micro-missions -- --week=2026-04-20`

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
- `SOLOSYNC_QA_AUTH_BYPASS=true` can be used for local/test and preview verification, but the bypass route remains blocked in real production.
- The new `npm run qa:preview -- --url https://...` path was validated through local script/runtime coverage, but not yet against a live preview URL in this branch session.

## Active Backlog

### Ready To Implement

1. **6C Preview QA hardening**
   - Make preview verification documented and repeatable beyond local QA bypass flows.
   - Detailed plan written in `docs/01-plan/features/post-phase-b-preview-qa.plan.md`.
   - Implemented locally on `codex/preview-qa-hardening`.
   - Pending review/merge.

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
- Retention report visibility is an internal/operator command, not a browser admin page.
- Mission adjustment should stay deterministic and should not call Gemini in the request path.
- Profile personalization should use explicit routine-space and social-fear arrays, and fallback mission generation should prefer those selections when present.
- Post-Phase-B should begin with observability, not another large user-facing surface, so the team can measure whether Phase B meaningfully improved return behavior.

## Tracking Rule

Immediately record future idea candidates here. If an idea changes priority, update the roadmap too.
