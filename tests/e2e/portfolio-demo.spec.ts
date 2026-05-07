import { expect, test } from '@playwright/test';

test.describe('portfolio demo flow', () => {
  test('lets a reviewer adjust a micro-mission, submit a reflection, and reach progress', async ({ page }) => {
    await page.goto('/ko/home');
    await page.locator('a[href$="/challenges/challenge-1"]').first().click();
    await expect(page).toHaveURL(/\/ko\/challenges\/challenge-1$/);

    const saferLineRequest = page.locator('input[name="requestType"][value="safer_line"]');
    const saferLineForm = page.locator('form').filter({ has: saferLineRequest });
    await saferLineForm.getByRole('button').click();
    await expect(page).toHaveURL(/adjusted=safer_line/);

    await page.locator('a[href$="/challenges/challenge-1/reflect"]').click();
    await expect(page.locator('input[name="outcome"]')).toHaveCount(3);

    await page.getByText('눈 마주치고 인사했어요').click();
    await page.locator('textarea[name="reflectionText"]').fill('작게 인사했고, 다음에도 같은 장소에서 다시 시도해볼 수 있겠다.');
    await page.getByRole('button', { name: /회고 저장|Save reflection/ }).click();

    await expect(page).toHaveURL(/\/ko\/progress$/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('keeps repeated reflection submission safe in demo mode', async ({ page }) => {
    async function submitReflectionAgain() {
      await page.goto('/ko/challenges/challenge-1/reflect');
      await page.getByText('한마디까지 건넸어요').click();
      await page.locator('textarea[name="reflectionText"]').fill('같은 회고를 다시 보내도 데모 흐름은 깨지지 않아야 한다.');
      await page.getByRole('button', { name: /회고 저장|Save reflection/ }).click();
      await expect(page).toHaveURL(/\/ko\/progress$/);
    }

    await submitReflectionAgain();
    await submitReflectionAgain();
  });
});
