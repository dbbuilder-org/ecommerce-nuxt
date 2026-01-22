/**
 * Veneer System - Theme-based Component Override System
 *
 * The veneer system allows each theme to optionally override base components
 * with theme-specific implementations. This enables visual customization
 * while maintaining a single codebase.
 *
 * Key concepts:
 * - Base components: Default implementations in components/
 * - Theme overrides: Theme-specific versions in components/theme/{themeId}/
 * - ThemedComponent: Wrapper that automatically resolves the correct component
 *
 * Usage:
 *
 * 1. Register components in componentRegistry.ts
 * 2. Use <ThemedComponent name="ComponentName" /> in templates
 * 3. The correct version loads based on current theme
 *
 * Example:
 * ```vue
 * <ThemedComponent name="Header" />
 * ```
 *
 * For Windermere theme, this loads WindermereHeader.vue
 * For other themes, this loads the base Header.vue
 */

export {
  getThemedComponent,
  getThemedComponentLoader,
  hasThemeOverride,
  getThemeOverrides,
  getRegisteredComponents,
  getThemesWithOverrides,
  registerBaseComponent,
  registerThemeOverride,
} from './componentRegistry'

/**
 * Helper composable for using veneer system in components
 */
export function useVeneer() {
  const themeStore = useThemeStore()

  /**
   * Check if current theme has an override for a component
   */
  function hasOverride(componentName: string): boolean {
    return hasThemeOverride(componentName, themeStore.currentThemeId)
  }

  /**
   * Get the themed component for the current theme
   */
  function getComponent(componentName: string) {
    return getThemedComponent(componentName, themeStore.currentThemeId)
  }

  /**
   * Get all overrides for the current theme
   */
  function getCurrentThemeOverrides() {
    return getThemeOverrides(themeStore.currentThemeId)
  }

  return {
    hasOverride,
    getComponent,
    getCurrentThemeOverrides,
    currentThemeId: computed(() => themeStore.currentThemeId),
  }
}

// Re-export from componentRegistry for convenience
import { getThemedComponent, hasThemeOverride, getThemeOverrides } from './componentRegistry'
import { useThemeStore } from '~/stores/theme'
import { computed } from 'vue'
