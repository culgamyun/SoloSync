import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { request } from '@playwright/test';

const qaStorageStatePath = path.join(process.cwd(), 'test-results', '.auth', 'qa-bypass.json');

export default async function globalSetup() {
  if (process.env.PLAYWRIGHT_QA_BYPASS === 'false') {
    return;
  }

  const port = process.env.PLAYWRIGHT_PORT ?? '3100';
  const baseURL = process.env.PLAYWRIGHT_BASE_URL?.trim() || `http://127.0.0.1:${port}`;
  const requestContext = await request.newContext({ baseURL });

  try {
    const response = await requestContext.get('/api/qa/auth-bypass?next=/ko/home');

    if (!response.ok()) {
      throw new Error(
        `QA auth bypass request failed with ${response.status()} for ${baseURL}. ` +
          'Make sure SOLOSYNC_QA_AUTH_BYPASS=true is enabled in the target environment and that the target is not production.'
      );
    }

    await mkdir(path.dirname(qaStorageStatePath), { recursive: true });
    await requestContext.storageState({ path: qaStorageStatePath });
  } finally {
    await requestContext.dispose();
  }
}
