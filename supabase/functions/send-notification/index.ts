import webpush from 'npm:web-push@3.6.7';

import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/helpers.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { userId, title = 'SoloSync', body = 'Your weekly social health update is ready.', url = '/ko/home' } =
    await request.json();
  const publicKey = Deno.env.get('NEXT_PUBLIC_VAPID_PUBLIC_KEY');
  const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
  const subject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:hello@solosync.app';

  if (!publicKey || !privateKey) {
    return Response.json({ queued: 0, reason: 'Missing VAPID keys' }, { headers: corsHeaders });
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const supabase = createServiceClient();
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('enabled', true);

  let sent = 0;
  for (const subscription of subscriptions ?? []) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        },
        JSON.stringify({ title, body, data: { url } })
      );
      sent += 1;
    } catch {
      await supabase.from('push_subscriptions').update({ enabled: false }).eq('id', subscription.id);
    }
  }

  return Response.json({ sent }, { headers: corsHeaders });
});
