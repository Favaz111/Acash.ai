import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Home Page
 * اختبارات شاملة للصفحة الرئيسية
 */

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/ar');

    // Check page title
    await expect(page).toHaveTitle(/Acash\.ai/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('خطط لمستقبلك المالي');
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/ar');

    // Check main navigation links exist
    await expect(page.getByRole('link', { name: /الرئيسية/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /الأسعار/ })).toBeVisible();
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/ar');

    // Click language switcher
    const languageSwitcher = page.getByRole('button', { name: /العربية/ });
    await languageSwitcher.click();

    // Select English
    await page.getByRole('menuitem', { name: /English/ }).click();

    // Verify URL changed
    await expect(page).toHaveURL(/\/en/);

    // Verify content changed to English
    await expect(page.locator('h1')).toContainText('Plan Your Financial Future');
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/ar');

    // Click pricing link
    await page
      .getByRole('link', { name: /الأسعار/ })
      .first()
      .click();

    // Verify navigation
    await expect(page).toHaveURL(/\/ar\/pricing/);
    await expect(page.locator('h1')).toContainText('اختر الباقة');
  });

  test('should navigate to registration', async ({ page }) => {
    await page.goto('/ar');

    // Click "Start Free" button
    await page
      .getByRole('link', { name: /ابدأ مجاناً/ })
      .first()
      .click();

    // Verify navigation to registration
    await expect(page).toHaveURL(/\/ar\/auth\/register/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ar');

    // Page should still load
    await expect(page.locator('h1')).toBeVisible();

    // Mobile menu should be accessible (if implemented)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/ar');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/ar');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // No critical errors should be present
    expect(errors.filter((e) => !e.includes('favicon'))).toHaveLength(0);
  });
});
