import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TaskForm } from './TaskForm';

afterEach(cleanup);

function renderTaskForm(onSubmit = vi.fn()) {
  render(
    <TaskForm
      submitLabel="Dodaj zadanie"
      resetAfterSubmit
      onSubmit={onSubmit}
    />,
  );

  return {
    onSubmit,
    title: screen.getByRole('textbox', { name: 'Nazwa' }),
    priority: screen.getByRole('combobox', { name: 'Priorytet' }),
    duration: screen.getByRole('spinbutton', { name: 'Czas (minuty)' }),
    submit: screen.getByRole('button', { name: 'Dodaj zadanie' }),
  };
}

describe('TaskForm', () => {
  it('has labelled fields and the defaults for a new task', () => {
    const { title, priority, duration } = renderTaskForm();

    expect(title).toHaveValue('');
    expect(title).toBeRequired();
    expect(priority).toHaveValue('medium');
    expect(duration).toHaveValue(30);
    expect(duration).toBeRequired();
    expect(duration).toHaveAttribute('min', '15');
    expect(duration).toHaveAttribute('step', '15');
    expect(duration).not.toHaveAttribute('max');
  });

  it('rejects an empty title and moves focus to it', async () => {
    const user = userEvent.setup();
    const { onSubmit, submit, title } = renderTaskForm();

    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Wpisz nazwę zadania.')).toBeInTheDocument();
    expect(title).toHaveAttribute('aria-invalid', 'true');
    expect(title).toHaveFocus();
  });

  it.each([
    ['', 'Wpisz czas zadania w minutach.'],
    ['-15', 'Czas musi wynosić co najmniej 15 minut i być wielokrotnością 15.'],
    ['1.5', 'Czas musi wynosić co najmniej 15 minut i być wielokrotnością 15.'],
    ['16', 'Czas musi wynosić co najmniej 15 minut i być wielokrotnością 15.'],
  ])('rejects invalid duration %j', async (value, message) => {
    const user = userEvent.setup();
    const { duration, onSubmit, submit, title } = renderTaskForm();

    await user.type(title, 'Poprawne zadanie');
    fireEvent.change(duration, { target: { value } });
    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(duration).toHaveAttribute('aria-invalid', 'true');
    expect(duration).toHaveFocus();
  });

  it('submits trimmed valid data and resets the add form', async () => {
    const user = userEvent.setup();
    const { duration, onSubmit, priority, submit, title } = renderTaskForm();

    await user.type(title, '  Przygotować prezentację  ');
    await user.selectOptions(priority, 'high');
    fireEvent.change(duration, { target: { value: '120' } });
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Przygotować prezentację',
      priority: 'high',
      durationMinutes: 120,
    });
    expect(title).toHaveValue('');
    expect(priority).toHaveValue('medium');
    expect(duration).toHaveValue(30);
    expect(title).toHaveFocus();
  });
});
