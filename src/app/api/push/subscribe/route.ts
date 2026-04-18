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

  const subscription = await request.json();
  const keys = subscription.keys ?? {};

  await supabase.from('push_subscriptions').upsert({
    user_id: user.id,
    endpoint: subscription.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    enabled: true
  });

  return NextResponse.json({ ok: true });
}
