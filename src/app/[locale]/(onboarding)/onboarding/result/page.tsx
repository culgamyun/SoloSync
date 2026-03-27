import { Share2 } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { ScoreBreakdown } from '@/components/dashboard/score-breakdown';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getHomeSnapshot } from '@/lib/server/app-data';

export default async function OnboardingResultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const home = await getHomeSnapshot();
  const challenge = home.challenges[0];

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      header={<MobileHeader title={locale === 'ko' ? '건강 분석 결과' : 'Analysis result'} centered trailing={<Share2 className='h-4 w-4 text-primary' />} />}
    >
      <div className='px-5 pb-10 pt-6'>
        <section className='flex flex-col items-center'>
          <ScoreRing score={home.latestScore} label={locale === 'ko' ? '나의 소셜 헬스 점수' : 'Your social score'} variant='result' />
        </section>

        <section className='mt-8 rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
          <ScoreBreakdown breakdown={home.breakdown} locale={locale} variant='result' />
        </section>

        <section className='mt-6 rounded-[1.8rem] bg-white/88 px-5 py-5 shadow-ambient'>
          <div className='flex items-center gap-2 text-secondary'>
            <span className='text-lg'>🧭</span>
            <span className='text-sm font-bold'>{locale === 'ko' ? '코치의 한마디' : 'Coach note'}</span>
          </div>
          <p className='mt-3 text-[15px] italic leading-7 text-muted-foreground'>“{home.latestInsight}”</p>
        </section>

        {challenge ? (
          <section className='mt-8'>
            <h2 className='text-[1.4rem] font-display font-bold tracking-[-0.03em]'>
              {locale === 'ko' ? '첫 번째 챌린지가 준비됐어요! 🎉' : 'Your first challenge is ready.'}
            </h2>
            <div className='mt-4 overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,rgba(155,96,92,0.92),rgba(236,155,148,0.82))] shadow-float'>
              <div className='bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))] px-5 py-6 backdrop-blur-sm'>
                <div className='rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold text-white/90'>
                  {locale === 'ko' ? 'FIRST CHALLENGE' : 'FIRST CHALLENGE'}
                </div>
                <h3 className='mt-6 text-[1.75rem] font-display font-bold leading-[1.05] tracking-[-0.04em] text-white'>
                  {challenge.title}
                </h3>
                <p className='mt-3 max-w-[15rem] text-sm leading-6 text-white/82'>{challenge.description}</p>
                <Button asChild variant='secondary' className='mt-6 bg-white/18 text-white hover:bg-white/24'>
                  <Link href={`/challenges/${challenge.id}`}>{locale === 'ko' ? '자세히 보기' : 'View details'}</Link>
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        <Button asChild size='lg' className='mt-8 w-full'>
          <Link href='/home'>
            {locale === 'ko' ? '여정 시작하기' : 'Start the journey'}
            <span aria-hidden>→</span>
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
