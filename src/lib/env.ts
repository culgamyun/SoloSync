import { z } from 'zod';

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().catch('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL: z.string().optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['ko', 'en']).catch('ko'),
  NEXT_PUBLIC_ENABLE_APPLE_AUTH: z
    .union([z.literal('true'), z.literal('false')])
    .catch('false'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional()
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().catch('gemini-2.5-flash'),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional()
});

export const publicEnv = publicSchema.parse(process.env);
export const serverEnv = serverSchema.parse(process.env);

export function isSupabaseConfigured() {
  return Boolean(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function arePushKeysConfigured() {
  return Boolean(publicEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY && serverEnv.VAPID_PRIVATE_KEY);
}

export function getSupabaseFunctionsUrl() {
  if (publicEnv.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL) {
    return publicEnv.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL;
  }

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
    return '';
  }

  return `${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;
}
