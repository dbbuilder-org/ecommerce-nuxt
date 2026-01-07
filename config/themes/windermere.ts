// Windermere School theme
// Enhanced theme with mega menu, search bar, video hero, and scroll effects

import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig } from '~/types/theme'
import { DEFAULT_FEATURES, DEFAULT_HERO } from '~/types/theme'

const features: ThemeFeatures = {
  ...DEFAULT_FEATURES,
  // Windermere-specific enhanced features
  megaMenu: true,
  searchBar: true,
  scrollEffects: true,
  quickActions: true,
  shopByGrade: true,
  videoHero: true,
  featuredCollections: true,
}

const hero: ThemeHeroConfig = {
  ...DEFAULT_HERO,
  // Windermere can use video backgrounds
  gradientClass: 'bg-gradient-to-r from-[#1e3a5f] to-[#0f1f33]',
  overlayClass: 'bg-black/40',
  showScrollIndicator: true,
}

export const windermereTheme: ThemeConfig = {
  id: 'windermere',
  name: 'Windermere',
  schoolName: 'Windermere School Store',
  colors: {
    primary: '#1e3a5f',
    primaryHover: '#152a45',
    primaryLight: '#e8edf3',
    secondary: '#c9a227',
    secondaryHover: '#b08f1f',
    accent: '#c9a227',
    headerBg: '#1e3a5f',
    headerText: '#ffffff',
    buttonBg: '#c9a227',
    buttonText: '#1e3a5f',
    buttonHover: '#b08f1f',
    footerBg: '#0f1f33',
    footerText: '#ffffff',
  },
  borderRadius: '0.5rem',
  features,
  hero,
  // Component overrides for Windermere-specific UI
  componentOverrides: {
    'Header': 'WindermereHeader',
    'HeroSection': 'WindermereHero',
    'LandingPage': 'WindermereLanding',
  },
}
