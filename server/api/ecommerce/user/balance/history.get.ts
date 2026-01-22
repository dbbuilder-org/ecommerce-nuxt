/**
 * Get Balance Transaction History
 *
 * Fetches transaction history for a specific declining balance account.
 */

import { apiGet, EcommerceRoutes } from '~/server/utils/apiClient'
import type { BalanceTransactionHistoryResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const accountId = query.accountId as string

  if (!accountId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'accountId is required',
    })
  }

  try {
    const response = await apiGet<BalanceTransactionHistoryResponse>(
      event,
      EcommerceRoutes.userBalanceHistory,
      { accountId }
    )

    return response
  } catch (error: any) {
    console.error('Balance History API Error:', error?.data || error?.message || error)

    // Return empty response on error
    return {
      transactions: [],
      accountId: parseInt(accountId),
      totalCount: 0,
    }
  }
})
