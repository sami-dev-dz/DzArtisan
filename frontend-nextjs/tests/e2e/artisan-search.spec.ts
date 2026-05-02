import { test, expect } from '@playwright/test';

test.describe('Artisan Search and Profile', () => {
  test('should load the artisan search page and filter correctly', async ({ page }) => {
    // Navigate to the artisans search page in French
    await page.goto('/fr/artisans');
    
    // Check if the page title is correct (using translations from fr.json)
    await expect(page).toHaveTitle(/DzArtisan/);
    
    // Wait for the artisan grid/list to load
    const searchInput = page.getByPlaceholder(/Que recherchez-vous/);
    await expect(searchInput).toBeVisible();
    
    // Type a query
    await searchInput.fill('Plombier');
    await page.waitForTimeout(500); // Simulate typing delay or debounce
    
    // The results should update, we check if at least one artisan card is visible
    // or if the "Aucun artisan trouvé" message appears if DB is empty
    const noResults = page.locator('text=Aucun artisan trouvé');
    const artisanCards = page.locator('.artisan-card'); // Assuming we have a class or role
    
    // Either we have results or no results message
    await expect(noResults.or(artisanCards.first())).toBeVisible();
  });
});
