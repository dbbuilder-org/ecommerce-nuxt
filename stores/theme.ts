// Theme store using Pinia
// Manages multi-tenant theming with V1 colors and V2 enhancements

import { defineStore } from 'pinia'
import type {
  ThemeConfig,
  ThemeColors,
  ThemeShadows,
  ThemeGradients,
  ThemeGlass,
  ThemeRadii,
  ThemeTransitions,
  ThemeFeatures,
} from '~/types/theme'
import {
  CSS_VARIABLE_MAP,
  SHADOW_CSS_VARIABLE_MAP,
  GRADIENT_CSS_VARIABLE_MAP,
  GLASS_CSS_VARIABLE_MAP,
  RADII_CSS_VARIABLE_MAP,
  TRANSITION_CSS_VARIABLE_MAP,
  DEFAULT_SHADOWS,
  DEFAULT_GRADIENTS,
  DEFAULT_GLASS,
  DEFAULT_RADII,
  DEFAULT_TRANSITIONS,
  DEFAULT_FEATURES,
} from '~/types/theme'
import { getTheme, isValidTheme, getThemeFeatures } from '~/config/themes'

interface ThemeState {
  currentThemeId: string
  isInitialized: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    currentThemeId: 'default',
    isInitialized: false,
  }),

  getters: {
    currentTheme: (state): ThemeConfig => getTheme(state.currentThemeId),
    schoolName: (state): string => getTheme(state.currentThemeId).schoolName,
    colors: (state): ThemeColors => getTheme(state.currentThemeId).colors,
    features: (state): ThemeFeatures => getThemeFeatures(state.currentThemeId),

    // Convenience getters for common feature checks
    hasMegaMenu: (state): boolean => getThemeFeatures(state.currentThemeId).megaMenu,
    hasSearchBar: (state): boolean => getThemeFeatures(state.currentThemeId).searchBar,
    hasScrollEffects: (state): boolean => getThemeFeatures(state.currentThemeId).scrollEffects,
    hasQuickActions: (state): boolean => getThemeFeatures(state.currentThemeId).quickActions,
    hasFeaturedItems: (state): boolean => getThemeFeatures(state.currentThemeId).featuredItems,
    hasShopByGrade: (state): boolean => getThemeFeatures(state.currentThemeId).shopByGrade,
    hasShopByCollection: (state): boolean => getThemeFeatures(state.currentThemeId).shopByCollection,
    isShippingEnabled: (state): boolean => getThemeFeatures(state.currentThemeId).shippingEnabled,
    isPickupEnabled: (state): boolean => getThemeFeatures(state.currentThemeId).pickupLocationsEnabled,
  },

  actions: {
    /**
     * Initialize theme from various sources (URL, config, default)
     */
    initializeTheme() {
      if (this.isInitialized) return

      // Try to detect theme from various sources
      let themeId = 'default'

      // 1. Check runtime config FIRST (highest priority for deployment)
      const config = useRuntimeConfig()
      if (config.public.defaultTheme && isValidTheme(config.public.defaultTheme as string)) {
        themeId = config.public.defaultTheme as string
      }

      // 2. Client-side detection (can override if more specific)
      if (import.meta.client) {
        // Check subdomain
        const hostname = window.location.hostname
        if (hostname.includes('westmoreland')) {
          themeId = 'westmoreland'
        } else if (hostname.includes('windermere')) {
          themeId = 'windermere'
        }

        // Check URL parameter (allows ?theme=windermere for testing)
        const urlParams = new URLSearchParams(window.location.search)
        const urlTheme = urlParams.get('theme')
        if (urlTheme && isValidTheme(urlTheme)) {
          themeId = urlTheme
        }
      }

      this.setTheme(themeId)
      this.isInitialized = true
    },

    /**
     * Set and apply a theme
     */
    setTheme(themeId: string) {
      if (!isValidTheme(themeId)) {
        console.warn(`Invalid theme: ${themeId}, falling back to default`)
        themeId = 'default'
      }

      this.currentThemeId = themeId

      // Save preference (client-side only)
      if (import.meta.client) {
        localStorage.setItem('theme', themeId)
      }

      // Apply all CSS variables
      this.applyCSSVariables()
    },

    /**
     * Apply theme colors and V2 enhancements as CSS variables
     */
    applyCSSVariables() {
      if (!import.meta.client) return

      const theme = this.currentTheme
      const root = document.documentElement

      // Apply V1 core color variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = CSS_VARIABLE_MAP[key as keyof ThemeColors]
        if (cssVar) {
          root.style.setProperty(cssVar, value)
        }
      })

      // Apply V2 shadows
      const shadows = { ...DEFAULT_SHADOWS, ...theme.shadows }
      Object.entries(shadows).forEach(([key, value]) => {
        const cssVar = SHADOW_CSS_VARIABLE_MAP[key as keyof ThemeShadows]
        if (cssVar) {
          root.style.setProperty(cssVar, value)
        }
      })

      // Apply V2 gradients
      const gradients = { ...DEFAULT_GRADIENTS, ...theme.gradients }
      Object.entries(gradients).forEach(([key, value]) => {
        const cssVar = GRADIENT_CSS_VARIABLE_MAP[key as keyof ThemeGradients]
        if (cssVar) {
          root.style.setProperty(cssVar, value)
        }
      })

      // Apply V2 glass morphism
      const glass = { ...DEFAULT_GLASS, ...theme.glass }
      Object.entries(glass).forEach(([key, value]) => {
        const cssVar = GLASS_CSS_VARIABLE_MAP[key as keyof ThemeGlass]
        if (cssVar) {
          root.style.setProperty(cssVar, value)
        }
      })

      // Apply V2 radii
      const radii = { ...DEFAULT_RADII, ...theme.radii }
      Object.entries(radii).forEach(([key, value]) => {
        const cssVar = RADII_CSS_VARIABLE_MAP[key as keyof ThemeRadii]
        if (cssVar) {
          root.style.setProperty(cssVar, value)
        }
      })

      // Apply V2 transitions
      const transitions = { ...DEFAULT_TRANSITIONS, ...theme.transitions }
      Object.entries(transitions).forEach(([key, value]) => {
        const cssVar = TRANSITION_CSS_VARIABLE_MAP[key as keyof ThemeTransitions]
        if (cssVar) {
          root.style.setProperty(cssVar, value)
        }
      })

      // Apply border radius if specified
      if (theme.borderRadius) {
        root.style.setProperty('--theme-radius', theme.borderRadius)
      }

      // Apply font family if specified
      if (theme.fontFamily) {
        root.style.setProperty('--theme-font', theme.fontFamily)
      }

      // Update Tailwind primary color classes dynamically
      this.updateTailwindColors(theme.colors)
    },

    /**
     * Update Tailwind color utilities based on theme colors
     */
    updateTailwindColors(colors: ThemeColors) {
      if (!import.meta.client) return

      const root = document.documentElement

      // Convert hex to RGB for Tailwind
      const hexToRgb = (hex: string): string | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (result && result[1] && result[2] && result[3]) {
          return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        }
        return null
      }

      // Set primary button color RGB values for Tailwind
      const buttonColorRgb = hexToRgb(colors.buttonColor)
      if (buttonColorRgb) {
        root.style.setProperty('--color-primary-600', buttonColorRgb)
      }

      const buttonHoverRgb = hexToRgb(colors.buttonHover)
      if (buttonHoverRgb) {
        root.style.setProperty('--color-primary-700', buttonHoverRgb)
      }

      // Header color for primary-500/400
      const headerColorRgb = hexToRgb(colors.headerColor)
      if (headerColorRgb) {
        root.style.setProperty('--color-primary-500', headerColorRgb)
      }

      // Success color
      const successRgb = hexToRgb(colors.successColor)
      if (successRgb) {
        root.style.setProperty('--color-success-600', successRgb)
      }

      // Alert/error color
      const alertRgb = hexToRgb(colors.alertColor)
      if (alertRgb) {
        root.style.setProperty('--color-red-600', alertRgb)
      }
    },

    /**
     * Reset to default theme
     */
    resetTheme() {
      this.setTheme('default')
    },

    /**
     * Check if current theme has a specific feature enabled
     */
    hasFeature(feature: keyof ThemeFeatures): boolean {
      return this.features[feature] ?? false
    },
  },

  persist: {
    pick: ['currentThemeId'],
  },
})
