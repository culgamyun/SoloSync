import { defineConfig, devices } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT ?? '3100';
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();
const baseURL = externalBaseUrl || `http://127.0.0.1:${port}`;
const shouldUseQaBypass = process.env.PLAYWRIGHT_QA_BYPASS !== 'false';
const qaStorageStatePath = 'test-results/.auth/qa-bypass.json';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  globalSetup: require.resolve('./tests/e2e/global.setup.ts'),
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...(shouldUseQaBypass ? { storageState: qaStorageStatePath } : {})
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
        env: {
          NEXT_TELEMETRY_DISABLED: '1',
          SOLOSYNC_QA_AUTH_BYPASS: shouldUseQaBypass ? 'true' : 'false'
        },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: `http://127.0.0.1:${port}/api/health`
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
