export type ThemeMode = 'system' | 'dark' | 'light'

// Fired after anything changes the theme, so every control showing it can catch up
export const THEME_EVENT = 'themechange'

export function storedThemeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem('theme')
    return stored === 'dark' || stored === 'light' ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function effectiveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Saves the choice, applies it to the page and tells the other theme controls */
export function setThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem('theme', mode)
  } catch {
    // Storage can be blocked; the theme still applies for this visit
  }
  document.documentElement.setAttribute('data-theme', effectiveTheme(mode))
  window.dispatchEvent(new Event(THEME_EVENT))
}
