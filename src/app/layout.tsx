import type { ReactNode } from 'react';

import './globals.css';

import { publicEnv } from '@/lib/env';

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale ?? publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
