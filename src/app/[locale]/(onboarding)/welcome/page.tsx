import { ArrowRight, ShieldCheck } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { BrandLogo } from '@/components/common/brand-logo';
import { FieldNoteImage } from '@/components/common/field-note-image';
import { MotionReveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default async function WelcomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isKorean = locale === 'ko';

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      surfaceClassName='max-w-none border-x-0 md:my-0 md:min-h-screen md:rounded-none md:border-0 md:shadow-none md:overflow-visible'
    >
      <section className='relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-6 pb-6 pt-6'>
        <MotionReveal className='flex items-center justify-center'>
          <BrandLogo priority />
        </MotionReveal>

        <MotionReveal delay={0.06} y={18} className='mx-auto mt-8 w-full max-w-[336px]'>
          <FieldNoteImage
            src='/images/field-notes/welcome-routine-space.webp'
            priority
            className='aspect-[0.78] shadow-sanctuary'
            sizes='(max-width: 430px) 86vw, 336px'
          />
        </MotionReveal>

        <MotionReveal delay={0.12} className='mt-7 text-center'>
          <h1 className='whitespace-pre-line text-balance font-display text-[2.34rem] font-bold leading-[1.07] text-foreground [word-break:keep-all] md:text-[2.75rem]'>
            {isKorean ? '이번 주 관계 루틴,\n한 걸음씩' : 'A weekly relationship routine,\none step at a time'}
          </h1>
          <p className='mx-auto mt-3 max-w-[19rem] text-[1rem] leading-7 text-muted-foreground [word-break:keep-all]'>
            {isKorean
              ? '이번 주는 눈 마주치고 인사하는 정도면 충분해요.'
              : 'This week, eye contact and a hello can be enough.'}
          </p>
        </MotionReveal>

        <MotionReveal delay={0.18} className='mt-7 space-y-5'>
          <Button asChild size='lg' className='w-full rounded-lg text-[1.05rem]'>
            <Link href='/login'>
              {isKorean ? '시작하기' : 'Get started'}
              <ArrowRight className='h-4 w-4' aria-hidden />
            </Link>
          </Button>
          <div className='flex flex-col items-center gap-3 text-center'>
            <Link
              href='/login'
              className='inline-flex min-h-11 items-center text-[15px] font-semibold text-muted-foreground'
            >
              {isKorean ? '이미 계정이 있어요' : 'I already have an account'}
            </Link>
            <div className='inline-flex items-center gap-2 rounded-lg border border-line bg-surface-high px-3 py-2 text-[11px] font-semibold text-muted-foreground shadow-ambient'>
              <ShieldCheck className='h-3.5 w-3.5' />
              {isKorean ? '무료 · 카드 등록 필요 없음' : 'Free · no card required'}
            </div>
          </div>
        </MotionReveal>
      </section>
    </AppShell>
  );
}
