# Checkpoint - Portfolio readiness audit

Date: 2026-04-29

## Verdict

SoloSync is close to a portfolio-grade demo for hiring or client review. The current branch shows a coherent product wedge: weekly micro-missions for small relationship routines, not dating, therapy, or a generic AI wrapper. A first-time reviewer can now reach the core loop locally through welcome, login/demo bypass, home, challenge list, mission detail, reflection, progress, and settings.

Overall readiness: 8.6 / 10

## Scores

- Code health: 9.5 / 10
  - `lint`, `typecheck`, unit tests, build, aggregate `check`, and smoke E2E pass.
  - Local generated folders no longer pollute ESLint, TypeScript, or Vitest.
- Visual and UX: 8.5 / 10
  - Welcome and app surfaces present a clear weekly micro-mission identity.
  - Mobile and desktop samples showed no console errors or horizontal overflow.
  - Demo fallback challenge copy is now consistently Korean.
- Functional QA: 8.7 / 10
  - Smoke coverage renders the localized shell, mission detail, reflection controls, profile chips, recovery check-in, and demo mission scaling.
  - Supabase-missing demo mode and QA auth bypass are usable for local review.
- Security and ops: 8.2 / 10
  - Production QA bypass is blocked by runtime helpers and covered by unit tests.
  - Service role usage is server-side or script-only, with no direct client exposure found in tracked app code.
  - User-owned Supabase tables have RLS enabled and owner policies.
  - Dependency audit is clean after lockfile updates and a PostCSS override.

## Fixes Applied

- Added repo-local ignores for `.codex-temp/`, `~/`, and `test-results/` across lint/test/typecheck tooling.
- Removed the stale `.eslintignore` file now that ESLint flat config owns ignores.
- Localized remaining English demo fallback challenge titles, descriptions, and conversation starters.
- Removed wildcard `next/image` remote host allowance because current app images are local.
- Added a restrictive `Permissions-Policy` header for camera, microphone, and geolocation.
- Updated the lockfile with `npm audit fix`, then added a PostCSS override so `npm audit --omit=dev` reaches zero vulnerabilities.
- Added a README portfolio demo path with local/demo auth instructions and production bypass warning.

## Validation

- `npm audit --omit=dev` - pass, 0 vulnerabilities
- `npm run lint` - pass
- `npm run typecheck` - pass
- `npm run test` - pass, 11 files / 49 tests
- `npm run build` - pass with known Sentry/OpenTelemetry and next-intl dynamic import warnings
- `npm run check` - pass
- `npm run test:e2e:smoke` - pass, 21 tests

Additional browser sampling:

- Mobile and desktop screenshots were captured under `test-results/portfolio-readiness/`.
- Checked welcome, login, home, challenges, mission detail, reflection, progress, and settings.
- Sample checks reported no horizontal overflow, no browser console errors, and no leftover English demo challenge copy.

## Security Notes

- QA bypass route returns 404 unless `SOLOSYNC_QA_AUTH_BYPASS=true` and runtime is non-production.
- `VERCEL_ENV=production` and `NODE_ENV=production` production cases are denied by `isQaBypassAllowedRuntime`.
- `SUPABASE_SERVICE_ROLE_KEY` appears in server-only AI proxy code, reporting scripts, Supabase functions, docs, tests, and env examples. It is not passed to the browser client in tracked app code.
- RLS is enabled for the initial user-owned tables and `challenge_mission_adjustments`; policies use `auth.uid()` ownership or session-owner joins.

## Remaining Backlog

- Add CSP in report-only mode first, then enforce after checking Google Fonts, Sentry, Next scripts, and inline styles.
- Consider self-hosting fonts with `next/font` for privacy and performance.
- Add an automated accessibility pass, especially keyboard traversal, focus visibility, and touch target measurements.
- Expand E2E to submit a reflection and assert duplicate reflection/idempotency behavior.
- Run one smoke pass against a real Vercel preview URL before showing the app publicly.
- Investigate repeated Sentry/OpenTelemetry dynamic dependency build warnings and either configure or document them.
- Pin GitHub Actions to commit SHAs if supply-chain hardening becomes a portfolio talking point.

## Demo Path

1. Install dependencies with `npm install`.
2. Start the app with `npm run dev`.
3. Open `/ko/welcome` and walk through welcome, login, home, challenges, mission detail, reflection, progress, and settings.
4. For local no-auth review, start with `SOLOSYNC_QA_AUTH_BYPASS=true` and visit `/api/qa/auth-bypass?next=/ko/home`.

