// Theme type definitions for multi-tenant theming
// Aligned with ecommerce-app CSS variable naming for consistency

/**
 * V1 Core Colors - matches ecommerce-app/src/themes/types.js
 * These CSS variables are used throughout the application
 */
export interface ThemeColors {
  // Header colors
  headerColor: string
  headerHover: string
  headerTextColor: string
  headerButtonColor: string
  headerButtonTextColor: string

  // Frame/container colors
  frameColor: string
  backgroundColor: string

  // Button colors
  buttonColor: string
  buttonHover: string
  buttonTextColor: string

  // Primary action buttons (for contrast - dark navy on Windermere)
  primaryActionBg: string
  primaryActionBgHover: string

  // Highlight/accent buttons
  highlightButtonColor: string
  highlightButtonHover: string

  // Text colors
  textColor: string
  lightTextColor: string

  // Status colors
  alertColor: string
  alertHover: string
  successColor: string
  successHover: string
  inactiveColor: string
}

/**
 * V2 Shadows - soft shadows and glow effects
 */
export interface ThemeShadows {
  soft: string
  softSm: string
  softLg: string
  softXl: string
  glowPrimary: string
  glowPrimaryLg: string
  glowAccent: string
  glowAccentLg: string
  glowSuccess: string
}

/**
 * V2 Gradients
 */
export interface ThemeGradients {
  primary: string
  accent: string
  success: string
  surface: string
}

/**
 * V2 Glass morphism
 */
export interface ThemeGlass {
  background: string
  border: string
  backgroundDark: string
}

/**
 * V2 Border radii
 */
export interface ThemeRadii {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  full: string
}

/**
 * V2 Transitions
 */
export interface ThemeTransitions {
  fast: string
  normal: string
  slow: string
  bounce: string
}

/**
 * Theme-specific feature flags
 * Controls which UI features are enabled per theme
 */
export interface ThemeFeatures {
  // Header features
  megaMenu: boolean
  megaMenuIcons: boolean
  searchBar: boolean
  scrollEffects: boolean
  scrollHeaderShrink: boolean
  announcementBar: boolean
  parentPortalLink: boolean
  userAvatarCircle: boolean
  contactInMenu: boolean
  instagramLink: boolean

  // Landing page features
  heroSection: boolean
  quickActions: boolean
  shopByGrade: boolean
  shopByCollection: boolean
  featuredItems: boolean
  videoHero: boolean
  featuredCollections: boolean
  promoBanner: boolean

  // Checkout features
  pickupLocationsEnabled: boolean
  shippingEnabled: boolean

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
  description?: string
  ctaPrimary?: string
  ctaSecondary?: string
  ctaLink?: string
}

/**
 * Component override mapping for veneer system
 * Maps component names to theme-specific override components
 */
export type ComponentOverrides = Record<string, string>

/**
 * Full theme configuration
 */
export interface ThemeConfig {
  id: string
  name: string
  schoolName: string
  logo?: string
  favicon?: string
  colors: ThemeColors
  borderRadius?: string
  fontFamily?: string

  // V2 enhancements (optional)
  shadows?: Partial<ThemeShadows>
  gradients?: Partial<ThemeGradients>
  glass?: Partial<ThemeGlass>
  radii?: Partial<ThemeRadii>
  transitions?: Partial<ThemeTransitions>

  // Extended theme configuration
  features?: Partial<ThemeFeatures>
  hero?: Partial<ThemeHeroConfig>
  componentOverrides?: ComponentOverrides
}

/**
 * Default feature flags (conservative defaults)
 */
export const DEFAULT_FEATURES: ThemeFeatures = {
  // Header features
  megaMenu: false,
  megaMenuIcons: false,
  searchBar: false,
  scrollEffects: false,
  scrollHeaderShrink: false,
  announcementBar: false,
  parentPortalLink: false,
  userAvatarCircle: false,
  contactInMenu: false,
  instagramLink: false,
  // Landing page features
  heroSection: true,
  quickActions: false,
  shopByGrade: false,
  shopByCollection: false,
  featuredItems: true,
  videoHero: false,
  featuredCollections: false,
  promoBanner: false,
  // Checkout features
  pickupLocationsEnabled: true,
  shippingEnabled: false,
  // UI enhancements
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
  ctaPrimary: 'Shop Now',
  ctaLink: '/shop',
}

/**
 * CSS variable names for V1 core colors
 * Maps ThemeColors keys to CSS variable names
 */
export const CSS_VARIABLE_MAP: Record<keyof ThemeColors, string> = {
  headerColor: '--header-color',
  headerHover: '--header-hover',
  headerTextColor: '--header-text-color',
  headerButtonColor: '--header-button-color',
  headerButtonTextColor: '--header-button-text-color',
  frameColor: '--frame-color',
  backgroundColor: '--background-color',
  buttonColor: '--button-color',
  buttonHover: '--button-hover',
  buttonTextColor: '--button-text-color',
  primaryActionBg: '--primary-action-bg',
  primaryActionBgHover: '--primary-action-bg-hover',
  highlightButtonColor: '--highlight-button-color',
  highlightButtonHover: '--highlight-button-hover',
  textColor: '--text-color',
  lightTextColor: '--light-text-color',
  alertColor: '--alert-color',
  alertHover: '--alert-hover',
  successColor: '--success-color',
  successHover: '--success-hover',
  inactiveColor: '--inactive-color',
}

