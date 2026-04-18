import { redirect } from 'next/navigation';

import { getEntryDestination } from '@/lib/server/app-data';

export default async function LocaleIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect((await getEntryDestination(locale)) as never);
}
