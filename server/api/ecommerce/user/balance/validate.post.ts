/**
 * Validate Balance Payment
 *
 * Validates a balance payment before processing.
 * Checks for sufficient funds, account status, and expiration.
 */

import { apiPost, EcommerceRoutes } from '~/server/utils/apiClient'
import type { ValidateBalancePaymentRequest, ValidateBalancePaymentResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
  const body = await readBody<ValidateBalancePaymentRequest>(event)

  if (!body.accountId || !body.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'accountId and amount are required',
    })
  }

  try {
    const response = await apiPost<ValidateBalancePaymentResponse>(
      event,
      EcommerceRoutes.userBalanceValidate,
      body
    )

    return response
  } catch (error: any) {
    console.error('Validate Balance Payment Error:', error?.data || error?.message || error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to validate balance payment',
    })
  }
})
