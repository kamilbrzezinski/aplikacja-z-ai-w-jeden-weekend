export const THEME_STORAGE_KEY = 'organizer-tygodnia:theme';
export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

export const themePreferences = ['system', 'light', 'dark'] as const;

export type ThemePreference = (typeof themePreferences)[number];
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export function parseThemePreference(value: unknown): ThemePreference {
  return (
    themePreferences.find((preference) => preference === value) ?? 'system'
  );
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference !== 'system') {
    return preference;
  }

  return systemPrefersDark ? 'dark' : 'light';
}

// Musi pozostać zgodne ze skryptem startowym w index.html.
export function applyTheme(
  root: HTMLElement,
  preference: ThemePreference,
  systemPrefersDark: boolean,
) {
  const theme = resolveTheme(preference, systemPrefersDark);

  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = theme;
}
