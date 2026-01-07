import { describe, it, expect } from 'vitest'
import { cn } from '~/utils/cn'

describe('cn utility', () => {
  describe('basic class merging', () => {
    it('merges single class strings', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('merges multiple class strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('handles empty strings', () => {
      expect(cn('')).toBe('')
      expect(cn('foo', '', 'bar')).toBe('foo bar')
    })

    it('handles undefined and null', () => {
      expect(cn(undefined)).toBe('')
      expect(cn(null)).toBe('')
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })
  })

  describe('conditional classes', () => {
    it('handles boolean conditions in objects', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo')
      expect(cn({ foo: true, bar: true })).toBe('foo bar')
    })

    it('handles mixed strings and objects', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active')
    })

    it('handles arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
      expect(cn(['foo', { bar: true }])).toBe('foo bar')
    })
  })

  describe('tailwind class merging', () => {
    it('merges conflicting tailwind classes correctly', () => {
      // Later class should override earlier conflicting class
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
      expect(cn('p-4', 'p-8')).toBe('p-8')
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('preserves non-conflicting tailwind classes', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
      expect(cn('p-4', 'm-4')).toBe('p-4 m-4')
    })

    it('handles responsive variants', () => {
      expect(cn('text-sm', 'md:text-lg')).toBe('text-sm md:text-lg')
      expect(cn('p-2', 'md:p-4', 'lg:p-8')).toBe('p-2 md:p-4 lg:p-8')
    })

    it('handles state variants', () => {
      expect(cn('bg-blue-500', 'hover:bg-blue-600')).toBe('bg-blue-500 hover:bg-blue-600')
      expect(cn('text-gray-500', 'focus:text-gray-900')).toBe('text-gray-500 focus:text-gray-900')
    })

    it('merges conflicting variants correctly', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500')
      expect(cn('md:p-4', 'md:p-8')).toBe('md:p-8')
    })
  })

  describe('complex scenarios', () => {
    it('handles component-style class composition', () => {
      const baseClasses = 'px-4 py-2 rounded-lg font-medium'
      const variantClasses = { 'bg-primary-600 text-white': true }
      const sizeClasses = 'text-sm'

      expect(cn(baseClasses, variantClasses, sizeClasses)).toContain('px-4')
      expect(cn(baseClasses, variantClasses, sizeClasses)).toContain('py-2')
      expect(cn(baseClasses, variantClasses, sizeClasses)).toContain('rounded-lg')
    })

    it('handles class overrides in component props', () => {
      const defaultClasses = 'bg-gray-100 text-gray-900'
      const propsClasses = 'bg-red-500'

      const result = cn(defaultClasses, propsClasses)
      expect(result).toContain('text-gray-900')
      expect(result).toContain('bg-red-500')
      expect(result).not.toContain('bg-gray-100')
    })
  })
})
