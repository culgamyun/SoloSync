# Checkpoint - Preview QA hardening implementation

Date: 2026-04-23

## What shipped on the working branch

- Added `docs/01-plan/features/post-phase-b-preview-qa.plan.md`
- Added `docs/preview-qa-playbook.md`
- Added preview QA runtime helpers in `src/lib/qa/runtime.ts`
- Updated:
  - `src/lib/env.ts`
  - `src/lib/server/demo-mode.ts`
  - `src/app/api/qa/auth-bypass/route.ts`
- Updated Playwright to support an external preview base URL:
  - `playwright.config.ts`
  - `tests/e2e/global.setup.ts`
- Added operator preview smoke entrypoints:
  - `scripts/lib/preview-qa.mjs`
  - `scripts/preview-qa-smoke.mjs`
  - `npm run test:e2e:smoke`
  - `npm run qa:preview -- --url https://...`
- Added tests:
  - `tests/unit/qa-runtime.test.ts`
  - `tests/unit/preview-qa-script.test.ts`

## Validation

- `npm run test -- tests/unit/qa-runtime.test.ts tests/unit/preview-qa-script.test.ts`
- `npm run typecheck`
- `npm run test:e2e:smoke`
- `npm run check`
- `npm run build`

## Notes

- Local smoke is now cookie-based through the same QA bypass route shape used for preview, instead of relying on global demo mode when the flag is present.
- Preview QA remains blocked in real production. Preview access still depends on the target deployment enabling `SOLOSYNC_QA_AUTH_BYPASS=true`.
- The new preview smoke script was validated through parser tests plus the shared Playwright/auth path, but not against a live preview URL in this session.

## Recommended next action

After this branch lands, the next useful move is either:

1. run one real preview smoke pass against the deployed preview URL to validate the external-base path end to end, or
2. move on to the next post-Phase-B product slice now that preview QA has a documented repeatable path.
