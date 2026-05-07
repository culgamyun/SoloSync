import { ShieldCheck } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { BrandLogo } from '@/components/common/brand-logo';
import { OauthButtons } from '@/components/common/oauth-buttons';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <AppShell padded={false} tabBarInset={false}>
      <section className='flex min-h-screen flex-col px-6 pb-10 pt-10'>
        <div className='flex justify-center'>
          <BrandLogo priority className='w-[220px]' />
        </div>
        <div className='mt-10 text-center'>
          <h1 className='mx-auto max-w-[18rem] break-keep font-display text-[2.45rem] font-bold leading-[1.08] tracking-normal'>
            {locale === 'ko' ? '관계 루틴 시작하기' : 'Start your weekly relationship routine'}
          </h1>
          <p className='mx-auto mt-5 max-w-[21rem] break-keep text-[15px] leading-7 text-muted-foreground'>
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
