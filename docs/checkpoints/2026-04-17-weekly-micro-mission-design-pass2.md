# Weekly Micro-Mission Design Review Pass 2

Date: 2026-04-17
Status: completed in working tree, not committed

## Scope

Second visual QA pass after the user explicitly requested `$design-review`.

Reviewed on `http://localhost:3001` using the QA auth bypass:

- `/ko/home`
- `/ko/challenges`
- `/ko/challenges/challenge-1`
- `/ko/challenges/challenge-1/reflect`
- `/ko/coach`
- `/ko/progress`
- `/ko/settings`

Viewports:

- 360 x 780
- 390 x 844
- 1280 x 900

## Findings Fixed

- `/coach` quick reply chips were still English on the Korean UI.
- `/coach` fallback response was English when Supabase functions were unavailable.
- `/coach` showed a three-dot icon that looked interactive but had no action.

## Verification

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run test`

Visual checks:

- Captured local Chrome headless screenshots across the reviewed routes and viewports.
- Confirmed no horizontal overflow in the captured pass.

## Caveats

- Working tree remains intentionally dirty for a larger one-shot review.
- Full `npm run test:e2e` remains unrun because Playwright's managed browser is not installed.
- Final coach screenshot after removing the three-dot icon was not recaptured because the browser command was declined.

## Screenshot Prefix

Screenshots from this pass use:

- `.gstack/design-reports/screenshots/design-pass2-*.png`
