import { test, expect } from '@playwright/test';

test.describe('Critical User Flow', () => {
  test('Homepage loads and navigation works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    await expect(page).toHaveTitle(/IKU.*Cábala Activa/);
    
    // Check hero section with specific data-testid with extended timeout
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible({ timeout: 10000 });
    
    // Test navigation using more specific selectors - updated to match real sections
    const navigationItems = [
      { text: 'Herramientas', section: 'herramientas' },
      { text: 'Precios', section: 'pricing' },
      { text: 'Testimonios', section: 'testimonios' },
      { text: 'Contacto', section: 'contact' }
    ];
    
    // Check viewport size for mobile handling
    const viewport = page.viewportSize();
    const isMobile = viewport.width < 1024;
    
    for (const item of navigationItems) {
      if (isMobile) {
        // On mobile, need to open hamburger menu for each navigation
        const mobileMenuButton = page.locator('button[class*="lg:hidden"]');
        await expect(mobileMenuButton).toBeVisible({ timeout: 5000 });
        await mobileMenuButton.click();
        await page.waitForTimeout(300);
      }
      
      // Use more specific selector for mobile menu items
      const navButton = isMobile 
        ? page.locator('.lg\\:hidden').locator('button').filter({ hasText: item.text })
        : page.getByRole('navigation').getByText(item.text, { exact: true });
        
      if (await navButton.count() > 0) {
        await expect(navButton).toBeVisible({ timeout: 5000 });
        await navButton.click();
        
        // Wait a moment for scroll
        await page.waitForTimeout(500);
        await expect(page.locator(`#${item.section}`)).toBeInViewport({ timeout: 10000 });
      }
    }
  });

  test('Contact modal functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for WhatsApp float to be visible before clicking
    await expect(page.locator('[data-testid="whatsapp-float"]')).toBeVisible({ timeout: 10000 });
    await page.click('[data-testid="whatsapp-float"]');
    
    // Verify modal opens with specific role
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    
    // Fill form
    await page.fill('input[name="nombre"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="telefono"]', '+1234567890');
    await page.fill('textarea[name="mensaje"]', 'Test message');
    
    // Submit form (should not actually send in test)
    await page.click('button[type="submit"]');
  });

  test('Hero section displays correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for navigation to be ready
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Check if on mobile (viewport < 1024px for lg breakpoint)
    const viewport = page.viewportSize();
    const isMobile = viewport.width < 1024;
    
    if (isMobile) {
      // On mobile, need to open hamburger menu first
      const mobileMenuButton = page.locator('button[class*="lg:hidden"]');
      await expect(mobileMenuButton).toBeVisible({ timeout: 5000 });
      await mobileMenuButton.click();
      
      // Wait for mobile menu to open
      await page.waitForTimeout(300);
    }
    
    // Navigate to hero section (inicio) using navigation
    const inicioNavButton = isMobile 
      ? page.locator('.lg\\:hidden').locator('button').filter({ hasText: 'Inicio' })
      : page.getByRole('navigation').getByText('Inicio', { exact: true });
    await expect(inicioNavButton).toBeVisible({ timeout: 5000 });
    await inicioNavButton.click();
    
    // Wait for hero section to be in viewport
    await expect(page.locator('[data-testid="hero-section"]')).toBeInViewport({ timeout: 10000 });
    
    // Verify hero section content is visible
    await expect(page.locator('[data-testid="hero-section"]')).toContainText('IKU');
    await expect(page.locator('[data-testid="hero-section"]')).toContainText('Cábala');
  });

  test('Pricing section displays correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for navigation to be ready
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Check if on mobile (viewport < 1024px for lg breakpoint)
    const viewport = page.viewportSize();
    const isMobile = viewport.width < 1024;
    
    if (isMobile) {
      // On mobile, need to open hamburger menu first
      const mobileMenuButton = page.locator('button[class*="lg:hidden"]');
      await expect(mobileMenuButton).toBeVisible({ timeout: 5000 });
      await mobileMenuButton.click();
      
      // Wait for mobile menu to open
      await page.waitForTimeout(300);
    }
    
    // Navigate to pricing using navigation
    const preciosNavButton = isMobile 
      ? page.locator('.lg\\:hidden').locator('button').filter({ hasText: 'Precios' })
      : page.getByRole('navigation').getByText('Precios', { exact: true });
    await expect(preciosNavButton).toBeVisible({ timeout: 5000 });
    await preciosNavButton.click();
    
    // Verify pricing section is visible
    await expect(page.locator('#pricing')).toBeInViewport();
    
    // Check for pricing cards
    const pricingCards = page.locator('[data-testid="pricing-card"]');
    await expect(pricingCards.first()).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu button exists and works
    const mobileMenuButton = page.locator('button[class*="lg:hidden"]');
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      
      // Wait for mobile menu to appear and look for first menu item
      await page.waitForTimeout(500); // Allow animation to complete
      
      // Check if mobile menu items are visible (any of them)
      const menuItems = ['Inicio', 'Herramientas', 'Precios', 'Testimonios', 'Contacto'];
      let menuFound = false;
      
      for (const item of menuItems) {
        const menuItem = page.locator('.lg\\:hidden').getByText(item);
        if (await menuItem.count() > 0 && await menuItem.isVisible()) {
          menuFound = true;
          break;
        }
      }
      
      expect(menuFound).toBe(true);
    } else {
      // If no mobile menu, just check responsiveness by verifying sections exist
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="herramientas-section"]')).toBeVisible();
    }
  });
});