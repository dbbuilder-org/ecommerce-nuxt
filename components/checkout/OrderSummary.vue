<template>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Order Summary</h2>
        <span class="text-sm text-gray-500">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}</span>
      </div>
    </div>

    <!-- Cart Items (collapsible on mobile) -->
    <div class="p-4 border-b border-gray-200">
      <button
        @click="showItems = !showItems"
        class="flex items-center justify-between w-full text-left sm:hidden mb-3"
      >
        <span class="text-sm font-medium text-gray-700">
          {{ showItems ? 'Hide' : 'Show' }} items
        </span>
        <Icon
          :name="showItems ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
          class="w-5 h-5 text-gray-400"
        />
      </button>

      <div :class="['space-y-4', { 'hidden sm:block': !showItems }]">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex gap-3"
        >
          <!-- Item Image -->
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="heroicons:photo" class="w-6 h-6 text-gray-300" />
            </div>
          </div>

          <!-- Item Details -->
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
            <p class="text-sm font-medium text-gray-900">
              {{ formatCurrency(item.price * item.quantity) }}
            </p>
          </div>

          <!-- Remove Button -->
          <button
            v-if="editable"
            @click="$emit('remove-item', item.id)"
            class="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            title="Remove item"
          >
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Totals -->
    <div class="p-4 space-y-3">
      <!-- Subtotal -->
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Subtotal</span>
        <span class="font-medium text-gray-900">{{ formatCurrency(subtotal) }}</span>
      </div>

      <!-- Shipping -->
      <div v-if="showShipping" class="flex justify-between text-sm">
        <span class="text-gray-600">Shipping</span>
        <span
          :class="[
            'font-medium',
            shippingCost === 0 ? 'text-green-600' : 'text-gray-900'
          ]"
        >
          {{ shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost) }}
        </span>
      </div>

      <!-- Tax -->
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Tax</span>
        <span class="text-gray-500">Calculated at payment</span>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 pt-3 mt-3">
        <div class="flex justify-between">
          <span class="text-base font-semibold text-gray-900">Total</span>
          <span class="text-lg font-bold text-primary-600">
            {{ formatCurrency(total) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Delivery Info Summary -->
    <div v-if="deliveryInfo" class="px-4 pb-4">
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="flex items-start">
          <Icon
            :name="deliveryInfo.type === 'pickup' ? 'heroicons:building-storefront' : 'heroicons:truck'"
            class="w-5 h-5 text-gray-500 flex-shrink-0"
          />
          <div class="ml-2 text-sm">
            <p class="font-medium text-gray-900">
              {{ deliveryInfo.type === 'pickup' ? 'Store Pickup' : 'Shipping' }}
            </p>
            <p class="text-gray-600 mt-0.5">{{ deliveryInfo.summary }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Button Slot -->
    <div v-if="$slots.actions" class="px-4 pb-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface DeliveryInfo {
  type: 'pickup' | 'shipping'
  summary: string
}

const props = withDefaults(defineProps<{
  items: CartItem[]
  subtotal: number
  shippingCost?: number
  showShipping?: boolean
  deliveryInfo?: DeliveryInfo | null
  editable?: boolean
}>(), {
  shippingCost: 0,
  showShipping: false,
  deliveryInfo: null,
  editable: false,
})

const emit = defineEmits<{
  (e: 'remove-item', itemId: number): void
}>()

const showItems = ref(false)

const itemCount = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity, 0)
})

const total = computed(() => {
  return props.subtotal + (props.showShipping ? props.shippingCost : 0)
})
</script>
