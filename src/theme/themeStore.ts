import {
  applyTheme,
  parseThemePreference,
  SYSTEM_DARK_QUERY,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from './theme';

const listeners = new Set<() => void>();

function systemPrefersDark() {
  return window.matchMedia(SYSTEM_DARK_QUERY).matches;
}

// Atrybut ustawiony przez skrypt startowy jest źródłem prawdy, dzięki czemu
// wybór działa także wtedy, gdy zapis w localStorage jest niedostępny.
export function getThemePreference(): ThemePreference {
  return parseThemePreference(document.documentElement.dataset.themePreference);
}

export function setThemePreference(preference: ThemePreference) {
  applyTheme(document.documentElement, preference, systemPrefersDark());

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Motyw pozostaje aktywny do końca sesji mimo nieudanego zapisu.
  }

  listeners.forEach((listener) => {
    listener();
  });
}

function handleSystemThemeChange() {
  if (getThemePreference() === 'system') {
    applyTheme(document.documentElement, 'system', systemPrefersDark());
  }
}

export function subscribeToTheme(listener: () => void) {
  const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);

  listeners.add(listener);
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  return () => {
    listeners.delete(listener);
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  };
}
