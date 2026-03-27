import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';

const sections = {
  ko: [
    {
      title: '어떤 정보를 수집하나요?',
      body: 'SoloSync는 계정 정보, 온보딩 답변, 점수 기록, 챌린지 상태, 반추 텍스트, 코칭 대화를 저장해 개인화된 제안을 제공합니다.'
    },
    {
      title: '어떻게 사용하나요?',
      body: '수집된 데이터는 주간 챌린지 생성, 점수 계산, 코치 응답 품질 개선에만 사용됩니다.'
    },
    {
      title: '언제 삭제할 수 있나요?',
      body: '계정 삭제나 별도 요청이 있으면 관련 데이터 삭제 절차를 진행할 수 있습니다.'
    }
  ],
  en: [
    {
      title: 'What do we collect?',
      body: 'SoloSync stores account details, onboarding answers, score history, challenge state, reflections and coaching messages to personalize weekly guidance.'
    },
    {
      title: 'How is it used?',
      body: 'The data is used to generate weekly challenges, calculate score updates and keep coach responses consistent.'
    },
    {
      title: 'When can it be deleted?',
      body: 'You can request data removal as part of account deletion or through a support request.'
    }
  ]
} as const;

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language = locale === 'en' ? 'en' : 'ko';

  return (
    <AppShell padded={false} tabBarInset={false} header={<MobileHeader title={language === 'ko' ? '개인정보처리방침' : 'Privacy policy'} backHref='/settings' centered />}>
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
