// Server-side API route for fetching user orders

interface SessionData {
  user: {
    id: number
    email: string
    name: string
    walletId?: number
  }
  createdAt: number
}

interface OrdersResponse {
  success: boolean
  orders: any[]
  message?: string
}

export default defineEventHandler(async (event): Promise<OrdersResponse> => {
  const config = useRuntimeConfig()

  // Get session cookie to identify user
  const sessionToken = getCookie(event, 'auth_session')

  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  // Get user from session
  const session = await useStorage('sessions').getItem(sessionToken) as SessionData | null
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session',
    })
  }

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  try {
    // Call backend API to get user orders
    const response = await $fetch<OrdersResponse>(`${apiBaseUrl}/api/ecommerce/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      query: {
        userId: session.user.id,
        walletId: session.user.walletId,
        email: session.user.email,
      },
    })

    return response
  } catch (error: any) {
    console.error('Orders API Error:', error?.data || error?.message || error)

    // Return empty orders if endpoint doesn't exist yet
    if (error?.statusCode === 404) {
      return {
        success: true,
        orders: [],
        message: 'Order history not available',
      }
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch orders',
    })
  }
})
