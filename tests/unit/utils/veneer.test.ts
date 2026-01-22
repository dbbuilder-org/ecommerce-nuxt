import { describe, it, expect } from 'vitest'
import {
  getThemedComponentLoader,
  hasThemeOverride,
  getThemeOverrides,
  getRegisteredComponents,
  getThemesWithOverrides,
} from '~/utils/veneer/componentRegistry'

describe('Veneer System - Component Registry', () => {
  describe('getThemedComponentLoader', () => {
    it('returns theme-specific override for windermere Header', () => {
      const loader = getThemedComponentLoader('Header', 'windermere')
      expect(loader).toBeDefined()
      expect(typeof loader).toBe('function')
    })

    it('returns base component when no theme override exists', () => {
      const loader = getThemedComponentLoader('Header', 'westmoreland')
      expect(loader).toBeDefined()
      expect(typeof loader).toBe('function')
    })

    it('returns base component for unregistered theme', () => {
      const loader = getThemedComponentLoader('Header', 'unknown-theme')
      expect(loader).toBeDefined()
    })

    it('returns null for unregistered component', () => {
      const loader = getThemedComponentLoader('NonExistentComponent', 'windermere')
      expect(loader).toBeNull()
    })
  })

  describe('hasThemeOverride', () => {
    it('returns true when windermere has Header override', () => {
      expect(hasThemeOverride('Header', 'windermere')).toBe(true)
    })

    it('returns true when windermere has HeroSection override', () => {
      expect(hasThemeOverride('HeroSection', 'windermere')).toBe(true)
    })

    it('returns true when westmoreland has Header override', () => {
      expect(hasThemeOverride('Header', 'westmoreland')).toBe(true)
    })

    it('returns true when westmoreland has HeroSection override', () => {
      expect(hasThemeOverride('HeroSection', 'westmoreland')).toBe(true)
    })

    it('returns false for unknown theme', () => {
      expect(hasThemeOverride('Header', 'unknown-theme')).toBe(false)
    })

    it('returns false for unregistered component', () => {
      expect(hasThemeOverride('NonExistentComponent', 'windermere')).toBe(false)
    })
  })

  describe('getThemeOverrides', () => {
    it('returns all overrides for windermere', () => {
      const overrides = getThemeOverrides('windermere')
      expect(overrides).toBeDefined()
      expect(Object.keys(overrides).length).toBeGreaterThan(0)
      expect('Header' in overrides).toBe(true)
      expect('HeroSection' in overrides).toBe(true)
    })

    it('returns all overrides for westmoreland', () => {
      const overrides = getThemeOverrides('westmoreland')
      expect(overrides).toBeDefined()
      expect(Object.keys(overrides).length).toBeGreaterThan(0)
      expect('Header' in overrides).toBe(true)
      expect('HeroSection' in overrides).toBe(true)
      expect('LandingContent' in overrides).toBe(true)
    })

    it('returns empty object for unknown theme', () => {
      const overrides = getThemeOverrides('unknown-theme')
      expect(overrides).toEqual({})
    })
  })

  describe('getRegisteredComponents', () => {
    it('returns array of component names', () => {
      const components = getRegisteredComponents()
      expect(Array.isArray(components)).toBe(true)
      expect(components.length).toBeGreaterThan(0)
    })

    it('includes essential components', () => {
      const components = getRegisteredComponents()
      expect(components).toContain('Header')
      expect(components).toContain('Footer')
      expect(components).toContain('HeroSection')
      expect(components).toContain('FeaturedItems')
      expect(components).toContain('ProductCard')
    })
  })

  describe('getThemesWithOverrides', () => {
    it('returns themes that have overrides', () => {
      const themes = getThemesWithOverrides()
      expect(Array.isArray(themes)).toBe(true)
      expect(themes).toContain('windermere')
      expect(themes).toContain('westmoreland')
    })

    it('includes both windermere and westmoreland with overrides', () => {
      const themes = getThemesWithOverrides()
      expect(themes.length).toBeGreaterThanOrEqual(2)
    })
  })
})
