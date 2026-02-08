// Server-side API route for fetching categories
import { getApiClientConfig, buildEcommerceApiUrl, getApiHeaders } from '~/server/utils/apiClient'

export default defineEventHandler(async (event) => {
  const clientConfig = getApiClientConfig(event)
  const locationId = 622103005 // Westmoreland location ID

  // API URL format: baseUrl/{tenant}/api/ecommerce/categories
  const apiUrl = buildEcommerceApiUrl(clientConfig.baseUrl, clientConfig.tenant, 'categories')

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: getApiHeaders(clientConfig),
      query: {
        locationId,
      },
    })

    // Transform categories to match frontend expected format
    const data = response as any
    if (data.categories && Array.isArray(data.categories)) {
      data.categories = data.categories.map((cat: any) => ({
        id: cat.categoryId,
        name: cat.categoryName,
        slug: createSlug(cat.categoryName),
        displayOrder: cat.displayOrder,
        productCount: cat.productCount,
      }))
    }

    return data
  } catch (error: any) {
    console.error('Categories API Error:', error?.data || error?.message || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch categories',
    })
  }
})

// Helper to create URL-friendly slug from category name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
