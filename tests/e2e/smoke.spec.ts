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

    const smallerRequest = page.locator('input[name="requestType"][value="smaller"]');
    const smallerForm = page.locator('form').filter({ has: smallerRequest });
    await expect(smallerRequest).toHaveCount(1);
    await smallerForm.getByRole('button').click();

    await expect(page).toHaveURL(/adjusted=smaller/);
  });
});

test.describe('profile personalization', () => {
  test('renders routine space and social fear chips', async ({ page }) => {
    await page.goto('/ko/settings/profile');

    await expect(page.locator('input[name="routineSpaces"]')).toHaveCount(5);
    await expect(page.locator('input[name="socialFears"]')).toHaveCount(5);
  });
});

test.describe('recovery check-in', () => {
  test('renders recovery messaging on the home screen in demo mode', async ({ page }) => {
    await page.goto('/ko/home');

    await expect(page.getByText('회복 체크인')).toBeVisible();
    await expect(page.getByText('주간 복구 체크인')).toBeVisible();
    await expect(page.getByRole('link', { name: '이번 주 미션 보기' })).toBeVisible();
  });
});
