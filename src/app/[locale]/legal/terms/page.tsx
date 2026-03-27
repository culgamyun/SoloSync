import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';

const sections = {
  ko: [
    {
      title: '서비스 성격',
      body: 'SoloSync는 의료 서비스가 아니며, 실세계 사회적 연결을 돕는 코칭 도구입니다.'
    },
    {
      title: '사용자 책임',
      body: '실제 만남과 대화의 진행 여부는 사용자의 판단에 따르며, 앱은 제안과 기록 도구 역할을 합니다.'
    },
    {
      title: '알림과 커뮤니케이션',
      body: '활성화된 푸시 구독에 한해 주간 챌린지와 체크인 알림을 보낼 수 있습니다.'
    }
  ],
  en: [
    {
      title: 'Service nature',
      body: 'SoloSync is not a medical service. It is a coaching tool designed to support real-world social connection.'
    },
    {
      title: 'User responsibility',
      body: 'The decision to follow through on real conversations and meetups remains with the user.'
    },
    {
      title: 'Notifications',
      body: 'Weekly challenge and check-in reminders are only sent to active push subscriptions.'
    }
  ]
} as const;

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language = locale === 'en' ? 'en' : 'ko';

  return (
    <AppShell padded={false} tabBarInset={false} header={<MobileHeader title={language === 'ko' ? '이용약관' : 'Terms of service'} backHref='/settings' centered />}>
      <div className='space-y-5 px-5 pb-10 pt-6'>
        {sections[language].map((section) => (
          <section key={section.title} className='rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
            <h2 className='font-display text-[1.25rem] font-bold'>{section.title}</h2>
            <p className='mt-3 text-[15px] leading-7 text-muted-foreground'>{section.body}</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
