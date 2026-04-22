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

  test('renders the reflection flow controls', async ({ page }) => {
    await page.goto('/ko/challenges/challenge-1/reflect');

    await expect(page.locator('input[name="outcome"]')).toHaveCount(3);
    await expect(page.locator('input[name="outcome"][value="could_not_do_it"]')).toBeAttached();
    await expect(page.locator('textarea[name="reflectionText"]')).toBeVisible();
  });

  test('lets the user scale the mission down in demo mode', async ({ page }) => {
    await page.goto('/ko/challenges/challenge-1');

    await expect(page.getByText('너무 크다면')).toBeVisible();
    await expect(page.getByRole('button', { name: '조금 더 작게' })).toBeVisible();
    await page.getByRole('button', { name: '조금 더 작게' }).click();

    await expect(page.getByText('오늘 기준으로 더 작은 버전으로 바꿨어요.')).toBeVisible();
    await expect(page.getByText('눈을 마주치고 고개만 살짝 끄덕여도 성공')).toBeVisible();
  });
});

test.describe('profile personalization', () => {
  test('renders routine space and social fear chips', async ({ page }) => {
    await page.goto('/ko/settings/profile');

    await expect(page.getByText('자주 지나는 생활 공간')).toBeVisible();
    await expect(page.locator('input[name="routineSpaces"]')).toHaveCount(5);
    await expect(page.locator('input[name="socialFears"]')).toHaveCount(5);
    await expect(page.getByText('미용실')).toBeVisible();
    await expect(page.getByText('다음에 또 마주치면 어색할까 봐')).toBeVisible();
  });
});
