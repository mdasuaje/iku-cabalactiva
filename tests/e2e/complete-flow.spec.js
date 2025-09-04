import { test, expect } from '@playwright/test';

test.describe('IKU Cábala Activa - Flujo Completo E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar interceptores para APIs externas
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
  });

  test('Carga inicial y elementos críticos', async ({ page }) => {
    await page.goto('/');
    
    // Verificar carga de la página
    await expect(page).toHaveTitle(/IKU Cábala Activa/);
    
    // Verificar elementos críticos del header
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Verificar hero section
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.getByText('Isaac Benzaquén')).toBeVisible();
    
    // Verificar que no hay errores de JavaScript
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test('Navegación y secciones principales', async ({ page }) => {
    await page.goto('/');
    
    // Verificar todas las secciones principales
    const sections = [
      'hero-section',
      'herramientas-section', 
      'about-maestro-section',
      'testimonios-section',
      'pricing-section',
      'contact-section'
    ];
    
    for (const section of sections) {
      await expect(page.locator(`[data-testid="${section}"]`)).toBeVisible();
    }
    
    // Test de scroll suave
    await page.click('a[href="#herramientas"]');
    await page.waitForTimeout(1000);
    
    const herramientasSection = page.locator('[data-testid="herramientas-section"]');
    await expect(herramientasSection).toBeInViewport();
  });

  test('Herramientas espirituales - Interacción completa', async ({ page }) => {
    await page.goto('/');
    
    // Navegar a sección de herramientas
    await page.click('a[href="#herramientas"]');
    
    // Verificar las 4 herramientas principales
    const herramientas = [
      'Carta Astral Cabalística',
      'Constelación Familiar Cabalística', 
      'Limpieza Áurica Cabalística',
      'Meditación Cabalística'
    ];
    
    for (const herramienta of herramientas) {
      await expect(page.getByText(herramienta)).toBeVisible();
    }
    
    // Test de modal de herramienta
    await page.click('[data-testid="herramienta-carta-astral"] button');
    await expect(page.locator('[data-testid="herramienta-modal"]')).toBeVisible();
    
    // Cerrar modal
    await page.click('[data-testid="modal-close"]');
    await expect(page.locator('[data-testid="herramienta-modal"]')).not.toBeVisible();
  });

  test('Formulario de contacto - Validación completa', async ({ page }) => {
    await page.goto('/');
    
    // Navegar a sección de contacto
    await page.click('a[href="#contact"]');
    
    // Verificar formulario
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
    
    // Test de validación - campos vacíos
    await page.click('[data-testid="submit-button"]');
    await expect(page.getByText('requerido')).toBeVisible();
    
    // Llenar formulario con datos válidos
    await page.fill('[data-testid="name-input"]', 'Juan Pérez');
    await page.fill('[data-testid="email-input"]', 'juan@example.com');
    await page.fill('[data-testid="phone-input"]', '+1234567890');
    await page.fill('[data-testid="message-input"]', 'Interesado en consulta cabalística');
    
    // Enviar formulario
    await page.click('[data-testid="submit-button"]');
    
    // Verificar mensaje de éxito
    await expect(page.getByText('Mensaje enviado')).toBeVisible({ timeout: 10000 });
  });

  test('WhatsApp integration', async ({ page }) => {
    await page.goto('/');
    
    // Verificar botón flotante de WhatsApp
    await expect(page.locator('[data-testid="whatsapp-float"]')).toBeVisible();
    
    // Test de click en WhatsApp (sin abrir realmente)
    const whatsappButton = page.locator('[data-testid="whatsapp-float"]');
    await expect(whatsappButton).toHaveAttribute('href', /whatsapp.com/);
  });

  test('Pricing y CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Navegar a pricing
    await page.click('a[href="#pricing"]');
    
    // Verificar cards de pricing
    const pricingCards = page.locator('[data-testid="pricing-card"]');
    await expect(pricingCards).toHaveCount(4);
    
    // Verificar precios
    await expect(page.getByText('$67')).toBeVisible();
    await expect(page.getByText('$97')).toBeVisible(); 
    await expect(page.getByText('$150')).toBeVisible();
    
    // Test de botones CTA
    const ctaButtons = page.locator('[data-testid="cta-button"]');
    await expect(ctaButtons.first()).toBeVisible();
  });

  test('Responsive design - Mobile', async ({ page }) => {
    // Simular dispositivo móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verificar que el menú móvil funciona
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
    
    // Verificar que las secciones se adaptan correctamente
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="herramientas-section"]')).toBeVisible();
  });

  test('Performance y carga de recursos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Verificar tiempo de carga inicial
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Menos de 5 segundos
    
    // Verificar que las imágenes cargan
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('src', /.+/);
    }
    
    // Verificar que no hay recursos 404
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push(response.url());
      }
    });
    
    await page.waitForTimeout(3000);
    expect(failedRequests).toHaveLength(0);
  });

  test('SEO y meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Verificar meta tags esenciales
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    
    // Verificar structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toBeAttached();
  });

  test('Accessibility básica', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que los elementos interactivos son accesibles por teclado
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Verificar alt text en imágenes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt', /.*/);
    }
  });

  test('Error handling', async ({ page }) => {
    // Test de página 404 (si existe)
    const response = await page.goto('/pagina-inexistente');
    expect(response?.status()).toBe(404);
    
    // Test de error boundary
    await page.goto('/');
    
    // Simular error de JavaScript
    await page.evaluate(() => {
      window.dispatchEvent(new Error('Test error'));
    });
    
    // La página debería seguir funcionando
    await expect(page.locator('body')).toBeVisible();
  });
});