import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_STORAGE_KEY } from './theme';
import { ThemeMenu } from './ThemeMenu';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themePreference;
  vi.restoreAllMocks();
});

function renderThemeMenu() {
  const user = userEvent.setup();

  render(
    <>
      <ThemeMenu />
      <p>Poza menu</p>
    </>,
  );

  return { user, trigger: screen.getByRole('button', { name: /^Motyw:/ }) };
}

describe('ThemeMenu', () => {
  it('starts with the automatic theme and shows all options', async () => {
    const { user, trigger } = renderThemeMenu();

    expect(trigger).toHaveAccessibleName('Motyw: Automatyczny');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    const menu = screen.getByRole('menu', { name: 'Wybierz motyw' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(
      screen.getAllByRole('menuitemradio').map((item) => item.textContent),
    ).toEqual([
      'AutomatycznyZgodny z urządzeniem',
      'JasnyZawsze jasny',
      'CiemnyZawsze ciemny',
    ]);
    expect(
      screen.getByRole('menuitemradio', { name: /Automatyczny/ }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('applies, persists and reflects the chosen theme', async () => {
    const { user, trigger } = renderThemeMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', { name: /Ciemny/ }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAccessibleName('Motyw: Ciemny');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('keeps the chosen theme when saving to storage fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const { user, trigger } = renderThemeMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', { name: /Jasny/ }));

    expect(trigger).toHaveAccessibleName('Motyw: Jasny');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('supports keyboard navigation and closes on Escape', async () => {
    const { user, trigger } = renderThemeMenu();

    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const items = screen.getAllByRole('menuitemradio');
    await waitFor(() => {
      expect(items[0]).toHaveFocus();
    });

    await user.keyboard('{ArrowUp}');
    expect(items[2]).toHaveFocus();

    await user.keyboard('{Home}');
    expect(items[0]).toHaveFocus();

    await user.keyboard('{End}{ArrowDown}');
    expect(items[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(trigger).toHaveAccessibleName('Motyw: Jasny');

    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(
        screen.getByRole('menuitemradio', { name: /Jasny/ }),
      ).toHaveFocus();
    });

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes when clicking outside or tabbing away', async () => {
    const { user, trigger } = renderThemeMenu();

    await user.click(trigger);
    await user.click(screen.getByText('Poza menu'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger);
    act(() => {
      screen.getAllByRole('menuitemradio')[0]?.focus();
    });
    await user.tab();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
