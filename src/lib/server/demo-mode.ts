import { cookies } from 'next/headers';

import { isQaAuthBypassEnabled, QA_AUTH_BYPASS_COOKIE, shouldUseDemoData } from '@/lib/env';

export async function shouldUseDemoDataForRequest() {
  if (shouldUseDemoData()) {
    return true;
  }

  if (!isQaAuthBypassEnabled()) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(QA_AUTH_BYPASS_COOKIE)?.value === '1';
}
