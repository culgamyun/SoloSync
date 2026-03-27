'use client';

import { createBrowserClient } from '@supabase/ssr';

import { publicEnv } from '@/lib/env';
import type { Database } from '@/lib/supabase/types';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? '',
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
  );

  return client;
}
