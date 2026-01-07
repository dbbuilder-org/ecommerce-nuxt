<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <!-- Loading Spinner -->
      <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="heroicons:arrow-path" class="w-10 h-10 text-primary-600 animate-spin" />
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-4">Processing Payment</h1>
      <p class="text-gray-600 mb-6">
        Please wait while we process your payment response...
      </p>

      <!-- Processing Status -->
      <div class="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-primary-700">{{ statusMessage }}</p>
      </div>

      <!-- Debug Info (development only) -->
      <div v-if="isDev && debugInfo" class="mt-6 text-left bg-gray-100 rounded-lg p-4">
        <p class="text-xs font-mono text-gray-600 mb-2">Debug Info:</p>
        <pre class="text-xs font-mono text-gray-500 overflow-auto max-h-40">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Payment Response Handler
 * Processes WorldPay callback parameters and redirects to appropriate page
 */

const router = useRouter()
const route = useRoute()

const statusMessage = ref('Analyzing payment response...')
const debugInfo = ref<Record<string, any> | null>(null)

// Check if in development mode
const isDev = import.meta.dev

interface PaymentData {
  transactionId: string | null
  amount: string | null
  totalAmount: string | null
  ticketTotal: string | null
  taxAmount: string | null
  netAmount: string | null
  lastFour: string | null
  cardType: string | null
  approvalNumber: string | null
  transactionDate: string | null
  status: string | null
  error: string | null
  cancelled: string | null
}

// Extract payment data from URL parameters
function extractPaymentData(): PaymentData {
  const query = route.query

  return {
    transactionId: query.transactionId as string | null,
    amount: query.amount as string | null,
    totalAmount: query.totalAmount as string | null,
    ticketTotal: query.ticketTotal as string | null,
    taxAmount: query.taxAmount as string | null,
    netAmount: query.netAmount as string | null,
    lastFour: query.lastFour as string | null,
    cardType: query.cardType as string | null,
    approvalNumber: query.approvalNumber as string | null,
    transactionDate: query.transactionDate as string | null,
    status: query.status as string | null,
    error: query.error as string | null,
    cancelled: query.cancelled as string | null,
  }
}

// Redirect based on payment status
function redirectBasedOnStatus(paymentData: PaymentData) {
  // Check for cancellation
  if (paymentData.cancelled === 'true' || paymentData.status === 'cancelled') {
    console.log('[PaymentResponse] Payment was cancelled')
    router.replace('/payment-cancelled')
    return
  }

  // Check for errors
  if (paymentData.error || paymentData.status === 'error' || paymentData.status === 'failed') {
    console.log('[PaymentResponse] Payment failed:', paymentData.error)
    router.replace({
      path: '/payment-error',
      query: { error: paymentData.error || 'Payment failed' },
    })
    return
  }

  // Check for successful payment
  if (
    paymentData.transactionId &&
    paymentData.amount &&
    (paymentData.status === 'approved' || paymentData.status === 'success' || !paymentData.status)
  ) {
    console.log('[PaymentResponse] Payment successful, redirecting to success page')

    // Build query parameters for success page
    const successQuery: Record<string, string> = {}
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value && value !== 'null') {
        successQuery[key] = value
      }
    })

    router.replace({
      path: '/payment-success',
      query: successQuery,
    })
    return
  }

  // Fallback - if we can't determine status, show error
  console.warn('[PaymentResponse] Unable to determine payment status')
  router.replace({
    path: '/payment-error',
    query: { error: 'Unable to determine payment status' },
  })
}

// Process payment response on mount
onMounted(async () => {
  try {
    console.log('[PaymentResponse] Processing WorldPay payment response...')

    // Extract payment data from URL
    const paymentData = extractPaymentData()

    if (isDev) {
      debugInfo.value = paymentData
    }

    console.log('[PaymentResponse] Payment data:', paymentData)

    // Update status
    statusMessage.value = 'Validating payment details...'

    // Small delay for user experience
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Redirect based on status
    redirectBasedOnStatus(paymentData)
  } catch (error) {
    console.error('[PaymentResponse] Error processing payment response:', error)
    router.replace({
      path: '/payment-error',
      query: { error: 'Failed to process payment response' },
    })
  }
})

// Page meta
definePageMeta({
  layout: false, // Use minimal layout without header/footer
})

// SEO
useHead({
  title: 'Processing Payment',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>
