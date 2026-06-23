import { Check, Flame, LineChart, Trophy } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { MotionReveal } from '@/components/motion/reveal';
import { getProgressSnapshot, getViewer } from '@/lib/server/app-data';
import { cn } from '@/lib/utils';

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
  const weakestAreaKey = Object.entries(snapshot.breakdown as Record<string, number>).sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
  const weakestArea = weakestAreaKey
    ? areaLabels[weakestAreaKey as keyof typeof areaLabels]?.[isKorean ? 'ko' : 'en'] ?? '-'
    : '-';
  const displayName = viewer?.displayName ?? (isKorean ? '당신' : 'you');

  return (
    <AppShell contentClassName='bg-[#fbf6ed] px-5 pb-32 pt-5'>
      <MotionReveal as='section'>
        <p className='font-data text-[12px] font-bold uppercase text-accent'>
          {isKorean ? '성장 리듬' : 'Growth rhythm'}
        </p>
        <h1 className='mt-4 whitespace-pre-line break-keep text-balance font-display text-[2.35rem] font-bold leading-[1.04] text-[#22251f]'>
          {isKorean ? `${displayName}님의\n관계 흐름` : 'Your relationship\nprogress'}
        </h1>
        <p className='mt-3 max-w-[18rem] text-[15px] leading-7 text-[#777268]'>
          {isKorean ? '점수보다 이번 주에 쌓인 작은 연결을 먼저 봅니다.' : 'Start with the small connections that actually happened.'}
        </p>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.05}
        className='mt-8 rounded-lg bg-[#8f9b84] px-5 py-5 text-white shadow-float'
      >
        <div className='grid grid-cols-[5rem_1fr] gap-4'>
          <div
            className='flex h-20 w-20 items-center justify-center rounded-full text-center font-data text-[1.5rem] font-bold leading-none text-[#30372d]'
            style={{
              background: `conic-gradient(#3f4a39 ${Math.min(100, Math.round((snapshot.streak.current / 7) * 100))}%, rgba(255,255,255,0.58) 0)`
            }}
          >
            <span className='flex h-14 w-14 items-center justify-center rounded-full bg-[#cad0bf]'>
              {Math.max(1, Math.min(7, snapshot.streak.current || 1))}
              <span className='mx-0.5 text-[#7b8474]'>/</span>7
            </span>
          </div>
          <div className='min-w-0'>
            <h2 className='text-[1.25rem] font-bold'>{isKorean ? '주간 진행' : 'Weekly Progress'}</h2>
            <p className='mt-1 text-sm text-white/82'>{isKorean ? '느리지만 리듬은 이어지고 있어요.' : 'Slow still counts as a rhythm.'}</p>
            <div className='mt-4 grid grid-cols-7 gap-2'>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <span key={`${day}-${index}`} className='flex flex-col items-center gap-1 font-data text-[10px] font-bold text-white/78'>
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border border-white/72',
                      index < Math.max(1, Math.min(7, snapshot.streak.current || 1))
                        ? 'bg-white text-[#7b8872]'
                        : 'bg-transparent text-transparent'
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

      <MotionReveal as='section' delay={0.08} className='mt-8 rounded-lg border border-[#e8ded2] bg-white/74 px-5 pb-3 pt-5 shadow-ambient'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='font-data text-[11px] font-bold uppercase text-accent'>{isKorean ? '현재 점수' : 'Current score'}</p>
            <p className='mt-2 font-display text-[2.6rem] font-bold leading-none text-[#22251f]'>{snapshot.latestScore}</p>
          </div>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-[#f5ded6] text-accent'>
            <LineChart className='h-6 w-6' aria-hidden />
          </div>
        </div>
        <ProgressChart data={snapshot.scoreHistory} />
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.09}
        className='mt-4 rounded-lg border border-[#e8ded2] bg-white/74 px-5 py-4 shadow-ambient'
      >
        <p className='font-data text-[11px] font-bold uppercase text-accent'>
          {isKorean ? '점수 해석' : 'Score readout'}
        </p>
        <div className='mt-3 grid gap-3 text-sm leading-6 text-[#777268]'>
          <div className='rounded-md bg-[#fffaf2] px-4 py-3'>
            <span className='font-bold text-[#22251f]'>{isKorean ? '반영 기준: ' : 'Signals: '}</span>
            {isKorean
              ? '최근 4주 실행, 최근 회고/체크인 감각, 관계 지도를 함께 봅니다.'
              : 'Recent actions, reflection/check-in mood, and your relationship map are combined.'}
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='rounded-md bg-[#f1f4ea] px-4 py-3'>
              <span className='block text-[11px] font-bold uppercase text-[#62705d]'>
                {isKorean ? '강한 축' : 'Strong axis'}
              </span>
              <span className='mt-1 block font-bold text-[#22251f]'>{strongestArea}</span>
            </div>
            <div className='rounded-md bg-[#fff4ed] px-4 py-3'>
              <span className='block text-[11px] font-bold uppercase text-accent'>
                {isKorean ? '다음 상승 여지' : 'Next lift'}
              </span>
              <span className='mt-1 block font-bold text-[#22251f]'>{weakestArea}</span>
            </div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.1} className='mt-6 grid grid-cols-2 gap-3'>
        <div className='rounded-lg border border-[#e8ded2] bg-white/74 p-4 shadow-ambient'>
          <Flame className='h-5 w-5 text-accent' aria-hidden />
          <p className='mt-3 text-sm text-[#777268]'>{isKorean ? '연속 시도' : 'Streak'}</p>
          <p className='mt-1 font-data text-[1.8rem] font-bold text-[#22251f]'>{snapshot.streak.current}</p>
        </div>
        <div className='rounded-lg border border-[#e8ded2] bg-white/74 p-4 shadow-ambient'>
          <Trophy className='h-5 w-5 text-[#9a7445]' aria-hidden />
          <p className='mt-3 text-sm text-[#777268]'>{isKorean ? '완료한 루틴' : 'Completed'}</p>
          <p className='mt-1 font-data text-[1.8rem] font-bold text-[#22251f]'>{snapshot.stats.challengesCompleted}</p>
        </div>
        <div className='col-span-2 rounded-lg border border-[#e8ded2] bg-white/74 p-4 shadow-ambient'>
          <p className='text-sm text-[#777268]'>{isKorean ? '가장 강한 축' : 'Strongest axis'}</p>
          <p className='mt-1 text-lg font-bold leading-6 text-[#22251f]'>{strongestArea}</p>
          <div className='mt-4 rounded-md bg-[#f4e4cf] px-4 py-3 font-data text-[12px] font-bold text-[#9a7445]'>
            {snapshot.streak.level.label} · {snapshot.streak.xp} XP
          </div>
        </div>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.12}
        className='mt-8 rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'
      >
        <h2 className='font-display text-[1.3rem] font-bold text-[#22251f]'>
          {isKorean ? '영역별 보기' : 'Axis breakdown'}
        </h2>
        <div className='mt-5'>
          <ScoreBreakdown breakdown={snapshot.breakdown} locale={locale} />
        </div>
      </MotionReveal>
    </AppShell>
  );
}
