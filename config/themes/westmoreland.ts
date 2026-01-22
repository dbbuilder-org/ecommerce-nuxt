// Westmoreland County Community College theme
// Blue theme with standard features - pickup-focused community college bookstore

import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig, ThemeColors, ThemeShadows, ThemeGradients, ThemeGlass, ThemeRadii, ThemeTransitions } from '~/types/theme'
import { DEFAULT_FEATURES, DEFAULT_HERO, DEFAULT_THEME_COLORS, DEFAULT_TRANSITIONS } from '~/types/theme'

const features: ThemeFeatures = {
  ...DEFAULT_FEATURES,
  // Westmoreland uses standard features with pickup locations
  pickupLocationsEnabled: true,
  shippingEnabled: false,
}

const hero: ThemeHeroConfig = {
  ...DEFAULT_HERO,
  gradientClass: 'bg-gradient-to-r from-[#035891] to-[#024572]',
  overlayClass: 'bg-black/20',
  title: 'Welcome to the Bookstore',
  subtitle: 'Westmoreland County Community College',
  ctaPrimary: 'Shop Now',
}

const colors: ThemeColors = {
  // Header - Blue theme
  headerColor: '#7EB3D7',
  headerHover: '#5a9bc7',
  headerTextColor: '#FFFFFF',
  headerButtonColor: '#992222',
  headerButtonTextColor: '#699864',

  // Frame
  frameColor: '#79bce1',
  backgroundColor: '#FFFFFF',

  // Buttons - Blue accent
  buttonColor: '#0c85b6',
  buttonHover: '#0a6b94',
  buttonTextColor: '#FFFFFF',

  // Primary action (same as button for Westmoreland)
  primaryActionBg: '#0c85b6',
  primaryActionBgHover: '#0a6b94',

  // Highlight/accent - Red for contrast
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
 * Westmoreland-specific shadows with blue tints
 */
const shadows: Partial<ThemeShadows> = {
  soft: '0 2px 8px -2px rgba(12,133,182,0.08), 0 4px 20px -4px rgba(12,133,182,0.12)',
  softSm: '0 1px 3px rgba(12,133,182,0.12), 0 1px 2px rgba(12,133,182,0.08)',
  softLg: '0 8px 30px -6px rgba(12,133,182,0.15)',
  softXl: '0 10px 40px -10px rgba(12,133,182,0.2)',
  glowPrimary: '0 4px 14px 0 rgba(126,179,215,0.4)',
  glowPrimaryLg: '0 6px 20px 0 rgba(126,179,215,0.5)',
  glowAccent: '0 4px 14px 0 rgba(12,133,182,0.4)',
  glowAccentLg: '0 6px 20px 0 rgba(12,133,182,0.5)',
  glowSuccess: '0 4px 14px 0 rgba(105,152,100,0.35)',
}

/**
 * Westmoreland-specific gradients
 */
const gradients: Partial<ThemeGradients> = {
  primary: 'linear-gradient(to bottom, #7EB3D7, #5a9bc7)',
  accent: 'linear-gradient(to bottom, #0c85b6, #0a6b94)',
  surface: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
  success: 'linear-gradient(to bottom, #699864, #527a4d)',
}

/**
 * Westmoreland glass effects (subtle)
 */
const glass: Partial<ThemeGlass> = {
  background: 'rgba(255, 255, 255, 0.7)',
  border: 'rgba(126, 179, 215, 0.2)',
  backgroundDark: 'rgba(126, 179, 215, 0.9)',
}

/**
 * Westmoreland border radii (rounded corners - community feel)
 */
const radii: Partial<ThemeRadii> = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
}

export const westmorelandTheme: ThemeConfig = {
  id: 'westmoreland',
  name: 'Westmoreland',
  schoolName: 'Westmoreland Bookstore',
  colors,
  borderRadius: '0.5rem',
  shadows,
  gradients,
  glass,
  radii,
  transitions: DEFAULT_TRANSITIONS,
  features,
  hero,
  // Component overrides for Westmoreland-specific UI
  componentOverrides: {
    Header: 'WestmorelandHeader',
    HeroSection: 'WestmorelandHero',
    LandingPage: 'WestmorelandLanding',
  },
}
