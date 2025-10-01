import { test, expect } from '@playwright/test';

test.describe('Basic Functionality', () => {
  test('Page loads and basic elements are present', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page has title
    await expect(page).toHaveTitle(/IKU/);
    
    // Check if basic sections exist by ID (more reliable than data-testid)
    await expect(page.locator('#hero')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#herramientas')).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
  });

  test('Navigation elements are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if header navigation exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if IKU logo is visible
    await expect(header.getByText('IKU')).toBeVisible();
  });

  test('WhatsApp float button is present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if WhatsApp float button exists (might take time to appear)
    const whatsappFloat = page.locator('[data-testid="whatsapp-float"]');
    await expect(whatsappFloat).toBeVisible({ timeout: 10000 });
  });

  test('Pricing cards are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to pricing section
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    
    // Check if pricing cards exist
    const pricingCards = page.locator('[data-testid="pricing-card"]');
    await expect(pricingCards).toHaveCount(4, { timeout: 10000 });
  });
});