import { corsHeaders } from '../_shared/cors.ts';
import { generateText } from '../_shared/gemini.ts';
import { chunkText, createServiceClient } from '../_shared/helpers.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = request.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  const supabase = createServiceClient();
  const {
    data: { user }
  } = await supabase.auth.getUser(token);

  if (!user) {
    return Response.json({ type: 'error', message: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  const payload = await request.json();
  const sessionType = payload.sessionType ?? 'coaching';
  const history = payload.history ?? [];
  const message = payload.message ?? '';

  const { data: insertedSession } = await supabase
    .from('coaching_sessions')
    .insert({ user_id: user.id, session_type: sessionType, turn_count: history.length + 1, last_message_at: new Date().toISOString() })
    .select('id')
    .single();

  if (insertedSession?.id) {
    await supabase.from('coaching_messages').insert({
      session_id: insertedSession.id,
      role: 'user',
      content: message
    });
  }

  const fallback =
    'Take the smallest real-world action available. One specific message or invitation is better than planning without contact.';
  const reply = await generateText(
    'You are SoloSync\'s social health coach. Give one practical response that leads to a real-world human interaction.',
    { sessionType, message, history },
    fallback
  );

  const stream = new ReadableStream({
    async start(controller) {
      for (const piece of chunkText(reply)) {
        controller.enqueue(new TextEncoder().encode(`${JSON.stringify({ type: 'delta', delta: piece })}\n`));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      if (insertedSession?.id) {
        await supabase.from('coaching_messages').insert({
          session_id: insertedSession.id,
          role: 'assistant',
          content: reply
        });
        await supabase
          .from('coaching_sessions')
          .update({ summary: reply.slice(0, 240), ended_at: new Date().toISOString() })
          .eq('id', insertedSession.id);
      }

      controller.enqueue(
        new TextEncoder().encode(`${JSON.stringify({ type: 'end', sessionId: insertedSession?.id ?? 'demo' })}\n`)
      );
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
});
