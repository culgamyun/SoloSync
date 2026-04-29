import { AppShell } from '@/components/common/app-shell';
import { FieldNoteImage } from '@/components/common/field-note-image';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { MotionReveal } from '@/components/motion/reveal';
import { getProgressSnapshot, getViewer } from '@/lib/server/app-data';

const areaLabels = {
  connection_frequency: { ko: '연결 빈도', en: 'Connection frequency' },
  relationship_diversity: { ko: '관계 다양성', en: 'Relationship diversity' },
  challenge_completion: { ko: '실행', en: 'Challenge completion' },
  satisfaction: { ko: '만족도', en: 'Satisfaction' }
} as const;

export default async function ProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getProgressSnapshot();
  const viewer = await getViewer();
  const isKorean = locale === 'ko';
  const strongestArea = snapshot.stats.strongestArea
    ? areaLabels[snapshot.stats.strongestArea as keyof typeof areaLabels]?.[isKorean ? 'ko' : 'en'] ?? '-'
    : '-';
  const displayName = viewer?.displayName ?? (isKorean ? '당신' : 'you');

  return (
    <AppShell>
      <MotionReveal as='section'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='font-data text-[12px] font-bold uppercase tracking-normal text-primary/70'>
              {isKorean ? '나의 여정' : 'My journey'}
            </p>
            <h1 className='mt-3 whitespace-pre-line break-keep text-balance font-display text-[2.35rem] font-bold leading-[1.04] tracking-normal text-foreground'>
              {isKorean ? `반가워요,\n${displayName}님의 성장` : 'A calmer view of\nyour growth'}
            </h1>
            <div className='editorial-rule' />
          </div>
          <FieldNoteImage
            src='/images/field-notes/progress-stamp.webp'
            className='h-16 w-16 shrink-0 shadow-none'
            sizes='64px'
          />
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.05}
        className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-sanctuary'
      >
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>{isKorean ? '현재 점수' : 'Current score'}</p>
            <p className='mt-2 font-display text-[2.4rem] font-bold tracking-normal'>{snapshot.latestScore}점</p>
          </div>
          <span className='rounded bg-reflection/10 px-3 py-1 font-data text-[11px] font-bold text-reflection'>
            {isKorean ? '상위 15%' : 'Top 15%'}
          </span>
        </div>
        <ProgressChart data={snapshot.scoreHistory} />
      </MotionReveal>

      <MotionReveal as='section' delay={0.08} className='mt-8 grid grid-cols-1 gap-4'>
        <div className='rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
          <div className='flex items-center gap-3'>
            <FieldNoteImage
              src='/images/field-notes/progress-stamp.webp'
              className='h-12 w-12 shrink-0 shadow-none'
              sizes='48px'
            />
            <div>
              <p className='text-sm font-semibold text-foreground'>
                {isKorean ? `${snapshot.streak.current}주 연속 시도` : `${snapshot.streak.current} week streak`}
              </p>
              <p className='text-sm text-muted-foreground'>{isKorean ? '차근히 기록 중' : 'Steady momentum'}</p>
            </div>
          </div>
          <div className='mt-5 rounded-md border border-line bg-surface-low px-4 py-4'>
            <div className='flex items-center justify-between text-sm font-semibold'>
              <span>{snapshot.streak.level.label}</span>
              <span className='text-muted-foreground'>{snapshot.streak.xp} XP</span>
            </div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.1} className='mt-8 grid grid-cols-2 gap-3'>
        <div className='rounded-lg border border-line bg-surface-high p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{isKorean ? '완료한 챌린지' : 'Completed challenges'}</p>
          <p className='mt-2 font-data text-[2rem] font-bold tracking-normal'>{snapshot.stats.challengesCompleted}</p>
        </div>
        <div className='rounded-lg border border-line bg-surface-high p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{isKorean ? '가장 강한 축' : 'Strongest axis'}</p>
          <p className='mt-2 text-lg font-bold leading-6'>{strongestArea}</p>
        </div>
        <div className='rounded-lg border border-line bg-surface-high p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{isKorean ? '총점' : 'Total score'}</p>
          <p className='mt-2 font-data text-[2rem] font-bold tracking-normal'>{snapshot.stats.totalScore}</p>
        </div>
        <div className='rounded-lg border border-line bg-surface-high p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{isKorean ? '누적 XP' : 'Total XP'}</p>
          <p className='mt-2 font-data text-[2rem] font-bold tracking-normal'>{snapshot.streak.xp}</p>
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.12}
        className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'
      >
        <h2 className='font-display text-[1.3rem] font-bold tracking-normal'>
          {isKorean ? '영역별 보기' : 'Axis breakdown'}
        </h2>
        <div className='mt-5'>
          <ScoreBreakdown breakdown={snapshot.breakdown} locale={locale} />
        </div>
      </MotionReveal>
    </AppShell>
  );
}
