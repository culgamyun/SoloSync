import { ArrowRight, Check, Coffee, Compass, HeartHandshake } from 'lucide-react';

import { updateChallengeStatusAction } from '@/actions/challenges';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  challengeDifficultyTone,
  getChallengeCategoryLabel,
  getChallengeDifficultyLabel,
  getChallengeStatusLabel,
  getEstimatedTimeLabel
} from '@/lib/constants/social';
import { Link } from '@/i18n/navigation';
import { getChallengeXp } from '@/lib/utils/xp';
import { cn } from '@/lib/utils';
import type { ChallengeRecord } from '@/types/challenge';

const categoryIcons = {
  reach_out: Coffee,
  deepen: HeartHandshake,
  explore: Compass,
  maintain: Check
} as const;

export function ChallengeList({
  challenges,
  locale,
  variant = 'list'
}: {
  challenges: ChallengeRecord[];
  locale: string;
  variant?: 'list' | 'home';
}) {
  if (challenges.length === 0) {
    return (
      <div className='rounded-[1.8rem] bg-white/78 px-5 py-6 text-sm text-muted-foreground shadow-ambient'>
        {locale === 'ko'
          ? '아직 챌린지가 없어요. 온보딩을 마치면 첫 제안이 도착합니다.'
          : 'No challenges yet. Finish onboarding to generate the first suggestions.'}
      </div>
    );
  }

  return (
    <div className={cn(variant === 'home' ? 'space-y-4' : 'space-y-5')}>
      {challenges.map((challenge) => {
        const Icon = categoryIcons[challenge.category];
        const xp = getChallengeXp(challenge.difficulty);

        return (
          <article
            key={challenge.id}
            className='overflow-hidden rounded-[1.9rem] bg-white/84 px-5 py-5 shadow-ambient transition hover:-translate-y-0.5'
          >
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-low text-primary'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Badge variant='warning'>{getChallengeCategoryLabel(challenge.category, locale)}</Badge>
                      <Badge className={challengeDifficultyTone[challenge.difficulty]}>
                        {getChallengeDifficultyLabel(challenge.difficulty, locale)}
                      </Badge>
                      <Badge variant='neutral'>{getEstimatedTimeLabel(challenge.estimatedTime, locale)}</Badge>
                    </div>
                    <h3 className='mt-2 text-[1.08rem] font-bold leading-6 tracking-[-0.02em] text-foreground'>
                      {challenge.title}
                    </h3>
                  </div>
                </div>
                <p className='mt-3 text-[14px] leading-6 text-muted-foreground'>{challenge.description}</p>
              </div>
              <div className='rounded-full bg-sun/35 px-3 py-1.5 text-[11px] font-bold text-accent'>+{xp} XP</div>
            </div>

            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <Badge variant='ghost'>{getChallengeStatusLabel(challenge.status, locale)}</Badge>
              {challenge.conversationStarters.slice(0, variant === 'home' ? 1 : 2).map((starter) => (
                <span key={starter} className='text-[11px] text-muted-foreground'>
                  • {starter}
                </span>
              ))}
            </div>

            <div className='mt-5 flex flex-wrap items-center gap-3'>
              <Button asChild variant='secondary' size='sm'>
                <Link href={`/challenges/${challenge.id}`}>
                  {locale === 'ko' ? '자세히 보기' : 'View details'}
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>

              {challenge.status === 'pending' ? (
                <form action={updateChallengeStatusAction}>
                  <input type='hidden' name='challengeId' value={challenge.id} />
                  <input type='hidden' name='status' value='in_progress' />
                  <input type='hidden' name='locale' value={locale} />
                  <Button type='submit' variant='chip' size='sm'>
                    {locale === 'ko' ? '시작' : 'Start'}
                  </Button>
                </form>
              ) : null}

              {challenge.status !== 'completed' ? (
                <form action={updateChallengeStatusAction}>
                  <input type='hidden' name='challengeId' value={challenge.id} />
                  <input type='hidden' name='status' value='completed' />
                  <input type='hidden' name='locale' value={locale} />
                  <Button type='submit' variant='chip' size='sm'>
                    {locale === 'ko' ? '완료' : 'Complete'}
                  </Button>
                </form>
              ) : null}

              {challenge.status !== 'skipped' ? (
                <form action={updateChallengeStatusAction}>
                  <input type='hidden' name='challengeId' value={challenge.id} />
                  <input type='hidden' name='status' value='skipped' />
                  <input type='hidden' name='locale' value={locale} />
                  <Button type='submit' variant='ghost' size='sm'>
                    {locale === 'ko' ? '건너뛰기' : 'Skip'}
                  </Button>
                </form>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
