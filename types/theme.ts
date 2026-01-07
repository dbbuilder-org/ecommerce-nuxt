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

/**
 * Theme-specific feature flags
 * Controls which UI features are enabled per theme
 */
export interface ThemeFeatures {
  // Header features
  megaMenu: boolean
  searchBar: boolean
  scrollEffects: boolean

  // Landing page features
  quickActions: boolean
  shopByGrade: boolean
  videoHero: boolean
  featuredCollections: boolean

  // UI enhancements
  glassEffects: boolean
  softShadows: boolean
  animatedGradients: boolean
}

/**
 * Hero section configuration per theme
 */
export interface ThemeHeroConfig {
  videoSrc?: string
  imageSrc?: string
  gradientClass: string
  overlayClass: string
  showScrollIndicator: boolean
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

/**
 * Component override mapping for veneer system
 * Maps component names to theme-specific override components
 */
export type ComponentOverrides = Record<string, string>

export interface ThemeConfig {
  id: string
  name: string
  schoolName: string
  logo?: string
  favicon?: string
  colors: ThemeColors
  borderRadius?: string
  fontFamily?: string

  // Extended theme configuration
  features?: ThemeFeatures
  hero?: ThemeHeroConfig
  componentOverrides?: ComponentOverrides
}

/**
 * Default feature flags (all disabled for base themes)
 */
export const DEFAULT_FEATURES: ThemeFeatures = {
  megaMenu: false,
  searchBar: false,
  scrollEffects: false,
  quickActions: false,
  shopByGrade: false,
  videoHero: false,
  featuredCollections: false,
  glassEffects: false,
  softShadows: false,
  animatedGradients: false,
}

/**
 * Default hero configuration
 */
export const DEFAULT_HERO: ThemeHeroConfig = {
  gradientClass: 'bg-gradient-to-r from-primary-600 to-primary-800',
  overlayClass: 'bg-black/30',
  showScrollIndicator: false,
  ctaText: 'Shop Now',
  ctaLink: '/shop',
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
