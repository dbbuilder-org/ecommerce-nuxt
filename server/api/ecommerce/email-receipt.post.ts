// Server-side API route for emailing receipt
import { getApiClientConfig, buildEcommerceApiUrl, getApiHeaders } from '~/server/utils/apiClient'

interface EmailReceiptResponse {
  success: boolean
  message: string
}

export default defineEventHandler(async (event): Promise<EmailReceiptResponse> => {
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

  const clientConfig = getApiClientConfig(event)
  const apiUrl = buildEcommerceApiUrl(clientConfig.baseUrl, clientConfig.tenant, 'email-receipt')

  try {
    await $fetch<{ success: boolean }>(apiUrl, {
      method: 'POST',
      headers: getApiHeaders(clientConfig),
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
