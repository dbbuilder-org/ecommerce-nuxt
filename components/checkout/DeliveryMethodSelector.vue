<template>
  <div class="space-y-4">
    <h3 class="text-base font-medium text-gray-900">Choose Delivery Method</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Pickup Option -->
      <button
        v-if="showPickup"
        type="button"
        @click="selectMethod('pickup')"
        :class="[
          'relative flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200',
          modelValue === 'pickup'
            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        ]"
      >
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mb-3',
            modelValue === 'pickup' ? 'bg-primary-100' : 'bg-gray-100'
          ]"
        >
          <Icon
            name="heroicons:building-storefront"
            :class="[
              'w-6 h-6',
              modelValue === 'pickup' ? 'text-primary-600' : 'text-gray-500'
            ]"
          />
        </div>
        <span
          :class="[
            'font-semibold',
            modelValue === 'pickup' ? 'text-primary-700' : 'text-gray-900'
          ]"
        >
          Store Pickup
        </span>
        <span class="text-sm text-gray-500 mt-1">Pick up at a location</span>

        <!-- Selected indicator -->
        <div
          v-if="modelValue === 'pickup'"
          class="absolute top-3 right-3"
        >
          <Icon
            name="heroicons:check-circle-solid"
            class="w-6 h-6 text-primary-500"
          />
        </div>
      </button>

      <!-- Shipping Option -->
      <button
        v-if="showShipping"
        type="button"
        @click="selectMethod('shipping')"
        :class="[
          'relative flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200',
          modelValue === 'shipping'
            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        ]"
      >
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mb-3',
            modelValue === 'shipping' ? 'bg-primary-100' : 'bg-gray-100'
          ]"
        >
          <Icon
            name="heroicons:truck"
            :class="[
              'w-6 h-6',
              modelValue === 'shipping' ? 'text-primary-600' : 'text-gray-500'
            ]"
          />
        </div>
        <span
          :class="[
            'font-semibold',
            modelValue === 'shipping' ? 'text-primary-700' : 'text-gray-900'
          ]"
        >
          Ship to Address
        </span>
        <span class="text-sm text-gray-500 mt-1">Delivery to your door</span>

        <!-- Free shipping badge -->
        <span
          v-if="showFreeShippingBadge"
          class="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          <Icon name="heroicons:truck" class="w-3 h-3 mr-1" />
          Free shipping over ${{ freeShippingThreshold }}
        </span>

        <!-- Selected indicator -->
        <div
          v-if="modelValue === 'shipping'"
          class="absolute top-3 right-3"
        >
          <Icon
            name="heroicons:check-circle-solid"
            class="w-6 h-6 text-primary-500"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliveryMethod } from '~/types/checkout'

const props = withDefaults(defineProps<{
  modelValue: DeliveryMethod
  showPickup?: boolean
  showShipping?: boolean
  freeShippingThreshold?: number
}>(), {
  showPickup: true,
  showShipping: false,
  freeShippingThreshold: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: DeliveryMethod): void
}>()

const showFreeShippingBadge = computed(() => {
  return props.showShipping && props.freeShippingThreshold > 0
})

function selectMethod(method: DeliveryMethod) {
  emit('update:modelValue', method)
}
</script>
