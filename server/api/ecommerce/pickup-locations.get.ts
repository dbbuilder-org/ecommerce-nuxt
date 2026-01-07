// Server-side API route for fetching pickup locations
// Proxies to the ecommerce API with secure credentials

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.ecommerceApiBase || config.paymentApiBaseUrl

  // API URL for pickup locations
  const apiUrl = `${apiBaseUrl}/api/ecommerce/pickup_locations`

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
      },
    })

    const data = response as any

    // Normalize response format
    if (data.Successful || data.successful) {
      return {
        Successful: true,
        pickupLocations: data.pickupLocations || data.locations || [],
      }
    }

    return {
      Successful: false,
      pickupLocations: [],
      message: data.message || 'Failed to fetch pickup locations',
    }
  } catch (error: any) {
    console.error('Pickup Locations API Error:', error)

    // Return mock data for development if API is unavailable
    if (process.dev) {
      return {
        Successful: true,
        pickupLocations: [
          {
            id: 1,
            name: 'Main Campus Bookstore',
            addressLine1: '145 Pavilion Lane',
            addressLine2: '',
            city: 'Youngwood',
            stateId: 'PA',
            postalCode: '15697',
            phoneNumber: '(724) 925-4000',
            emailAddress: 'bookstore@wccc.edu',
            pickupInstructions: 'Enter through the main entrance. The bookstore is located on the first floor near the cafeteria. Please bring your order confirmation email and a valid ID.',
          },
          {
            id: 2,
            name: 'Downtown Education Center',
            addressLine1: '301 Donner Avenue',
            addressLine2: 'Suite 100',
            city: 'Greensburg',
            stateId: 'PA',
            postalCode: '15601',
            phoneNumber: '(724) 836-7040',
            emailAddress: 'downtown@wccc.edu',
            pickupInstructions: 'Free parking available in the rear lot. Pickup is available at the front desk during business hours.',
          },
        ],
      }
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch pickup locations',
    })
  }
})
