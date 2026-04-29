import { expect, test } from '@playwright/test';

test.describe('portfolio accessibility polish', () => {
  test('bottom navigation exposes the current page and keeps touch targets large enough', async ({ page }) => {
    await page.goto('/ko/home');

    const navigation = page.getByRole('navigation', { name: '주요 내비게이션' });
    await expect(navigation).toBeVisible();
    await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1);

    const links = await navigation.getByRole('link').all();
    expect(links).toHaveLength(5);

    for (const link of links) {
      const box = await link.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test('reflection choices are reachable and selectable with the keyboard', async ({ page }) => {
    await page.goto('/ko/challenges/challenge-1/reflect');

    for (let index = 0; index < 24; index += 1) {
      const activeName = await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.name);
      if (activeName === 'outcome') {
        break;
      }

      await page.keyboard.press('Tab');
    }

    await expect(page.locator('input[name="outcome"]').first()).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('input[name="outcome"]').first()).toBeChecked();
  });
});
