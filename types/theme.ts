// Theme type definitions for multi-tenant theming

export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryLight: string
  secondary: string
  secondaryHover: string
  accent: string
  headerBg: string
  headerText: string
  buttonBg: string
  buttonText: string
  buttonHover: string
  footerBg: string
  footerText: string
}

export interface ThemeConfig {
  id: string
  name: string
  schoolName: string
  logo?: string
  favicon?: string
  colors: ThemeColors
  borderRadius?: string
  fontFamily?: string
}

export const CSS_VARIABLE_MAP: Record<keyof ThemeColors, string> = {
  primary: '--theme-primary',
  primaryHover: '--theme-primary-hover',
  primaryLight: '--theme-primary-light',
  secondary: '--theme-secondary',
  secondaryHover: '--theme-secondary-hover',
  accent: '--theme-accent',
  headerBg: '--theme-header-bg',
  headerText: '--theme-header-text',
  buttonBg: '--theme-button-bg',
  buttonText: '--theme-button-text',
  buttonHover: '--theme-button-hover',
  footerBg: '--theme-footer-bg',
  footerText: '--theme-footer-text',
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#0284c7',
  primaryHover: '#0369a1',
  primaryLight: '#e0f2fe',
  secondary: '#64748b',
  secondaryHover: '#475569',
  accent: '#f59e0b',
  headerBg: '#ffffff',
  headerText: '#1f2937',
  buttonBg: '#0284c7',
  buttonText: '#ffffff',
  buttonHover: '#0369a1',
  footerBg: '#1f2937',
  footerText: '#ffffff',
}
