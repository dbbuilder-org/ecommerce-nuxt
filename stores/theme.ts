// Theme store using Pinia
// Manages multi-tenant theming

import { defineStore } from 'pinia'
import type { ThemeConfig, ThemeColors } from '~/types/theme'
import { CSS_VARIABLE_MAP, DEFAULT_THEME_COLORS } from '~/types/theme'
import { getTheme, isValidTheme } from '~/config/themes'

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
  },

  actions: {
    /**
     * Initialize theme from various sources (URL, config, default)
     */
    initializeTheme() {
      if (this.isInitialized) return

      // Try to detect theme from various sources
      let themeId = 'default'

      // 1. Check URL parameter
      if (import.meta.client) {
        const urlParams = new URLSearchParams(window.location.search)
        const urlTheme = urlParams.get('theme')
        if (urlTheme && isValidTheme(urlTheme)) {
          themeId = urlTheme
        }

        // 2. Check subdomain
        const hostname = window.location.hostname
        if (hostname.includes('westmoreland')) {
          themeId = 'westmoreland'
        } else if (hostname.includes('windermere')) {
          themeId = 'windermere'
        }

        // 3. Check localStorage for saved preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme && isValidTheme(savedTheme)) {
          themeId = savedTheme
        }
      }

      // 4. Check runtime config
      const config = useRuntimeConfig()
      if (config.public.defaultTheme && isValidTheme(config.public.defaultTheme as string)) {
        themeId = config.public.defaultTheme as string
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

      // Save preference
      if (import.meta.client) {
        localStorage.setItem('theme', themeId)
      }

      // Apply CSS variables
      this.applyCSSVariables()
    },

    /**
     * Apply theme colors as CSS variables
     */
    applyCSSVariables() {
      if (!import.meta.client) return

      const theme = this.currentTheme
      const root = document.documentElement

      // Apply color variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = CSS_VARIABLE_MAP[key as keyof ThemeColors]
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
     * Update Tailwind color utilities
     */
    updateTailwindColors(colors: ThemeColors) {
      if (!import.meta.client) return

      const root = document.documentElement

      // Convert hex to RGB for Tailwind
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
          : null
      }

      // Set primary color RGB values for Tailwind
      const primaryRgb = hexToRgb(colors.primary)
      if (primaryRgb) {
        root.style.setProperty('--color-primary-600', primaryRgb)
      }

      const primaryHoverRgb = hexToRgb(colors.primaryHover)
      if (primaryHoverRgb) {
        root.style.setProperty('--color-primary-700', primaryHoverRgb)
      }

      const primaryLightRgb = hexToRgb(colors.primaryLight)
      if (primaryLightRgb) {
        root.style.setProperty('--color-primary-100', primaryLightRgb)
      }
    },

    /**
     * Reset to default theme
     */
    resetTheme() {
      this.setTheme('default')
    },
  },

  persist: {
    pick: ['currentThemeId'],
  },
})
