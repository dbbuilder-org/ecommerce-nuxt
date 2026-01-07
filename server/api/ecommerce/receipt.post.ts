// Server-side API route for fetching receipt data from secure token
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { receiptToken } = body

  if (!receiptToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Receipt token is required',
    })
  }

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  try {
    // Call backend API to validate token and get receipt data
    const response = await $fetch(`${apiBaseUrl}/api/ecommerce/receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      body: {
        receiptToken,
      },
    })

    return response
  } catch (error: any) {
    console.error('Receipt API Error:', error?.data || error?.message || error)

    // Return graceful fallback - let client parse URL params
    return {
      success: false,
      message: 'Unable to load receipt from token',
      receipt: null,
    }
  }
})
