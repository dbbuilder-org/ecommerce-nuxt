// Server-side API route for validating promo codes

interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed' | 'freeShipping'
  discountValue: number
  description?: string
  minOrderAmount?: number
  maxDiscount?: number
}

interface PromoCodeResponse {
  success: boolean
  message?: string
  promoCode?: PromoCode
}

export default defineEventHandler(async (event): Promise<PromoCodeResponse> => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { code, subtotal } = body

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Promo code is required',
    })
  }

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  try {
    // Call backend API to validate promo code
    const response = await $fetch<PromoCodeResponse>(`${apiBaseUrl}/api/ecommerce/validate-promo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      body: {
        code: code.toUpperCase(),
        subtotal: subtotal || 0,
      },
    })

    return response
  } catch (error: any) {
    console.error('Promo Code API Error:', error?.data || error?.message || error)

    // Check if backend doesn't have this endpoint yet - provide demo fallback
    if (error?.statusCode === 404) {
      // Demo promo codes for testing (remove in production when backend is ready)
      const demoPromoCodes: Record<string, any> = {
        'SAVE10': {
          code: 'SAVE10',
          discountType: 'percentage',
          discountValue: 10,
          description: '10% off your order',
        },
        'SAVE20': {
          code: 'SAVE20',
          discountType: 'percentage',
          discountValue: 20,
          description: '20% off your order',
          minOrderAmount: 50,
        },
        'FLAT5': {
          code: 'FLAT5',
          discountType: 'fixed',
          discountValue: 5,
          description: '$5 off your order',
        },
        'FREESHIP': {
          code: 'FREESHIP',
          discountType: 'freeShipping',
          discountValue: 0,
          description: 'Free shipping on your order',
        },
      }

      const upperCode = code.toUpperCase()
      const promoCode = demoPromoCodes[upperCode]

      if (promoCode) {
        // Check minimum order amount
        if (promoCode.minOrderAmount && subtotal < promoCode.minOrderAmount) {
          return {
            success: false,
            message: `Minimum order of $${promoCode.minOrderAmount} required for this code`,
          }
        }

        return {
          success: true,
          promoCode,
        }
      }

      return {
        success: false,
        message: 'Invalid or expired promo code',
      }
    }

    // Return error for other status codes
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Failed to validate promo code',
    })
  }
})
