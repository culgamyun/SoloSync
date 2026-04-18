import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { publicEnv } from '@/lib/env';
import type { Database } from '@/lib/supabase/types';

type TypedSupabaseClient = SupabaseClient<Database, 'public', 'public', Database['public'], Database['__InternalSupabase']>;

export async function createClient(): Promise<TypedSupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? '',
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Cookie writes from a server component are ignored.
          }
        }
      }
    }
  ) as unknown as TypedSupabaseClient;
}
