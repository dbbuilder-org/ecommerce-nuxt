// Server-side API route for fetching receipt data from secure token

interface ReceiptData {
  transactionId?: string | null
  amount?: string | null
  taxAmount?: string | null
  netAmount?: string | null
  ticketId?: string | null
  lastFour?: string | null
  cardType?: string | null
  approvalNumber?: string | null
  transactionDate?: string | null
  status?: string | null
}

interface ReceiptResponse {
  success: boolean
  message?: string
  receipt: ReceiptData | null
}

export default defineEventHandler(async (event): Promise<ReceiptResponse> => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { receiptToken } = body

  if (!receiptToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Receipt token is required',
    })
  }

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  try {
    // Call backend API to validate token and get receipt data
    const response = await $fetch<ReceiptResponse>(`${apiBaseUrl}/api/ecommerce/receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      body: {
        receiptToken,
      },
    })

    return response
  } catch (error: any) {
    console.error('Receipt API Error:', error?.data || error?.message || error)

    // Return graceful fallback - let client parse URL params
    return {
      success: false,
      message: 'Unable to load receipt from token',
      receipt: null,
    }
  }
})
