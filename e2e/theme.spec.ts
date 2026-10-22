import { expect, test } from '@playwright/test';

const THEME_STORAGE_KEY = 'organizer-tygodnia:theme';

test('follows the system theme and keeps a chosen theme after reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  const root = page.locator('html');
  const trigger = page.getByRole('button', { name: /^Motyw:/ });

  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(trigger).toHaveAccessibleName('Motyw: Automatyczny');

  await page.emulateMedia({ colorScheme: 'light' });
  await expect(root).toHaveAttribute('data-theme', 'light');

  await trigger.click();
  await page.getByRole('menuitemradio', { name: /Ciemny/ }).click();

  await expect(root).toHaveAttribute('data-theme', 'dark');
  expect(
    await page.evaluate(
      (key) => window.localStorage.getItem(key),
      THEME_STORAGE_KEY,
    ),
  ).toBe('dark');
  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );

  await page.reload();

  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(trigger).toHaveAccessibleName('Motyw: Ciemny');
  expect(
    await page.evaluate(() => getComputedStyle(document.body).backgroundColor),
  ).toBe(background);
  expect(background).toBe('rgb(18, 21, 26)');
});
