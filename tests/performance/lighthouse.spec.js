import { test, expect } from '@playwright/test';

test.describe('Performance & Accessibility Tests', () => {
  test('Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // LCP should be under 2.5s
  });

  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Page should load in under 3s
  });

  test('Accessibility checks', async ({ page }) => {
    await page.goto('/');
    
    // Check for alt attributes on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Check for form labels
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(label).toBeGreaterThan(0);
      }
    }
  });
});