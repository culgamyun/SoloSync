import { redirect } from 'next/navigation';

import { publicEnv } from '@/lib/env';

export default function RootPage() {
  redirect(`/${publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE}`);
}
