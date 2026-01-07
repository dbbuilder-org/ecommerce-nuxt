<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="cartStore.closeCart()"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide">
    <div
      v-if="cartStore.isOpen"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-semibold">Shopping Cart</h2>
        <button
          @click="cartStore.closeCart()"
          class="p-2 text-gray-500 hover:text-gray-700"
        >
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartStore.isEmpty" class="text-center py-12">
          <Icon name="heroicons:shopping-cart" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">Your cart is empty</p>
          <NuxtLink
            to="/shop"
            class="inline-block mt-4 text-primary-600 hover:text-primary-700"
            @click="cartStore.closeCart()"
          >
            Continue Shopping
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <!-- Item Image -->
            <div class="w-20 h-20 bg-gray-200 rounded shrink-0">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover rounded"
              />
            </div>

            <!-- Item Details -->
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 truncate">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ formatPrice(item.price) }}</p>

              <!-- Quantity Controls -->
              <div class="flex items-center mt-2">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Icon name="heroicons:minus" class="w-4 h-4" />
                </button>
                <span class="px-3 text-sm font-medium">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Icon name="heroicons:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click="cartStore.removeItem(item.id)"
              class="p-1 text-gray-400 hover:text-red-500"
            >
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!cartStore.isEmpty" class="border-t p-4 space-y-4">
        <div class="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{{ cartStore.formattedSubtotal }}</span>
        </div>
        <NuxtLink
          to="/checkout"
          class="block w-full py-3 bg-primary-600 text-white text-center font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          @click="cartStore.closeCart()"
        >
          Proceed to Checkout
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const cartStore = useCartStore()

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
