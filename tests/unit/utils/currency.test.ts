import { describe, it, expect } from 'vitest'
import { formatCurrency, toCurrency } from '~/utils/currency'

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('formats a positive number correctly', () => {
      expect(formatCurrency(10)).toBe('$10.00')
      expect(formatCurrency(100.5)).toBe('$100.50')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-10)).toBe('-$10.00')
      expect(formatCurrency(-100.5)).toBe('-$100.50')
    })

    it('handles decimal precision', () => {
      expect(formatCurrency(10.999)).toBe('$11.00')
      expect(formatCurrency(10.001)).toBe('$10.00')
      expect(formatCurrency(10.125)).toBe('$10.13') // rounds up
    })

    it('handles undefined input', () => {
      expect(formatCurrency(undefined)).toBe('$0.00')
    })

    it('handles null input', () => {
      expect(formatCurrency(null)).toBe('$0.00')
    })

    it('handles large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99')
    })

    it('handles small decimal values', () => {
      expect(formatCurrency(0.01)).toBe('$0.01')
      expect(formatCurrency(0.99)).toBe('$0.99')
    })
  })

  describe('toCurrency', () => {
    it('is an alias for formatCurrency', () => {
      expect(toCurrency(10)).toBe(formatCurrency(10))
      expect(toCurrency(100.5)).toBe(formatCurrency(100.5))
      expect(toCurrency(undefined)).toBe(formatCurrency(undefined))
      expect(toCurrency(null)).toBe(formatCurrency(null))
    })
  })
})
