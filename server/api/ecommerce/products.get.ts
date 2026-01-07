// Server-side API route for fetching products
// This keeps API credentials secure on the server
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl
  const locationId = 622103005 // Westmoreland location ID

  // Use all-categorized endpoint for efficient loading
  const apiUrl = `${apiBaseUrl}/api/ecommerce/products/all-categorized`

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
        availableOnly: false,
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
