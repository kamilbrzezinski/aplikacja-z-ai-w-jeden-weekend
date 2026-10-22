import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyTheme,
  parseThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
} from './theme';

function resetRoot() {
  const root = document.documentElement;

  delete root.dataset.theme;
  delete root.dataset.themePreference;
  root.style.colorScheme = '';
}

afterEach(() => {
  window.localStorage.clear();
  resetRoot();
  vi.restoreAllMocks();
});

describe('parseThemePreference', () => {
  it.each(['system', 'light', 'dark'] as const)('accepts %s', (value) => {
    expect(parseThemePreference(value)).toBe(value);
  });

  it.each([null, undefined, '', 'Dark', 'auto', 1, {}])(
    'falls back to system for %o',
    (value) => {
      expect(parseThemePreference(value)).toBe('system');
    },
  );
});

describe('resolveTheme', () => {
  it('follows the system only for the system preference', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});

describe('applyTheme', () => {
  it('marks the root with the resolved theme and preference', () => {
    const root = document.documentElement;

    applyTheme(root, 'system', true);

    expect(root.dataset.theme).toBe('dark');
    expect(root.dataset.themePreference).toBe('system');
    expect(root.style.colorScheme).toBe('dark');
  });
});

describe('index.html bootstrap script', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '';

  function runBootstrap(systemPrefersDark: boolean) {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: systemPrefersDark,
    } as MediaQueryList);
    // Uruchamia rzeczywisty skrypt z index.html, aby wykryć rozjazd z theme.ts.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const bootstrap = new Function(script) as () => void;
    bootstrap();
  }

  it('applies the stored preference using the shared storage key', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    runBootstrap(false);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.themePreference).toBe('dark');
  });

  it('falls back to the system theme for an invalid stored value', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');

    runBootstrap(true);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.themePreference).toBe('system');
  });
});
