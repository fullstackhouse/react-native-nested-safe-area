import { test, expect } from '@playwright/test';

test('nested safe area example works on web', async ({ page }) => {
  // Navigate to the example app
  await page.goto('/');

  // Wait for the app to load
  await page.waitForTimeout(2000);

  // Check that the outer safe area text is visible
  await expect(page.locator('text=Outer Safe Area')).toBeVisible();

  // Check that the inner safe area text is visible
  await expect(page.locator('text=Inner Safe Area (top only)')).toBeVisible();

  // Check that the innermost safe area text is visible
  await expect(
    page.locator('text=Innermost Safe Area (bottom only)')
  ).toBeVisible();

  // Take a screenshot to verify the layout
  await page.screenshot({
    path: 'test-results/nested-safe-area-layout.png',
    fullPage: true,
  });
});
