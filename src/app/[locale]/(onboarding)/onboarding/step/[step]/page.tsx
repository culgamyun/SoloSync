import { redirect } from 'next/navigation';

import { AppShell } from '@/components/common/app-shell';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { getViewer } from '@/lib/server/app-data';

export default async function OnboardingStepPage({
  params
}: {
  params: Promise<{ locale: string; step: string }>;
}) {
  const { locale, step } = await params;
  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/${locale}/login`);
  }

  const numericStep = Number(step);
  if (Number.isNaN(numericStep) || numericStep < 1 || numericStep > 4) {
    redirect(`/${locale}/onboarding/step/1`);
  }

  return (
    <AppShell padded={false} tabBarInset={false}>
      <OnboardingFlow step={numericStep} locale={locale} />
    </AppShell>
  );
}
