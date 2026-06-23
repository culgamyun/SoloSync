'use client';

import { SendHorizontal, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCoachStream } from '@/hooks/useCoach';
import { cn } from '@/lib/utils';
import type { ChallengeRecord } from '@/types/challenge';
import type { CoachMessage, CoachSessionType } from '@/types/coach';

export function ChatPanel({
  initialMessages,
  locale,
  sessionType,
  suggestedContext = []
}: {
  initialMessages: CoachMessage[];
  locale: string;
  sessionType: CoachSessionType;
  suggestedContext?: ChallengeRecord[];
}) {
  const { messages, input, setInput, sendMessage, isPending, error, quickReplies } = useCoachStream(
    initialMessages,
    sessionType,
    locale,
    suggestedContext
  );
  const language = locale === 'en' ? 'en' : 'ko';
  const currentMission = suggestedContext.find((challenge) => challenge.missionKind === 'micro_social') ?? suggestedContext[0];
  const missionReplies = currentMission
    ? language === 'ko'
      ? ['더 작게', '한마디', '회고 도움']
      : ['Smaller', 'Safe line', 'Reflect']
    : [];
  const visibleQuickReplies = missionReplies.length > 0 ? missionReplies : quickReplies.slice(0, 3);

  return (
    <div className='flex h-[calc(100svh-89px)] flex-col bg-[#fbf6ed]'>
      <div className='flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4'>
        <div className='flex justify-center'>
          <span className='rounded-md border border-[#e8ded2] bg-white/72 px-3 py-1 font-data text-[11px] font-bold text-[#777268]'>
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
                    <div className='flex h-7 w-7 items-center justify-center rounded-md bg-[#e7eade] text-[#62705d]'>
                      <Sparkles className='h-3.5 w-3.5' />
                    </div>
                    <span className='text-[11px] font-bold text-[#62705d]'>AI 코치</span>
                  </div>
                ) : null}
                <div
                  className={cn(
                    'rounded-lg border px-4 py-3 text-[15px] leading-7 shadow-ambient',
                    assistant
                      ? 'border-[#e8ded2] bg-white/78 text-[#22251f]'
                      : 'border-accent/20 bg-accent text-white'
                  )}
                >
                  <p className='whitespace-pre-wrap'>{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-auto shrink-0 border-t border-[#e8ded2] bg-[#fffaf2] px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-4'>
        <div className='no-scrollbar flex gap-2 overflow-x-auto pb-3'>
          {visibleQuickReplies.map((chip) => (
            <Button key={chip} type='button' variant='chip' size='sm' onClick={() => void sendMessage(chip)}>
              {chip}
            </Button>
          ))}
        </div>
        <div className='rounded-lg border border-[#e8ded2] bg-white/80 p-2 shadow-ambient'>
          <div className='flex items-end gap-2'>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={locale === 'ko' ? '메시지를 입력하세요...' : 'Type a message...'}
              className='min-h-[56px] border-0 bg-transparent px-3 py-3 shadow-none focus:ring-0'
            />
            <Button
              type='button'
              size='icon'
              onClick={() => void sendMessage()}
              disabled={isPending}
              aria-label={locale === 'ko' ? '메시지 보내기' : 'Send message'}
            >
              <SendHorizontal aria-hidden='true' className='h-5 w-5' strokeWidth={2.5} />
            </Button>
          </div>
          <p className='px-3 pb-2 text-[12px] text-[#777268]'>
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
