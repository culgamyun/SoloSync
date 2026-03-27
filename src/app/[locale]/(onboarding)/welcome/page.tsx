import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { AppShell } from '@/components/common/app-shell';

export default async function WelcomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <AppShell padded={false} tabBarInset={false} surfaceClassName='md:overflow-visible'>
      <section className='relative flex min-h-screen flex-col px-6 pb-10 pt-8'>
        <div className='flex items-center justify-center gap-3 text-primary'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-peach/55'>
            <Sparkles className='h-5 w-5' />
          </div>
          <span className='font-display text-[2rem] font-bold tracking-[-0.04em]'>SoloSync</span>
        </div>

        <div className='relative mx-auto mt-10 flex w-full max-w-[320px] items-center justify-center'>
          <div className='absolute inset-0 rotate-3 rounded-[3rem] bg-white/58 blur-sm' />
          <div className='absolute inset-2 -rotate-2 rounded-[2.6rem] bg-white/84 shadow-sanctuary' />
          <div className='relative z-10 aspect-square w-full overflow-hidden rounded-[2.6rem] bg-[radial-gradient(circle_at_35%_25%,rgba(39,154,255,0.85),transparent_24%),radial-gradient(circle_at_62%_38%,rgba(33,38,52,0.92),transparent_28%),radial-gradient(circle_at_52%_58%,rgba(53,84,194,0.72),transparent_22%),linear-gradient(145deg,#4f5c8f_0%,#1c2435_72%,#111520_100%)] shadow-float'>
            <div className='absolute -left-6 top-6 h-40 w-40 rounded-full bg-[#0e1018]/60 blur-2xl' />
            <div className='absolute right-[-8%] top-[16%] h-48 w-24 rounded-full bg-[#1da0ff]/60 blur-2xl' />
            <div className='absolute bottom-[-4%] left-[22%] h-36 w-36 rounded-full bg-[#0b1226]/90 blur-2xl' />
          </div>
          <div className='absolute -left-5 top-[-6%] flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-peach text-primary shadow-ambient'>
            <Sparkles className='h-5 w-5' />
          </div>
          <div className='absolute -right-4 bottom-[10%] flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-mint text-secondary shadow-ambient'>
            <Heart className='h-5 w-5 fill-current' />
          </div>
        </div>

        <div className='mt-14 text-center'>
          <h1 className='whitespace-pre-line text-balance font-display text-[3.15rem] font-bold leading-[0.98] tracking-[-0.06em] text-foreground'>
            {locale === 'ko' ? '나의 소셜 헬스,\n한 걸음씩' : 'Your social health,\none step at a time'}
          </h1>
          <p className='mx-auto mt-5 max-w-[18rem] text-[1.05rem] leading-7 text-muted-foreground'>
            {locale === 'ko'
              ? 'AI 코칭으로 진짜 관계를 만들어가요'
              : 'Build real relationships with guidance that stays grounded in real life.'}
          </p>
        </div>

        <div className='mt-auto space-y-5 pt-12'>
          <Button asChild size='lg' className='w-full rounded-[1.45rem] text-[1.05rem]'>
            <Link href='/login'>
              {locale === 'ko' ? '시작하기' : 'Get started'}
              <span aria-hidden>→</span>
            </Link>
          </Button>
          <div className='space-y-4 text-center'>
            <Link href='/login' className='text-[15px] font-semibold text-muted-foreground'>
              {locale === 'ko' ? '이미 계정이 있어요' : 'I already have an account'}
            </Link>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold text-muted-foreground shadow-ambient'>
              <ShieldCheck className='h-3.5 w-3.5' />
              {locale === 'ko' ? '무료 · 카드 등록 필요 없음' : 'Free · no card required'}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
