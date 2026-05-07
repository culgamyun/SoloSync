import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { TabBar } from '@/components/common/tab-bar';
import { MotionPageTransition } from '@/components/motion/page-transition';
import { getViewer } from '@/lib/server/app-data';

export default async function MainLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/${locale}/login`);
  }

  if (!viewer.onboardingCompleted) {
    redirect(`/${locale}/onboarding/step/1`);
  }

  return (
    <>
      <MotionPageTransition>{children}</MotionPageTransition>
      <TabBar />
    </>
  );
}
