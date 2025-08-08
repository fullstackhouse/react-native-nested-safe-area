import { test, expect } from '@playwright/test';

test('nested safe area example works on web', async ({ page }) => {
  // Navigate to the example app
  await page.goto('/');

  // Wait for the app to load
  await page.waitForTimeout(3000);

  // Check that the section titles are visible
  await expect(page.locator('text=Header Section')).toBeVisible();
  await expect(page.locator('text=Footer Section')).toBeVisible();

  // Check that nested sections are visible
  await expect(page.locator('text=Nested Section')).toBeVisible();
  await expect(page.locator('text=Triple Nested').first()).toBeVisible();

  // Check that inset displays are working
  await expect(page.locator('text=Root Level')).toBeVisible();
  await expect(page.locator('text=Inside Header')).toBeVisible();
  await expect(page.locator('text=Deeply Nested')).toBeVisible();
  await expect(page.locator('text=Inside Footer')).toBeVisible();

  // Verify that inset values are being displayed (they contain numbers)
  const insetTexts = page.locator(
    'text=/Top: \\d+, Right: \\d+, Bottom: \\d+, Left: \\d+/'
  );
  await expect(insetTexts.first()).toBeVisible();

  // Take a screenshot to verify the layout
  await page.screenshot({
    path: 'test-results/nested-safe-area-layout.png',
    fullPage: true,
  });
});
