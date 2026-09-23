import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows the add form above the empty backlog', async ({ page }) => {
  const addHeading = page.getByRole('heading', { name: 'Dodaj zadanie' });
  const backlogHeading = page.getByRole('heading', {
    name: 'Do zaplanowania',
  });
  const duration = page.getByRole('spinbutton', { name: 'Czas (minuty)' });

  await expect(
    page.getByRole('heading', { name: 'Zacznij od zadań' }),
  ).toBeVisible();
  await expect(addHeading).toBeVisible();
  await expect(backlogHeading).toBeVisible();
  await expect(duration).toHaveValue('30');
  await expect(duration).toHaveAttribute('min', '15');
  await expect(duration).toHaveAttribute('step', '15');
  await expect(
    page.getByText('Nie masz jeszcze zadań. Dodaj pierwsze powyżej.'),
  ).toBeVisible();
  expect(
    await addHeading.evaluate((element) => {
      const backlog = document.querySelector('#backlog-heading');

      return (
        backlog !== null &&
        Boolean(
          element.compareDocumentPosition(backlog) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        )
      );
    }),
  ).toBe(true);
  await expect(page).toHaveTitle('Organizer tygodnia');
});

test('rejects invalid values without adding a task', async ({ page }) => {
  await page.getByRole('button', { name: 'Dodaj zadanie' }).click();

  await expect(page.getByText('Wpisz nazwę zadania.')).toBeVisible();
  await expect(page.getByLabel('Liczba zadań: 0')).toBeVisible();

  await page.getByRole('textbox', { name: 'Nazwa' }).fill('Niepoprawny czas');
  await page.getByRole('spinbutton', { name: 'Czas (minuty)' }).fill('16');
  await page.getByRole('button', { name: 'Dodaj zadanie' }).click();

  await expect(
    page.getByText(
      'Czas musi wynosić co najmniej 15 minut i być wielokrotnością 15.',
    ),
  ).toBeVisible();
  await expect(page.getByLabel('Liczba zadań: 0')).toBeVisible();
});

test('adds and edits a task, while Escape cancels and restores focus', async ({
  page,
}) => {
  const addTitle = page.getByRole('textbox', { name: 'Nazwa' });
  const addPriority = page.getByRole('combobox', { name: 'Priorytet' });
  const addDuration = page.getByRole('spinbutton', { name: 'Czas (minuty)' });

  await addTitle.fill('Przygotować prezentację');
  await addPriority.selectOption('high');
  await addDuration.fill('120');
  await page.getByRole('button', { name: 'Dodaj zadanie' }).click();

  await expect(page.getByText('Przygotować prezentację')).toBeVisible();
  await expect(
    page.getByText('Priorytet: Wysoki · Czas: 2 godz.'),
  ).toBeVisible();
  await expect(addTitle).toHaveValue('');
  await expect(addPriority).toHaveValue('medium');
  await expect(addDuration).toHaveValue('30');

  const editTrigger = page.getByRole('button', {
    name: 'Edytuj: Przygotować prezentację',
  });
  await editTrigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Popraw szczegóły' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Nazwa' })).toBeFocused();
  await dialog
    .getByRole('textbox', { name: 'Nazwa' })
    .fill('Niezapisana nazwa');
  await page.keyboard.press('Escape');

  await expect(dialog).not.toBeVisible();
  await expect(editTrigger).toBeFocused();
  await expect(page.getByText('Przygotować prezentację')).toBeVisible();
  await expect(page.getByText('Niezapisana nazwa')).not.toBeVisible();

  await editTrigger.click();
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('textbox', { name: 'Nazwa' })
    .fill('Prezentacja kwartalna');
  await dialog.getByRole('combobox', { name: 'Priorytet' }).selectOption('low');
  await dialog.getByRole('spinbutton', { name: 'Czas (minuty)' }).fill('45');
  await dialog.getByRole('button', { name: 'Zapisz zmiany' }).click();

  await expect(dialog).not.toBeVisible();
  await expect(page.getByText('Prezentacja kwartalna')).toBeVisible();
  await expect(page.getByText('Priorytet: Niski · Czas: 45 min')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Edytuj: Prezentacja kwartalna' }),
  ).toBeFocused();
});
