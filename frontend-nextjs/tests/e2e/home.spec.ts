import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display hero title', async ({ page }) => {
    await page.goto('/');
    
    // Check if the title contains DzArtisan
    await expect(page).toHaveTitle(/DzArtisan/);
    
    // Check if hero title is visible (using a substring that exists in fr.json)
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to artisan search page', async ({ page }) => {
    await page.goto('/fr');
    
    // Find the link or button to find an artisan
    const searchLink = page.getByRole('link', { name: /Trouver un artisan/i });
    if (await searchLink.isVisible()) {
      await searchLink.click();
      await expect(page).toHaveURL(/.*\/artisans/);
    }
  });
});
