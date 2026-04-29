import { ArrowRight, Flame, Sparkles } from 'lucide-react';

import { submitWeeklyCheckInAction } from '@/actions/challenges';
import { ChallengeList } from '@/components/challenges/challenge-list';
import { AppShell } from '@/components/common/app-shell';
import { FieldNoteImage } from '@/components/common/field-note-image';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { MotionReveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/i18n/navigation';
import { getHomeSnapshot } from '@/lib/server/app-data';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getHomeSnapshot();
  const isKorean = locale === 'ko';
  const weeklyDelta =
    snapshot.scoreHistory.length > 1
      ? snapshot.scoreHistory[snapshot.scoreHistory.length - 1].score -
        snapshot.scoreHistory[snapshot.scoreHistory.length - 2].score
      : 0;
  const recoveryCheckIn = snapshot.recoveryCheckIn;
  const displayName = snapshot.viewer?.displayName ?? (isKorean ? '친구' : 'friend');
  const greeting = isKorean ? `좋아요, 아침이에요.\n${displayName}님` : `Good morning, ${displayName}.`;

  return (
    <AppShell>
      <MotionReveal as='section'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='whitespace-pre-line break-keep font-display text-[2.05rem] font-bold leading-[1.08] tracking-normal text-foreground'>
              {greeting}
            </h1>
            <div className='editorial-rule' />
          </div>
          <FieldNoteImage
            src='/images/field-notes/progress-stamp.webp'
            className='h-14 w-14 shrink-0 shadow-none'
            sizes='56px'
          />
        </div>
        <div className='mt-5 inline-flex items-center gap-2 rounded bg-observation/18 px-4 py-2 font-data text-[12px] font-bold text-foreground'>
          <Flame className='h-4 w-4' />
          {isKorean ? `${snapshot.streak.current}주 연속 시도` : `${snapshot.streak.current} week streak`}
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.05}
        className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-sanctuary'
      >
        <div className='flex flex-col items-center gap-4'>
          <ScoreRing score={snapshot.latestScore} label='SCORE' variant='compact' delta={weeklyDelta} />
          <ScoreBreakdown breakdown={snapshot.breakdown} locale={locale} variant='compact' />
          <div className='rounded bg-primary/10 px-4 py-2 font-data text-[13px] font-bold text-primary'>
            {weeklyDelta >= 0 ? (isKorean ? '상승' : 'Up') : isKorean ? '하락' : 'Down'}
            {isKorean ? ` 지난주 대비 ${Math.abs(weeklyDelta)}` : ` ${Math.abs(weeklyDelta)} vs last week`}
          </div>
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.08}
        className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'
      >
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='font-data text-[12px] font-bold uppercase tracking-normal text-primary/70'>
              {isKorean ? '점수 변화' : 'Score change'}
            </p>
            <h2 className='mt-2 font-display text-[1.35rem] font-bold tracking-normal'>
              {isKorean ? `현재 ${snapshot.latestScore}점` : `Now ${snapshot.latestScore}`}
            </h2>
          </div>
          <span className='rounded bg-reflection/12 px-3 py-1 font-data text-[11px] font-bold text-reflection'>
            {weeklyDelta >= 0 ? '+' : '-'}
            {Math.abs(weeklyDelta)}
          </span>
        </div>
        <ProgressChart data={snapshot.scoreHistory} />
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.1}
        className='mt-8 overflow-hidden rounded-lg border border-line bg-surface-high shadow-ambient'
      >
        <FieldNoteImage
          src='/images/field-notes/micro-mission-field-note.webp'
          className='aspect-[2/1] rounded-none border-0 shadow-none'
          sizes='(max-width: 430px) 100vw, 430px'
        />
        <div className='p-5'>
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
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.12} className='mt-8'>
        <div className='flex items-center justify-between'>
          <h2 className='font-display text-[1.45rem] font-bold tracking-normal'>
            {isKorean ? '이번 주 챌린지' : "This week's challenges"}
          </h2>
        </div>
        <div className='mt-4'>
          <ChallengeList challenges={snapshot.challenges} locale={locale} variant='home' />
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.14}
        className='mt-8 rounded-lg border border-observation/25 bg-observation/12 px-5 py-5 text-foreground shadow-ambient'
      >
        <div className='flex items-center gap-2 text-sm font-bold'>
          <Sparkles className='h-4 w-4' />
          {isKorean ? 'AI 인사이트' : 'AI insight'}
        </div>
        <p className='mt-3 text-[15px] leading-7'>{snapshot.latestInsight}</p>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.16}
        className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'
      >
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h2 className='font-display text-[1.2rem] font-bold'>{recoveryCheckIn.formTitle}</h2>
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
              placeholder={isKorean ? '만족도 1-5' : 'Satisfaction 1-5'}
            />
            <Input
              name='energyScore'
              type='number'
              min={1}
              max={5}
              defaultValue={snapshot.weeklyCheckIn?.energy ?? 3}
              placeholder={isKorean ? '에너지 1-5' : 'Energy 1-5'}
            />
          </div>
          <Textarea
            name='note'
            defaultValue={snapshot.weeklyCheckIn?.note ?? ''}
            placeholder={recoveryCheckIn.notePrompt}
            className='min-h-[120px]'
          />
          <Button type='submit' className='w-full'>
            {isKorean ? '체크인 저장' : 'Save check-in'}
          </Button>
        </form>
      </MotionReveal>
    </AppShell>
  );
}
