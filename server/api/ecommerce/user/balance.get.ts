/**
 * Get User's Declining Balance Accounts
 *
 * Fetches all declining balance accounts for the authenticated user.
 * Uses the multi-tenant API routing pattern.
 */

import { apiGet, EcommerceRoutes } from '~/server/utils/apiClient'
import type { UserBalanceResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
  try {
    const response = await apiGet<UserBalanceResponse>(
      event,
      EcommerceRoutes.userBalance
    )

    return response
  } catch (error: any) {
    console.error('User Balance API Error:', error?.data || error?.message || error)

    // Return empty response on error
    return {
      accounts: [],
      totalBalance: 0,
      currency: 'USD',
    }
  }
})
