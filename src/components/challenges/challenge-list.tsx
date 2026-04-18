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
      <div className='rounded-md border border-line bg-surface-high px-5 py-6 text-sm text-muted-foreground'>
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
        const isMicroMission = challenge.missionKind === 'micro_social';
        const primaryLabel = isMicroMission
          ? locale === 'ko'
            ? '작은 접촉'
            : 'Micro-mission'
          : getChallengeCategoryLabel(challenge.category, locale);

        return (
          <article
            key={challenge.id}
            className='overflow-hidden rounded-lg border border-line bg-surface-high px-5 py-5 shadow-ambient transition hover:border-primary/30'
          >
            <div className='relative'>
              <div className='absolute right-0 top-0 whitespace-nowrap rounded bg-observation/18 px-3 py-1.5 font-data text-[11px] font-bold leading-none text-foreground'>
                +{xp} XP
              </div>
              <div className='flex flex-wrap items-center gap-2 pr-20'>
                <Badge variant={isMicroMission ? 'neutral' : 'warning'}>{primaryLabel}</Badge>
                <Badge className={challengeDifficultyTone[challenge.difficulty]}>
                  {getChallengeDifficultyLabel(challenge.difficulty, locale)}
                </Badge>
                <Badge variant='neutral'>{getEstimatedTimeLabel(challenge.estimatedTime, locale)}</Badge>
              </div>
              <div className='mt-4 flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface-low text-primary'>
                <Icon className='h-5 w-5' />
              </div>
              <h3
                className={cn(
                  'mt-3 min-w-0 text-[1.08rem] font-bold leading-6 tracking-normal text-foreground',
                  locale === 'ko' ? 'break-keep' : 'break-normal'
                )}
              >
                {challenge.title}
              </h3>
            </div>

            <p className='mt-3 break-words text-[14px] leading-6 text-muted-foreground'>{challenge.description}</p>

            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <Badge variant='ghost'>{getChallengeStatusLabel(challenge.status, locale)}</Badge>
              {isMicroMission && challenge.minimumWin ? (
                  <span className='text-[11px] font-bold text-primary'>
                  {locale === 'ko' ? `최소 성공: ${challenge.minimumWin}` : `Minimum win: ${challenge.minimumWin}`}
                </span>
              ) : (
                challenge.conversationStarters.slice(0, variant === 'home' ? 1 : 2).map((starter) => (
                  <span key={starter} className='text-[11px] text-muted-foreground'>
                    &quot;{starter}&quot;
                  </span>
                ))
              )}
            </div>

            {isMicroMission && challenge.safeLine ? (
              <div className='mt-4 rounded-md border border-observation/25 bg-observation/10 px-4 py-3 text-sm leading-6 text-muted-foreground'>
                <span className='font-semibold text-foreground'>{locale === 'ko' ? '안전한 한마디' : 'Safe line'}: </span>
                &quot;{challenge.safeLine}&quot;
              </div>
            ) : null}

            <div className='mt-5 flex flex-nowrap items-center gap-2'>
              <Button asChild variant='secondary' size='sm'>
                <Link href={`/challenges/${challenge.id}`}>
                  {locale === 'ko' ? '자세히 보기' : 'View details'}
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>

              {['pending', 'skipped'].includes(challenge.status) ? (
                <form action={updateChallengeStatusAction}>
                  <input type='hidden' name='challengeId' value={challenge.id} />
                  <input type='hidden' name='status' value='in_progress' />
                  <input type='hidden' name='locale' value={locale} />
                  <Button type='submit' variant='chip' size='sm'>
                    {locale === 'ko' ? '시작' : 'Start'}
                  </Button>
                </form>
              ) : null}

              {challenge.status === 'in_progress' ? (
                <form action={updateChallengeStatusAction}>
                  <input type='hidden' name='challengeId' value={challenge.id} />
                  <input type='hidden' name='status' value='completed' />
                  <input type='hidden' name='locale' value={locale} />
                  <Button type='submit' variant='chip' size='sm'>
                    {locale === 'ko' ? '완료' : 'Complete'}
                  </Button>
                </form>
              ) : null}

              {!['completed', 'skipped'].includes(challenge.status) ? (
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
