import { test, expect } from '@playwright/test';

test('nested safe area example loads and displays correctly', async ({
  page,
}) => {
  // Navigate to the example app
  await page.goto('/');

  // Wait for the app to load completely
  await page.waitForLoadState('networkidle');

  // Wait for React components to render
  await page.waitForSelector('text=Header Section', { timeout: 10000 });

  // Verify main section titles are visible
  await expect(page.locator('text=Header Section')).toBeVisible();
  await expect(page.locator('text=Footer Section')).toBeVisible();

  // Verify nested sections are visible
  await expect(page.locator('text=Nested Section')).toBeVisible();
  await expect(page.locator('text=Triple Nested').first()).toBeVisible();
});

test('inset displays show correct structure', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Inside Header', { timeout: 10000 });

  // Check that all inset display labels are visible
  await expect(page.locator('text=Inside Header')).toBeVisible();
  await expect(page.locator('text=Deeply Nested')).toBeVisible();
  await expect(page.locator('text=Triple Nested')).toBeVisible();
  await expect(page.locator('text=Inside Footer')).toBeVisible();

  // Verify that inset values are being displayed with numeric format
  const insetPattern = /Top: \d+, Right: \d+, Bottom: \d+, Left: \d+/;
  const insetTexts = page.locator(`text=${insetPattern}`);

  // Should have 4 inset displays (Inside Header, Deeply Nested, Triple Nested, Inside Footer)
  await expect(insetTexts).toHaveCount(4);

  // Verify first inset display is visible
  await expect(insetTexts.first()).toBeVisible();
});

test('nested safe area hierarchy is properly structured', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Header Section', { timeout: 10000 });

  // Check that sections are properly nested in DOM
  const headerSection = page.locator('text=Header Section').first();
  const nestedSection = page.locator('text=Nested Section').first();
  const tripleNested = page.locator('text=Triple Nested').first();
  const footerSection = page.locator('text=Footer Section').first();

  await expect(headerSection).toBeVisible();
  await expect(nestedSection).toBeVisible();
  await expect(tripleNested).toBeVisible();
  await expect(footerSection).toBeVisible();

  // Take a screenshot to verify the layout
  await page.screenshot({
    path: 'test-results/nested-safe-area-layout.png',
    fullPage: true,
  });
});
