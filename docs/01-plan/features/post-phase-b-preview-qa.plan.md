# Post-Phase-B Preview QA Hardening Plan

Last updated: 2026-04-23
Status: implemented locally on `codex/preview-qa-hardening`, review/merge pending

## Goal

Make SoloSync preview verification repeatable enough that weekly product iteration no longer depends on local memory, one-off browser poking, or local-only QA bypass behavior.

## Problem

The repository already has:

- local Playwright smoke coverage
- a QA auth-bypass route
- a documented note that preview/prod QA is still not repeatable

But the current setup still has a gap:

1. Preview deployments usually run with `NODE_ENV=production`, so the current QA bypass path is effectively blocked there.
2. Playwright is wired mainly for a local dev server, not an existing preview URL.
3. There is no one stable operator command that says "run the smoke flow against this preview."
4. The repo docs do not give a single concise preview QA playbook.

## Scope

Ship a narrow but durable 6C bundle:

1. **Preview-safe QA bypass runtime gating**
   - Allow the QA bypass only for:
     - local dev/test
     - preview deployments
   - Keep it blocked for real production.
   - Keep the bypass explicitly opt-in via `SOLOSYNC_QA_AUTH_BYPASS=true`.

2. **External-base Playwright smoke support**
   - Let Playwright run against:
     - the existing local dev server flow
     - an externally provided preview URL
   - Ensure the QA bypass cookie can be established automatically before smoke tests.

3. **Stable operator entrypoint**
   - Add one script that accepts a preview URL and runs the smoke suite with the right env wiring.
   - Keep the default scope conservative: Chromium smoke only unless explicitly widened.

4. **Preview QA playbook**
   - Add one doc that explains:
     - required env on preview
     - local smoke command
     - preview smoke command
     - expected failure modes

## Non-Goals

- Full production canary monitoring
- Vercel project auto-discovery or deploy orchestration
- Role-based admin QA dashboard
- Screenshot diffing or visual regression infrastructure
- Replacing the existing local QA bypass flow

## Proposed Changes

### Runtime and env

- Add a small runtime helper to distinguish:
  - local/dev/test
  - preview deployment
  - real production
- Update `src/lib/env.ts`, `src/lib/server/demo-mode.ts`, and `src/app/api/qa/auth-bypass/route.ts` to use that helper.
- Change QA bypass behavior from "global demo mode when the env flag is on" to "cookie-based request bypass when the env flag is on."

### Playwright

- Update `playwright.config.ts` to accept an external `PLAYWRIGHT_BASE_URL`.
- Keep the current local `webServer` flow when no external base URL is provided.
- Add Playwright setup that establishes the QA bypass cookie through `/api/qa/auth-bypass`.

### Scripts

- Add a preview smoke runner script, for example:
  - `npm run qa:preview -- --url https://...`
- Add a smaller stable local smoke entrypoint:
  - `npm run test:e2e:smoke`

### Docs

- Create a preview QA doc under `docs/`.
- Update README and local env guidance with the new preview smoke flow and the `SOLOSYNC_QA_AUTH_BYPASS` variable.
- Update roadmap/worklog/checkpoint once implemented.

## Validation

Minimum:

- `npm run check`
- `npm run test:e2e:smoke`
- `npm run build`

Additional confidence:

- unit tests for runtime classification and preview QA script arg parsing
- verify that the preview smoke runner fails clearly when the bypass route is unavailable

## Acceptance Criteria

- QA bypass works in preview deployments when explicitly enabled, but remains blocked in production.
- Playwright can run smoke tests against a provided preview URL without requiring local server edits.
- The repo contains one documented preview QA path that a future agent or operator can rerun quickly.
- The local smoke flow remains intact.

## Recommended Implementation Order

1. Runtime gating helper plus QA auth route update
2. Request-level demo mode update
3. Playwright external-base support and auth setup
4. Preview smoke script
5. Docs, roadmap/worklog, checkpoint
