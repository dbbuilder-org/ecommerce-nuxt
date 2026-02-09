// Server-side API route for fetching receipt data from secure token
import { getApiClientConfig, buildEcommerceApiUrl, getApiHeaders } from '~/server/utils/apiClient'

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
  const body = await readBody(event)

  const { receiptToken } = body

  if (!receiptToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Receipt token is required',
    })
  }

  const clientConfig = getApiClientConfig(event)
  const apiUrl = buildEcommerceApiUrl(clientConfig.baseUrl, clientConfig.tenant, 'receipt')

  try {
    const response = await $fetch<ReceiptResponse>(apiUrl, {
      method: 'POST',
      headers: getApiHeaders(clientConfig),
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
