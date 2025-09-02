import { test, expect } from '@playwright/test';

test.describe('Critical User Flow', () => {
  test('Homepage loads and navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Verify page loads
    await expect(page).toHaveTitle(/IKU.*Cábala Activa/);
    
    // Check logo IKU is present
    await expect(page.locator('text=IKU')).toBeVisible();
    
    // Test navigation
    const sections = ['herramientas', 'maestro', 'pricing', 'testimonios', 'contact'];
    
    for (const section of sections) {
      await page.click(`text=${section.charAt(0).toUpperCase() + section.slice(1)}`);
      await expect(page.locator(`#${section}`)).toBeInViewport();
    }
  });

  test('Contact modal functionality', async ({ page }) => {
    await page.goto('/');
    
    // Click floating contact button
    await page.click('[data-testid="contact-float"], .fixed button');
    
    // Verify modal opens
    await expect(page.locator('text=Contacto')).toBeVisible();
    
    // Fill form
    await page.fill('input[name="nombre"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="telefono"]', '+1234567890');
    await page.fill('textarea[name="mensaje"]', 'Test message');
    
    // Submit form (should not actually send in test)
    await page.click('button[type="submit"]');
  });

  test('Maestro YouTube link works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to maestro section
    await page.click('text=Maestro');
    
    // Click "Conecta con la Sabiduría" button
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('text=Conecta con la Sabiduría')
    ]);
    
    // Verify YouTube URL
    expect(newPage.url()).toContain('youtu.be/xHOmoj-4MQo');
  });

  test('Pricing section displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to pricing
    await page.click('text=Precios');
    
    // Verify pricing section is visible
    await expect(page.locator('#pricing')).toBeInViewport();
    await expect(page.locator('text=Planes y')).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu
    await page.click('button[class*="lg:hidden"]');
    await expect(page.locator('text=Inicio')).toBeVisible();
    
    // Test mobile navigation
    await page.click('text=Herramientas');
    await expect(page.locator('#herramientas')).toBeInViewport();
  });
});