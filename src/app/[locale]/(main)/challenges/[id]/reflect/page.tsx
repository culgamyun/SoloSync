import { submitReflectionAction } from '@/actions/challenges';
import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getChallengeDetail } from '@/lib/server/app-data';
import type { ChallengeReflectionOutcome } from '@/types/challenge';

const moods = [
  { value: 1, emoji: '😟' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😊' }
] as const;

const difficultyOptions = [
  { value: 1, ko: '매우 쉬웠어요', en: 'Very easy' },
  { value: 2, ko: '쉬운 편', en: 'Easy' },
  { value: 3, ko: '적당했어요', en: 'Balanced' },
  { value: 4, ko: '조금 어려웠어요', en: 'A little hard' },
  { value: 5, ko: '꽤 어려웠어요', en: 'Quite hard' }
] as const;

const outcomeOptions: {
  value: ChallengeReflectionOutcome;
  label: Record<'ko' | 'en', string>;
  helper: Record<'ko' | 'en', string>;
}[] = [
  {
    value: 'greeted',
    label: { ko: '눈 마주치고 인사했어요', en: 'I made eye contact and greeted them' },
    helper: { ko: '오늘의 최소 성공입니다.', en: 'That is today\'s minimum win.' }
  },
  {
    value: 'said_line',
    label: { ko: '한마디까지 건넸어요', en: 'I said the line' },
    helper: { ko: '작지만 분명한 접촉을 만들었어요.', en: 'You made a small but real point of contact.' }
  },
  {
    value: 'could_not_do_it',
    label: { ko: '오늘은 못 했어요', en: 'I could not do it today' },
    helper: { ko: '멈춘 지점을 알게 된 것도 다음 시도의 재료입니다.', en: 'Knowing where you stopped helps the next attempt.' }
  }
];

export default async function ChallengeReflectionPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const challenge = await getChallengeDetail(id);
  const language = locale === 'en' ? 'en' : 'ko';
  const isMicroMission = challenge?.missionKind === 'micro_social';

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      header={<MobileHeader title={language === 'ko' ? '회고' : 'Challenge Reflection'} backHref={`/challenges/${id}`} centered />}
    >
      <div className='px-5 pb-10 pt-6'>
        <div className='max-w-[18rem]'>
          <h1 className='whitespace-pre-line break-keep font-display text-[2.2rem] font-bold leading-[1.08] tracking-normal'>
            {language === 'ko' ? '어땠는지\n기록해볼까요?' : 'How did it feel?'}
          </h1>
          <div className='editorial-rule' />
          <p className='mt-5 text-[15px] leading-7 text-muted-foreground'>{challenge?.title}</p>
        </div>

        <form action={submitReflectionAction} className='mt-8 space-y-7'>
          <input type='hidden' name='locale' value={locale} />
          <input type='hidden' name='challengeId' value={id} />

          {isMicroMission ? (
            <section className='rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
              <h2 className='font-display text-[1.25rem] font-bold'>
                {language === 'ko' ? '어디까지 해냈나요?' : 'How far did you get?'}
              </h2>
              <div className='mt-4 space-y-3'>
                {outcomeOptions.map((option) => (
                  <label key={option.value} className='block cursor-pointer'>
                    <input
                      className='peer sr-only'
                      type='radio'
                      name='outcome'
                      value={option.value}
                      required
                    />
                    <span className='block rounded-md border border-line bg-surface-low px-4 py-4 text-sm transition peer-checked:border-primary/30 peer-checked:bg-primary/10'>
                      <span className='font-semibold text-foreground'>{option.label[language]}</span>
                      <span className='mt-1 block leading-6 text-muted-foreground'>{option.helper[language]}</span>
                    </span>
                  </label>
                ))}
              </div>
              {challenge?.reframe ? (
                <p className='mt-4 rounded-md border border-observation/25 bg-observation/10 px-4 py-3 text-sm leading-6 text-muted-foreground'>
                  {challenge.reframe}
                </p>
              ) : null}
            </section>
          ) : null}

          <section className='rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
            <h2 className='font-display text-[1.25rem] font-bold'>
              {language === 'ko' ? '시작 전 기분' : 'Mood before'}
            </h2>
            <div className='mt-4 flex items-center justify-between gap-2'>
              {moods.map((mood, index) => (
                <label key={`before-${mood.value}`} className='cursor-pointer'>
                  <input className='peer sr-only' type='radio' name='moodBefore' value={mood.value} defaultChecked={index === 2} />
                  <span className='flex h-12 w-12 items-center justify-center rounded-md border border-transparent text-2xl grayscale opacity-50 transition peer-checked:border-reflection/25 peer-checked:bg-reflection/12 peer-checked:grayscale-0 peer-checked:opacity-100'>
                    {mood.emoji}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className='rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
            <h2 className='font-display text-[1.25rem] font-bold'>
              {language === 'ko' ? '마치고 난 뒤 기분' : 'Mood after'}
            </h2>
            <div className='mt-4 flex items-center justify-between gap-2'>
              {moods.map((mood, index) => (
                <label key={`after-${mood.value}`} className='cursor-pointer'>
                  <input className='peer sr-only' type='radio' name='moodAfter' value={mood.value} defaultChecked={index === 4} />
                  <span className='flex h-12 w-12 items-center justify-center rounded-md border border-transparent text-2xl grayscale opacity-50 transition peer-checked:border-reflection/25 peer-checked:bg-reflection/12 peer-checked:grayscale-0 peer-checked:opacity-100'>
                    {mood.emoji}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className='rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
            <h2 className='font-display text-[1.25rem] font-bold'>
              {language === 'ko' ? '체감 난이도' : 'Difficulty felt'}
            </h2>
            <div className='mt-4 space-y-3'>
              {difficultyOptions.map((option, index) => (
                <label key={option.value} className='block cursor-pointer'>
                  <input
                    className='peer sr-only'
                    type='radio'
                    name='difficultyFelt'
                    value={option.value}
                    defaultChecked={index === 2}
                  />
                  <span className='flex rounded-md border border-line bg-surface-low px-4 py-4 text-sm font-semibold text-muted-foreground transition peer-checked:border-reflection/25 peer-checked:bg-reflection/10 peer-checked:text-reflection'>
                    {option[language]}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className='rounded-lg border border-line bg-surface-high p-5 shadow-ambient'>
            <h2 className='font-display text-[1.25rem] font-bold'>
              {language === 'ko' ? '어떤 점이 달라졌나요?' : 'What shifted?'}
            </h2>
            <Textarea
              name='reflectionText'
              className='mt-4 min-h-[160px]'
              placeholder={language === 'ko' ? '기억에 남는 장면, 다음에 바꾸고 싶은 점을 적어보세요.' : 'Write what stood out and what you want to try next time.'}
            />
          </section>

          <Button type='submit' className='w-full'>
            {language === 'ko' ? '반추 저장' : 'Save reflection'}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
