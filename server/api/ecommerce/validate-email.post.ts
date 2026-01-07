// Server-side API route for validating if email exists
// Used during checkout to detect returning customers

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.ecommerceApiBase || config.paymentApiBaseUrl
  const body = await readBody(event)

  // Validate email
  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format',
    })
  }

  // API URL for email validation
  const apiUrl = `${apiBaseUrl}/api/ecommerce/check_email`

  try {
    const response = await $fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ecommerceApiKey || config.paymentApiSecret || '',
        'X-School-Code': schoolCode,
      },
      body: {
        email: body.email,
        schoolCode,
      },
    })

    const data = response as any

    // Normalize response format
    if (data.success || data.Successful) {
      return {
        success: true,
        emailExists: data.EmailExists || data.emailExists || false,
        userInfo: data.EmailExists ? {
          personId: data.PersonId,
          email: data.Email,
          userName: data.UserName,
          isActive: data.IsActive,
        } : null,
      }
    }

    return {
      success: true,
      emailExists: false,
      userInfo: null,
    }
  } catch (error: any) {
    console.error('Email Validation API Error:', error)

    // Return false for email exists on error (fail-safe)
    return {
      success: true,
      emailExists: false,
      userInfo: null,
    }
  }
})
