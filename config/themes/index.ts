// Theme registry - all available themes
// Supports veneer system with component overrides per theme

import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig } from '~/types/theme'
import { DEFAULT_THEME_COLORS, DEFAULT_FEATURES, DEFAULT_HERO } from '~/types/theme'
import { westmorelandTheme } from './westmoreland'
import { windermereTheme } from './windermere'

// Default theme
export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  schoolName: 'School Bookstore',
  colors: DEFAULT_THEME_COLORS,
  features: DEFAULT_FEATURES,
  hero: DEFAULT_HERO,
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

// Get theme features with defaults
export function getThemeFeatures(themeId: string): ThemeFeatures {
  const theme = getTheme(themeId)
  return { ...DEFAULT_FEATURES, ...theme.features }
}

// Get theme hero config with defaults
export function getThemeHero(themeId: string): ThemeHeroConfig {
  const theme = getTheme(themeId)
  return { ...DEFAULT_HERO, ...theme.hero }
}

// Check if theme has a specific feature enabled
export function themeHasFeature(themeId: string, feature: keyof ThemeFeatures): boolean {
  const features = getThemeFeatures(themeId)
  return features[feature] === true
}

// Get component override for a theme (veneer system)
export function getComponentOverride(themeId: string, componentName: string): string | null {
  const theme = getTheme(themeId)
  return theme.componentOverrides?.[componentName] || null
}

export { westmorelandTheme, windermereTheme }
