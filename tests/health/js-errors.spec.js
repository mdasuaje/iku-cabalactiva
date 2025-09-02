import { test, expect } from '@playwright/test';

test.describe('JavaScript Error Detection', () => {
  test('No JavaScript errors on page load', async ({ page }) => {
    const errors = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Non-Error promise rejection captured') &&
      !error.includes('ResizeObserver loop limit exceeded')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('All assets load successfully', async ({ page }) => {
    const failedRequests = [];
    
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(failedRequests).toHaveLength(0);
  });

  test('No 404 errors', async ({ page }) => {
    const responses = [];
    
    page.on('response', (response) => {
      if (response.status() >= 400) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(responses).toHaveLength(0);
  });
});