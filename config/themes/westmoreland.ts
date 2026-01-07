// Westmoreland County Community College theme

import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig } from '~/types/theme'
import { DEFAULT_FEATURES, DEFAULT_HERO } from '~/types/theme'

const features: ThemeFeatures = {
  ...DEFAULT_FEATURES,
  // Westmoreland uses standard features
}

const hero: ThemeHeroConfig = {
  ...DEFAULT_HERO,
  gradientClass: 'bg-gradient-to-r from-[#035891] to-[#024572]',
  overlayClass: 'bg-black/20',
}

export const westmorelandTheme: ThemeConfig = {
  id: 'westmoreland',
  name: 'Westmoreland',
  schoolName: 'Westmoreland Bookstore',
  colors: {
    primary: '#035891',
    primaryHover: '#024572',
    primaryLight: '#e6f0f7',
    secondary: '#7EB3D7',
    secondaryHover: '#5a9bc7',
    accent: '#FFB81C',
    headerBg: '#035891',
    headerText: '#ffffff',
    buttonBg: '#035891',
    buttonText: '#ffffff',
    buttonHover: '#024572',
    footerBg: '#1e3a5f',
    footerText: '#ffffff',
  },
  borderRadius: '0.75rem',
  features,
  hero,
}
