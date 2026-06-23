import { ArrowRight, Check, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

import { adjustMicroMissionAction, updateChallengeStatusAction } from '@/actions/challenges';
import { AppShell } from '@/components/common/app-shell';
import { FieldNoteImage } from '@/components/common/field-note-image';
import { MobileHeader } from '@/components/common/mobile-header';
import { MotionReveal } from '@/components/motion/reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  buildAdjustedMicroMission,
  isChallengeAdjustmentRequestType
} from '@/lib/challenges/micro-mission-adjustments';
import {
  challengeDifficultyTone,
  getChallengeCategoryLabel,
  getChallengeDifficultyLabel,
  getChallengeStatusLabel,
  getEstimatedTimeLabel
} from '@/lib/constants/social';
import { getChallengeDetail } from '@/lib/server/app-data';
import { shouldUseDemoDataForRequest } from '@/lib/server/demo-mode';
import { Link } from '@/i18n/navigation';
import type { ChallengeAdjustmentRequestType } from '@/types/challenge';

const categoryIcons = {
  reach_out: Sparkles,
  deepen: HeartHandshake,
  explore: Compass,
  maintain: Check
} as const;

const adjustmentButtonCopy = {
  ko: {
    smaller: '조금 더 작게',
    different_space: '장소 바꾸기',
    safer_line: '한마디를 더 안전하게'
  },
  en: {
    smaller: 'Make it smaller',
    different_space: 'Switch the place',
    safer_line: 'Use a safer line'
  }
} as const;

const adjustmentBannerCopy = {
  ko: {
    smaller: '오늘 기준으로 더 작은 버전으로 바꿨어요.',
    different_space: '부담이 덜한 다른 생활 공간 버전으로 바꿨어요.',
    safer_line: '같은 미션을 유지하고 더 안전한 한마디 버전으로 바꿨어요.'
  },
  en: {
    smaller: 'This mission now uses a smaller version for today.',
    different_space: 'This mission now uses a lower-pressure place.',
    safer_line: 'This mission now uses a shorter and safer line.'
  }
} as const;

const adjustmentErrorCopy = {
  ko: {
    completed: '이미 완료한 미션은 바꾸지 않고 회고에 남겨둘게요.',
    default: '지금은 이 미션을 바꾸지 못했어요. 화면을 다시 열고 한 번 더 시도해 주세요.'
  },
  en: {
    completed: 'Completed missions stay as they are. Keep the note in your reflection instead.',
    default: 'We could not adjust this mission right now. Please reopen the page and try again.'
  }
} as const;

