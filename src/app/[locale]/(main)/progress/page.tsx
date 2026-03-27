import dynamic from 'next/dynamic';

import { AppShell } from '@/components/common/app-shell';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { getProgressSnapshot, getViewer } from '@/lib/server/app-data';

const ProgressChart = dynamic(
  () => import('@/components/dashboard/progress-chart').then((mod) => mod.ProgressChart),
  { ssr: false }
);

const areaLabels = {
  connection_frequency: { ko: '연결 빈도', en: 'Connection frequency' },
  relationship_diversity: { ko: '관계 다양성', en: 'Relationship diversity' },
  challenge_completion: { ko: '활동', en: 'Challenge completion' },
  satisfaction: { ko: '만족도', en: 'Satisfaction' }
} as const;

export default async function ProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getProgressSnapshot();
  const viewer = await getViewer();
  const strongestArea = snapshot.stats.strongestArea
    ? areaLabels[snapshot.stats.strongestArea as keyof typeof areaLabels]?.[locale === 'en' ? 'en' : 'ko'] ?? '-'
    : '-';
  const displayName = viewer?.displayName ?? (locale === 'ko' ? '당신' : 'you');

  return (
    <AppShell>
      <section>
        <p className='text-[12px] font-semibold uppercase tracking-[0.24em] text-primary/70'>
          {locale === 'ko' ? '나의 여정' : 'My journey'}
        </p>
        <h1 className='whitespace-pre-line mt-3 text-balance font-display text-[2.35rem] font-bold leading-[1.02] tracking-[-0.05em] text-foreground'>
          {locale === 'ko' ? `반가워요,\n${displayName}님의 성장` : 'A calmer view of\nyour growth'}
        </h1>
        <div className='editorial-rule' />
      </section>

      <section className='mt-8 rounded-[2rem] bg-white/84 p-5 shadow-sanctuary'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>{locale === 'ko' ? '현재 점수' : 'Current score'}</p>
            <p className='mt-2 font-display text-[2.4rem] font-bold tracking-[-0.05em]'>{snapshot.latestScore}점</p>
          </div>
          <span className='rounded-full bg-peach/35 px-3 py-1 text-[11px] font-bold text-primary'>
            {locale === 'ko' ? '상위 15%' : 'Top 15%'}
          </span>
        </div>
        <ProgressChart data={snapshot.scoreHistory} />
      </section>

      <section className='mt-8 grid grid-cols-1 gap-4'>
        <div className='rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sun/35 text-accent'>🔥</div>
            <div>
              <p className='text-sm font-semibold text-foreground'>{locale === 'ko' ? `${snapshot.streak.current}주 연속 달성` : `${snapshot.streak.current} week streak`}</p>
              <p className='text-sm text-muted-foreground'>{locale === 'ko' ? '차근히 기록 중' : 'Steady momentum'}</p>
            </div>
          </div>
          <div className='mt-5 rounded-[1.5rem] bg-surface-low px-4 py-4'>
            <div className='flex items-center justify-between text-sm font-semibold'>
              <span>{snapshot.streak.level.label}</span>
              <span className='text-muted-foreground'>{snapshot.streak.xp} XP</span>
            </div>
          </div>
        </div>
      </section>

      <section className='mt-8 grid grid-cols-2 gap-3'>
        <div className='rounded-[1.7rem] bg-white/84 p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{locale === 'ko' ? '완료한 챌린지' : 'Completed challenges'}</p>
          <p className='mt-2 text-[2rem] font-display font-bold tracking-[-0.04em]'>{snapshot.stats.challengesCompleted}</p>
        </div>
        <div className='rounded-[1.7rem] bg-white/84 p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{locale === 'ko' ? '가장 강한 축' : 'Strongest axis'}</p>
          <p className='mt-2 text-lg font-bold leading-6'>{strongestArea}</p>
        </div>
        <div className='rounded-[1.7rem] bg-white/84 p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{locale === 'ko' ? '총점' : 'Total score'}</p>
          <p className='mt-2 text-[2rem] font-display font-bold tracking-[-0.04em]'>{snapshot.stats.totalScore}</p>
        </div>
        <div className='rounded-[1.7rem] bg-white/84 p-4 shadow-ambient'>
          <p className='text-sm text-muted-foreground'>{locale === 'ko' ? '누적 XP' : 'Total XP'}</p>
          <p className='mt-2 text-[2rem] font-display font-bold tracking-[-0.04em]'>{snapshot.streak.xp}</p>
        </div>
      </section>

      <section className='mt-8 rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
        <h2 className='text-[1.3rem] font-display font-bold tracking-[-0.03em]'>
          {locale === 'ko' ? '세부 축 보기' : 'Axis breakdown'}
        </h2>
        <div className='mt-5'>
          <ScoreBreakdown breakdown={snapshot.breakdown} locale={locale} />
        </div>
      </section>
    </AppShell>
  );
}
