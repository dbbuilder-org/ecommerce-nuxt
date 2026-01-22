import { describe, it, expect } from 'vitest'
import {
  getTheme,
  isValidTheme,
  getThemeFeatures,
  getThemeHero,
  themeHasFeature,
  getAvailableThemes,
} from '~/config/themes'
import type { ThemeConfig, ThemeFeatures } from '~/types/theme'

describe('Theme Configuration', () => {
  describe('getTheme', () => {
    it('returns windermere theme config', () => {
      const theme = getTheme('windermere')
      expect(theme).toBeDefined()
      expect(theme.id).toBe('windermere')
      expect(theme.name).toBe('Windermere')
    })

    it('returns westmoreland theme config', () => {
      const theme = getTheme('westmoreland')
      expect(theme).toBeDefined()
      expect(theme.id).toBe('westmoreland')
      expect(theme.name).toBe('Westmoreland')
    })

    it('returns default theme for unknown theme ID', () => {
      const theme = getTheme('unknown-theme')
      expect(theme).toBeDefined()
      expect(theme.id).toBe('default')
    })

    it('includes required properties', () => {
      const theme = getTheme('windermere')
      expect(theme.colors).toBeDefined()
      expect(theme.colors.headerColor).toBeDefined()
      expect(theme.colors.buttonColor).toBeDefined()
      expect(theme.schoolName).toBeDefined()
    })
  })

  describe('isValidTheme', () => {
    it('returns true for windermere', () => {
      expect(isValidTheme('windermere')).toBe(true)
    })

    it('returns true for westmoreland', () => {
      expect(isValidTheme('westmoreland')).toBe(true)
    })

    it('returns true for default', () => {
      expect(isValidTheme('default')).toBe(true)
    })

    it('returns false for unknown theme', () => {
      expect(isValidTheme('unknown-theme')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidTheme('')).toBe(false)
    })
  })

  describe('getThemeFeatures', () => {
    it('returns features with defaults for windermere', () => {
      const features = getThemeFeatures('windermere')
      expect(features).toBeDefined()
      expect(typeof features.megaMenu).toBe('boolean')
      expect(typeof features.shippingEnabled).toBe('boolean')
    })

    it('windermere has megaMenu enabled', () => {
      const features = getThemeFeatures('windermere')
      expect(features.megaMenu).toBe(true)
    })

    it('windermere has shipping enabled and pickup disabled', () => {
      const features = getThemeFeatures('windermere')
      expect(features.shippingEnabled).toBe(true)
      expect(features.pickupLocationsEnabled).toBe(false)
    })

    it('westmoreland has pickup enabled and shipping disabled', () => {
      const features = getThemeFeatures('westmoreland')
      expect(features.pickupLocationsEnabled).toBe(true)
      expect(features.shippingEnabled).toBe(false)
    })

    it('returns defaults for unknown theme', () => {
      const features = getThemeFeatures('unknown-theme')
      expect(features).toBeDefined()
      expect(features.heroSection).toBe(true) // default
    })
  })

  describe('themeHasFeature', () => {
    it('returns true when windermere has megaMenu', () => {
      expect(themeHasFeature('windermere', 'megaMenu')).toBe(true)
    })

    it('returns false when westmoreland does not have megaMenu', () => {
      expect(themeHasFeature('westmoreland', 'megaMenu')).toBe(false)
    })

    it('returns true when windermere has searchBar', () => {
      expect(themeHasFeature('windermere', 'searchBar')).toBe(true)
    })
  })

  describe('getThemeHero', () => {
    it('returns hero config for windermere', () => {
      const hero = getThemeHero('windermere')
      expect(hero).toBeDefined()
      expect(hero.title).toBeDefined()
      expect(hero.ctaPrimary).toBeDefined()
    })

    it('includes default values', () => {
      const hero = getThemeHero('windermere')
      expect(hero.ctaLink).toBe('/shop')
    })
  })

  describe('getAvailableThemes', () => {
    it('returns array of themes', () => {
      const themes = getAvailableThemes()
      expect(Array.isArray(themes)).toBe(true)
      expect(themes.length).toBeGreaterThanOrEqual(3)
    })

    it('includes windermere and westmoreland', () => {
      const themes = getAvailableThemes()
      const themeIds = themes.map((t) => t.id)
      expect(themeIds).toContain('windermere')
      expect(themeIds).toContain('westmoreland')
      expect(themeIds).toContain('default')
    })
  })

  describe('Theme Colors', () => {
    it('windermere uses navy primary color', () => {
      const theme = getTheme('windermere')
      expect(theme.colors.headerColor).toBe('#02233c')
    })

    it('windermere uses teal accent color', () => {
      const theme = getTheme('windermere')
      expect(theme.colors.buttonColor).toBe('#9bd3dd')
    })

    it('westmoreland uses blue colors', () => {
      const theme = getTheme('westmoreland')
      expect(theme.colors.headerColor).toBe('#7EB3D7')
    })

    it('all themes have required color properties', () => {
      const themes = getAvailableThemes()
      themes.forEach((theme) => {
        expect(theme.colors.headerColor).toBeDefined()
        expect(theme.colors.buttonColor).toBeDefined()
        expect(theme.colors.primaryActionBg).toBeDefined()
        expect(theme.colors.textColor).toBeDefined()
      })
    })
  })
})
