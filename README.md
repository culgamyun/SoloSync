# SoloSync

SoloSync is a hosted-first Next.js + Supabase PWA for an AI-powered social health coach. The current wedge is a weekly micro-social mission: low-pressure, routine-space social practice for people whose relationships have become shallow after graduation, moving, discharge, or job changes.

The product is not dating, meetup, friend matching, or therapy. It helps users make one small counterexample to "my life is hopeless" by choosing a safe line, trying a tiny action, and reflecting without shame even when the mission does not happen.

## Current Product Surface

- Weekly micro-missions in the existing challenge list, detail, and reflection flow.
- Mission fields for context, safe line, minimum win, fear, and reframe.
- Reflection outcomes for `greeted`, `said_line`, and `could_not_do_it`.
- Demo fallback data when Supabase is not configured.
- Development-only QA auth bypass for browser and Playwright checks.
- Return report RPC for "failed/skipped users who return the following week".

## Stack

- Next.js App Router + TypeScript strict
- Tailwind CSS + lightweight shadcn-style UI primitives
- next-intl (`ko` / `en`)
- Supabase Auth / Postgres / Edge Functions
- Gemini for AI scoring, coaching, and challenge generation
- Zustand for onboarding draft state
- Recharts for score history
- Web Push service worker
- Vitest and Playwright

## Setup

1. Copy `.env.example` to `.env.local` and fill in Supabase, Gemini, and optional VAPID/Sentry values.
2. Install dependencies with `npm install`.
3. Apply the SQL files in `supabase/migrations` to your Supabase project, or run `npx supabase db push` after linking the project.
4. Deploy the Edge Functions under `supabase/functions`.
5. Run `npm run dev`.

See `ENV_LOCAL_SETUP.md` for the full local environment guide.

## Portfolio Demo Path

For a local portfolio walkthrough, start at `/ko/welcome`, continue through login, then use the demo fallback path to review home, challenges, a mission detail, reflection, progress, and settings. When a Supabase project is not configured, SoloSync serves demo data so the weekly micro-mission experience remains explorable.

For browser or Playwright review without real auth, run with `SOLOSYNC_QA_AUTH_BYPASS=true` in local or preview environments and open `/api/qa/auth-bypass?next=/ko/home`. The bypass is explicitly blocked in production runtime and must not be enabled for a real production demo.

## Useful Commands

- `npm run dev` - start the local Next.js server.
- `npm run check` - run lint, typecheck, and unit tests.
- `npm run test:e2e` - run Playwright against a QA auth-bypass dev server on port 3100.
- `npm run test:e2e:smoke` - run the stable local Chromium smoke flow.
- `npm run qa:preview -- --url https://...` - run the smoke flow against a preview URL.
- `npm run build` - create a production Next.js build.

## Key Paths

- `src/app/[locale]` - localized app routes.
- `src/actions` - server actions for onboarding, challenges, reflections, and settings.
- `src/lib/server/app-data.ts` - demo fallback and server data queries.
- `src/lib/server/demo-mode.ts` - QA/demo-mode user context.
- `src/app/api/qa/auth-bypass/route.ts` - non-production QA login bypass.
- `supabase/migrations` - schema, RLS, helper functions, and return report RPC.
- `supabase/functions` - AI, scoring, challenge, and notification functions.
- `tests/e2e/smoke.spec.ts` - smoke coverage for the localized app shell and micro-mission path.

## Project Docs

- `DESIGN.md` - SoloSync design system and product UI guardrails.
- `docs/01-plan/weekly-micro-mission-roadmap.md` - product direction and priority stack.
- `docs/weekly-micro-mission-worklog.md` - current execution state and backlog.
- `docs/01-plan/features/weekly-micro-mission-v1.plan.md` - implementation plan and engineering decisions.
- `docs/checkpoints/` - dated handoff snapshots.
- `docs/preview-qa-playbook.md` - repeatable local and preview QA flow.

## Notes

- When Supabase env vars are absent, the app falls back to demo data so the UI can still be explored.
- Set `SOLOSYNC_QA_AUTH_BYPASS=true` only in local/test environments. Production rejects the bypass route.
- Preview smoke can also use `SOLOSYNC_QA_AUTH_BYPASS=true`, but only on preview deployments, never on real production.
- Apple auth is feature-gated via `NEXT_PUBLIC_ENABLE_APPLE_AUTH`.
- Push notifications require valid VAPID keys and a deployed service worker.