/**
 * CSS variable names for V2 shadows
 */
export const SHADOW_CSS_VARIABLE_MAP: Record<keyof ThemeShadows, string> = {
  soft: '--shadow-soft',
  softSm: '--shadow-soft-sm',
  softLg: '--shadow-soft-lg',
  softXl: '--shadow-soft-xl',
  glowPrimary: '--shadow-glow-primary',
  glowPrimaryLg: '--shadow-glow-primary-lg',
  glowAccent: '--shadow-glow-accent',
  glowAccentLg: '--shadow-glow-accent-lg',
  glowSuccess: '--shadow-glow-success',
}

/**
 * CSS variable names for V2 gradients
 */
export const GRADIENT_CSS_VARIABLE_MAP: Record<keyof ThemeGradients, string> = {
  primary: '--gradient-primary',
  accent: '--gradient-accent',
  success: '--gradient-success',
  surface: '--gradient-surface',
}

/**
 * CSS variable names for V2 glass morphism
 */
export const GLASS_CSS_VARIABLE_MAP: Record<keyof ThemeGlass, string> = {
  background: '--glass-bg',
  border: '--glass-border',
  backgroundDark: '--glass-bg-dark',
}

/**
 * CSS variable names for V2 radii
 */
export const RADII_CSS_VARIABLE_MAP: Record<keyof ThemeRadii, string> = {
  sm: '--radius-sm',
  md: '--radius-md',
  lg: '--radius-lg',
  xl: '--radius-xl',
  '2xl': '--radius-2xl',
  full: '--radius-full',
}

/**
 * CSS variable names for V2 transitions
 */
export const TRANSITION_CSS_VARIABLE_MAP: Record<keyof ThemeTransitions, string> = {
  fast: '--transition-fast',
  normal: '--transition-normal',
  slow: '--transition-slow',
  bounce: '--transition-bounce',
}

/**
 * Default theme colors (Westmoreland blue theme)
 */
export const DEFAULT_THEME_COLORS: ThemeColors = {
  // Header
  headerColor: '#7EB3D7',
  headerHover: '#5a9bc7',
  headerTextColor: '#FFFFFF',
  headerButtonColor: '#992222',
  headerButtonTextColor: '#699864',

  // Frame
  frameColor: '#79bce1',
  backgroundColor: '#FFFFFF',

  // Buttons
  buttonColor: '#0c85b6',
  buttonHover: '#0a6b94',
  buttonTextColor: '#FFFFFF',

  // Primary action (same as button for Westmoreland)
  primaryActionBg: '#0c85b6',
  primaryActionBgHover: '#0a6b94',

  // Highlight/accent
  highlightButtonColor: '#992222',
  highlightButtonHover: '#7a1b1b',

  // Text
  textColor: '#0E2049',
  lightTextColor: '#FFFFFF',

  // Status
  alertColor: '#E32323',
  alertHover: '#c21e1e',
  successColor: '#699864',
  successHover: '#527a4d',
  inactiveColor: '#C3C3C3',
}

/**
 * Default V2 shadows
 */
export const DEFAULT_SHADOWS: ThemeShadows = {
  soft: '0 2px 8px -2px rgba(0,0,0,0.05), 0 4px 20px -4px rgba(0,0,0,0.08)',
  softSm: '0 1px 4px -1px rgba(0,0,0,0.04), 0 2px 8px -2px rgba(0,0,0,0.06)',
  softLg: '0 8px 30px -6px rgba(0,0,0,0.12)',
  softXl: '0 12px 40px -8px rgba(0,0,0,0.15)',
  glowPrimary: '0 4px 14px 0 rgba(12,133,182,0.4)',
  glowPrimaryLg: '0 6px 20px 0 rgba(12,133,182,0.5)',
  glowAccent: '0 4px 14px 0 rgba(153,34,34,0.35)',
  glowAccentLg: '0 6px 20px 0 rgba(153,34,34,0.45)',
  glowSuccess: '0 4px 14px 0 rgba(105,152,100,0.35)',
}

/**
 * Default V2 gradients
 */
export const DEFAULT_GRADIENTS: ThemeGradients = {
  primary: 'linear-gradient(to bottom, #0c85b6, #0a6b94)',
  accent: 'linear-gradient(to bottom, #992222, #7a1b1b)',
  success: 'linear-gradient(to bottom, #699864, #527a4e)',
  surface: 'linear-gradient(to bottom, #ffffff, #fafafa)',
}

/**
 * Default V2 glass morphism
 */
export const DEFAULT_GLASS: ThemeGlass = {
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'rgba(255, 255, 255, 0.2)',
  backgroundDark: 'rgba(0, 0, 0, 0.3)',
}

/**
 * Default V2 radii
 */
export const DEFAULT_RADII: ThemeRadii = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
}

/**
 * Default V2 transitions
 */
export const DEFAULT_TRANSITIONS: ThemeTransitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
