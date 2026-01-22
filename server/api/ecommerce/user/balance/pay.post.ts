/**
 * Process Balance Payment
 *
 * Processes a declining balance payment, deducting from the user's account.
 * Should be called after validatePayment confirms funds are available.
 */

import { apiPost, EcommerceRoutes } from '~/server/utils/apiClient'
import type { ProcessBalancePaymentRequest, ProcessBalancePaymentResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
  const body = await readBody<ProcessBalancePaymentRequest>(event)

  if (!body.accountId || !body.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'accountId and amount are required',
    })
  }

  try {
    const response = await apiPost<ProcessBalancePaymentResponse>(
      event,
      EcommerceRoutes.userBalancePay,
      body
    )

    return response
  } catch (error: any) {
    console.error('Process Balance Payment Error:', error?.data || error?.message || error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to process balance payment',
    })
  }
})
