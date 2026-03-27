import dynamic from 'next/dynamic';
import { Flame, Sparkles } from 'lucide-react';

import { submitWeeklyCheckInAction } from '@/actions/challenges';
import { AppShell } from '@/components/common/app-shell';
import { ChallengeList } from '@/components/challenges/challenge-list';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getHomeSnapshot } from '@/lib/server/app-data';

const ProgressChart = dynamic(
  () => import('@/components/dashboard/progress-chart').then((mod) => mod.ProgressChart),
  { ssr: false }
);

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getHomeSnapshot();
  const weeklyDelta =
    snapshot.scoreHistory.length > 1
      ? snapshot.scoreHistory[snapshot.scoreHistory.length - 1].score - snapshot.scoreHistory[snapshot.scoreHistory.length - 2].score
      : 0;
  const displayName = snapshot.viewer?.displayName ?? (locale === 'ko' ? '친구' : 'friend');

  return (
    <AppShell>
      <section>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-balance font-display text-[2.2rem] font-bold leading-[1.06] tracking-[-0.05em] text-foreground'>
              {locale === 'ko' ? `좋은 아침이에요, ${displayName}님 👋` : `Good morning, ${displayName}.`}
            </h1>
            <div className='editorial-rule' />
          </div>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-white/78 shadow-ambient'>
            <span className='text-lg'>🏠</span>
          </div>
        </div>
        <div className='mt-5 inline-flex items-center gap-2 rounded-full bg-sun/35 px-4 py-2 text-[12px] font-semibold text-accent'>
          <Flame className='h-4 w-4' />
          {locale === 'ko' ? `${snapshot.streak.current}주 연속 달성` : `${snapshot.streak.current} week streak`}
        </div>
      </section>

      <section className='mt-8 rounded-[2.2rem] bg-white/84 p-5 shadow-sanctuary'>
        <div className='flex flex-col items-center gap-4'>
          <ScoreRing
            score={snapshot.latestScore}
            label='SCORE'
            variant='compact'
            delta={weeklyDelta}
          />
          <ScoreBreakdown breakdown={snapshot.breakdown} locale={locale} variant='compact' />
          <div className='rounded-full bg-mint/30 px-4 py-2 text-[13px] font-semibold text-secondary'>
            {weeklyDelta >= 0 ? '↑' : '↓'}
            {locale === 'ko' ? ` 지난주 대비 ${Math.abs(weeklyDelta)}` : ` ${Math.abs(weeklyDelta)} vs last week`}
          </div>
        </div>
      </section>

      <section className='mt-8 rounded-[2rem] bg-white/82 p-5 shadow-ambient'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-[12px] font-semibold uppercase tracking-[0.24em] text-primary/70'>
              {locale === 'ko' ? '여정 점수 변화' : 'Score change'}
            </p>
            <h2 className='mt-2 text-[1.35rem] font-display font-bold tracking-[-0.03em]'>
              {locale === 'ko' ? `현재 ${snapshot.latestScore}점` : `Now ${snapshot.latestScore}`}
            </h2>
          </div>
          <span className='rounded-full bg-peach/35 px-3 py-1 text-[11px] font-bold text-primary'>
            {weeklyDelta >= 0 ? '+' : '-'}{Math.abs(weeklyDelta)}
          </span>
        </div>
        <ProgressChart data={snapshot.scoreHistory} />
      </section>

      <section className='mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[1.45rem] font-display font-bold tracking-[-0.03em]'>
            {locale === 'ko' ? '이번 주 챌린지' : 'This week\'s challenges'}
          </h2>
        </div>
        <div className='mt-4'>
          <ChallengeList challenges={snapshot.challenges} locale={locale} variant='home' />
        </div>
      </section>

      <section className='mt-8 rounded-[1.9rem] bg-mint/42 px-5 py-5 text-secondary shadow-ambient'>
        <div className='flex items-center gap-2 text-sm font-bold'>
          <Sparkles className='h-4 w-4' />
          {locale === 'ko' ? 'AI 인사이트' : 'AI insight'}
        </div>
        <p className='mt-3 text-[15px] leading-7'>{snapshot.latestInsight}</p>
      </section>

      <section className='mt-8 rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h2 className='text-[1.2rem] font-display font-bold'>
              {locale === 'ko' ? '주간 체크인' : 'Weekly check-in'}
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              {locale === 'ko'
                ? '만족도와 에너지 축을 최신 상태로 유지합니다.'
                : 'Keeps the satisfaction axis current.'}
            </p>
          </div>
        </div>
        <form action={submitWeeklyCheckInAction} className='mt-5 space-y-4'>
          <input type='hidden' name='locale' value={locale} />
          <div className='grid grid-cols-2 gap-3'>
            <Input
              name='satisfactionScore'
              type='number'
              min={1}
              max={5}
              defaultValue={snapshot.weeklyCheckIn?.satisfaction ?? 4}
              placeholder={locale === 'ko' ? '만족도 1-5' : 'Satisfaction 1-5'}
            />
            <Input
              name='energyScore'
              type='number'
              min={1}
              max={5}
              defaultValue={snapshot.weeklyCheckIn?.energy ?? 3}
              placeholder={locale === 'ko' ? '에너지 1-5' : 'Energy 1-5'}
            />
          </div>
          <Textarea
            name='note'
            defaultValue={snapshot.weeklyCheckIn?.note ?? ''}
            placeholder={locale === 'ko' ? '이번 주 감각을 짧게 남겨보세요.' : 'Leave a short note for this week.'}
            className='min-h-[120px]'
          />
          <Button type='submit' className='w-full'>
            {locale === 'ko' ? '체크인 저장' : 'Save check-in'}
          </Button>
        </form>
      </section>
    </AppShell>
  );
}
