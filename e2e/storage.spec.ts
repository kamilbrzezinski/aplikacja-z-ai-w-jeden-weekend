import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'organizer-tygodnia:v1';

test('starts empty with corrupted storage and saves the next valid change', async ({
  page,
}) => {
  const pageErrors: Error[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error);
  });
  await page.addInitScript(
    ({ key, marker, value }) => {
      if (window.sessionStorage.getItem(marker)) {
        return;
      }

      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem(marker, 'true');
    },
    {
      key: STORAGE_KEY,
      marker: 'storage-corrupted-for-test',
      value: '{"schemaVersion":1,"tasks":',
    },
  );

  await page.goto('/');

  await expect(page.getByLabel('Liczba zadań: 0')).toBeVisible();
  await expect(
    page.getByText('Tu pojawią się zadania, które czekają na zaplanowanie.'),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);

  await page
    .getByRole('button', { name: 'Dodaj zadanie', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'Nazwa' })
    .fill('Zadanie po bezpiecznym starcie');
  await page.getByRole('button', { name: 'Dodaj zadanie' }).click();
  await expect(page.getByText('Zadanie po bezpiecznym starcie')).toBeVisible();

  await page.reload();

  await expect(page.getByText('Zadanie po bezpiecznym starcie')).toBeVisible();
  await expect(page.getByLabel('Liczba zadań: 1')).toBeVisible();
  expect(pageErrors).toEqual([]);
});
