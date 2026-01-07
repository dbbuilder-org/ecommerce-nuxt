// Theme registry - all available themes

import type { ThemeConfig } from '~/types/theme'
import { DEFAULT_THEME_COLORS } from '~/types/theme'
import { westmorelandTheme } from './westmoreland'
import { windermereTheme } from './windermere'

// Default theme
export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  schoolName: 'School Bookstore',
  colors: DEFAULT_THEME_COLORS,
}

// Theme registry
export const themes: Record<string, ThemeConfig> = {
  default: defaultTheme,
  westmoreland: westmorelandTheme,
  windermere: windermereTheme,
}

// Get theme by ID
export function getTheme(themeId: string): ThemeConfig {
  return themes[themeId] || themes.default
}

// Get all available themes
export function getAvailableThemes(): ThemeConfig[] {
  return Object.values(themes)
}

// Check if theme exists
export function isValidTheme(themeId: string): boolean {
  return themeId in themes
}

export { westmorelandTheme, windermereTheme }
