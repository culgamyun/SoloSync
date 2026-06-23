import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  Check,
  ChevronRight,
  Heart,
  HeartHandshake,
  Lightbulb,
  Menu,
  MessageCircleHeart,
  Users
} from 'lucide-react';

import { submitWeeklyCheckInAction } from '@/actions/challenges';
import { AppShell } from '@/components/common/app-shell';
import { MotionReveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/i18n/navigation';
import { getHomeSnapshot } from '@/lib/server/app-data';
import { cn } from '@/lib/utils';
import type { ChallengeRecord } from '@/types/challenge';

const routineIcons = [MessageCircleHeart, Users, Lightbulb] as const;

function getRoutineTitle(challenge: ChallengeRecord | undefined, index: number, isKorean: boolean) {
  if (challenge) {
    return challenge.title;
  }

  const fallbacks = isKorean
    ? ['고마웠던 일 공유하기', '10분 다시 연결하기', '작은 계획 하나 잡기']
    : ['Share a gratitude', 'Reconnect for 10 mins', 'Plan something fun'];

  return fallbacks[index];
}

function getRoutineMeta(challenge: ChallengeRecord | undefined, index: number, isKorean: boolean) {
  if (challenge?.conversationStarters[0]) {
    return challenge.conversationStarters[0];
  }

  const fallbacks = isKorean
    ? ['한 문장으로 충분해요', '가벼운 안부부터', '주말 전에 정하기']
    : ['One line is enough', 'Start with a check-in', 'Choose before the weekend'];

  return fallbacks[index];
}

function getGreeting(isKorean: boolean, displayName: string) {
  return isKorean ? `좋은 아침이에요, ${displayName}님` : `Good morning, ${displayName}`;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getHomeSnapshot();
  const isKorean = locale === 'ko';
  const displayName = snapshot.viewer?.displayName ?? (isKorean ? '친구' : 'friend');
  const completedCount = snapshot.challenges.filter((challenge) => challenge.status === 'completed').length;
  const progressDone = Math.max(1, Math.min(7, snapshot.streak.current || completedCount || 1));
  const progressPercent = Math.round((progressDone / 7) * 100);
  const primaryChallenge = snapshot.challenges[0];
  const conversationStarter =
    primaryChallenge?.safeLine ??
    primaryChallenge?.conversationStarters[0] ??
    (isKorean ? '오늘 생각난 사람에게 짧게 안부를 물어보세요.' : 'Ask one person how their day is going.');

  const routineCards = Array.from({ length: 3 }, (_, index) => {
    const challenge = snapshot.challenges[index];
    const Icon = routineIcons[index];
    const isDone = challenge?.status === 'completed' || index < completedCount;

    return {
      challenge,
      href: challenge ? (`/challenges/${challenge.id}` as const) : ('/challenges' as const),
      Icon,
      isDone,
      title: getRoutineTitle(challenge, index, isKorean),
      meta: getRoutineMeta(challenge, index, isKorean)
    };
  });

  return (
    <AppShell contentClassName='bg-[#fbf6ed] px-5 pb-32 pt-5'>
      <MotionReveal as='section' className='space-y-7'>
        <div className='grid grid-cols-[44px,1fr,44px] items-center gap-3'>
          <Button asChild variant='ghost' size='icon' className='rounded-lg text-[#22251f] hover:bg-[#efe5d9]'>
            <Link href='/settings' aria-label={isKorean ? '설정 열기' : 'Open settings'}>
              <Menu className='h-5 w-5' aria-hidden />
            </Link>
          </Button>
          <div className='h-7' aria-hidden />
          <Button asChild variant='ghost' size='icon' className='relative rounded-lg text-[#22251f] hover:bg-[#efe5d9]'>
            <Link href='/settings/notifications' aria-label={isKorean ? '알림 설정' : 'Notification settings'}>
              <Bell className='h-5 w-5' aria-hidden />
              <span className='absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-accent' />
            </Link>
          </Button>
        </div>

        <div>
          <h1 className='text-balance font-display text-[2.45rem] font-bold leading-[1.03] text-[#22251f] [word-break:keep-all]'>
            {getGreeting(isKorean, displayName)}
            <Heart className='ml-2 inline h-8 w-8 text-accent' aria-hidden />
          </h1>
          <p className='mt-2 text-[1rem] font-medium leading-7 text-[#777268]'>
            {isKorean ? '함께 더 가까워지는 하루.' : 'Stronger together, every day.'}
          </p>
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.05}
        interactive
        className='mt-7 rounded-lg bg-accent px-5 py-5 text-white shadow-float'
      >
        <div className='grid grid-cols-[4rem_minmax(0,1fr)_3.25rem] items-center gap-4'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#fff7ef] text-accent shadow-sm'>
            <Heart className='h-7 w-7 fill-current' aria-hidden />
          </div>
          <div>
            <h2 className='text-[1.08rem] font-bold'>{isKorean ? '오늘의 연결' : 'Daily Connection'}</h2>
            <div className='mt-3 flex items-center gap-0.5'>
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className='flex flex-1 items-center'>
                  <span className={cn('h-3 w-3 rounded-full border border-white/65', index < progressDone - 2 ? 'bg-white' : 'bg-white/18')} />
                  {index < 4 ? <span className='h-px flex-1 bg-white/45' /> : null}
                </span>
              ))}
            </div>
          </div>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7ef] text-[#8d5a48] shadow-sm'>
            <Check className='h-6 w-6' aria-hidden />
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.08} className='mt-8'>
        <h2 className='font-display text-[1.35rem] font-bold text-[#22251f]'>
          {isKorean ? '오늘의 루틴' : "Today's Routine"}
        </h2>
        <div className='mt-4 space-y-3'>
          {routineCards.map((item, index) => {
            const tone = index === 0 ? 'bg-[#f5ded6] text-accent' : index === 1 ? 'bg-[#e4e6dc] text-[#5f6858]' : 'bg-[#f2e7d1] text-[#9a7445]';
            return (
              <Link
                key={`${item.title}-${index}`}
                href={item.href}
                className='grid min-h-[84px] grid-cols-[4rem_1fr_3rem] items-center gap-4 rounded-lg border border-[#e8ded2] bg-white/74 px-4 py-3 shadow-ambient transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white'
              >
                <span className={cn('flex h-14 w-14 items-center justify-center rounded-lg', tone)}>
                  <item.Icon className='h-7 w-7' aria-hidden />
                </span>
                <span className='min-w-0'>
                  <span className='line-clamp-2 text-[0.98rem] font-bold leading-5 text-[#2b2d27] [word-break:keep-all]'>
                    {item.title}
                  </span>
                  <span className='mt-2 block max-w-[12rem] truncate text-[0.84rem] font-medium text-[#a9a49a]'>
                    {item.meta}
                  </span>
                </span>
                <span
                  className={cn(
                    'ml-auto flex h-11 w-11 items-center justify-center rounded-full border text-sm',
                    item.isDone ? 'border-transparent bg-accent text-white' : 'border-[#bda98e] text-[#bda98e]'
                  )}
                >
                  {item.isDone ? <Check className='h-5 w-5' aria-hidden /> : null}
                </span>
              </Link>
            );
          })}
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.11} className='mt-7 rounded-lg bg-[#8f9b84] px-5 py-5 text-white shadow-ambient'>
        <div className='grid grid-cols-[4.5rem_1fr] gap-4'>
          <div
            className='flex h-16 w-16 items-center justify-center rounded-full text-center font-data text-[1.35rem] font-bold leading-none text-[#30372d]'
            style={{
              background: `conic-gradient(#3f4a39 ${progressPercent}%, rgba(255,255,255,0.58) 0)`
            }}
          >
            <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#cad0bf]'>
              {progressDone}
              <span className='mx-0.5 text-[#7b8474]'>/</span>7
            </span>
          </div>
          <div className='min-w-0'>
            <h2 className='text-[1.05rem] font-bold'>{isKorean ? '주간 진행' : 'Weekly Progress'}</h2>
            <p className='mt-1 text-sm text-white/82'>
              {isKorean ? '좋아요. 이번 주 리듬이 쌓이고 있어요.' : "Keep going, you're doing great."}
            </p>
            <div className='mt-4 grid grid-cols-7 gap-2'>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <span key={`${day}-${index}`} className='flex flex-col items-center gap-1 font-data text-[10px] font-bold text-white/78'>
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border border-white/72',
                      index < progressDone ? 'bg-white text-[#7b8872]' : 'bg-transparent text-transparent'
                    )}
                  >
                    <Check className='h-3 w-3' aria-hidden />
                  </span>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.14} className='mt-8'>
        <h2 className='font-display text-[1.3rem] font-bold text-[#22251f]'>
          {isKorean ? '대화 시작 문장' : 'Conversation Starter'}
        </h2>
        <Link
          href={primaryChallenge ? (`/challenges/${primaryChallenge.id}` as const) : '/coach'}
          className='mt-4 grid min-h-[88px] grid-cols-[3.75rem_1fr_2rem] items-center gap-4 rounded-lg bg-white/58 px-4 py-3 shadow-ambient transition hover:bg-white'
        >
          <span className='flex h-12 w-12 items-center justify-center rounded-lg bg-[#e0e5d8] text-[#8f9b84]'>
            <HeartHandshake className='h-6 w-6' aria-hidden />
          </span>
          <span className='line-clamp-2 text-[0.98rem] font-semibold leading-6 text-[#605f58] [word-break:keep-all]'>
            {conversationStarter}
          </span>
          <ChevronRight className='h-5 w-5 text-[#605f58]' aria-hidden />
        </Link>
      </MotionReveal>

      <MotionReveal as='section' delay={0.17} className='mt-8'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h2 className='font-display text-[1.3rem] font-bold text-[#22251f]'>{isKorean ? '이번 주 체크인' : 'Weekly check-in'}</h2>
            <p className='mt-1 text-sm text-[#777268]'>{snapshot.recoveryCheckIn.formHint}</p>
          </div>
          <Button asChild variant='ghost' size='icon' className='rounded-lg text-accent hover:bg-accent/10'>
            <Link href='/challenges' aria-label={isKorean ? '챌린지 보기' : 'View challenges'}>
              <CalendarCheck2 className='h-5 w-5' aria-hidden />
            </Link>
          </Button>
        </div>
        <form action={submitWeeklyCheckInAction} className='mt-4 space-y-3 rounded-lg border border-[#e8ded2] bg-white/72 p-4 shadow-ambient'>
          <input type='hidden' name='locale' value={locale} />
          <div className='grid grid-cols-2 gap-3'>
            <Input
              name='satisfactionScore'
              type='number'
              min={1}
              max={5}
              defaultValue={snapshot.weeklyCheckIn?.satisfaction ?? 4}
              placeholder={isKorean ? '만족도' : 'Satisfaction'}
              className='bg-white/76'
            />
            <Input
              name='energyScore'
              type='number'
              min={1}
              max={5}
              defaultValue={snapshot.weeklyCheckIn?.energy ?? 3}
              placeholder={isKorean ? '에너지' : 'Energy'}
              className='bg-white/76'
            />
          </div>
          <Textarea
            name='note'
            defaultValue={snapshot.weeklyCheckIn?.note ?? ''}
            placeholder={snapshot.recoveryCheckIn.notePrompt}
            className='min-h-[104px] bg-white/76'
          />
          <Button type='submit' className='w-full rounded-lg bg-primary hover:bg-primary/90'>
            {isKorean ? '체크인 저장' : 'Save check-in'}
            <ArrowRight className='h-4 w-4' aria-hidden />
          </Button>
        </form>
      </MotionReveal>
    </AppShell>
  );
}
