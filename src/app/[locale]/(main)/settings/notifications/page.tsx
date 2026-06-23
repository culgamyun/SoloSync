import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { PushPermissionCard } from '@/components/settings/push-permission-card';

export default async function NotificationSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <AppShell padded={false} header={<MobileHeader title={locale === 'ko' ? '알림' : 'Notifications'} backHref='/settings' centered />}>
      <div className='bg-[#fbf6ed] px-5 pb-10 pt-6'>
        <div className='rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'>
          <h2 className='font-display text-[1.3rem] font-bold text-[#22251f]'>
            {locale === 'ko' ? '알림 리듬' : 'Notification rhythm'}
          </h2>
          <p className='mt-2 text-sm leading-6 text-[#777268]'>
            {locale === 'ko'
              ? '주간 챌린지 생성과 체크인 시점에 맞춰 푸시를 보냅니다.'
              : 'Push nudges arrive when weekly challenges and check-ins are ready.'}
          </p>
        </div>
        <div className='mt-5'>
          <PushPermissionCard />
        </div>
      </div>
    </AppShell>
  );
}
