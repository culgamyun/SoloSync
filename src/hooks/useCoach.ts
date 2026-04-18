'use client';

import { useState, useTransition } from 'react';

import { createClient } from '@/lib/supabase/client';
import { getSupabaseFunctionsUrl } from '@/lib/env';
import { quickReplies } from '@/lib/constants/coach';
import type { CoachMessage, CoachSessionType, CoachStreamEvent } from '@/types/coach';

export function useCoachStream(initialMessages: CoachMessage[], sessionType: CoachSessionType, locale: string) {
  const [messages, setMessages] = useState<CoachMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const language = locale === 'en' ? 'en' : 'ko';

  async function sendMessage(prompt = input) {
    if (!prompt.trim()) {
      return;
    }

    setError(null);
    const draftUserMessage: CoachMessage = {
      id: `local-user-${Date.now()}`,
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString()
    };
    const draftAssistantMessage: CoachMessage = {
      id: `local-assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString()
    };
    const nextHistory = [...messages, draftUserMessage].slice(-8);

    setMessages((current) => [...current, draftUserMessage, draftAssistantMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const functionsUrl = getSupabaseFunctionsUrl();
        if (!functionsUrl) {
          setMessages((current) => {
            const copy = [...current];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content:
                language === 'ko'
                  ? '이번 주에는 한 사람과 부담 낮은 접점 하나만 정해도 충분해요.'
                  : 'Start with one specific person and one low-pressure invitation this week.'
            };
            return copy;
          });
          return;
        }

        const supabase = createClient();
        const {
          data: { session }
        } = await supabase.auth.getSession();
        const response = await fetch(`${functionsUrl}/coaching-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
          },
          body: JSON.stringify({
            sessionType,
            message: prompt,
            history: nextHistory
          })
        });

        if (!response.body) {
          throw new Error('Streaming unavailable');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffered = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffered += decoder.decode(value, { stream: true });
          const chunks = buffered.split('\n');
          buffered = chunks.pop() ?? '';

          for (const chunk of chunks) {
            if (!chunk.trim()) {
              continue;
            }
            const event = JSON.parse(chunk) as CoachStreamEvent;

            if (event.type === 'delta') {
              setMessages((current) => {
                const copy = [...current];
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  content: copy[copy.length - 1].content + event.delta
                };
                return copy;
              });
            }

            if (event.type === 'error') {
              setError(event.message);
            }
          }
        }
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Unknown error');
      }
    });
  }

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isPending,
    error,
    quickReplies: [...quickReplies[language]]
  };
}
