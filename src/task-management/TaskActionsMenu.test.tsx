import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TaskActionsMenu } from './TaskActionsMenu';

function renderMenu() {
  const handlers = {
    onMove: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  render(
    <>
      <TaskActionsMenu taskId="task-1" taskTitle="Raport" {...handlers} />
      <button type="button">Poza menu</button>
    </>,
  );

  return {
    ...handlers,
    trigger: screen.getByRole('button', { name: 'Akcje: Raport' }),
  };
}

describe('TaskActionsMenu', () => {
  afterEach(() => {
    cleanup();
  });

  it('opens with focus on the first action and cycles with arrow keys', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    const move = screen.getByRole('menuitem', { name: 'Przenieś do…: Raport' });
    const edit = screen.getByRole('menuitem', { name: 'Edytuj: Raport' });
    const remove = screen.getByRole('menuitem', { name: 'Usuń: Raport' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(move).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(edit).toHaveFocus();

    await user.keyboard('{End}');
    expect(remove).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(move).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(remove).toHaveFocus();
  });

  it.each(['{Escape}', '{Tab}'])(
    'closes on %s and returns focus to the trigger',
    async (key) => {
      const user = userEvent.setup();
      const { trigger } = renderMenu();

      await user.click(trigger);
      await user.keyboard(key);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    },
  );

  it('closes after a pointer press outside the menu', async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Poza menu' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('passes the trigger to the chosen action so dialogs can restore focus', async () => {
    const user = userEvent.setup();
    const { onEdit, onMove, onDelete, trigger } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Edytuj: Raport' }));

    expect(onEdit).toHaveBeenCalledWith(trigger);
    expect(onMove).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
