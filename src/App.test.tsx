import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('renders the two-list drag and drop spike', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Przeciąganie między listami' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Do zaplanowania' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Poniedziałek' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Upuść zadanie tutaj')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Przenieś: Przygotować prezentację',
      }),
    ).toHaveAttribute('aria-describedby', 'dnd-instructions');
  });
});
