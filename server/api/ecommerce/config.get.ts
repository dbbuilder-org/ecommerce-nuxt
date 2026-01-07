// Server-side API route for fetching app configuration
// Provides feature flags and school-specific settings

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.ecommerceApiBase || config.paymentApiBaseUrl

  // API URL for config
  const apiUrl = `${apiBaseUrl}/api/ecommerce/config`

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
        config: {
          schoolCode: data.schoolCode || schoolCode,
          schoolName: data.schoolName || config.public.schoolName || 'School Bookstore',
          locationId: data.locationId || 0,
          apiBaseUrl: apiBaseUrl,
          features: data.features || getDefaultFeatures(),
          freeShippingThreshold: data.freeShippingThreshold || 75,
        },
      }
    }

    // If API doesn't return config, use defaults
    return {
      Successful: true,
      config: getDefaultConfig(config),
    }
  } catch (error: any) {
    console.error('Config API Error:', error)

    // Return default config from runtime config
    return {
      Successful: true,
      config: getDefaultConfig(config),
    }
  }
})

function getDefaultFeatures() {
  return {
    loginEnabled: true,
    guestCheckoutEnabled: true,
    emailVerificationEnabled: true,
    showPickupLocations: true,
    showShippingForm: false,
    pickupLocationsEnabled: true,
    shippingEnabled: false,
    creditCardEnabled: true,
    decliningBalanceEnabled: false,
    showPromoBanner: true,
    showCategoryCarousel: true,
    showFeaturedProducts: true,
  }
}

function getDefaultConfig(config: any) {
  const schoolCode = config.public.schoolCode || 'westmoreland'

  return {
    schoolCode,
    schoolName: config.public.schoolName || 'School Bookstore',
    locationId: 1,
    apiBaseUrl: config.ecommerceApiBase || config.paymentApiBaseUrl,
    features: getDefaultFeatures(),
    freeShippingThreshold: 75,
  }
}
