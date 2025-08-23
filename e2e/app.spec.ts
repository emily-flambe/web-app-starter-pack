import { test, expect } from '@playwright/test';

test.describe('App E2E Tests', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Web App/);
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/');
    
    // Check the main heading is visible
    const heading = page.getByRole('heading', { name: /Web App Starter Pack/i });
    await expect(heading).toBeVisible();
  });

  test('has working links', async ({ page }) => {
    await page.goto('/');
    
    // Check React link
    const reactLink = page.getByRole('link', { name: /Learn React/i });
    await expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    await expect(reactLink).toHaveAttribute('target', '_blank');
    
    // Check Tailwind link
    const tailwindLink = page.getByRole('link', { name: /Learn Tailwind/i });
    await expect(tailwindLink).toHaveAttribute('href', 'https://tailwindcss.com');
    await expect(tailwindLink).toHaveAttribute('target', '_blank');
  });

  test('responsive design works', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('.container')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();
  });

  test('dark mode styles are present', async ({ page }) => {
    await page.goto('/');
    
    // Check that dark mode classes exist in the DOM
    const darkModeElement = page.locator('.dark\\:bg-gray-900');
    const count = await darkModeElement.count();
    expect(count).toBeGreaterThan(0);
  });
});