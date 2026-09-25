import { expect, test, type Page } from '@playwright/test';

import type { AppState } from '../src/domain/model';

const STORAGE_KEY = 'organizer-tygodnia:v1';

async function addTask(
  page: Page,
  title: string,
  durationMinutes: number,
  priority: 'low' | 'medium' | 'high' = 'medium',
) {
  const addTrigger = page.locator('button[aria-controls="add-task-panel"]');

  if ((await addTrigger.getAttribute('aria-expanded')) === 'false') {
    await addTrigger.click();
  }

  await page.getByRole('textbox', { name: 'Nazwa' }).fill(title);
  await page
    .getByRole('combobox', { name: 'Priorytet' })
    .selectOption(priority);
  await page
    .getByRole('spinbutton', { name: 'Czas (minuty)' })
    .fill(String(durationMinutes));
  await page.getByRole('button', { name: 'Dodaj zadanie' }).click();
}

async function moveWithDialogToThursday(
  page: Page,
  title: string,
  position?: 'first',
) {
  const trigger = page.getByRole('button', {
    name: `Przenieś do…: ${title}`,
  });

  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Przenieś do…' });
  const destination = dialog.getByRole('combobox', {
    name: 'Miejsce docelowe',
  });
  const destinationPosition = dialog.getByRole('combobox', {
    name: 'Pozycja w kolumnie',
  });

  await expect(destination).toBeFocused();
  await destination.press('c');
  await expect(destination).toHaveValue('thursday');
  await page.keyboard.press('Tab');

  if (position === 'first') {
    await destinationPosition.press('1');
    await expect(destinationPosition).toHaveValue('1');
  }

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: `Przenieś do…: ${title}` }),
  ).toBeFocused();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('moves and reorders tasks with the accessible dialog, then restores the saved state', async ({
  page,
}) => {
  await addTask(page, 'Przygotować prezentację', 120, 'high');
  await moveWithDialogToThursday(page, 'Przygotować prezentację');

  const thursday = page.getByRole('region', { name: 'Czwartek' });

  await expect(
    thursday.getByRole('article', {
      name: 'Zadanie: Przygotować prezentację',
    }),
  ).toBeVisible();

  await addTask(page, 'Sprawdzić notatki', 30);
  await moveWithDialogToThursday(page, 'Sprawdzić notatki');

  await expect(
    thursday.getByRole('article', { name: 'Zadanie: Sprawdzić notatki' }),
  ).toBeVisible();
  await expect(thursday.getByText('Zaplanowano: 2 godz. 30 min')).toBeVisible();
  await expect(thursday.getByText('Pozostało: 2 godz. 30 min')).toBeVisible();

  const cardsBeforeReorder = thursday.getByRole('article');
  const bottomCardLabel = await cardsBeforeReorder
    .nth(1)
    .getAttribute('aria-label');
  const bottomTaskTitle = bottomCardLabel?.replace('Zadanie: ', '');

  expect(bottomTaskTitle).toBeTruthy();

  if (!bottomTaskTitle) {
    return;
  }

  await moveWithDialogToThursday(page, bottomTaskTitle, 'first');

  await expect(thursday.getByRole('article').nth(0)).toHaveAttribute(
    'aria-label',
    `Zadanie: ${bottomTaskTitle}`,
  );

  const savedState = await page.evaluate((storageKey): AppState | null => {
    const serializedState = window.localStorage.getItem(storageKey);

    return serializedState ? (JSON.parse(serializedState) as AppState) : null;
  }, STORAGE_KEY);

  expect(savedState).not.toBeNull();

  if (!savedState) {
    return;
  }

  expect(savedState.columns.thursday).toHaveLength(2);
  expect(
    savedState.columns.thursday.map(
      (taskId: string) => savedState.tasks[taskId]?.title,
    ),
  ).toEqual([bottomTaskTitle, 'Przygotować prezentację']);

  await page.reload();

  const restoredThursday = page.getByRole('region', { name: 'Czwartek' });
  const restoredCards = restoredThursday.getByRole('article');

  await expect(restoredCards).toHaveCount(2);
  await expect(restoredCards.nth(0)).toHaveAttribute(
    'aria-label',
    `Zadanie: ${bottomTaskTitle}`,
  );
  await expect(
    restoredThursday.getByText('Zaplanowano: 2 godz. 30 min'),
  ).toBeVisible();
});

test('cancels the move dialog with Escape without saving and restores focus', async ({
  page,
}) => {
  const title = 'Anulować przenoszenie';

  await addTask(page, title, 30);

  const trigger = page.getByRole('button', {
    name: `Przenieś do…: ${title}`,
  });
  const stateBeforeDialog = await page.evaluate(
    (storageKey) => window.localStorage.getItem(storageKey),
    STORAGE_KEY,
  );

  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Przenieś do…' });

  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('combobox', { name: 'Miejsce docelowe' })
    .selectOption('friday');
  await page.keyboard.press('Escape');

  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(
    page
      .getByRole('region', { name: 'Do zaplanowania' })
      .getByRole('article', { name: `Zadanie: ${title}` }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      STORAGE_KEY,
    ),
  ).toBe(stateBeforeDialog);
});

test('keeps the pointer handle outside keyboard navigation and the accessibility tree', async ({
  page,
}) => {
  const title = 'Tylko wskaźnik';

  await addTask(page, title, 30);

  const pointerHandle = page.locator('[data-pointer-drag-handle]');
  const taskCard = page.getByRole('article', { name: `Zadanie: ${title}` });
  const sortableItem = taskCard.locator('xpath=ancestor::li');
  const stateBeforeKeys = await page.evaluate(
    (storageKey) => window.localStorage.getItem(storageKey),
    STORAGE_KEY,
  );

  await expect(pointerHandle).toHaveCount(1);
  await expect(pointerHandle).toHaveAttribute('aria-hidden', 'true');
  await expect(pointerHandle).toHaveAttribute('role', 'presentation');
  await expect(pointerHandle).toHaveAttribute('tabindex', '-1');
  await expect(
    page.getByRole('button', { name: `Przenieś: ${title}` }),
  ).toHaveCount(0);

  for (const key of [' ', 'Enter', 'ArrowRight']) {
    await pointerHandle.dispatchEvent('keydown', { key });
  }

  await expect(sortableItem).not.toHaveAttribute('data-dragging', 'true');
  expect(
    await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      STORAGE_KEY,
    ),
  ).toBe(stateBeforeKeys);
});

test('moves a task to an empty day with a multi-step pointer drag', async ({
  page,
}) => {
  await addTask(page, 'Przenieść wskaźnikiem', 45);

  const handle = page
    .getByRole('article', { name: 'Zadanie: Przenieść wskaźnikiem' })
    .locator('[data-pointer-drag-handle]');
  const mondayDropzone = page.getByTestId('dropzone-monday');
  const handleBox = await handle.boundingBox();
  const targetBox = await mondayDropzone.boundingBox();

  expect(handleBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  if (!handleBox || !targetBox) {
    return;
  }

  await page.mouse.move(
    handleBox.x + handleBox.width / 2,
    handleBox.y + handleBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 20, handleBox.y + 20, { steps: 5 });
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 20 },
  );
  await page.mouse.up();

  const monday = page.getByRole('region', { name: 'Poniedziałek' });

  await expect(
    monday.getByRole('article', { name: 'Zadanie: Przenieść wskaźnikiem' }),
  ).toBeVisible();
  await expect(monday.getByText('Zaplanowano: 45 min')).toBeVisible();
});
