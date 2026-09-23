import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { App } from './App';
import { STORAGE_KEY } from './storage/appStateStorage';

beforeEach(() => {
  window.localStorage.removeItem(STORAGE_KEY);
});

afterEach(() => {
  cleanup();
  window.localStorage.removeItem(STORAGE_KEY);
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
    expect(
      screen.getByText('Priorytet: Wysoki · Czas: 2 godz.'),
    ).toBeInTheDocument();
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
    expect(
      screen.getByText('Priorytet: Niski · Czas: 45 min'),
    ).toBeInTheDocument();
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
});
