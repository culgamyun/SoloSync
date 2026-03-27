import { ShieldCheck, Sparkles } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { OauthButtons } from '@/components/common/oauth-buttons';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <AppShell padded={false} tabBarInset={false}>
      <section className='flex min-h-screen flex-col px-6 pb-10 pt-10'>
        <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-[1.6rem] bg-peach/60 text-primary shadow-ambient'>
          <Sparkles className='h-6 w-6' />
        </div>
        <div className='mt-10 text-center'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70'>SoloSync</p>
          <h1 className='text-balance mt-4 font-display text-[2.65rem] font-bold leading-[1.02] tracking-[-0.05em]'>
            {locale === 'ko' ? '기분 좋은 관계 루틴을 시작해요' : 'Start a calmer rhythm for real connection'}
          </h1>
          <p className='mx-auto mt-5 max-w-[19rem] text-[15px] leading-7 text-muted-foreground'>
            {locale === 'ko'
              ? '점수, 챌린지, 코칭 기록을 저장하려면 로그인하세요.'
              : 'Sign in to save your score, weekly challenges and coaching history.'}
          </p>
        </div>

        <div className='mt-10 rounded-[2.1rem] bg-white/82 p-5 shadow-sanctuary'>
          <OauthButtons locale={locale} />
        </div>

        <div className='mt-auto rounded-[1.6rem] bg-surface-low px-4 py-4 text-sm leading-6 text-muted-foreground'>
          <div className='flex items-center gap-2 text-secondary'>
            <ShieldCheck className='h-4 w-4' />
            <span className='font-semibold'>{locale === 'ko' ? '개인 데이터 보호' : 'Private by default'}</span>
          </div>
          <p className='mt-2'>
            {locale === 'ko'
              ? 'SoloSync는 실세계 연결을 돕는 코칭 앱이며, 핵심 데이터는 계정에 안전하게 저장됩니다.'
              : 'SoloSync stores your core score and coaching history so your weekly guidance can stay consistent.'}
          </p>
        </div>
      </section>
    </AppShell>
  );
}
