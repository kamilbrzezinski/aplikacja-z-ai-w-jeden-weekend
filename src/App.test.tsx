import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { STORAGE_KEY } from './storage/appStateStorage';

beforeEach(() => {
  window.localStorage.removeItem(STORAGE_KEY);
});

afterEach(() => {
  cleanup();
  window.localStorage.removeItem(STORAGE_KEY);
  vi.restoreAllMocks();
});

describe('App', () => {
  it('places the add form before an initially empty backlog', () => {
    render(<App />);

    const addHeading = screen.getByRole('heading', { name: 'Dodaj zadanie' });
    const backlogHeading = screen.getByRole('heading', {
      name: 'Do zaplanowania',
    });

    expect(
      addHeading.compareDocumentPosition(backlogHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getByText('Nie masz jeszcze zadań. Dodaj pierwsze powyżej.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Liczba zadań: 0')).toBeInTheDocument();
  });

  it('adds a valid task and edits every field in a populated dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nazwa' }),
      'Prezentacja',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Priorytet' }),
      'high',
    );
    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Czas (minuty)' }),
      { target: { value: '120' } },
    );
    await user.click(screen.getByRole('button', { name: 'Dodaj zadanie' }));

    expect(screen.getByText('Prezentacja')).toBeInTheDocument();
    expect(screen.getByText('Wysoki priorytet')).toBeInTheDocument();
    expect(screen.getByText('2 godz.')).toBeInTheDocument();
    expect(screen.getByLabelText('Liczba zadań: 1')).toBeInTheDocument();

    const editTrigger = screen.getByRole('button', {
      name: 'Edytuj: Prezentacja',
    });
    await user.click(editTrigger);

    const dialog = screen.getByRole('dialog', { name: 'Popraw szczegóły' });
    const title = within(dialog).getByRole('textbox', { name: 'Nazwa' });
    const priority = within(dialog).getByRole('combobox', {
      name: 'Priorytet',
    });
    const duration = within(dialog).getByRole('spinbutton', {
      name: 'Czas (minuty)',
    });

    expect(title).toHaveValue('Prezentacja');
    expect(priority).toHaveValue('high');
    expect(duration).toHaveValue(120);

    await user.clear(title);
    await user.type(title, 'Prezentacja kwartalna');
    await user.selectOptions(priority, 'low');
    fireEvent.change(duration, { target: { value: '45' } });
    await user.click(
      within(dialog).getByRole('button', { name: 'Zapisz zmiany' }),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Prezentacja kwartalna')).toBeInTheDocument();
    expect(screen.getByText('Niski priorytet')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Edytuj: Prezentacja kwartalna',
      }),
    ).toHaveFocus();
  });

  it('cancels editing without saving and restores focus', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nazwa' }),
      'Bez zmian',
    );
    await user.click(screen.getByRole('button', { name: 'Dodaj zadanie' }));

    const editTrigger = screen.getByRole('button', {
      name: 'Edytuj: Bez zmian',
    });
    await user.click(editTrigger);
    const dialog = screen.getByRole('dialog', { name: 'Popraw szczegóły' });
    const title = within(dialog).getByRole('textbox', { name: 'Nazwa' });

    await user.clear(title);
    await user.type(title, 'Niezapisana zmiana');
    await user.click(within(dialog).getByRole('button', { name: 'Anuluj' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Bez zmian')).toBeInTheDocument();
    expect(screen.queryByText('Niezapisana zmiana')).not.toBeInTheDocument();
    expect(editTrigger).toHaveFocus();
  });

  it('handles the native dialog cancel event without saving', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nazwa' }),
      'Zamknij Esc',
    );
    await user.click(screen.getByRole('button', { name: 'Dodaj zadanie' }));

    const editTrigger = screen.getByRole('button', {
      name: 'Edytuj: Zamknij Esc',
    });
    await user.click(editTrigger);
    const dialog = screen.getByRole('dialog', { name: 'Popraw szczegóły' });
    const title = within(dialog).getByRole('textbox', { name: 'Nazwa' });

    await user.clear(title);
    await user.type(title, 'Niezapisane po Esc');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Zamknij Esc')).toBeInTheDocument();
    expect(editTrigger).toHaveFocus();
  });

  it('marks a task as completed and allows restoring it without moving it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nazwa' }),
      'Sprawdzić status',
    );
    await user.click(screen.getByRole('button', { name: 'Dodaj zadanie' }));

    const card = screen.getByRole('article', {
      name: 'Zadanie: Sprawdzić status',
    });
    const completeControl = screen.getByRole('checkbox', {
      name: 'Oznacz jako wykonane: Sprawdzić status',
    });

    await user.click(completeControl);

    expect(card).toHaveAttribute('data-status', 'completed');
    expect(screen.getByText('Wykonane')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Oznacz jako niewykonane: Sprawdzić status',
      }),
    ).toBeChecked();

    await waitFor(() => {
      const savedState = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? '{}',
      ) as { columns?: { backlog?: string[] } };
      expect(savedState.columns?.backlog).toHaveLength(1);
    });

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Oznacz jako niewykonane: Sprawdzić status',
      }),
    );

    expect(card).toHaveAttribute('data-status', 'active');
    expect(screen.getByText('Do zrobienia')).toBeInTheDocument();
  });

  it('keeps a task when deletion is cancelled and removes it after confirmation', async () => {
    const user = userEvent.setup();
    const confirm = vi
      .spyOn(window, 'confirm')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nazwa' }),
      'Decyzja o usunięciu',
    );
    await user.click(screen.getByRole('button', { name: 'Dodaj zadanie' }));

    const deleteButton = screen.getByRole('button', {
      name: 'Usuń: Decyzja o usunięciu',
    });

    await user.click(deleteButton);

    expect(confirm).toHaveBeenLastCalledWith(
      'Usunąć zadanie „Decyzja o usunięciu”? Tej operacji nie można cofnąć.',
    );
    expect(screen.getByText('Decyzja o usunięciu')).toBeInTheDocument();

    await user.click(deleteButton);

    expect(screen.queryByText('Decyzja o usunięciu')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Liczba zadań: 0')).toBeInTheDocument();
  });

  it('keeps a long title and all card actions usable in the compact layout', async () => {
    const user = userEvent.setup();
    render(<App />);

    const longTitle =
      'Bardzo długi tytuł zadania, który ma się bezpiecznie zawinąć i nie może rozbić układu karty nawet w wąskiej kolumnie';
    await user.type(screen.getByRole('textbox', { name: 'Nazwa' }), longTitle);
    await user.click(screen.getByRole('button', { name: 'Dodaj zadanie' }));

    expect(
      screen.getByRole('article', {
        name: `Zadanie: ${longTitle}`,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(
      screen.getByRole('button', { name: `Edytuj: ${longTitle}` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `Usuń: ${longTitle}` }),
    ).toBeInTheDocument();
  });
});
