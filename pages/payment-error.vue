<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="heroicons:exclamation-triangle" class="w-10 h-10 text-red-600" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Error</h1>
      <p class="text-gray-600 mb-6">
        There was an error processing your payment. Please try again or contact support if the problem persists.
      </p>

      <!-- Error Details (if available) -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
        <h3 class="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Cart Status -->
      <div v-if="cartRestored" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-blue-700">
          <Icon name="heroicons:shopping-cart" class="w-4 h-4 inline mr-1" />
          Your cart has been preserved. You can try the payment again.
        </p>
      </div>

      <div class="space-y-3">
        <NuxtLink
          to="/checkout"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-2xl font-medium hover:bg-blue-700 transition-colors block text-center"
        >
          Try Again
        </NuxtLink>
        <NuxtLink
          to="/shop"
          class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-200 transition-colors block text-center"
        >
          Continue Shopping
        </NuxtLink>
        <NuxtLink
          to="/"
          class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-200 transition-colors block text-center"
        >
          Return to Home
        </NuxtLink>
      </div>

      <!-- Support Contact -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Need help?
          <a href="mailto:support@schoolvision.io" class="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const cartStore = useCartStore()

const errorMessage = ref<string | null>(null)
const cartRestored = ref(false)

onMounted(() => {
  // Parse error details from URL
  errorMessage.value = (route.query.error || route.query.message) as string || null

  console.error('Payment error occurred:', errorMessage.value || 'Unknown error')

  // Check if cart has items (preserved from before payment)
  if (cartStore.items.length > 0) {
    cartRestored.value = true
  }
})

useHead({
  title: 'Payment Error',
})
</script>
