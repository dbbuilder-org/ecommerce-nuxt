/**
 * Refund Balance Payment
 *
 * Processes a refund for a declining balance payment,
 * crediting the amount back to the user's account.
 */

import { apiPost, EcommerceRoutes } from '~/server/utils/apiClient'
import type { RefundBalancePaymentRequest, RefundBalancePaymentResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
  const body = await readBody<RefundBalancePaymentRequest>(event)

  if (!body.originalAccountTransactionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'originalAccountTransactionId is required',
    })
  }

  try {
    const response = await apiPost<RefundBalancePaymentResponse>(
      event,
      EcommerceRoutes.userBalanceRefund,
      body
    )

    return response
  } catch (error: any) {
    console.error('Refund Balance Payment Error:', error?.data || error?.message || error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to process refund',
    })
  }
})
