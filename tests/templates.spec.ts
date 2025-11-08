import { test, expect } from '@playwright/test';

test.describe('Templates generation', () => {
  test('renders AI output after proxy call', async ({ page }) => {
    await page.route('**/api/gemini/text', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ text: 'Mocked bilingual business plan output.' }),
      });
    });

    await page.goto('/');
    await page.click('button[title="Templates"]');

    const firstTemplateCard = page.locator('[data-testid="template-card"]').first();
    await firstTemplateCard.click();

    await page.fill('#userPrompt', 'Test coffee shop in Riyadh');
    await page.click('button:has-text("Generate")');

    await expect(page.getByText('Mocked bilingual business plan output.')).toBeVisible();
  });
});
