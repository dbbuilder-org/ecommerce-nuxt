// Server-side API route for emailing receipt

interface EmailReceiptResponse {
  success: boolean
  message: string
}

export default defineEventHandler(async (event): Promise<EmailReceiptResponse> => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { email, transactionId } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email address is required',
    })
  }

  if (!transactionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction ID is required',
    })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address format',
    })
  }

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  try {
    // Call backend API to send receipt email
    await $fetch<{ success: boolean }>(`${apiBaseUrl}/api/ecommerce/email-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      body: {
        email,
        transactionId,
      },
    })

    return {
      success: true,
      message: `Receipt sent to ${email}`,
    }
  } catch (error: any) {
    console.error('Email Receipt API Error:', error?.data || error?.message || error)

    // Check if backend doesn't have this endpoint yet
    if (error?.statusCode === 404) {
      // Graceful fallback - log but don't fail hard
      console.warn('Email receipt endpoint not available on backend')
      return {
        success: false,
        message: 'Email service temporarily unavailable. Please try again later.',
      }
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to send receipt email',
    })
  }
})
