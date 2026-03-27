# SoloSync

SoloSync is a hosted-first Next.js + Supabase PWA scaffold for an AI-powered social health coach.

## Stack

- Next.js App Router + TypeScript strict
- Tailwind CSS + lightweight shadcn-style UI primitives
- next-intl (ko / en)
- Supabase Auth / Postgres / Edge Functions
- Zustand for onboarding draft state
- Recharts for score history
- Web Push service worker

## Setup

1. Copy `.env.example` to `.env.local` and fill in Supabase, Gemini and VAPID values.
2. Install dependencies with `npm install`.
3. Apply the SQL files in `supabase/migrations` to your Supabase project.
4. Deploy the Edge Functions under `supabase/functions`.
5. Run `npm run dev`.

## Key paths

- `src/app/[locale]` - localized app routes
- `src/actions` - server actions for onboarding, challenges and settings
- `src/lib/server/app-data.ts` - demo fallback + server data queries
- `supabase/migrations` - schema, RLS and helper functions
- `supabase/functions` - AI, scoring, challenge and notification functions

## Notes

- When Supabase env vars are absent, the app falls back to demo data so the UI can still be explored.
- Apple auth is feature-gated via `NEXT_PUBLIC_ENABLE_APPLE_AUTH`.
- Push notifications require valid VAPID keys and a deployed service worker.
