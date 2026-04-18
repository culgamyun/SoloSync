import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { shouldUseDemoDataForRequest } from '@/lib/server/demo-mode';

export async function POST(request: Request) {
  if (await shouldUseDemoDataForRequest()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { endpoint } = await request.json();
  await supabase
    .from('push_subscriptions')
    .update({ enabled: false })
    .eq('user_id', user.id)
    .eq('endpoint', endpoint);

  return NextResponse.json({ ok: true });
}
