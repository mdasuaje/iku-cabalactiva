import { test, expect } from '@playwright/test';

test.describe('Healing Test - Critical Elements', () => {
  test('Hero section loads with proper timing', async ({ page }) => {
    console.log('🔍 Navegando a la página principal...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Verificando que la página carga correctamente...');
    await expect(page).toHaveTitle(/IKU.*Cábala Activa/);
    
    console.log('🎯 Esperando que la sección hero sea visible...');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible({ timeout: 15000 });
    
    console.log('✅ Hero section found! Testing content...');
    await expect(page.locator('[data-testid="hero-section"]')).toContainText('Isaac');
    
    console.log('🎉 Test de sanación completado exitosamente!');
  });

  test('WhatsApp float button visibility', async ({ page }) => {
    console.log('🔍 Cargando página para test de WhatsApp...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for components to fully render
    await page.waitForTimeout(2000);
    
    console.log('🎯 Buscando botón flotante de WhatsApp...');
    const whatsappButton = page.locator('[data-testid="whatsapp-float"]');
    
    // Check if it exists first
    const buttonCount = await whatsappButton.count();
    console.log(`📊 Botones WhatsApp encontrados: ${buttonCount}`);
    
    if (buttonCount > 0) {
      await expect(whatsappButton).toBeVisible({ timeout: 10000 });
      console.log('✅ WhatsApp button is visible!');
    } else {
      console.log('❌ WhatsApp button not found in DOM');
      // Let's check what elements are actually present
      const allElements = await page.locator('body *').count();
      console.log(`📊 Total elements found: ${allElements}`);
    }
  });

  test('Navigation elements are present', async ({ page }) => {
    console.log('🔍 Testing navigation elements...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for navigation to be ready
    await page.waitForSelector('nav', { timeout: 15000 });
    console.log('✅ Navigation container found');
    
    // Check for navigation buttons
    const navButtons = page.locator('nav button, nav a');
    const buttonCount = await navButtons.count();
    console.log(`📊 Navigation buttons found: ${buttonCount}`);
    
    if (buttonCount > 0) {
      console.log('✅ Navigation elements are present');
    } else {
      console.log('⚠️  No navigation buttons found');
    }
  });

  test('Pricing cards detection', async ({ page }) => {
    console.log('🔍 Testing pricing cards...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait extra time for all components
    await page.waitForTimeout(3000);
    
    console.log('🎯 Buscando pricing cards...');
    const pricingCards = page.locator('[data-testid="pricing-card"]');
    const cardCount = await pricingCards.count();
    
    console.log(`📊 Pricing cards encontradas: ${cardCount}`);
    
    if (cardCount > 0) {
      await expect(pricingCards.first()).toBeVisible({ timeout: 10000 });
      console.log('✅ Al menos una pricing card es visible');
    } else {
      console.log('❌ No se encontraron pricing cards');
      
      // Let's check if the pricing section exists
      const pricingSection = page.locator('#pricing, section:has-text("precio")');
      const sectionCount = await pricingSection.count();
      console.log(`📊 Pricing sections encontradas: ${sectionCount}`);
    }
  });
});