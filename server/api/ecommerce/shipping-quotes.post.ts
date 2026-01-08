// Server-side API route for fetching shipping quotes
// Proxies to the ecommerce API with secure credentials

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.ecommerceApiBase || config.paymentApiBaseUrl
  const body = await readBody(event)

  // Validate request body
  if (!body.toAddress) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Shipping address is required',
    })
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart items are required',
    })
  }

  // API URL for shipping quotes (multi-tenant: /{schoolCode}/api/ecommerce/shipping/quotes)
  const apiUrl = `${apiBaseUrl}/${schoolCode}/api/ecommerce/shipping/quotes`

  try {
    const response = await $fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ecommerceApiKey || config.paymentApiSecret || '',
        'X-School-Code': schoolCode,
      },
      body: {
        schoolCode,
        toAddress: body.toAddress,
        items: body.items,
        orderSubtotal: body.orderSubtotal || 0,
      },
    })

    const data = response as any

    // Normalize response format
    if (data.Successful || data.successful) {
      return {
        Successful: true,
        rates: data.rates || [],
        freeShippingApplied: data.freeShippingApplied || false,
        freeShippingThreshold: data.freeShippingThreshold || 0,
      }
    }

    return {
      Successful: false,
      rates: [],
      freeShippingApplied: false,
      message: data.message || 'Failed to fetch shipping quotes',
    }
  } catch (error: any) {
    console.error('Shipping Quotes API Error:', error)

    // Return mock data for development if API is unavailable
    if (process.dev) {
      const subtotal = body.orderSubtotal || 0
      const freeThreshold = 75

      return {
        Successful: true,
        rates: [
          {
            rateId: 'usps_priority',
            serviceName: 'USPS Priority Mail',
            carrierName: 'USPS',
            estimatedDays: 3,
            isGuaranteed: false,
            amount: subtotal >= freeThreshold ? 0 : 7.99,
          },
          {
            rateId: 'usps_express',
            serviceName: 'USPS Priority Mail Express',
            carrierName: 'USPS',
            estimatedDays: 2,
            isGuaranteed: true,
            amount: 24.99,
          },
          {
            rateId: 'ups_ground',
            serviceName: 'UPS Ground',
            carrierName: 'UPS',
            estimatedDays: 5,
            isGuaranteed: false,
            amount: subtotal >= freeThreshold ? 0 : 6.49,
          },
          {
            rateId: 'fedex_2day',
            serviceName: 'FedEx 2Day',
            carrierName: 'FedEx',
            estimatedDays: 2,
            isGuaranteed: true,
            amount: 19.99,
          },
        ],
        freeShippingApplied: subtotal >= freeThreshold,
        freeShippingThreshold: freeThreshold,
      }
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch shipping quotes',
    })
  }
})
