/**
 * Declining Balance Composable
 *
 * Provides reactive access to declining balance functionality
 * for authenticated users. Integrates with the PaymentAPI
 * declining balance endpoints.
 *
 * Features:
 * - Fetch user's balance accounts
 * - Validate balance payments before processing
 * - Process balance payments
 * - Request refunds
 * - View transaction history
 */

import type {
  DecliningBalanceAccount,
  UserBalanceResponse,
  ValidateBalancePaymentRequest,
  ValidateBalancePaymentResponse,
  ProcessBalancePaymentRequest,
  ProcessBalancePaymentResponse,
  RefundBalancePaymentRequest,
  RefundBalancePaymentResponse,
  BalanceTransactionHistoryResponse,
} from '~/types/api'

export interface UseDecliningBalanceReturn {
  // State
  accounts: Ref<DecliningBalanceAccount[]>
  totalBalance: Ref<number>
  isLoading: Ref<boolean>
  error: Ref<string | null>

  // Actions
  fetchBalance: () => Promise<void>
  validatePayment: (request: ValidateBalancePaymentRequest) => Promise<ValidateBalancePaymentResponse>
  processPayment: (request: ProcessBalancePaymentRequest) => Promise<ProcessBalancePaymentResponse>
  refundPayment: (request: RefundBalancePaymentRequest) => Promise<RefundBalancePaymentResponse>
  getTransactionHistory: (accountId: number) => Promise<BalanceTransactionHistoryResponse>

  // Computed
  hasBalance: ComputedRef<boolean>
  primaryAccount: ComputedRef<DecliningBalanceAccount | null>
  canPayAmount: (amount: number) => boolean
}

export function useDecliningBalance(): UseDecliningBalanceReturn {
  // State
  const accounts = ref<DecliningBalanceAccount[]>([])
  const totalBalance = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * Fetch user's declining balance accounts
   */
  async function fetchBalance(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<UserBalanceResponse>('/api/ecommerce/user/balance')

      accounts.value = response.accounts || []
      totalBalance.value = response.totalBalance || 0
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch balance'
      console.error('Fetch balance error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Validate a balance payment before processing
   */
  async function validatePayment(
    request: ValidateBalancePaymentRequest
  ): Promise<ValidateBalancePaymentResponse> {
    try {
      return await $fetch<ValidateBalancePaymentResponse>('/api/ecommerce/user/balance/validate', {
        method: 'POST',
        body: request,
      })
    } catch (err: any) {
      console.error('Validate payment error:', err)
      return {
        Successful: false,
        IsValid: false,
        AccountID: request.accountId,
        RequestedAmount: request.amount,
        AvailableBalance: 0,
        InsufficientFunds: true,
        AccountInactive: false,
        AccountExpired: false,
        Message: err.data?.message || 'Validation failed',
      }
    }
  }

  /**
   * Process a balance payment
   */
  async function processPayment(
    request: ProcessBalancePaymentRequest
  ): Promise<ProcessBalancePaymentResponse> {
    try {
      const response = await $fetch<ProcessBalancePaymentResponse>('/api/ecommerce/user/balance/pay', {
        method: 'POST',
        body: request,
      })

      // Refresh balance after successful payment
      if (response.Successful) {
        await fetchBalance()
      }

      return response
    } catch (err: any) {
      console.error('Process payment error:', err)
      return {
        Successful: false,
        AccountTransactionID: 0,
        AccountID: request.accountId,
        Amount: request.amount,
        NewBalance: 0,
        Message: err.data?.message || 'Payment processing failed',
      }
    }
  }

  /**
   * Request a refund for a balance payment
   */
  async function refundPayment(
    request: RefundBalancePaymentRequest
  ): Promise<RefundBalancePaymentResponse> {
    try {
      const response = await $fetch<RefundBalancePaymentResponse>('/api/ecommerce/user/balance/refund', {
        method: 'POST',
        body: request,
      })

      // Refresh balance after successful refund
      if (response.Successful) {
        await fetchBalance()
      }

      return response
    } catch (err: any) {
      console.error('Refund payment error:', err)
      return {
        Successful: false,
        RefundAccountTransactionID: 0,
        AccountID: 0,
        RefundAmount: 0,
        NewBalance: 0,
        Message: err.data?.message || 'Refund processing failed',
      }
    }
  }

  /**
   * Get transaction history for an account
   */
  async function getTransactionHistory(
    accountId: number
  ): Promise<BalanceTransactionHistoryResponse> {
    try {
      return await $fetch<BalanceTransactionHistoryResponse>('/api/ecommerce/user/balance/history', {
        query: { accountId },
      })
    } catch (err: any) {
      console.error('Get transaction history error:', err)
      return {
        transactions: [],
        accountId,
        totalCount: 0,
      }
    }
  }

  // Computed properties
  const hasBalance = computed(() => totalBalance.value > 0)

  const primaryAccount = computed(() => {
    // Return the first active account with balance, or first active account
    const activeWithBalance = accounts.value.find(
      (a) => a.isActive && a.availableBalance > 0
    )
    if (activeWithBalance) return activeWithBalance

    return accounts.value.find((a) => a.isActive) || null
  })

  /**
   * Check if user can pay a specific amount
   */
  function canPayAmount(amount: number): boolean {
    return totalBalance.value >= amount
  }

  return {
    // State
    accounts,
    totalBalance,
    isLoading,
    error,

    // Actions
    fetchBalance,
    validatePayment,
    processPayment,
    refundPayment,
    getTransactionHistory,

    // Computed
    hasBalance,
    primaryAccount,
    canPayAmount,
  }
}
