// Server-side API route for fetching products
// This keeps API credentials secure on the server
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  // API URL format: baseUrl/api/ecommerce/products (no school prefix for test API)
  const apiUrl = `${apiBaseUrl}/api/ecommerce/products`

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      query: {
        categoryId: query.categoryId,
        page: query.page || 1,
        limit: query.limit || 50,
      },
    })

    return response
  } catch (error: any) {
    console.error('Products API Error:', error?.data || error?.message || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch products',
    })
  }
})
