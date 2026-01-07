// Forgot Password API route
// Initiates password reset flow

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required',
    })
  }

  const config = useRuntimeConfig()

  try {
    // Call the ecommerce API for password reset
    const response = await $fetch(`${config.ecommerceApiBase}/api/wallet/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ecommerceApiKey || '',
      },
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
