// Windermere School theme
// Nord Anglia Education - Navy and teal accent theme
// Enhanced features: mega menu, shipping only, scroll effects

import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig, ThemeColors, ThemeShadows, ThemeGradients } from '~/types/theme'
import { DEFAULT_FEATURES, DEFAULT_HERO } from '~/types/theme'

const features: ThemeFeatures = {
  ...DEFAULT_FEATURES,
  // Header features
  megaMenu: true,
  searchBar: true,
  scrollEffects: true,
  contactInMenu: true,
  instagramLink: true,

  // Landing page features
  heroSection: true,
  quickActions: true,
  shopByGrade: true,
  shopByCollection: true,
  featuredItems: true,
  videoHero: false, // Can enable for video backgrounds
  featuredCollections: true,
  promoBanner: false,

  // Checkout - Windermere is SHIPPING ONLY (no pickup)
  pickupLocationsEnabled: false,
  shippingEnabled: true,

  // UI enhancements
  glassEffects: true,
  softShadows: true,
  animatedGradients: false,
}

const hero: ThemeHeroConfig = {
  ...DEFAULT_HERO,
  gradientClass: 'bg-gradient-to-r from-[#02233c] to-[#0f1f33]',
  overlayClass: 'bg-[#02233c]/70',
  showScrollIndicator: true,
  title: 'Campus Store',
  subtitle: 'Nord Anglia Education',
  description: 'Shop uniforms, supplies, and spirit wear for the Windermere community',
  ctaPrimary: 'Shop Now',
  ctaSecondary: 'Sign In',
  ctaLink: '/shop',
}

/**
 * Windermere Colors - Navy primary with teal accent
 * Primary: #02233c (Navy)
 * Accent: #9bd3dd (Teal)
 */
const colors: ThemeColors = {
  // Header - Navy background
  headerColor: '#02233c',
  headerHover: '#041e32',
  headerTextColor: '#FFFFFF',
  headerButtonColor: '#9bd3dd',
  headerButtonTextColor: '#02233c',

  // Frame
  frameColor: '#02233c',
  backgroundColor: '#FFFFFF',

  // Buttons - Teal accent
  buttonColor: '#9bd3dd',
  buttonHover: '#7cc4d0',
  buttonTextColor: '#02233c',

  // Primary action - Uses NAVY for contrast on light backgrounds
  // This is different from buttonColor to ensure good contrast
  primaryActionBg: '#02233c',
  primaryActionBgHover: '#041e32',

  // Highlight/accent - Teal
  highlightButtonColor: '#9bd3dd',
  highlightButtonHover: '#7cc4d0',

  // Text
  textColor: '#02233c',
  lightTextColor: '#FFFFFF',

  // Status
  alertColor: '#E32323',
  alertHover: '#c21e1e',
  successColor: '#22c55e',
  successHover: '#16a34a',
  inactiveColor: '#94a3b8',
}

/**
 * Windermere-specific shadows with navy tints
 */
const shadows: Partial<ThemeShadows> = {
  soft: '0 2px 8px -2px rgba(2,35,60,0.08), 0 4px 20px -4px rgba(2,35,60,0.12)',
  softLg: '0 8px 30px -6px rgba(2,35,60,0.15)',
  glowPrimary: '0 4px 14px 0 rgba(2,35,60,0.4)',
  glowAccent: '0 4px 14px 0 rgba(155,211,221,0.4)',
}

/**
 * Windermere-specific gradients
 */
const gradients: Partial<ThemeGradients> = {
  primary: 'linear-gradient(to bottom, #02233c, #041e32)',
  accent: 'linear-gradient(to bottom, #9bd3dd, #7cc4d0)',
  surface: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
}

export const windermereTheme: ThemeConfig = {
  id: 'windermere',
  name: 'Windermere',
  schoolName: 'Windermere Campus Store',
  colors,
  borderRadius: '0', // Sharp corners for Windermere
  shadows,
  gradients,
  features,
  hero,
  // Component overrides for Windermere-specific UI
  componentOverrides: {
    Header: 'WindermereHeader',
    HeroSection: 'WindermereHero',
    LandingPage: 'WindermereLanding',
  },
}
