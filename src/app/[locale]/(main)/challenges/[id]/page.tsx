import { ArrowRight, Check, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

import { updateChallengeStatusAction } from '@/actions/challenges';
import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  challengeDifficultyTone,
  getChallengeCategoryLabel,
  getChallengeDifficultyLabel,
  getChallengeStatusLabel,
  getEstimatedTimeLabel
} from '@/lib/constants/social';
import { getChallengeDetail } from '@/lib/server/app-data';
import { Link } from '@/i18n/navigation';

const categoryIcons = {
  reach_out: Sparkles,
  deepen: HeartHandshake,
  explore: Compass,
  maintain: Check
} as const;

export default async function ChallengeDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const challenge = await getChallengeDetail(id);

  if (!challenge) {
    notFound();
  }

  const Icon = categoryIcons[challenge.category];
  const isMicroMission = challenge.missionKind === 'micro_social';

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      header={<MobileHeader title={locale === 'ko' ? '챌린지 상세' : 'Challenge details'} backHref='/challenges' centered />}
    >
      <div className='px-5 pb-10 pt-6'>
        <section className='overflow-hidden rounded-lg border border-primary bg-primary shadow-float'>
          <div className='px-5 py-7 text-primary-foreground'>
            <div className='flex h-12 w-12 items-center justify-center rounded-md border border-white/25 bg-white/12'>
              <Icon className='h-6 w-6' />
            </div>
            <p className='mt-5 font-data text-[11px] font-bold uppercase tracking-normal text-white/70'>
              {getChallengeCategoryLabel(challenge.category, locale)}
            </p>
            <h1 className='mt-3 break-keep font-display text-[2.15rem] font-bold leading-[1.08] tracking-normal'>
              {challenge.title}
            </h1>
            <p className='mt-4 max-w-[17rem] text-[15px] leading-7 text-white/84'>{challenge.description}</p>
          </div>
        </section>

        <section className='mt-6 flex flex-wrap gap-2'>
          <Badge variant='warning'>{getChallengeCategoryLabel(challenge.category, locale)}</Badge>
          <Badge className={challengeDifficultyTone[challenge.difficulty]}>
            {getChallengeDifficultyLabel(challenge.difficulty, locale)}
          </Badge>
          <Badge variant='neutral'>{getEstimatedTimeLabel(challenge.estimatedTime, locale)}</Badge>
          <Badge variant='ghost'>{getChallengeStatusLabel(challenge.status, locale)}</Badge>
        </section>

        {isMicroMission ? (
          <section className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
            <p className='font-data text-[12px] font-bold uppercase tracking-normal text-primary/70'>
              {locale === 'ko' ? '이번 주 작은 접촉' : 'This week\'s micro-mission'}
            </p>
            <h2 className='mt-2 font-display text-[1.3rem] font-bold tracking-normal'>
              {locale === 'ko' ? '작게 시작해도 충분해요' : 'Small counts here'}
            </h2>
            <div className='mt-5 space-y-3 text-sm leading-6'>
              {challenge.missionContext ? (
                <div className='rounded-md border border-line bg-surface-low px-4 py-3'>
                  <span className='font-semibold text-foreground'>{locale === 'ko' ? '장소' : 'Context'}: </span>
                  <span className='text-muted-foreground'>{challenge.missionContext}</span>
                </div>
              ) : null}
              {challenge.minimumWin ? (
                <div className='rounded-md border border-primary/20 bg-primary/10 px-4 py-3'>
                  <span className='font-semibold text-secondary'>{locale === 'ko' ? '최소 성공' : 'Minimum win'}: </span>
                  <span className='text-secondary'>{challenge.minimumWin}</span>
                </div>
              ) : null}
              {challenge.safeLine ? (
                <div className='rounded-md border border-observation/25 bg-observation/10 px-4 py-3'>
                  <span className='font-semibold text-foreground'>{locale === 'ko' ? '안전한 한마디' : 'Safe line'}: </span>
                  <span className='text-muted-foreground'>&quot;{challenge.safeLine}&quot;</span>
                </div>
              ) : null}
              {challenge.fear ? (
                <div className='rounded-md border border-reflection/20 bg-reflection/10 px-4 py-3'>
                  <span className='font-semibold text-primary'>{locale === 'ko' ? '걱정' : 'Fear'}: </span>
                  <span className='text-primary'>{challenge.fear}</span>
                </div>
              ) : null}
              {challenge.reframe ? (
                <div className='rounded-md border border-observation/25 bg-observation/10 px-4 py-3 text-muted-foreground'>{challenge.reframe}</div>
              ) : null}
            </div>
          </section>
        ) : (
          <section className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
            <h2 className='font-display text-[1.3rem] font-bold tracking-normal'>
              {locale === 'ko' ? '대화 시작 문장' : 'Conversation starters'}
            </h2>
            <div className='mt-4 space-y-3'>
              {challenge.conversationStarters.map((starter) => (
                <div key={starter} className='rounded-md border border-line bg-surface-low px-4 py-3 text-sm leading-6 text-muted-foreground'>
                  {starter}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className='mt-8 grid gap-3'>
          {['pending', 'skipped'].includes(challenge.status) ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='in_progress' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' className='w-full'>
                {locale === 'ko' ? '지금 시작하기' : 'Start now'}
              </Button>
            </form>
          ) : null}

          {challenge.status === 'in_progress' ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='completed' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' variant='secondary' className='w-full'>
                {locale === 'ko' ? '완료로 표시' : 'Mark as completed'}
              </Button>
            </form>
          ) : null}

          {!['completed', 'skipped'].includes(challenge.status) ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='skipped' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' variant='ghost' className='w-full'>
                {locale === 'ko' ? '이번 주는 건너뛰기' : 'Skip for this week'}
              </Button>
            </form>
          ) : null}

          <Button asChild variant='outline' className='w-full'>
            <Link href={`/challenges/${challenge.id}/reflect`}>
              {locale === 'ko' ? '회고 작성하기' : 'Write reflection'}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </section>
      </div>
    </AppShell>
  );
}

