import { NextResponse } from 'next/server';

import { arePushKeysConfigured, isSupabaseConfigured } from '@/lib/env';

export function GET() {
  return NextResponse.json({
    ok: true,
    supabaseConfigured: isSupabaseConfigured(),
    pushConfigured: arePushKeysConfigured()
  });
}
