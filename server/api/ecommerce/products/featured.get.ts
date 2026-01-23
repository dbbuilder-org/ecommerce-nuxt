/**
 * Featured Products API Endpoint
 *
 * Fetches featured products from the "Featured Items" category in the database.
 * Products are filtered by: IsActive=1, ShowOnline=1, has images, quantity>=1
 */
import { apiGet, getApiClientConfig, buildEcommerceApiUrl, getApiHeaders } from '~/server/utils/apiClient'

interface FeaturedProductsResponse {
  Successful: boolean
  products: any[]
  message?: string
}

export default defineEventHandler(async (event): Promise<{ success: boolean; products: any[]; count: number; fallback?: boolean; message?: string }> => {
  const config = useRuntimeConfig(event)
  const clientConfig = getApiClientConfig(event)

  try {
    // Call the featured products endpoint
    const url = buildEcommerceApiUrl(clientConfig.baseUrl, clientConfig.tenant, 'products/featured')

    const response = await $fetch<FeaturedProductsResponse>(url, {
      method: 'GET',
      headers: getApiHeaders(clientConfig),
    })

    if (!response.Successful) {
      throw createError({
        statusCode: 400,
        statusMessage: response.message || 'Failed to fetch featured products',
      })
    }

    // Transform products to add image URLs
    const products = (response.products || []).map((product: any) => ({
      ...product,
      id: product.productId || product.id,
      image: getProductImageUrl(product.imageFilename, clientConfig.baseUrl, clientConfig.tenant),
      // Ensure price is a number
      price: parseFloat(product.price) || 0,
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
    }))

    return {
      success: true,
      products,
      count: products.length,
    }
  } catch (error: any) {
    console.error('Featured Products API Error:', error?.data || error?.message || error)

    // If the featured endpoint doesn't exist, fall back to fetching all and filtering
    if (error.statusCode === 404) {
      return await fetchFeaturedFallback(event, clientConfig)
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch featured products',
    })
  }
})

interface AllProductsResponse {
  products?: any[]
}

/**
 * Fallback: Fetch all products and filter to featured category
 */
async function fetchFeaturedFallback(event: any, clientConfig: any): Promise<{ success: boolean; products: any[]; count: number; fallback?: boolean; message?: string }> {
  try {
    const url = buildEcommerceApiUrl(clientConfig.baseUrl, clientConfig.tenant, 'products/all-categorized')

    const response: AllProductsResponse = await $fetch<AllProductsResponse>(url, {
      method: 'GET',
      headers: getApiHeaders(clientConfig),
      query: {
        locationId: 622103005, // TODO: Make this configurable
        availableOnly: false,
      },
    })

    // Filter to featured products (category name contains "Featured")
    const allProducts: any[] = response.products || []
    const featuredProducts: any[] = allProducts.filter((p: any) =>
      p.categoryName?.toLowerCase().includes('featured') ||
      p.isFeatured === true
    )

    const products: any[] = featuredProducts.map((product: any) => ({
      ...product,
      id: product.productId || product.id,
      image: getProductImageUrl(product.imageFilename, clientConfig.baseUrl, clientConfig.tenant),
      price: parseFloat(product.price) || 0,
    }))

    return {
      success: true,
      products,
      count: products.length,
      fallback: true, // Indicates this used fallback logic
    }
  } catch (error: any) {
    console.error('Featured Products Fallback Error:', error)
    return {
      success: false,
      products: [],
      count: 0,
      message: 'No featured products available',
    }
  }
}

/**
 * Transform imageFilename to full image URL
 */
function getProductImageUrl(imageFilename: string | undefined, apiBaseUrl: string, schoolCode: string): string | undefined {
  if (!imageFilename || imageFilename.trim() === '') {
    return undefined
  }

  let cleanFilename = imageFilename.trim()

  // Fix common extension issues
  cleanFilename = cleanFilename.replace(/\/jpg$/, '.jpg')
  cleanFilename = cleanFilename.replace(/\/j$/, '.jpg')
  cleanFilename = cleanFilename.replace(/\/jpeg$/, '.jpeg')
  cleanFilename = cleanFilename.replace(/\/png$/, '.png')

  if (cleanFilename.endsWith('.j')) {
    cleanFilename = cleanFilename + 'pg'
  }

  const lastDotIndex = cleanFilename.lastIndexOf('.')
  if (lastDotIndex > 0) {
    const name = cleanFilename.substring(0, lastDotIndex)
    const ext = cleanFilename.substring(lastDotIndex + 1)
    return `${apiBaseUrl}/${schoolCode}/api/getimage/${encodeURIComponent(name)}/${ext}`
  }

  return undefined
}
