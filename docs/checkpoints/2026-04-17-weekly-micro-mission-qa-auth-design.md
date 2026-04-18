# Weekly Micro-Mission QA Auth And Design Checkpoint

Date: 2026-04-17
Status: implemented in working tree, not committed

## Trigger

User opened the app on port 3001 and wanted design QA, but first wanted to bypass login for smoother testing.

## What Changed

- Added `SOLOSYNC_QA_AUTH_BYPASS` as a dev-only server flag.
- Added a dev-only cookie bypass route:
  - `GET /api/qa/auth-bypass?next=/ko/home`
  - `DELETE /api/qa/auth-bypass`
- Added request-level demo mode detection through `src/lib/server/demo-mode.ts`.
- Updated viewer/data/actions/push routes to use demo behavior when the QA bypass is active.
- Hid the bottom tab bar on nested challenge pages such as challenge detail and reflection.
- Tightened Korean large heading wrapping with explicit line breaks, `break-keep`, and normal tracking on touched screens.
- Removed compact score-ring inline delta to prevent overlap with the circular chart.
- Reworked challenge card header layout so chips, XP, and titles do not fight for the same narrow mobile row.

## Verification

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `http://localhost:3001/api/qa/auth-bypass?next=/ko/home` redirects to `/ko/home` with the bypass cookie.
- Auth-bypassed requests returned 200 for:
  - `/ko/challenges`
  - `/ko/challenges/challenge-1`
  - `/ko/challenges/challenge-1/reflect`

Visual QA:

- Captured mobile and desktop screenshots with local Chrome headless.
- Confirmed no horizontal overflow on tested pages.
- Confirmed nested challenge detail/reflection pages no longer render the bottom tab bar.
- Confirmed the reflection headline now renders as two intentional lines.
- Confirmed compact score ring no longer overlaps the score/delta with the ring.
- Confirmed the first micro-mission card keeps chips and XP on stable lines with no horizontal overflow.

## Caveats

- Playwright's managed Chromium binary is not installed locally, so screenshots used installed Chrome.
- The screenshots show the Next dev indicator bubble; this is a dev artifact, not product UI.
- Full `npm run test:e2e` remains unrun.

## Screenshot Artifacts

- `.gstack/design-reports/screenshots/home-after-mobile.png`
- `.gstack/design-reports/screenshots/challenge-detail-after-mobile.png`
- `.gstack/design-reports/screenshots/challenge-reflect-after-mobile.png`
- Desktop variants are in the same folder.

## Next Best Step

Continue V1 hardening: add the return-after-failure metric query/report and focused non-browser tests, then run one consolidated review.
