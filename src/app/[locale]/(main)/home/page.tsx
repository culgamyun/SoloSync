import { ArrowRight, Flame, Sparkles } from 'lucide-react';

import { submitWeeklyCheckInAction } from '@/actions/challenges';
import { ChallengeList } from '@/components/challenges/challenge-list';
import { AppShell } from '@/components/common/app-shell';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/i18n/navigation';
import { getHomeSnapshot } from '@/lib/server/app-data';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getHomeSnapshot();
  const weeklyDelta =
    snapshot.scoreHistory.length > 1
      ? snapshot.scoreHistory[snapshot.scoreHistory.length - 1].score - snapshot.scoreHistory[snapshot.scoreHistory.length - 2].score
      : 0;
  const recoveryCheckIn = snapshot.recoveryCheckIn;
  const displayName = snapshot.viewer?.displayName ?? (locale === 'ko' ? '친구' : 'friend');
  const greeting = locale === 'ko' ? `좋아, 아침이에요.\n${displayName}님.` : `Good morning, ${displayName}.`;

  return (
    <AppShell>
      <section>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='whitespace-pre-line break-keep font-display text-[2.05rem] font-bold leading-[1.08] tracking-normal text-foreground'>
              {greeting}
            </h1>
            <div className='editorial-rule' />
          </div>
          <div className='flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface-high'>
            <span className='text-lg'>☀</span>
          </div>
        </div>
        <div className='mt-5 inline-flex items-center gap-2 rounded bg-observation/18 px-4 py-2 font-data text-[12px] font-bold text-foreground'>
          <Flame className='h-4 w-4' />
          {locale === 'ko' ? `${snapshot.streak.current}주 연속 활성` : `${snapshot.streak.current} week streak`}
        </div>
      </section>

      <section className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-sanctuary'>
        <div className='flex flex-col items-center gap-4'>
          <ScoreRing score={snapshot.latestScore} label='SCORE' variant='compact' delta={weeklyDelta} />
          <ScoreBreakdown breakdown={snapshot.breakdown} locale={locale} variant='compact' />
          <div className='rounded bg-primary/10 px-4 py-2 font-data text-[13px] font-bold text-primary'>
            {weeklyDelta >= 0 ? '상승' : '하락'}
            {locale === 'ko' ? ` 지난주 대비 ${Math.abs(weeklyDelta)}` : ` ${Math.abs(weeklyDelta)} vs last week`}
          </div>
        </div>
      </section>

      <section className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='font-data text-[12px] font-bold uppercase tracking-normal text-primary/70'>
              {locale === 'ko' ? '점수 변화' : 'Score change'}
            </p>
            <h2 className='mt-2 font-display text-[1.35rem] font-bold tracking-normal'>
              {locale === 'ko' ? `현재 ${snapshot.latestScore}점` : `Now ${snapshot.latestScore}`}
            </h2>
          </div>
          <span className='rounded bg-reflection/12 px-3 py-1 font-data text-[11px] font-bold text-reflection'>
            {weeklyDelta >= 0 ? '+' : '-'}
            {Math.abs(weeklyDelta)}
          </span>
        </div>
        <ProgressChart data={snapshot.scoreHistory} />
      </section>

      <section className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='rounded bg-primary/10 px-3 py-1 font-data text-[11px] font-bold text-primary'>
            {recoveryCheckIn.eyebrow}
          </span>
          <span className='rounded bg-surface-low px-3 py-1 font-data text-[11px] font-bold text-muted-foreground'>
            {recoveryCheckIn.previousLabel}
          </span>
          <span className='rounded bg-observation/18 px-3 py-1 font-data text-[11px] font-bold text-foreground'>
            {recoveryCheckIn.nextLabel}
          </span>
        </div>
        <h2 className='mt-4 whitespace-pre-line break-keep font-display text-[1.45rem] font-bold leading-[1.18] tracking-normal text-foreground'>
          {recoveryCheckIn.title}
        </h2>
        <p className='mt-3 text-[15px] leading-7 text-muted-foreground'>{recoveryCheckIn.body}</p>
        <Button asChild variant='secondary' className='mt-5 w-full sm:w-auto'>
          <Link href={recoveryCheckIn.ctaHref}>
            {recoveryCheckIn.ctaLabel}
            <ArrowRight className='h-4 w-4' />
          </Link>
        </Button>
      </section>

      <section className='mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='font-display text-[1.45rem] font-bold tracking-normal'>
            {locale === 'ko' ? '이번 주 챌린지' : "This week's challenges"}
          </h2>
        </div>
        <div className='mt-4'>
          <ChallengeList challenges={snapshot.challenges} locale={locale} variant='home' />
        </div>
      </section>

      <section className='mt-8 rounded-lg border border-observation/25 bg-observation/12 px-5 py-5 text-foreground shadow-ambient'>
        <div className='flex items-center gap-2 text-sm font-bold'>
          <Sparkles className='h-4 w-4' />
          {locale === 'ko' ? 'AI 인사이트' : 'AI insight'}
        </div>
        <p className='mt-3 text-[15px] leading-7'>{snapshot.latestInsight}</p>
      </section>

      <section className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h2 className='text-[1.2rem] font-display font-bold'>{recoveryCheckIn.formTitle}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>{recoveryCheckIn.formHint}</p>
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
            placeholder={recoveryCheckIn.notePrompt}
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
