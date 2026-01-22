/**
 * Component Registry for the Veneer System
 *
 * The veneer system allows theme-specific component overrides.
 * When a theme defines an override for a component, the themed version
 * is loaded instead of the base component.
 *
 * Usage:
 * - Register base components with their default implementations
 * - Register theme overrides for specific themes
 * - Use getThemedComponent() to resolve the correct component
 */

import { defineAsyncComponent, type Component } from 'vue'

// Type for async component loader
type AsyncComponentLoader = () => Promise<{ default: Component }>

/**
 * Base component registry
 * Maps component names to their default implementations
 */
const baseComponents: Record<string, AsyncComponentLoader> = {
  // Layout components
  Header: () => import('~/components/layout/Header.vue'),
  Footer: () => import('~/components/layout/Footer.vue'),

  // Landing page components
  HeroSection: () => import('~/components/layout/HeroSection.vue'),
  LandingContent: () => import('~/components/layout/LandingContent.vue'),

  // Shop components (can be overridden per theme)
  FeaturedItems: () => import('~/components/shop/FeaturedItems.vue'),
  ProductCard: () => import('~/components/shop/ProductCard.vue'),
}

/**
 * Theme-specific component overrides
 * Each theme can override specific components
 */
const themeOverrides: Record<string, Record<string, AsyncComponentLoader>> = {
  windermere: {
    Header: () => import('~/components/theme/windermere/WindermereHeader.vue'),
    HeroSection: () => import('~/components/theme/windermere/WindermereHero.vue'),
    LandingContent: () => import('~/components/theme/windermere/WindermereLanding.vue'),
  },
  westmoreland: {
    Header: () => import('~/components/theme/westmoreland/WestmorelandHeader.vue'),
    HeroSection: () => import('~/components/theme/westmoreland/WestmorelandHero.vue'),
    LandingContent: () => import('~/components/theme/westmoreland/WestmorelandLanding.vue'),
  },
}

/**
 * Get the themed component loader for a given component name
 *
 * @param componentName - The base component name (e.g., 'Header', 'HeroSection')
 * @param themeId - The current theme ID (e.g., 'windermere', 'westmoreland')
 * @returns AsyncComponentLoader for the appropriate component
 */
export function getThemedComponentLoader(
  componentName: string,
  themeId: string
): AsyncComponentLoader | null {
  // Check for theme-specific override first
  const themeComponents = themeOverrides[themeId]
  if (themeComponents && themeComponents[componentName]) {
    return themeComponents[componentName]
  }

  // Fall back to base component
  if (baseComponents[componentName]) {
    return baseComponents[componentName]
  }

  return null
}

/**
 * Get an async component with proper loading/error states
 *
 * @param componentName - The base component name
 * @param themeId - The current theme ID
 * @returns Vue async component definition
 */
export function getThemedComponent(componentName: string, themeId: string): Component | null {
  const loader = getThemedComponentLoader(componentName, themeId)

  if (!loader) {
    console.warn(`[Veneer] Component "${componentName}" not found in registry`)
    return null
  }

  return defineAsyncComponent({
    loader,
    loadingComponent: undefined, // Could add a loading spinner component
    errorComponent: undefined, // Could add an error component
    delay: 200, // Show loading after 200ms
    timeout: 10000, // Timeout after 10s
  })
}

/**
 * Check if a theme has an override for a specific component
 *
 * @param componentName - The base component name
 * @param themeId - The theme to check
 * @returns true if the theme has an override
 */
export function hasThemeOverride(componentName: string, themeId: string): boolean {
  const themeComponents = themeOverrides[themeId]
  return !!(themeComponents && themeComponents[componentName])
}

/**
 * Get all component overrides for a theme
 *
 * @param themeId - The theme ID
 * @returns Record of component names to loaders
 */
export function getThemeOverrides(themeId: string): Record<string, AsyncComponentLoader> {
  return themeOverrides[themeId] || {}
}

/**
 * Get list of all registered base component names
 */
export function getRegisteredComponents(): string[] {
  return Object.keys(baseComponents)
}

/**
 * Get list of themes that have any overrides
 */
export function getThemesWithOverrides(): string[] {
  return Object.keys(themeOverrides).filter((themeId: string) => {
    const overrides = themeOverrides[themeId]
    return overrides && Object.keys(overrides).length > 0
  })
}

/**
 * Register a new base component (for dynamic registration)
 * Note: This should rarely be used - prefer static registration above
 */
export function registerBaseComponent(name: string, loader: AsyncComponentLoader): void {
  baseComponents[name] = loader
}

/**
 * Register a theme override (for dynamic registration)
 * Note: This should rarely be used - prefer static registration above
 */
export function registerThemeOverride(
  themeId: string,
  componentName: string,
  loader: AsyncComponentLoader
): void {
  if (!themeOverrides[themeId]) {
    themeOverrides[themeId] = {}
  }
  themeOverrides[themeId][componentName] = loader
}
