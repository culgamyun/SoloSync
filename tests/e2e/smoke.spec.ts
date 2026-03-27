import { expect, test } from '@playwright/test';

const routes = [
  '/ko/welcome',
  '/ko/login',
  '/ko/onboarding/step/1',
  '/ko/onboarding/result',
  '/ko/home',
  '/ko/challenges',
  '/ko/challenges/challenge-1',
  '/ko/challenges/challenge-1/reflect',
  '/ko/coach',
  '/ko/progress',
  '/ko/settings',
  '/ko/settings/profile',
  '/ko/settings/language',
  '/ko/settings/notifications',
  '/ko/legal/privacy',
  '/ko/legal/terms'
];

test.describe('smoke routes', () => {
  for (const route of routes) {
    test(`renders ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }
});
