<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-medium text-gray-900">Shipping Options</h3>
      <button
        v-if="!loading && rates.length > 0"
        @click="$emit('refresh')"
        class="text-sm text-primary-600 hover:text-primary-700 flex items-center"
      >
        <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" />
        Refresh rates
      </button>
    </div>

    <!-- Free Shipping Banner -->
    <div
      v-if="freeShippingApplied"
      class="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
    >
      <Icon name="heroicons:gift" class="w-5 h-5 text-green-600 flex-shrink-0" />
      <span class="ml-2 text-sm font-medium text-green-800">
        Congratulations! Free shipping has been applied to your order.
      </span>
    </div>

    <!-- Free Shipping Progress -->
    <div
      v-else-if="freeShippingThreshold > 0 && !freeShippingApplied"
      class="p-3 bg-blue-50 border border-blue-100 rounded-lg"
    >
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-blue-800">
          Add {{ formatCurrency(amountToFreeShipping) }} more for free shipping!
        </span>
        <span class="text-blue-600 font-medium">
          {{ Math.round(progressToFreeShipping) }}%
        </span>
      </div>
      <div class="h-2 bg-blue-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-500 rounded-full transition-all duration-300"
          :style="{ width: `${progressToFreeShipping}%` }"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <Icon name="heroicons:arrow-path" class="w-6 h-6 text-primary-500 animate-spin" />
      <span class="ml-2 text-gray-500">Getting shipping rates...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-start">
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500 flex-shrink-0" />
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
          <button
            @click="$emit('refresh')"
            class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- No Rates -->
    <div
      v-else-if="rates.length === 0 && !loading"
      class="text-center py-6 text-gray-500"
    >
      <Icon name="heroicons:truck" class="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <p class="text-sm">Enter your address to see shipping options</p>
    </div>

    <!-- Shipping Rate Options -->
    <div v-else class="space-y-3">
      <div
        v-for="rate in rates"
        :key="rate.rateId"
        @click="selectRate(rate.rateId)"
        :class="[
          'relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
          modelValue === rate.rateId
            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <!-- Radio indicator -->
            <div
              :class="[
                'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                modelValue === rate.rateId
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300 bg-white'
              ]"
            >
              <div
                v-if="modelValue === rate.rateId"
                class="w-2 h-2 bg-white rounded-full"
              />
            </div>

            <div class="ml-3">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'font-medium',
                    modelValue === rate.rateId ? 'text-primary-700' : 'text-gray-900'
                  ]"
                >
                  {{ rate.serviceName }}
                </span>
                <span
                  v-if="rate.isGuaranteed"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                >
                  <Icon name="heroicons:shield-check" class="w-3 h-3 mr-1" />
                  Guaranteed
                </span>
              </div>
              <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{{ rate.carrierName }}</span>
                <span class="flex items-center">
                  <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                  {{ rate.estimatedDays }} {{ rate.estimatedDays === 1 ? 'day' : 'days' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="text-right">
            <span
              v-if="rate.amount === 0"
              class="text-lg font-bold text-green-600"
            >
              FREE
            </span>
            <span
              v-else
              :class="[
                'text-lg font-semibold',
                modelValue === rate.rateId ? 'text-primary-700' : 'text-gray-900'
              ]"
            >
              {{ formatCurrency(rate.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingRate } from '~/types/checkout'
import { formatCurrency } from '~/utils/currency'

const props = withDefaults(defineProps<{
  modelValue: string | null
  rates: ShippingRate[]
  loading?: boolean
  error?: string | null
  freeShippingApplied?: boolean
  freeShippingThreshold?: number
  orderSubtotal?: number
}>(), {
  loading: false,
  error: null,
  freeShippingApplied: false,
  freeShippingThreshold: 0,
  orderSubtotal: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'refresh'): void
}>()

const amountToFreeShipping = computed(() => {
  return Math.max(0, props.freeShippingThreshold - props.orderSubtotal)
})

const progressToFreeShipping = computed(() => {
  if (props.freeShippingThreshold === 0) return 0
  return Math.min(100, (props.orderSubtotal / props.freeShippingThreshold) * 100)
})

function selectRate(rateId: string) {
  emit('update:modelValue', rateId)
}
</script>
