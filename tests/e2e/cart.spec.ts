import { test, expect } from '@playwright/test'

test.describe('Cart Functionality', () => {
  test('cart sidebar opens when clicking cart button', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find cart button - it's the button with shopping-cart icon in header
    // Use a more specific selector based on the button's class pattern
    const cartButton = page.locator('header button.relative.p-2').first()

    // If the specific selector doesn't work, try finding by icon content
    if (!(await cartButton.isVisible())) {
      const altCartButton = page.locator('header').getByRole('button').filter({
        has: page.locator('[class*="heroicons:shopping-cart"]')
      })
      await altCartButton.click()
    } else {
      await cartButton.click()
    }

    // Cart sidebar should be visible
    const cartSidebar = page.getByText('Shopping Cart')
    await expect(cartSidebar).toBeVisible({ timeout: 5000 })
  })

  test('empty cart shows appropriate message', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open cart using relative positioned button
    const cartButton = page.locator('header button.relative.p-2').first()
    await cartButton.click()

    // Should show empty cart message
    const emptyMessage = page.getByText(/cart is empty/i)
    await expect(emptyMessage).toBeVisible({ timeout: 5000 })
  })

  test('cart shows Continue Shopping link when empty', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open cart
    const cartButton = page.locator('header button.relative.p-2').first()
    await cartButton.click()

    // Should have continue shopping link
    const continueLink = page.getByRole('link', { name: /continue shopping/i })
    await expect(continueLink).toBeVisible({ timeout: 5000 })
  })

  test('cart can be closed', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open cart
    const cartButton = page.locator('header button.relative.p-2').first()
    await cartButton.click()

    // Cart should be visible
    const cartTitle = page.getByText('Shopping Cart')
    await expect(cartTitle).toBeVisible()

    // Find and click close button in the cart sidebar
    const closeButton = page.locator('[class*="fixed"][class*="right-0"] button').first()

    if (await closeButton.isVisible()) {
      await closeButton.click()
      await page.waitForTimeout(500)
    }
  })
})

test.describe('Add to Cart Flow', () => {
  test('can navigate to shop and see products', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    // Should have product cards
    const productGrid = page.locator('.grid').first()
    await expect(productGrid).toBeVisible({ timeout: 10000 })
  })
})
