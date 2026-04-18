'use client';

import { SendHorizontal, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCoachStream } from '@/hooks/useCoach';
import { cn } from '@/lib/utils';
import type { CoachMessage, CoachSessionType } from '@/types/coach';

export function ChatPanel({
  initialMessages,
  locale,
  sessionType
}: {
  initialMessages: CoachMessage[];
  locale: string;
  sessionType: CoachSessionType;
}) {
  const { messages, input, setInput, sendMessage, isPending, error, quickReplies } = useCoachStream(
    initialMessages,
    sessionType,
    locale
  );

  return (
    <div className='flex min-h-[calc(100svh-8.75rem)] flex-col'>
      <div className='flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-4'>
        <div className='flex justify-center'>
          <span className='rounded border border-line bg-surface-low px-3 py-1 font-data text-[11px] font-bold text-muted-foreground'>
            {locale === 'ko' ? '코칭 세션이 시작되었어요' : 'Coaching session started'}
          </span>
        </div>
        {messages.map((message) => {
          const assistant = message.role === 'assistant';

          return (
            <div key={message.id} className={cn('flex', assistant ? 'justify-start' : 'justify-end')}>
              <div className={cn('max-w-[88%]', assistant ? 'space-y-2' : 'space-y-1')}>
                {assistant ? (
                  <div className='flex items-center gap-2 px-1'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-md border border-observation/25 bg-observation/16 text-foreground'>
                      <Sparkles className='h-3.5 w-3.5' />
                    </div>
                    <span className='text-[11px] font-bold text-secondary'>AI 코치</span>
                  </div>
                ) : null}
                <div
                  className={cn(
                    'rounded-md border px-4 py-3 text-[15px] leading-7 shadow-ambient',
                    assistant
                      ? 'border-line bg-surface-high text-foreground'
                      : 'border-primary/20 bg-primary/10 text-primary'
                  )}
                >
                  <p className='whitespace-pre-wrap'>{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='glass-nav mt-auto border-t border-line px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4'>
        <div className='no-scrollbar flex gap-2 overflow-x-auto pb-3'>
          {quickReplies.map((chip) => (
            <Button key={chip} type='button' variant='chip' size='sm' onClick={() => void sendMessage(chip)}>
              {chip}
            </Button>
          ))}
        </div>
        <div className='rounded-lg border border-line bg-surface-high p-2 shadow-ambient'>
          <div className='flex items-end gap-2'>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={locale === 'ko' ? '메시지를 입력하세요...' : 'Type a message...'}
              className='min-h-[56px] border-0 bg-transparent px-3 py-3 shadow-none focus:ring-0'
            />
            <Button type='button' size='icon' onClick={() => void sendMessage()} disabled={isPending}>
              <SendHorizontal className='h-4 w-4' />
            </Button>
          </div>
          <p className='px-3 pb-2 text-[12px] text-muted-foreground'>
            {error ??
              (locale === 'ko'
                ? '코치는 실제 사람에게 닿는 다음 행동을 우선합니다.'
                : 'The coach prioritizes the next action that reaches a real person.')}
          </p>
        </div>
      </div>
    </div>
  );
}
