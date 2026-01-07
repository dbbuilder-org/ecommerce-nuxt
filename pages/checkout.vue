<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Checkout</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-12">
      <Icon name="heroicons:shopping-cart" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-4">Add some items before checking out.</p>
      <NuxtLink to="/shop" class="btn-primary">
        Browse Products
      </NuxtLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Guest Info -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold mb-4">Contact Information</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input v-model="form.firstName" type="text" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input v-model="form.lastName" type="text" class="input" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input v-model="form.email" type="email" class="input" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input v-model="form.phone" type="tel" class="input" />
            </div>
          </div>
        </div>

        <!-- Payment Button -->
        <button
          @click="handleCheckout"
          :disabled="isProcessing || !isFormValid"
          class="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon v-if="isProcessing" name="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
          {{ isProcessing ? 'Processing...' : 'Proceed to Payment' }}
        </button>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-24">
          <h2 class="text-lg font-semibold mb-4">Order Summary</h2>

          <div class="space-y-3 mb-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-600">
                {{ item.name }} x {{ item.quantity }}
              </span>
              <span class="font-medium">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>

          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ cartStore.formattedSubtotal }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax</span>
              <span>Calculated at payment</span>
            </div>
            <div class="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>{{ cartStore.formattedSubtotal }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const isProcessing = ref(false)

const isFormValid = computed(() =>
  form.firstName.trim() &&
  form.lastName.trim() &&
  form.email.trim() &&
  form.email.includes('@')
)

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

async function handleCheckout() {
  if (!isFormValid.value || isProcessing.value) return

  isProcessing.value = true

  try {
    // Call server-side API route (secrets handled on server)
    const response = await $fetch('/api/ecommerce/initiate-payment', {
      method: 'POST',
      body: {
        guestInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        cartItems: cartStore.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    })

    // Redirect to WorldPay payment page
    if (response.paymentUrl) {
      window.location.href = response.paymentUrl
    }
  } catch (error) {
    console.error('Checkout error:', error)
    alert('Failed to initiate payment. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

// Page meta
useHead({
  title: 'Checkout',
})
</script>