export default async function ChallengeDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ adjusted?: string; adjustmentError?: string }>;
}) {
  const { locale, id } = await params;
  const resolvedSearchParams = await searchParams;
  const language = locale === 'en' ? 'en' : 'ko';
  const isKorean = language === 'ko';
  const adjustedCandidate = resolvedSearchParams.adjusted;
  const adjustedType: ChallengeAdjustmentRequestType | null =
    adjustedCandidate && isChallengeAdjustmentRequestType(adjustedCandidate) ? adjustedCandidate : null;
  const adjustmentError = String(resolvedSearchParams.adjustmentError ?? '');
  let challenge = await getChallengeDetail(id);

  if (!challenge) {
    notFound();
  }

  const isDemo = await shouldUseDemoDataForRequest();
  if (isDemo && challenge.missionKind === 'micro_social' && challenge.status !== 'completed' && adjustedType) {
    challenge = buildAdjustedMicroMission(challenge, adjustedType, locale);
  }

  const Icon = categoryIcons[challenge.category];
  const isMicroMission = challenge.missionKind === 'micro_social';
  const canAdjustMission = isMicroMission && challenge.status !== 'completed';

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      header={<MobileHeader title={isKorean ? '챌린지 상세' : 'Challenge details'} backHref='/challenges' centered />}
    >
      <div className='bg-[#fbf6ed] px-5 pb-10 pt-6'>
        <MotionReveal as='section' className='overflow-hidden rounded-lg bg-[#8f9b84] shadow-float'>
          <div className='px-5 py-7 text-white'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/86 text-[#8f9b84]'>
              <Icon className='h-6 w-6' />
            </div>
            <p className='mt-5 font-data text-[11px] font-bold uppercase text-white/72'>
              {getChallengeCategoryLabel(challenge.category, locale)}
            </p>
            <h1 className='mt-3 break-keep font-display text-[2.15rem] font-bold leading-[1.08]'>
              {challenge.title}
            </h1>
            <p className='mt-4 max-w-[17rem] text-[15px] leading-7 text-white/84'>{challenge.description}</p>
          </div>
        </MotionReveal>

        <MotionReveal as='section' delay={0.04} className='mt-6 flex flex-wrap gap-2'>
          <Badge variant='warning'>{getChallengeCategoryLabel(challenge.category, locale)}</Badge>
          <Badge className={challengeDifficultyTone[challenge.difficulty]}>
            {getChallengeDifficultyLabel(challenge.difficulty, locale)}
          </Badge>
          <Badge variant='neutral'>{getEstimatedTimeLabel(challenge.estimatedTime, locale)}</Badge>
          <Badge variant='ghost'>{getChallengeStatusLabel(challenge.status, locale)}</Badge>
        </MotionReveal>

        {adjustedType ? (
          <MotionReveal className='mt-6 rounded-lg border border-[#dde2d4] bg-[#f1f4ea] px-4 py-3 text-sm font-medium leading-6 text-[#62705d]'>
            {adjustmentBannerCopy[language][adjustedType]}
          </MotionReveal>
        ) : null}

        {adjustmentError ? (
          <MotionReveal className='mt-6 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-sm font-medium leading-6 text-accent'>
            {adjustmentError === 'completed' ? adjustmentErrorCopy[language].completed : adjustmentErrorCopy[language].default}
          </MotionReveal>
        ) : null}

        {isMicroMission ? (
          <MotionReveal
            as='section'
            delay={0.08}
            className='mt-8 overflow-hidden rounded-lg border border-[#e8ded2] bg-white/74 shadow-ambient'
          >
            <FieldNoteImage
              src='/images/field-notes/micro-mission-field-note.webp'
              className='aspect-[2/1] rounded-none border-0 shadow-none'
              sizes='(max-width: 430px) 100vw, 430px'
            />
            <div className='p-5'>
              <p className='font-data text-[12px] font-bold uppercase text-accent'>
                {isKorean ? '이번 주 작은 접촉' : "This week's micro-mission"}
              </p>
              <h2 className='mt-2 font-display text-[1.3rem] font-bold text-[#22251f]'>
                {isKorean ? '작게 시작해도 충분해요' : 'Small counts here'}
              </h2>
              <div className='mt-5 space-y-3 text-sm leading-6'>
                {challenge.missionContext ? (
                  <div className='rounded-md border border-line bg-surface-low px-4 py-3'>
                    <span className='font-semibold text-[#22251f]'>{isKorean ? '장소' : 'Context'}: </span>
                    <span className='text-[#777268]'>{challenge.missionContext}</span>
                  </div>
                ) : null}
                {challenge.minimumWin ? (
                  <div className='rounded-md border border-accent/20 bg-accent/10 px-4 py-3'>
                    <span className='font-semibold text-accent'>{isKorean ? '최소 성공' : 'Minimum win'}: </span>
                    <span className='text-accent'>{challenge.minimumWin}</span>
                  </div>
                ) : null}
                {challenge.safeLine ? (
                  <div className='rounded-md border border-[#dde2d4] bg-[#f1f4ea] px-4 py-3'>
                    <span className='font-semibold text-[#22251f]'>{isKorean ? '안전한 한마디' : 'Safe line'}: </span>
                    <span className='text-[#66705f]'>&quot;{challenge.safeLine}&quot;</span>
                  </div>
                ) : null}
                {challenge.fear ? (
                  <div className='rounded-md border border-[#f1ddd2] bg-[#fff4ed] px-4 py-3'>
                    <span className='font-semibold text-[#9a7445]'>{isKorean ? '걱정' : 'Fear'}: </span>
                    <span className='text-[#9a7445]'>{challenge.fear}</span>
                  </div>
                ) : null}
                {challenge.reframe ? (
                  <div className='rounded-md border border-[#dde2d4] bg-[#f1f4ea] px-4 py-3 text-[#66705f]'>
                    {challenge.reframe}
                  </div>
                ) : null}
              </div>
            </div>
          </MotionReveal>
        ) : (
          <MotionReveal
            as='section'
            delay={0.08}
            className='mt-8 rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'
          >
            <h2 className='font-display text-[1.3rem] font-bold tracking-normal'>
              {isKorean ? '대화 시작 문장' : 'Conversation starters'}
            </h2>
            <div className='mt-4 space-y-3'>
              {challenge.conversationStarters.map((starter) => (
                <div key={starter} className='rounded-md border border-[#e8ded2] bg-[#fffaf2] px-4 py-3 text-sm leading-6 text-[#777268]'>
                  {starter}
                </div>
              ))}
            </div>
          </MotionReveal>
        )}

        {canAdjustMission ? (
          <MotionReveal
            as='section'
            delay={0.12}
            className='mt-6 rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'
          >
            <p className='font-data text-[12px] font-bold uppercase text-accent'>
              {isKorean ? '너무 크다면' : 'If this feels too much'}
            </p>
            <h2 className='mt-2 font-display text-[1.2rem] font-bold text-[#22251f]'>
              {isKorean ? '이번 주 연결은 망치지 않게 줄여볼 수 있어요' : 'You can scale this down without losing the week'}
            </h2>
            <p className='mt-3 text-sm leading-6 text-[#777268]'>
              {isKorean
                ? '조금 더 작게, 장소 바꾸기, 더 짧은 한마디 중 하나로 다시 맞출 수 있어요.'
                : 'Choose a smaller version, a different place, or a safer line.'}
            </p>
            <div className='mt-5 grid gap-2'>
              {(['smaller', 'different_space', 'safer_line'] as const).map((requestType) => (
                <form key={requestType} action={adjustMicroMissionAction}>
                  <input type='hidden' name='challengeId' value={challenge.id} />
                  <input type='hidden' name='locale' value={locale} />
                  <input type='hidden' name='requestType' value={requestType} />
                  <Button type='submit' variant='chip' className='h-11 w-full justify-between px-4 text-left text-sm text-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0'>
                    <span>{adjustmentButtonCopy[language][requestType]}</span>
                    <ArrowRight className='h-4 w-4 shrink-0' />
                  </Button>
                </form>
              ))}
            </div>
          </MotionReveal>
        ) : null}

        <MotionReveal as='section' delay={0.16} className='mt-8 grid gap-3'>
          {['pending', 'skipped'].includes(challenge.status) ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='in_progress' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' className='w-full'>
                {isKorean ? '지금 시작하기' : 'Start now'}
              </Button>
            </form>
          ) : null}

          {challenge.status === 'in_progress' ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='completed' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' variant='secondary' className='w-full'>
                {isKorean ? '완료로 표시' : 'Mark as completed'}
              </Button>
            </form>
          ) : null}

          {!['completed', 'skipped'].includes(challenge.status) ? (
            <form action={updateChallengeStatusAction}>
              <input type='hidden' name='challengeId' value={challenge.id} />
              <input type='hidden' name='status' value='skipped' />
              <input type='hidden' name='locale' value={locale} />
              <Button type='submit' variant='ghost' className='w-full'>
                {isKorean ? '이번 주는 건너뛰기' : 'Skip for this week'}
              </Button>
            </form>
          ) : null}

          <Button asChild variant='outline' className='w-full'>
            <Link href={`/challenges/${challenge.id}/reflect`}>
              {isKorean ? '회고 작성하기' : 'Write reflection'}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </MotionReveal>
      </div>
    </AppShell>
  );
}
