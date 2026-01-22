/**
 * Theme composable - provides access to theme configuration and veneer system
 * Wraps the theme store for reactive access to theme state
 */
import { useThemeStore } from '~/stores/theme'
import type { ThemeConfig, ThemeFeatures, ThemeHeroConfig, ThemeColors } from '~/types/theme'
import { DEFAULT_HERO } from '~/types/theme'

export function useTheme() {
  const themeStore = useThemeStore()
  const config = useRuntimeConfig()

  // Initialize theme on first use
  if (!themeStore.isInitialized) {
    themeStore.initializeTheme()
  }

  // Get the current theme ID
  const themeId = computed(() => themeStore.currentThemeId)

  // Get the current theme configuration
  const theme = computed<ThemeConfig>(() => themeStore.currentTheme)

  // Get theme colors
  const colors = computed<ThemeColors>(() => themeStore.colors)

  // Get theme features (with defaults merged in store)
  const features = computed<ThemeFeatures>(() => themeStore.features)

  // Get hero configuration with defaults
  const heroConfig = computed<ThemeHeroConfig>(() => ({
    ...DEFAULT_HERO,
    ...theme.value.hero,
    // Override with runtime config if set
    videoSrc: (config.public.heroVideoSrc as string) || theme.value.hero?.videoSrc,
    imageSrc: (config.public.heroImageSrc as string) || theme.value.hero?.imageSrc,
  }))

  // Check if a feature is enabled
  function hasFeature(feature: keyof ThemeFeatures): boolean {
    return themeStore.hasFeature(feature)
  }

  // Convenience getters for common features
  const hasMegaMenu = computed(() => themeStore.hasMegaMenu)
  const hasSearchBar = computed(() => themeStore.hasSearchBar)
  const hasScrollEffects = computed(() => themeStore.hasScrollEffects)
  const hasQuickActions = computed(() => themeStore.hasQuickActions)
  const isShippingEnabled = computed(() => themeStore.isShippingEnabled)
  const isPickupEnabled = computed(() => themeStore.isPickupEnabled)
  const hasFeaturedItems = computed(() => features.value.featuredItems)
  const hasShopByGrade = computed(() => features.value.shopByGrade)
  const hasShopByCollection = computed(() => features.value.shopByCollection)

  // Get component override name (veneer system)
  function getComponentOverride(componentName: string): string | null {
    return theme.value.componentOverrides?.[componentName] || null
  }

  // Check if theme has component override
  function hasComponentOverride(componentName: string): boolean {
    return !!theme.value.componentOverrides?.[componentName]
  }

  // Apply CSS variables to document (delegates to store)
  function applyCSSVariables() {
    themeStore.applyCSSVariables()
  }

  // Set theme (delegates to store)
  function setTheme(newThemeId: string) {
    themeStore.setTheme(newThemeId)
  }

  return {
    // Core
    theme,
    themeId,
    colors,
    features,
    heroConfig,

    // Feature checks
    hasFeature,
    hasMegaMenu,
    hasSearchBar,
    hasScrollEffects,
    hasQuickActions,
    isShippingEnabled,
    isPickupEnabled,
    hasFeaturedItems,
    hasShopByGrade,
    hasShopByCollection,

    // Veneer system
    getComponentOverride,
    hasComponentOverride,

    // Actions
    applyCSSVariables,
    setTheme,
  }
}
