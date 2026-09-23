import { expect, test } from '@playwright/test';

test('shows the application shell', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Zaplanuj tydzień po swojemu' }),
  ).toBeVisible();
  await expect(page).toHaveTitle('Organizer tygodnia');
});
