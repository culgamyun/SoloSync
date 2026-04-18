'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { publicEnv } from '@/lib/env';
import type { Database } from '@/lib/supabase/types';

type TypedSupabaseClient = SupabaseClient<Database, 'public', 'public', Database['public'], Database['__InternalSupabase']>;

let client: TypedSupabaseClient | null = null;

export function createClient(): TypedSupabaseClient {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? '',
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
  ) as unknown as TypedSupabaseClient;

  return client;
}
