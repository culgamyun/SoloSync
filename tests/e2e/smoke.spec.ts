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

test.describe('weekly micro-mission', () => {
  test('renders Korean mission detail copy', async ({ page }) => {
    await page.goto('/ko/challenges/challenge-1');

    await expect(page.getByText('이번 주 작은 접촉')).toBeVisible();
    await expect(page.getByText('눈 마주치고 인사만 해도 성공')).toBeVisible();
    await expect(page.getByText('안녕하세요. 오늘도 늦게까지 하시네요.')).toBeVisible();
  });

  test('renders a non-shaming reflection outcome', async ({ page }) => {
    await page.goto('/ko/challenges/challenge-1/reflect');

    await expect(page.getByText('어디까지 해냈나요?')).toBeVisible();
    await expect(page.getByText('오늘은 못 했어요')).toBeVisible();
    await expect(page.getByText('멈춘 지점을 알게 된 것도 다음 시도의 재료입니다.')).toBeVisible();
  });
});
