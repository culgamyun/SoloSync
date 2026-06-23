'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Minus, Plus, Sparkles } from 'lucide-react';

import { completeOnboardingAction } from '@/actions/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routineSpaceOptions, socialFearOptions } from '@/lib/challenges/profile-personalization';
import { barrierOptions, comfortOptions, goalOptions, livingSituationOptions } from '@/lib/constants/social';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { cn } from '@/lib/utils';

const relationshipMeta = {
  close_friends: {
    icon: '💛',
    label: { ko: '가까운 친구', en: 'Close friends' },
    description: { ko: '언제든 연락할 수 있는', en: 'People you can reach anytime' }
  },
  casual_friends: {
    icon: '🤝',
    label: { ko: '가끔 만나는 친구', en: 'Casual friends' },
    description: { ko: '부담 없이 연락하는 사이', en: 'Low-pressure friends' }
  },
  family: {
    icon: '👨‍👩‍👧',
    label: { ko: '가까이 사는 가족', en: 'Family nearby' },
    description: { ko: '자주 마주치거나 연락하는', en: 'Family in your weekly orbit' }
  },
  colleagues: {
    icon: '💼',
    label: { ko: '어울리는 직장 동료', en: 'Work friends' },
    description: { ko: '업무 외 대화도 가능한', en: 'Colleagues beyond task talk' }
  }
} as const;

function ProgressDots({ step }: { step: number }) {
  return (
    <div className='flex items-center gap-2'>
      {Array.from({ length: 4 }).map((_, index) => {
        const active = index + 1 === step;
        const complete = index + 1 < step;

        return (
          <span
            key={index}
            className={cn(
              'h-2.5 rounded-full transition-all',
              active ? 'w-6 bg-peach' : 'w-2.5',
              complete ? 'bg-mint' : active ? '' : 'bg-surface-soft'
            )}
          />
        );
      })}
    </div>
  );
}

function SelectChip({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition',
        active ? 'bg-peach text-primary shadow-ambient' : 'bg-white/84 text-muted-foreground shadow-ambient hover:bg-white'
      )}
    >
      {label}
    </button>
  );
}

