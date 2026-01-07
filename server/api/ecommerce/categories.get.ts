// Server-side API route for fetching categories
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  try {
    const response = await $fetch(`${apiBaseUrl}/${schoolCode}/api/ecommerce/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
    })

    return response
  } catch (error: any) {
    console.error('Categories API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch categories',
    })
  }
})
