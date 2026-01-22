// Register API route - Server-side user registration
// Handles new user registration against the ecommerce API

interface RegisterApiResponse {
  Successful: boolean
  Message?: string
  user?: {
    id?: number
    userId?: number
    email?: string
    role?: string
  }
  wallet?: {
    id?: number
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, firstName, lastName } = body

  if (!email || !password || !firstName || !lastName) {
    throw createError({
      statusCode: 400,
      message: 'All fields are required',
    })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format',
    })
  }

  // Password strength validation
  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 8 characters',
    })
  }

  const config = useRuntimeConfig()

  try {
    // Call the ecommerce API for registration
    const response = await $fetch<RegisterApiResponse>(`${config.ecommerceApiBase}/api/wallet/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ecommerceApiKey || '',
      },
      body: {
        email,
        password,
        firstName,
        lastName,
      },
    })

    if (response.Successful) {
      // If user is returned, auto-login
      if (response.user) {
        const user = {
          id: response.user.id || response.user.userId,
          email: response.user.email,
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          role: response.user.role || 'customer',
          walletId: response.wallet?.id,
        }

        // Set session cookie
        const sessionToken = generateSessionToken()
        setCookie(event, 'auth_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        await useStorage('sessions').setItem(sessionToken, {
          user,
          createdAt: Date.now(),
        })

        return {
          success: true,
          user,
          token: sessionToken,
          message: 'Account created successfully!',
        }
      }

      return {
        success: true,
        message: response.Message || 'Account created. Please check your email to verify.',
      }
    } else {
      return {
        success: false,
        message: response.Message || 'Registration failed',
      }
    }
  } catch (error: any) {
    console.error('Registration API error:', error)

    // Handle duplicate email
    if (error.statusCode === 409 || error.data?.message?.includes('exists')) {
      return {
        success: false,
        message: 'An account with this email already exists',
      }
    }

    throw createError({
      statusCode: 500,
      message: 'Registration service unavailable',
    })
  }
})

function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
