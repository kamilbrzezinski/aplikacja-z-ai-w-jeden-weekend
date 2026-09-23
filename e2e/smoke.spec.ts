import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows the two-list dnd spike', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Przeciąganie między listami' }),
  ).toBeVisible();
  await expect(page.getByTestId('column-backlog')).toContainText(
    'Przygotować prezentację',
  );
  await expect(page.getByTestId('column-monday')).toContainText(
    'Upuść zadanie tutaj',
  );
  await expect(page).toHaveTitle('Organizer tygodnia');
});

test('reorders and moves items with the keyboard, then cancels a move', async ({
  page,
}) => {
  const backlog = page.getByTestId('dropzone-backlog');
  const monday = page.getByTestId('dropzone-monday');
  const presentationHandle = page.getByRole('button', {
    name: 'Przenieś: Przygotować prezentację',
  });
  const presentationItem = page.locator(
    '[data-item-id="task-presentation"]:not([data-dnd-placeholder])',
  );

  await presentationHandle.focus();
  await page.keyboard.press('Space');
  await expect(presentationItem).toHaveAttribute('data-dragging', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(backlog.locator('[data-item-id]').first()).toHaveAttribute(
    'data-item-id',
    'task-email',
  );
  await page.keyboard.press('Space');
  await expect(presentationItem).toHaveAttribute('data-dropping', 'true');
  await expect(presentationItem).not.toHaveAttribute('data-dropping', 'true');

  await presentationHandle.focus();
  await page.keyboard.press('Space');
  await expect(presentationItem).toHaveAttribute('data-dragging', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(monday).toContainText('Przygotować prezentację');
  await page.keyboard.press('Space');
  await expect(backlog).not.toContainText('Przygotować prezentację');
  await expect(presentationItem).toHaveAttribute('data-dropping', 'true');
  await expect(presentationItem).not.toHaveAttribute('data-dropping', 'true');

  const emailHandle = page.getByRole('button', {
    name: 'Przenieś: Odpisać na ważne wiadomości',
  });
  const emailItem = page.locator(
    '[data-item-id="task-email"]:not([data-dnd-placeholder])',
  );

  await emailHandle.focus();
  await page.keyboard.press('Space');
  await expect(emailItem).toHaveAttribute('data-dragging', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(monday).toContainText('Odpisać na ważne wiadomości');
  await page.keyboard.press('Escape');

  await expect(backlog).toContainText('Odpisać na ważne wiadomości');
  await expect(monday).not.toContainText('Odpisać na ważne wiadomości');
  await expect(emailHandle).toBeFocused();
});

test('moves an item to the initially empty column with the pointer', async ({
  page,
}) => {
  const source = page.getByRole('button', {
    name: 'Przenieś: Zaplanować zakupy',
  });
  const target = page.getByTestId('dropzone-monday');
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Nie można wyznaczyć położenia elementów spike’u DnD.');
  }

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2 + 12,
    sourceBox.y + sourceBox.height / 2,
    { steps: 4 },
  );
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 12 },
  );
  await page.mouse.up();

  await expect(target).toContainText('Zaplanować zakupy');
  await expect(page.getByTestId('dropzone-backlog')).not.toContainText(
    'Zaplanować zakupy',
  );
});
