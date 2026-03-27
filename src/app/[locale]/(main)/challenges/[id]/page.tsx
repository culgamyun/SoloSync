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

  return (
    <AppShell
      padded={false}
      header={<MobileHeader title={locale === 'ko' ? '챌린지 상세' : 'Challenge details'} backHref='/challenges' centered />}
    >
      <div className='px-5 pb-10 pt-6'>
        <section className='overflow-hidden rounded-[2.3rem] bg-[linear-gradient(155deg,rgba(141,76,74,0.95),rgba(254,171,167,0.82))] shadow-float'>
          <div className='px-5 py-7 text-white'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20'>
              <Icon className='h-6 w-6' />
            </div>
            <p className='mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70'>
              {getChallengeCategoryLabel(challenge.category, locale)}
            </p>
            <h1 className='mt-3 text-balance font-display text-[2.15rem] font-bold leading-[1.02] tracking-[-0.05em]'>
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

        <section className='mt-8 rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
          <h2 className='font-display text-[1.3rem] font-bold tracking-[-0.03em]'>
            {locale === 'ko' ? '대화 시작 문장' : 'Conversation starters'}
          </h2>
          <div className='mt-4 space-y-3'>
            {challenge.conversationStarters.map((starter) => (
              <div key={starter} className='rounded-[1.4rem] bg-surface-low px-4 py-3 text-sm leading-6 text-muted-foreground'>
                {starter}
              </div>
            ))}
          </div>
        </section>

        <section className='mt-8 grid gap-3'>
          {challenge.status === 'pending' ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='in_progress' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' className='w-full'>
                {locale === 'ko' ? '지금 시작하기' : 'Start now'}
              </Button>
            </form>
          ) : null}

          {challenge.status !== 'completed' ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='completed' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' variant='secondary' className='w-full'>
                {locale === 'ko' ? '완료로 표시' : 'Mark as completed'}
              </Button>
            </form>
          ) : null}

          {challenge.status !== 'skipped' ? (
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

