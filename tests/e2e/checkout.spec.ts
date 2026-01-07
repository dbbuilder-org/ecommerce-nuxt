import { test, expect } from '@playwright/test'

test.describe('Checkout Page', () => {
  test('redirects or shows empty cart when cart is empty', async ({ page }) => {
    await page.goto('/checkout')

    // Should show empty cart state or redirect
    const emptyState = page.getByText(/cart is empty/i)
    const browseButton = page.getByRole('link', { name: /browse products/i })

    // Either empty state message or browse button should be visible
    const isEmptyVisible = await emptyState.isVisible().catch(() => false)
    const isBrowseVisible = await browseButton.isVisible().catch(() => false)

    expect(isEmptyVisible || isBrowseVisible).toBe(true)
  })

  test('has correct title', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveTitle(/Checkout/)
  })

  test('displays checkout heading', async ({ page }) => {
    await page.goto('/checkout')

    const heading = page.getByRole('heading', { name: /checkout/i })
    await expect(heading).toBeVisible()
  })
})

test.describe('Checkout with Items', () => {
  // These tests would require adding items to cart first
  // For now, test the checkout page structure

  test('checkout page has step indicator', async ({ page }) => {
    await page.goto('/checkout')

    // If cart has items, step indicator should be visible
    // Otherwise empty cart state is shown
    const stepIndicator = page.getByText(/contact|delivery|payment/i).first()
    const emptyState = page.getByText(/cart is empty/i)

    const hasSteps = await stepIndicator.isVisible().catch(() => false)
    const isEmpty = await emptyState.isVisible().catch(() => false)

    expect(hasSteps || isEmpty).toBe(true)
  })
})

test.describe('Navigation', () => {
  test('can navigate between pages', async ({ page }) => {
    // Start at home
    await page.goto('/')
    await expect(page).toHaveURL('/')

    // Navigate to shop
    const shopLink = page.getByRole('link', { name: /shop/i }).first()
    await shopLink.click()
    await expect(page).toHaveURL('/shop')

    // Navigate back to home
    const homeLink = page.getByRole('link', { name: /home/i }).first()
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })
})
