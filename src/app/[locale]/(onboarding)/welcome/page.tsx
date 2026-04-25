import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
          <div className='relative z-10 h-[292px] overflow-hidden rounded-lg border border-line bg-surface-high shadow-float md:h-[320px]'>
            <Image
              src='/images/welcome-social-moment-isometric.webp'
              alt={
                locale === 'ko'
                  ? '카페에서 직원에게 가볍게 인사하며 커피를 받는 장면'
                  : 'A small greeting while receiving coffee at a cafe counter'
              }
              fill
              priority
              sizes='(max-width: 430px) 82vw, 320px'
              className='object-cover object-[50%_45%]'
            />
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
