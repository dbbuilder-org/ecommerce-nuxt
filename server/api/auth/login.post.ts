// Login API route - Server-side authentication
// Handles user login against the ecommerce API

interface LoginApiResponse {
  Successful: boolean
  Message?: string
  user?: {
    id?: number
    userId?: number
    email?: string
    name?: string
    firstName?: string
    lastName?: string
    role?: string
  }
  wallet?: {
    id?: number
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  const config = useRuntimeConfig()

  try {
    // Call the ecommerce API for authentication
    const response = await $fetch<LoginApiResponse>(`${config.ecommerceApiBase}/api/wallet/loginuserlimit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ecommerceApiKey || '',
      },
      body: {
        email,
        password,
      },
    })

    if (response.Successful && response.user) {
      // Transform user data
      const user = {
        id: response.user.id || response.user.userId,
        email: response.user.email,
        name: response.user.name || `${response.user.firstName} ${response.user.lastName}`,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role || 'customer',
        walletId: response.wallet?.id,
      }

      // Set session cookie (httpOnly for security)
      const sessionToken = generateSessionToken()
      setCookie(event, 'auth_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      // Store session in memory (in production, use Redis or database)
      await useStorage('sessions').setItem(sessionToken, {
        user,
        createdAt: Date.now(),
      })

      return {
        success: true,
        user,
        token: sessionToken,
        message: `Welcome back, ${user.name}!`,
      }
    } else {
      return {
        success: false,
        message: response.Message || 'Invalid email or password',
      }
    }
  } catch (error: any) {
    console.error('Login API error:', error)

    // Handle specific API errors
    if (error.statusCode === 401) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    throw createError({
      statusCode: 500,
      message: 'Authentication service unavailable',
    })
  }
})

// Generate a random session token
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
