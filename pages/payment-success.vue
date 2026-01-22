<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Success Animation Header -->
      <div class="text-center mb-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p class="text-lg text-gray-600">Your payment has been processed successfully</p>
      </div>

      <!-- Transaction Receipt -->
      <div v-if="hasTransactionData" class="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
        <!-- Receipt Header -->
        <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 text-center">
          <h2 class="text-2xl font-bold mb-2">Payment Confirmation</h2>
          <div class="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Payment Approved
          </div>
        </div>

        <!-- Transaction Details -->
        <div class="p-6 space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600 font-medium">Transaction ID:</span>
            <span class="font-mono text-gray-900 font-semibold">{{ transactionData.transactionId }}</span>
          </div>

          <!-- Payment Summary -->
          <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Payment Summary</h3>

            <div v-if="transactionData.netAmount && transactionData.taxAmount" class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 text-sm">Subtotal:</span>
                <span class="font-semibold text-gray-900">${{ parseFloat(transactionData.netAmount || '0').toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-gray-300">
                <span class="text-gray-600 text-sm">Tax:</span>
                <span class="font-semibold text-gray-900">${{ parseFloat(transactionData.taxAmount || '0').toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-gray-800 font-bold text-lg">Total Paid:</span>
                <span class="text-2xl font-bold text-green-600">${{ parseFloat(transactionData.amount || '0').toFixed(2) }}</span>
              </div>
            </div>

            <div v-else class="flex justify-between items-center">
              <span class="text-gray-800 font-bold text-lg">Total Paid:</span>
              <span class="text-2xl font-bold text-green-600">${{ transactionData.amount }}</span>
            </div>
          </div>

          <div v-if="transactionData.ticketId" class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600 font-medium">Ticket ID:</span>
            <span class="font-mono text-gray-900 font-semibold">{{ transactionData.ticketId }}</span>
          </div>

          <div v-if="transactionData.cardType && transactionData.lastFour" class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600 font-medium">Payment Method:</span>
            <span class="font-semibold">{{ transactionData.cardType }} ****{{ transactionData.lastFour }}</span>
          </div>

          <div v-if="transactionData.approvalNumber" class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600 font-medium">Approval Number:</span>
            <span class="font-mono text-gray-900 font-semibold">{{ transactionData.approvalNumber }}</span>
          </div>

          <div v-if="transactionData.transactionDate" class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-gray-600 font-medium">Transaction Date:</span>
            <span class="text-gray-900 font-semibold">{{ formatDate(transactionData.transactionDate) }}</span>
          </div>

          <div class="flex justify-between items-center py-3">
            <span class="text-gray-600 font-medium">Status:</span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              {{ transactionData.status || 'Approved' }}
            </span>
          </div>
        </div>

        <!-- Receipt Actions -->
        <div class="p-6 bg-gray-50 border-t border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button @click="printReceipt" class="btn-primary flex items-center justify-center">
              <Icon name="heroicons:printer" class="w-5 h-5 mr-2" />
              Print Receipt
            </button>
            <button @click="showEmailDialog = true" class="btn-secondary flex items-center justify-center">
              <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
              Email Receipt
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Loading Receipt...</h2>
        <p class="text-gray-600">Please wait while we retrieve your receipt details.</p>
      </div>

      <!-- Basic Success (no transaction data) -->
      <div v-else class="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p class="text-gray-600 mb-6">
          Your payment has been processed successfully. You will receive a confirmation email shortly.
        </p>
      </div>

      <!-- Navigation Actions -->
      <div class="bg-white rounded-2xl shadow-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">What would you like to do next?</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink to="/shop" class="btn-primary text-center py-4">
            <Icon name="heroicons:shopping-bag" class="w-5 h-5 mr-2 inline" />
            Continue Shopping
          </NuxtLink>
          <NuxtLink to="/" class="btn-secondary text-center py-4">
            <Icon name="heroicons:home" class="w-5 h-5 mr-2 inline" />
            Return to Home
          </NuxtLink>
        </div>
      </div>

      <!-- Customer Support -->
      <div class="text-center mt-6 text-gray-600">
        <p class="text-sm">
          Questions about your order?
          <a href="mailto:support@schoolvision.io" class="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
        </p>
      </div>
    </div>

    <!-- Email Dialog Modal -->
    <div v-if="showEmailDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showEmailDialog = false">
      <div class="bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-md w-full" @click.stop>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Email Receipt</h3>
        <p class="text-gray-600 mb-4">Enter your email address to receive a copy of your receipt:</p>
        <input
          v-model="emailAddress"
          type="email"
          placeholder="Enter email address"
          class="input mb-4"
          @keyup.enter="sendEmail"
        />
        <div class="flex gap-3">
          <button @click="sendEmail" :disabled="!emailAddress" class="btn-primary flex-1">
            Send Email
          </button>
          <button @click="showEmailDialog = false" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const cartStore = useCartStore()

const loading = ref(true)
const showEmailDialog = ref(false)
const emailAddress = ref('')

const transactionData = ref({
  transactionId: null as string | null,
  amount: null as string | null,
  taxAmount: null as string | null,
  netAmount: null as string | null,
  ticketId: null as string | null,
  lastFour: null as string | null,
  cardType: null as string | null,
  approvalNumber: null as string | null,
  transactionDate: null as string | null,
  status: null as string | null,
})

const hasTransactionData = computed(() => {
  return transactionData.value.transactionId && transactionData.value.amount
})

onMounted(async () => {
  await loadReceiptData()
  clearCart()
})

async function loadReceiptData() {
  try {
    loading.value = true

    // Check for secure token first
    const token = route.query.token as string
    if (token) {
      await loadReceiptFromToken(token)
    } else {
      parseUrlParameters()
    }
  } catch (error) {
    console.error('Error loading receipt data:', error)
  } finally {
    loading.value = false
  }
}

interface ReceiptResponse {
  success: boolean
  message?: string
  receipt: {
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
  } | null
}

async function loadReceiptFromToken(token: string) {
  try {
    const response = await $fetch<ReceiptResponse>('/api/ecommerce/receipt', {
      method: 'POST',
      body: { receiptToken: token },
    })

    if (response.success && response.receipt) {
      transactionData.value = {
        transactionId: response.receipt.transactionId ?? null,
        amount: response.receipt.amount ?? null,
        taxAmount: response.receipt.taxAmount ?? null,
        netAmount: response.receipt.netAmount ?? null,
        ticketId: response.receipt.ticketId ?? null,
        lastFour: response.receipt.lastFour ?? null,
        cardType: response.receipt.cardType ?? null,
        approvalNumber: response.receipt.approvalNumber ?? null,
        transactionDate: response.receipt.transactionDate ?? null,
        status: response.receipt.status ?? null,
      }
    } else {
      parseUrlParameters()
    }
  } catch (error) {
    console.error('Error loading receipt from token:', error)
    parseUrlParameters()
  }
}

function parseUrlParameters() {
  const params = route.query

  transactionData.value = {
    transactionId: params.transactionId as string || null,
    amount: (params.totalAmount || params.ticketTotal || params.amount) as string || null,
    taxAmount: params.taxAmount as string || null,
    netAmount: (params.netAmount || params.amount) as string || null,
    ticketId: params.ticketId as string || null,
    lastFour: params.lastFour as string || null,
    cardType: params.cardType as string || null,
    approvalNumber: params.approvalNumber as string || null,
    transactionDate: params.transactionDate as string || null,
    status: params.status as string || null,
  }

  // Calculate total if tax breakdown available but no total
  if (transactionData.value.taxAmount && transactionData.value.netAmount && !transactionData.value.amount) {
    const calculatedTotal = parseFloat(transactionData.value.netAmount) + parseFloat(transactionData.value.taxAmount)
    transactionData.value.amount = calculatedTotal.toFixed(2)
  }
}

function clearCart() {
  try {
    cartStore.clearCart()
    console.log('Cart cleared after successful payment')
  } catch (error) {
    console.error('Failed to clear cart:', error)
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateString
  }
}

function printReceipt() {
  window.print()
}

async function sendEmail() {
  if (!emailAddress.value) return

  try {
    await $fetch('/api/ecommerce/email-receipt', {
      method: 'POST',
      body: {
        email: emailAddress.value,
        transactionId: transactionData.value.transactionId,
      },
    })
    alert('Receipt sent to ' + emailAddress.value)
    showEmailDialog.value = false
    emailAddress.value = ''
  } catch (error) {
    console.error('Error sending email:', error)
    alert('Failed to send email. Please try again.')
  }
}

useHead({
  title: 'Payment Successful',
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

@media print {
  .btn-primary,
  .btn-secondary,
  nav {
    display: none !important;
  }
}
</style>
