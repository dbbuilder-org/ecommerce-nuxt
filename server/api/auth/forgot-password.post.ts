// Forgot Password API route
// Initiates password reset flow
import { getApiClientConfig, buildTenantUrl, getApiHeaders } from '~/server/utils/apiClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required',
    })
  }

  const clientConfig = getApiClientConfig(event)

  try {
    // Call the ecommerce API for password reset
    const apiUrl = buildTenantUrl(clientConfig.baseUrl, clientConfig.tenant, 'wallet/forgotpassword')
    await $fetch(apiUrl, {
      method: 'POST',
      headers: getApiHeaders(clientConfig),
      body: { email },
    })

    // Always return success to prevent email enumeration
    return {
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    }
  } catch (error: any) {
    console.error('Forgot password API error:', error)

    // Still return success to prevent email enumeration
    return {
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    }
  }
})
