/**
 * Theme composable - provides access to theme configuration and veneer system
 */
import { getTheme } from '~/config/themes'
import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig } from '~/types/theme'
import { DEFAULT_FEATURES, DEFAULT_HERO } from '~/types/theme'

export function useTheme() {
  const config = useRuntimeConfig()
  const themeId = config.public.defaultTheme || 'westmoreland'

  // Get the current theme configuration
  const theme = computed<ThemeConfig>(() => getTheme(themeId))

  // Get theme features with defaults
  const features = computed<ThemeFeatures>(() => ({
    ...DEFAULT_FEATURES,
    ...theme.value.features,
  }))

  // Get hero configuration with defaults
  const heroConfig = computed<ThemeHeroConfig>(() => ({
    ...DEFAULT_HERO,
    ...theme.value.hero,
    // Override with runtime config if set
    videoSrc: config.public.heroVideoSrc as string || theme.value.hero?.videoSrc,
    imageSrc: config.public.heroImageSrc as string || theme.value.hero?.imageSrc,
  }))

  // Check if a feature is enabled
  function hasFeature(feature: keyof ThemeFeatures): boolean {
    return features.value[feature] === true
  }

  // Get component override name (veneer system)
  function getComponentOverride(componentName: string): string | null {
    return theme.value.componentOverrides?.[componentName] || null
  }

  // Check if theme has component override
  function hasComponentOverride(componentName: string): boolean {
    return !!theme.value.componentOverrides?.[componentName]
  }

  // Apply CSS variables to document
  function applyCSSVariables() {
    if (import.meta.server) return

    const root = document.documentElement
    const colors = theme.value.colors

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${kebabCase(key)}`, value)
    })

    // Apply border radius
    if (theme.value.borderRadius) {
      root.style.setProperty('--theme-border-radius', theme.value.borderRadius)
    }

    // Apply font family
    if (theme.value.fontFamily) {
      root.style.setProperty('--theme-font-family', theme.value.fontFamily)
    }
  }

  // Helper: convert camelCase to kebab-case
  function kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  return {
    theme,
    themeId,
    features,
    heroConfig,
    hasFeature,
    getComponentOverride,
    hasComponentOverride,
    applyCSSVariables,
  }
}
