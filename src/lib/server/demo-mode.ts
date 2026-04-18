import { cookies } from 'next/headers';

import { QA_AUTH_BYPASS_COOKIE, shouldUseDemoData } from '@/lib/env';

export async function shouldUseDemoDataForRequest() {
  if (shouldUseDemoData()) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(QA_AUTH_BYPASS_COOKIE)?.value === '1';
}
