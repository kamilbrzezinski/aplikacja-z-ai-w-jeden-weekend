import { expect, test, type Page } from '@playwright/test';

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

async function keyboardMove(page: Page, title: string, keys: string[]) {
  const handle = page.getByRole('button', { name: `Przenieś: ${title}` });

  await handle.focus();
  await page.keyboard.press('Enter');

  for (const key of keys) {
    await page.keyboard.press(key);
  }

  await page.keyboard.press('Enter');
  await expect(handle).toBeFocused();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('plans and reorders tasks with the keyboard, then restores the saved state', async ({
  page,
}) => {
  await addTask(page, 'Przygotować prezentację', 120, 'high');
  await keyboardMove(page, 'Przygotować prezentację', ['ArrowDown']);

  const thursday = page.getByRole('region', { name: 'Czwartek' });

  await expect(
    thursday.getByRole('article', {
      name: 'Zadanie: Przygotować prezentację',
    }),
  ).toBeVisible();

  await addTask(page, 'Sprawdzić notatki', 30);
  await keyboardMove(page, 'Sprawdzić notatki', ['ArrowDown']);

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

  await keyboardMove(page, bottomTaskTitle, ['ArrowUp']);

  await expect(thursday.getByRole('article').nth(0)).toHaveAttribute(
    'aria-label',
    `Zadanie: ${bottomTaskTitle}`,
  );

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

test('moves a task to an empty day with a multi-step pointer drag', async ({
  page,
}) => {
  await addTask(page, 'Przenieść wskaźnikiem', 45);

  const handle = page.getByRole('button', {
    name: 'Przenieś: Przenieść wskaźnikiem',
  });
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
