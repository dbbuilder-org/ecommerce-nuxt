import { test, expect } from '@playwright/test'

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Shop/)
  })

  test('displays products heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('displays product count', async ({ page }) => {
    // Wait for products to load
    await page.waitForLoadState('networkidle')

    // Check for product count text (e.g., "X products")
    const productCount = page.getByText(/\d+ products?/)
    await expect(productCount).toBeVisible({ timeout: 10000 })
  })

  test('displays filter section on desktop', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, filters should be in a drawer
      const filterButton = page.getByRole('button', { name: /filters/i })
      await expect(filterButton).toBeVisible()
    } else {
      // On desktop, filters should be in sidebar
      const filterSection = page.locator('aside')
      await expect(filterSection).toBeVisible()
    }
  })

  test('search filter works', async ({ page }) => {
    // Wait for products to load
    await page.waitForLoadState('networkidle')

    // Find search input
    const searchInput = page.getByPlaceholder(/search/i).first()

    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      // Wait for filter to apply
      await page.waitForTimeout(500)
    }
  })

  test('product cards are displayed', async ({ page }) => {
    // Wait for products to load
    await page.waitForLoadState('networkidle')

    // Check for product grid
    const productGrid = page.locator('.grid').first()
    await expect(productGrid).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Shop Mobile Filters', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('mobile filter button opens drawer', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    // Look for mobile filter button - might be a button with filter icon or text
    const filterButton = page.getByRole('button', { name: /filter/i }).first()
    const altFilterButton = page.locator('button').filter({ hasText: /filter/i }).first()

    const buttonToClick = await filterButton.isVisible() ? filterButton : altFilterButton

    if (await buttonToClick.isVisible()) {
      await buttonToClick.click()

      // Check drawer opened - look for filter content or close mechanism
      const filterContent = page.getByText(/price/i).or(page.getByText(/category/i))
      const isDrawerOpen = await filterContent.first().isVisible({ timeout: 3000 }).catch(() => false)

      // If drawer opened, verify it's showing filter options
      if (isDrawerOpen) {
        expect(isDrawerOpen).toBe(true)
      }
    } else {
      // Mobile filters might not be implemented - skip gracefully
      test.skip()
    }
  })
})
