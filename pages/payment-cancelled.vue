<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="heroicons:x-mark" class="w-10 h-10 text-orange-600" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
      <p class="text-gray-600 mb-6">
        Your payment was cancelled. No charges have been made to your account.
      </p>

      <!-- Cart Status -->
      <div v-if="cartRestored" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-blue-700">
          <Icon name="heroicons:shopping-cart" class="w-4 h-4 inline mr-1" />
          Your cart has been preserved. You can continue shopping or try again.
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
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()

const cartRestored = ref(false)

onMounted(() => {
  console.log('Payment was cancelled by user')

  // Check if cart has items (preserved from before payment)
  if (cartStore.items.length > 0) {
    cartRestored.value = true
  }
})

useHead({
  title: 'Payment Cancelled',
})
</script>
