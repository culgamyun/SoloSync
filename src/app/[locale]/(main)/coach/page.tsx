import { MoreVertical } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { ChatPanel } from '@/components/coach/chat-panel';
import { MobileHeader } from '@/components/common/mobile-header';
import { getCoachSnapshot } from '@/lib/server/app-data';

export default async function CoachPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getCoachSnapshot();

  return (
    <AppShell
      padded={false}
      tabBarInset={false}
      header={
        <MobileHeader
          title={locale === 'ko' ? '코치' : 'Coach'}
          subtitle={locale === 'ko' ? '실행 중심 세션' : 'Action-oriented session'}
          centered
          trailing={<MoreVertical className='h-4 w-4 text-primary' />}
        />
      }
    >
      <ChatPanel initialMessages={snapshot.messages} locale={locale} sessionType='coaching' />
    </AppShell>
  );
}
