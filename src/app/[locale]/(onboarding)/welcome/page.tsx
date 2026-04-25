import { ArrowRight, Coffee, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { AppShell } from '@/components/common/app-shell';

export default async function WelcomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      surfaceClassName='max-w-none border-x-0 md:my-0 md:min-h-screen md:rounded-none md:border-0 md:shadow-none md:overflow-visible'
    >
      <section className='relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-6 pb-6 pt-6'>
        <div className='flex items-center justify-center gap-3 text-primary'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-reflection/25'>
            <Sparkles className='h-5 w-5' />
          </div>
          <span className='font-display text-[1.85rem] font-bold'>SoloSync</span>
        </div>

        <div className='relative mx-auto mt-7 w-full max-w-[320px]'>
          <div className='absolute -left-4 top-5 h-16 w-16 rounded-lg bg-reflection/85 shadow-ambient' />
          <div className='absolute -right-3 bottom-7 h-14 w-14 rounded-lg border border-line bg-observation/30 shadow-ambient' />

          <div className='relative z-10 rounded-lg border border-line bg-surface-high p-3.5 shadow-float'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-surface-soft text-primary'>
                  <Coffee className='h-5 w-5' />
                </span>
                <div>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    {locale === 'ko' ? '이번 주 작은 접촉' : 'This week'}
                  </p>
                  <p className='font-data text-[11px] font-semibold text-primary'>10 MIN</p>
                </div>
              </div>
              <span className='rounded-md bg-observation/20 px-2.5 py-1 font-data text-[11px] font-semibold text-secondary-foreground'>
                +50 XP
              </span>
            </div>

            <div className='mt-4 space-y-2.5'>
              <h2 className='text-[1.3rem] font-bold leading-tight text-foreground [word-break:keep-all]'>
                {locale === 'ko'
                  ? '단골 카페에서 눈 마주치고 인사하기'
                  : 'Make eye contact and say hello at a familiar cafe'}
              </h2>
              <p className='text-[0.92rem] leading-6 text-muted-foreground [word-break:keep-all]'>
                {locale === 'ko'
                  ? '이미 지나치는 생활 공간에서 20초짜리 접촉 하나만 만들어봐요.'
                  : 'Try one 20-second contact in a place already inside your routine.'}
              </p>
            </div>

            <div className='mt-4 rounded-lg border border-line bg-surface-soft p-2.5'>
              <div className='flex items-start gap-2 text-primary'>
                <MessageCircle className='mt-0.5 h-4 w-4 shrink-0' />
                <p className='text-sm font-semibold leading-5 text-foreground [word-break:keep-all]'>
                  {locale === 'ko'
                    ? '“안녕하세요. 오늘도 늦게까지 하시네요.”'
                    : '"Hi. You are open late today, too."'}
                </p>
              </div>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {(locale === 'ko'
                ? ['작은 접촉', '가볍게', '눈 마주치면 성공']
                : ['Small contact', 'Light', 'Eye contact counts']
              ).map((label) => (
                <span
                  key={label}
                  className='whitespace-nowrap rounded-md border border-line bg-white px-2.5 py-1 text-xs font-semibold text-muted-foreground'
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <h1 className='whitespace-pre-line text-balance font-display text-[2.45rem] font-bold leading-[1.06] text-foreground [word-break:keep-all] md:text-[2.75rem]'>
            {locale === 'ko' ? '나의 소셜 헬스,\n한 걸음씩' : 'Your social health,\none step at a time'}
          </h1>
          <p className='mx-auto mt-3 max-w-[19rem] text-[1rem] leading-7 text-muted-foreground [word-break:keep-all]'>
            {locale === 'ko'
              ? '이번 주는 눈 마주치고 인사하는 정도면 충분해요.'
              : 'This week, eye contact and a hello can be enough.'}
          </p>
        </div>

        <div className='mt-8 space-y-5'>
          <Button asChild size='lg' className='w-full rounded-lg text-[1.05rem]'>
            <Link href='/login'>
              {locale === 'ko' ? '시작하기' : 'Get started'}
              <ArrowRight className='h-4 w-4' aria-hidden />
            </Link>
          </Button>
          <div className='flex flex-col items-center gap-3 text-center'>
            <Link
              href='/login'
              className='inline-flex min-h-11 items-center text-[15px] font-semibold text-muted-foreground'
            >
              {locale === 'ko' ? '이미 계정이 있어요' : 'I already have an account'}
            </Link>
            <div className='inline-flex items-center gap-2 rounded-lg border border-line bg-surface-high px-3 py-2 text-[11px] font-semibold text-muted-foreground shadow-ambient'>
              <ShieldCheck className='h-3.5 w-3.5' />
              {locale === 'ko' ? '무료 · 카드 등록 필요 없음' : 'Free · no card required'}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
