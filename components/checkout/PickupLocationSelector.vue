<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-medium text-gray-900">Select Pickup Location</h3>
      <span v-if="required" class="text-sm text-red-500">* Required</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <Icon name="heroicons:arrow-path" class="w-6 h-6 text-primary-500 animate-spin" />
      <span class="ml-2 text-gray-500">Loading pickup locations...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-start">
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500 flex-shrink-0" />
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
          <button
            @click="$emit('retry')"
            class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- No Locations -->
    <div v-else-if="locations.length === 0" class="text-center py-8 text-gray-500">
      <Icon name="heroicons:map-pin" class="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <p>No pickup locations available</p>
    </div>

    <!-- Location List -->
    <div v-else class="space-y-3">
      <div
        v-for="location in locations"
        :key="location.id"
        @click="selectLocation(location)"
        :class="[
          'relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
          modelValue === location.id
            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        ]"
      >
        <div class="flex items-start">
          <!-- Radio indicator -->
          <div
            :class="[
              'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
              modelValue === location.id
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-300 bg-white'
            ]"
          >
            <div
              v-if="modelValue === location.id"
              class="w-2 h-2 bg-white rounded-full"
            />
          </div>

          <!-- Location Details -->
          <div class="ml-3 flex-1">
            <div class="flex items-center">
              <Icon
                name="heroicons:building-storefront"
                :class="[
                  'w-5 h-5 mr-2',
                  modelValue === location.id ? 'text-primary-600' : 'text-gray-400'
                ]"
              />
              <span
                :class="[
                  'font-semibold',
                  modelValue === location.id ? 'text-primary-700' : 'text-gray-900'
                ]"
              >
                {{ location.name }}
              </span>
            </div>

            <div class="mt-2 text-sm text-gray-600 space-y-1">
              <p>{{ location.addressLine1 }}</p>
              <p v-if="location.addressLine2">{{ location.addressLine2 }}</p>
              <p>{{ location.city }}, {{ location.stateId }} {{ location.postalCode }}</p>
            </div>

            <!-- Contact info -->
            <div class="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              <span v-if="location.phoneNumber" class="flex items-center">
                <Icon name="heroicons:phone" class="w-4 h-4 mr-1" />
                {{ location.phoneNumber }}
              </span>
              <span v-if="location.emailAddress" class="flex items-center">
                <Icon name="heroicons:envelope" class="w-4 h-4 mr-1" />
                {{ location.emailAddress }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pickup Instructions (shown when selected) -->
        <div
          v-if="modelValue === location.id && location.pickupInstructions"
          class="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg"
        >
          <div class="flex items-start">
            <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div class="ml-2">
              <p class="text-sm font-medium text-blue-800">Pickup Instructions</p>
              <p class="text-sm text-blue-700 mt-1">{{ location.pickupInstructions }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Error -->
    <p v-if="showValidation && required && !modelValue" class="text-sm text-red-500 mt-2">
      Please select a pickup location
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PickupLocation } from '~/types/checkout'

const props = withDefaults(defineProps<{
  modelValue: number | null
  locations: PickupLocation[]
  loading?: boolean
  error?: string | null
  required?: boolean
  showValidation?: boolean
}>(), {
  loading: false,
  error: null,
  required: false,
  showValidation: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'retry'): void
}>()

function selectLocation(location: PickupLocation) {
  emit('update:modelValue', location.id)
}
</script>
