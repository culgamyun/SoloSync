# SoloSync Agent Notes

## Design System

Always read `DESIGN.md` before making visual or UI decisions.

All font choices, colors, spacing, product tone, and component guardrails are defined there. Do not deviate without explicit user approval. In QA mode, flag any code that does not match `DESIGN.md`.

## Product Context

SoloSync is currently focused on weekly micro-social missions for 수도권 20대 1인 가구 직장인 who have few low-pressure social contacts outside work.

The product should not feel like:

- therapy,
- dating,
- meetup/event discovery,
- friend matching,
- or a generic AI chatbot wrapper.

The first success metric is not "mission completed". The key V1 signal is whether users who fail or skip a mission return the following week.

## Source-Of-Truth Docs

Read these before continuing feature work:

1. `docs/01-plan/weekly-micro-mission-roadmap.md`
2. `docs/weekly-micro-mission-worklog.md`
3. `docs/01-plan/features/weekly-micro-mission-v1.plan.md`
4. Latest relevant file in `docs/checkpoints/`
5. `git status --short`

## Commands

- `npm run dev` - start the local Next.js server.
- `npm run check` - run lint, typecheck, and unit tests.
- `npm run test:e2e` - run Playwright with QA auth bypass on port `3100`.
- `npm run build` - run a production build.

Known non-blocking warnings:

- ESLint 9 warns that `.eslintignore` is deprecated.
- Next build may show an existing Sentry/OpenTelemetry dynamic require warning.

## QA Auth Bypass

For local and Playwright tests only:

```text
/api/qa/auth-bypass?next=/ko/home
```

Use `SOLOSYNC_QA_AUTH_BYPASS=true` in local/test environments. Production rejects the route. Do not use this as a production auth path.

## Supabase Notes

Migrations `001` through `005` are part of the shipped V1 path.

Important shipped pieces:

- optional micro-mission fields on `challenges`,
- `challenge_reflections.outcome`,
- idempotent reflection handling for `(user_id, challenge_id)`,
- `public.micro_mission_return_report()` for failed/skipped next-week return analysis.

## Local Workflow Notes

Repo-local `.gstack/` is generated workflow output, not the Codex skill installation directory. The user’s gstack skills live under:

```text
C:\Users\culga\.codex\skills\...
```
