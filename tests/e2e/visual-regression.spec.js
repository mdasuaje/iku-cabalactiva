import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('Homepage visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('Header component visual', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Header screenshot
    await expect(page.locator('header')).toHaveScreenshot('header.png');
  });

  test('Hero section visual', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Hero section screenshot
    await expect(page.locator('#hero')).toHaveScreenshot('hero-section.png');
  });

  test('Pricing section visual', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Precios');
    await page.waitForLoadState('networkidle');
    
    // Pricing section screenshot
    await expect(page.locator('#pricing')).toHaveScreenshot('pricing-section.png');
  });

  test('Contact modal visual', async ({ page }) => {
    await page.goto('/');
    await page.click('.fixed button');
    await page.waitForSelector('text=Contacto');
    
    // Modal screenshot
    await expect(page.locator('[role="dialog"], .fixed.inset-0')).toHaveScreenshot('contact-modal.png');
  });

  test('Mobile view visual', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Mobile screenshot
    await expect(page).toHaveScreenshot('mobile-view.png', {
      fullPage: true
    });
  });
});