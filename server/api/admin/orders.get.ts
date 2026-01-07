// Server-side API route for fetching admin orders
// Protected endpoint - requires admin authentication

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.ecommerceApiBase || config.paymentApiBaseUrl

  // Get query parameters
  const query = getQuery(event)
  const status = query.status as string | undefined
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const search = query.search as string | undefined

  // API URL for orders
  const apiUrl = `${apiBaseUrl}/api/admin/orders`

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ecommerceApiKey || config.paymentApiSecret || '',
        'X-School-Code': schoolCode,
      },
      query: {
        schoolCode,
        status,
        page,
        limit,
        search,
      },
    })

    const data = response as any

    if (data.Successful || data.successful) {
      return {
        success: true,
        orders: data.orders || [],
        pagination: {
          page,
          limit,
          total: data.total || 0,
          totalPages: Math.ceil((data.total || 0) / limit),
        },
      }
    }

    return {
      success: false,
      orders: [],
      message: data.message || 'Failed to fetch orders',
    }
  } catch (error: any) {
    console.error('Admin Orders API Error:', error)

    // Return mock data for development
    if (process.dev) {
      return {
        success: true,
        orders: getMockOrders(),
        pagination: {
          page: 1,
          limit: 20,
          total: 4,
          totalPages: 1,
        },
      }
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch orders',
    })
  }
})

function getMockOrders() {
  return [
    {
      id: 1,
      orderReference: 'ORD-2024-001',
      customerName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      itemCount: 3,
      total: 125.00,
      status: 'Pending',
      deliveryMethod: 'pickup',
      pickupLocation: {
        id: 1,
        name: 'Main Campus Bookstore',
        address: '145 Pavilion Lane, Youngwood, PA 15697',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      orderReference: 'ORD-2024-002',
      customerName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: null,
      itemCount: 1,
      total: 45.00,
      status: 'Processing',
      deliveryMethod: 'shipping',
      shippingAddress: {
        name: 'Jane Doe',
        address: '123 Main St, Pittsburgh, PA 15213',
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      orderReference: 'ORD-2024-003',
      customerName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '(555) 987-6543',
      itemCount: 5,
      total: 280.00,
      status: 'Fulfilled',
      deliveryMethod: 'pickup',
      pickupLocation: {
        id: 2,
        name: 'Downtown Education Center',
        address: '301 Donner Avenue, Greensburg, PA 15601',
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]
}
