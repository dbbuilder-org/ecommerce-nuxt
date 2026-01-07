// Currency formatting utilities

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '$0.00'
  return currencyFormatter.format(value)
}

export function toCurrency(value: number | undefined | null): string {
  return formatCurrency(value)
}
