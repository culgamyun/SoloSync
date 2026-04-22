# Preview QA Playbook

Last updated: 2026-04-23

## Purpose

This document describes the repeatable QA path for SoloSync smoke verification in both local development and preview deployments.

## Runtime Rules

- QA auth bypass is allowed only when:
  - `SOLOSYNC_QA_AUTH_BYPASS=true`
  - the runtime is local dev/test or a preview deployment
- QA auth bypass is blocked in real production

## Local Smoke Flow

Use the stable local smoke entrypoint:

```bash
npm run test:e2e:smoke
```

What it does:

- starts the local dev server on port `3100`
- enables the QA bypass route
- establishes the bypass cookie before the smoke suite
- runs the Chromium smoke tests

## Preview Smoke Flow

1. Ensure the preview environment has:

```env
SOLOSYNC_QA_AUTH_BYPASS=true
```

2. Run the preview smoke command:

```bash
npm run qa:preview -- --url https://your-preview-url
```

Optional flags:

- `--project mobile-chrome`
- `--project all`
- `--headed`
- `--no-bypass`

Examples:

```bash
npm run qa:preview -- --url https://solosync-git-branch-user.vercel.app
npm run qa:preview -- --url https://solosync-git-branch-user.vercel.app --project mobile-chrome
npm run qa:preview -- --url https://solosync-git-branch-user.vercel.app --project all
```

## Expected Failure Modes

### The preview smoke run fails on `/api/qa/auth-bypass`

Likely causes:

- `SOLOSYNC_QA_AUTH_BYPASS` is not enabled in the preview environment
- the URL points at a real production deployment
- the preview is protected upstream and your session cannot reach the route

### The smoke suite opens but still shows the login gate

Likely causes:

- the bypass cookie was not established
- the preview URL redirected across domains and dropped the cookie
- the target environment is not using the same bypass flag or runtime gating

## Recommended Operator Sequence

1. Run `npm run check`
2. Run `npm run build`
3. Run either:
   - `npm run test:e2e:smoke` for local
   - `npm run qa:preview -- --url https://...` for preview
4. If smoke fails, confirm bypass env, target URL, and runtime type before investigating UI regressions