export function OnboardingFlow({ step, locale }: { step: number; locale: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { draft, updateDraft, updateRelationshipMap, toggleListValue } = useOnboardingStore();
  const language = locale === 'en' ? 'en' : 'ko';
  const selectedRoutineSpaces = draft.routineSpaces ?? [];
  const selectedSocialFears = draft.socialFears ?? [];

  const goTo = (nextStep: number) => {
    startTransition(() => {
      router.push(`/${locale}/onboarding/step/${nextStep}`);
    });
  };

  const pageTitle =
    step === 1
      ? language === 'ko'
        ? '반가워요!\n알려주세요 👋'
        : 'Nice to meet you.\nTell us a bit about you.'
      : step === 2
        ? language === 'ko'
          ? '요즘 사회생활은\n어떤가요? 💭'
          : 'How is your social life\nfeeling these days?'
        : step === 3
          ? language === 'ko'
            ? '지금 관계를 알려주세요 🗺️'
            : 'Show us your current circle.'
          : language === 'ko'
            ? '가장 원하는 건\n뭔가요? 🎯'
            : 'What do you want most right now?';

  const pageDescription =
    step === 1
      ? language === 'ko'
        ? '현재 생활 리듬을 기준으로 시작할게요.'
        : 'We will start from your current rhythm.'
      : step === 2
        ? language === 'ko'
          ? '짧게 답해도 충분해요.'
          : 'Short answers are enough.'
        : step === 3
          ? language === 'ko'
            ? '대략적인 숫자만 있어도 괜찮아요.'
            : 'Approximate numbers are enough.'
          : language === 'ko'
            ? 'SoloSync가 맞춤형 행동을 제안할게요.'
            : 'SoloSync will tailor your first actions.';

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='glass-nav sticky top-0 z-20 border-b border-white/50 px-5 py-4'>
        <div className='grid grid-cols-[40px,1fr,auto] items-center gap-4'>
          <button
            type='button'
            onClick={() => goTo(Math.max(1, step - 1))}
            disabled={step === 1 || isPending}
            className='flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/45 disabled:opacity-35'
          >
            ←
          </button>
          <div className='flex justify-center'>
            <ProgressDots step={step} />
          </div>
          {step < 4 ? (
            <button
              type='button'
              onClick={() => goTo(step + 1)}
              className='text-sm font-semibold text-muted-foreground transition hover:text-foreground'
            >
              {language === 'ko' ? '건너뛰기' : 'Skip'}
            </button>
          ) : (
            <div className='w-12' />
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-5 pb-40 pt-8'>
        <div className='max-w-[22rem]'>
          <h1 className='whitespace-pre-line break-keep text-balance font-display text-[2.35rem] font-bold leading-[1.08] tracking-normal'>
            {pageTitle}
          </h1>
          <div className='editorial-rule' />
          <p className='mt-5 text-[15px] leading-7 text-muted-foreground'>{pageDescription}</p>
        </div>

        {step === 1 ? (
          <div className='mt-10 space-y-7'>
            <div>
              <Label>{language === 'ko' ? '닉네임' : 'Display name'}</Label>
              <Input
                value={draft.displayName}
                placeholder={language === 'ko' ? '뭐라고 불러드릴까요?' : 'What should we call you?'}
                onChange={(event) => updateDraft({ displayName: event.target.value })}
              />
            </div>
            <div>
              <Label>{language === 'ko' ? '활동 지역' : 'City'}</Label>
              <div className='relative'>
                <MapPin className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50' />
                <Input
                  className='pl-11'
                  value={draft.city}
                  placeholder={language === 'ko' ? '어디에 살고 계세요?' : 'Where are you based?'}
                  onChange={(event) => updateDraft({ city: event.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>{language === 'ko' ? '거주 형태' : 'Living situation'}</Label>
              <div className='mt-3 grid grid-cols-2 gap-3'>
                {livingSituationOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => updateDraft({ livingSituation: option.value })}
                    className={cn(
                      'rounded-[1.8rem] px-4 py-6 text-center shadow-ambient transition',
                      draft.livingSituation === option.value ? 'bg-peach/65 text-primary' : 'bg-white/84 text-foreground'
                    )}
                  >
                    <div className='text-3xl'>{option.icon}</div>
                    <p className='mt-4 text-sm font-semibold'>{option.label[language]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className='mt-10 space-y-8'>
            <section className='space-y-4 rounded-[2rem] bg-white/84 px-5 py-5 shadow-ambient'>
              <div className='flex items-center justify-between'>
                <h2 className='font-display text-xl font-bold'>{language === 'ko' ? '사회적 만족도' : 'Social satisfaction'}</h2>
                <span className='rounded-full bg-peach/45 px-3 py-1 text-sm font-bold text-primary'>
                  {draft.socialSatisfactionScore}/10
                </span>
              </div>
              <input
                type='range'
                min={1}
                max={10}
                value={draft.socialSatisfactionScore}
                onChange={(event) => updateDraft({ socialSatisfactionScore: Number(event.target.value) })}
                className='w-full'
              />
            </section>
            <section className='space-y-4 rounded-[2rem] bg-white/84 px-5 py-5 shadow-ambient'>
              <div className='flex items-center justify-between'>
                <h2 className='font-display text-xl font-bold'>{language === 'ko' ? '성향' : 'Introversion'}</h2>
                <span className='rounded-full bg-mint/45 px-3 py-1 text-sm font-bold text-secondary'>
                  {draft.introversionLevel}/10
                </span>
              </div>
              <input
                type='range'
                min={1}
                max={10}
                value={draft.introversionLevel}
                onChange={(event) => updateDraft({ introversionLevel: Number(event.target.value) })}
                className='w-full'
              />
            </section>
            <section>
              <h2 className='font-display text-xl font-bold'>{language === 'ko' ? '어려움이나 장벽' : 'Barriers'}</h2>
              <div className='mt-4 flex flex-wrap gap-3'>
                {barrierOptions.map((barrier) => (
                  <SelectChip
                    key={barrier.value}
                    active={draft.barriers.includes(barrier.value)}
                    label={barrier.label[language]}
                    onClick={() => toggleListValue('barriers', barrier.value)}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {step === 3 ? (
          <div className='mt-10 space-y-4'>
            {(Object.keys(relationshipMeta) as Array<keyof typeof relationshipMeta>).map((key) => {
              const current = draft.relationshipMap[key];
              const meta = relationshipMeta[key];
              return (
                <div key={key} className='flex items-center justify-between gap-4 rounded-[2rem] bg-white/86 px-5 py-5 shadow-ambient'>
                  <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-low text-2xl'>
                      {meta.icon}
                    </div>
                    <div>
                      <h2 className='font-semibold text-foreground'>{meta.label[language]}</h2>
                      <p className='text-sm text-muted-foreground'>{meta.description[language]}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 rounded-full bg-surface-low px-3 py-2'>
                    <button
                      type='button'
                      onClick={() => updateRelationshipMap(key, Math.max(0, current - 1))}
                      className='flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white'
                    >
                      <Minus className='h-4 w-4' />
                    </button>
                    <span className='min-w-5 text-center text-lg font-bold'>{current}</span>
                    <button
                      type='button'
                      onClick={() => updateRelationshipMap(key, current + 1)}
                      className='flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white'
                    >
                      <Plus className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {step === 4 ? (
          <div className='mt-10 space-y-4'>
            {goalOptions.map((goal) => (
              <button
                key={goal.value}
                type='button'
                onClick={() => toggleListValue('goals', goal.value)}
                className={cn(
                  'w-full rounded-[1.9rem] px-5 py-5 text-left shadow-ambient transition',
                  draft.goals.includes(goal.value) ? 'bg-peach/40 ring-2 ring-peach text-primary' : 'bg-white/84 text-foreground'
                )}
              >
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-start gap-4'>
                    <span className='mt-0.5 text-2xl'>{goal.icon}</span>
                    <div>
                      <h2 className='font-semibold'>{goal.label[language]}</h2>
                    </div>
                  </div>
                  <span className={cn('text-xl', draft.goals.includes(goal.value) ? 'opacity-100' : 'opacity-0')}>
                    ✓
                  </span>
                </div>
              </button>
            ))}

            <div className='rounded-[1.7rem] bg-white/78 px-5 py-4 shadow-ambient'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-mint/55 text-secondary'>
                  <Sparkles className='h-4 w-4' />
                </div>
                <p className='text-sm leading-6 text-muted-foreground'>
                  {language === 'ko'
                    ? `${draft.displayName || '당신'}님, 거의 다 왔어요. 편안한 난이도부터 시작할게요.`
                    : `Almost there, ${draft.displayName || 'there'}. We will start from a comfortable difficulty.`}
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-3 pt-2'>
              {comfortOptions.map((option) => (
                <SelectChip
                  key={option.value}
                  active={draft.comfortLevel === option.value}
                  label={option.label[language]}
                  onClick={() => updateDraft({ comfortLevel: option.value })}
                />
              ))}
            </div>

            <section className='rounded-[1.7rem] bg-white/78 px-5 py-5 shadow-ambient'>
              <h2 className='font-display text-xl font-bold'>
                {language === 'ko' ? '이번 주 가장 현실적인 장소' : 'Most realistic place this week'}
              </h2>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                {language === 'ko'
                  ? '이미 지나치는 곳을 고르면 첫 미션이 덜 뜬금없어져요.'
                  : 'Choose places that already exist in your routine.'}
              </p>
              <div className='mt-4 flex flex-wrap gap-3'>
                {routineSpaceOptions.map((option) => (
                  <SelectChip
                    key={option.value}
                    active={selectedRoutineSpaces.includes(option.value)}
                    label={option.label[language]}
                    onClick={() => toggleListValue('routineSpaces', option.value)}
                  />
                ))}
              </div>
            </section>

            <section className='rounded-[1.7rem] bg-white/78 px-5 py-5 shadow-ambient'>
              <h2 className='font-display text-xl font-bold'>
                {language === 'ko' ? '가장 부담되는 순간' : 'Hardest moment'}
              </h2>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                {language === 'ko'
                  ? '미션을 더 안전한 문장과 기준으로 맞추는 데만 사용합니다.'
                  : 'This only tunes the mission tone and minimum win.'}
              </p>
              <div className='mt-4 flex flex-wrap gap-3'>
                {socialFearOptions.map((option) => (
                  <SelectChip
                    key={option.value}
                    active={selectedSocialFears.includes(option.value)}
                    label={option.label[language]}
                    onClick={() => toggleListValue('socialFears', option.value)}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>

      <div className='glass-nav mt-auto border-t border-white/60 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4'>
        <div className='flex items-center justify-between gap-3'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => goTo(Math.max(1, step - 1))}
            disabled={step === 1 || isPending}
          >
            {language === 'ko' ? '뒤로' : 'Back'}
          </Button>
          {step < 4 ? (
            <Button type='button' size='lg' className='min-w-[11rem]' onClick={() => goTo(step + 1)} disabled={isPending}>
              {language === 'ko' ? '계속하기' : 'Continue'}
            </Button>
          ) : (
            <form action={completeOnboardingAction}>
              <input type='hidden' name='locale' value={locale} />
              <input type='hidden' name='displayName' value={draft.displayName} />
              <input type='hidden' name='city' value={draft.city} />
              <input type='hidden' name='livingSituation' value={draft.livingSituation ?? ''} />
              <input type='hidden' name='socialSatisfactionScore' value={draft.socialSatisfactionScore} />
              <input type='hidden' name='introversionLevel' value={draft.introversionLevel} />
              <input type='hidden' name='barriers' value={draft.barriers.join(',')} />
              <input type='hidden' name='relationshipMap' value={JSON.stringify(draft.relationshipMap)} />
              <input type='hidden' name='goals' value={draft.goals.join(',')} />
              <input type='hidden' name='comfortLevel' value={draft.comfortLevel} />
              <input type='hidden' name='routineSpaces' value={selectedRoutineSpaces.join(',')} />
              <input type='hidden' name='socialFears' value={selectedSocialFears.join(',')} />
              <Button type='submit' size='lg' className='min-w-[14rem]' disabled={isPending}>
                {language === 'ko' ? '소셜 헬스 분석하기' : 'Analyze my social health'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
