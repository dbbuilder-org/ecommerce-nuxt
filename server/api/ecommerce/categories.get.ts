// Server-side API route for fetching categories
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl
  const locationId = 622103005 // Westmoreland location ID

  // API URL format: baseUrl/api/ecommerce/categories
  const apiUrl = `${apiBaseUrl}/api/ecommerce/categories`

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      query: {
        locationId,
      },
    })

    return response
  } catch (error: any) {
    console.error('Categories API Error:', error?.data || error?.message || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch categories',
    })
  }
})
