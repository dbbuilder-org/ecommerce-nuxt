<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-medium text-gray-900">Shipping Address</h3>
      <span v-if="required" class="text-sm text-red-500">* Required</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- First Name -->
      <UiFormInput
        :model-value="modelValue.firstName"
        @update:model-value="updateField('firstName', $event)"
        label="First Name"
        placeholder="John"
        :error="errors.firstName"
        :required="required"
        autocomplete="shipping given-name"
      />

      <!-- Last Name -->
      <UiFormInput
        :model-value="modelValue.lastName"
        @update:model-value="updateField('lastName', $event)"
        label="Last Name"
        placeholder="Doe"
        :error="errors.lastName"
        :required="required"
        autocomplete="shipping family-name"
      />

      <!-- Address Line 1 -->
      <div class="sm:col-span-2">
        <UiFormInput
          :model-value="modelValue.addressLine1"
          @update:model-value="updateField('addressLine1', $event)"
          label="Address"
          placeholder="123 Main Street"
          :error="errors.addressLine1"
          :required="required"
          autocomplete="shipping address-line1"
        />
      </div>

      <!-- Address Line 2 -->
      <div class="sm:col-span-2">
        <UiFormInput
          :model-value="modelValue.addressLine2"
          @update:model-value="updateField('addressLine2', $event)"
          label="Apartment, suite, etc. (optional)"
          placeholder="Apt 4B"
          autocomplete="shipping address-line2"
        />
      </div>

      <!-- City -->
      <UiFormInput
        :model-value="modelValue.city"
        @update:model-value="updateField('city', $event)"
        label="City"
        placeholder="New York"
        :error="errors.city"
        :required="required"
        autocomplete="shipping address-level2"
      />

      <!-- State and ZIP -->
      <div class="grid grid-cols-2 gap-4">
        <UiFormInput
          :model-value="modelValue.state"
          @update:model-value="updateField('state', $event)"
          label="State"
          placeholder="NY"
          :error="errors.state"
          :required="required"
          autocomplete="shipping address-level1"
        />

        <UiFormInput
          :model-value="modelValue.zipCode"
          @update:model-value="handleZipChange"
          @blur="$emit('zip-blur')"
          label="ZIP Code"
          placeholder="10001"
          :error="errors.zipCode"
          :required="required"
          autocomplete="shipping postal-code"
        />
      </div>

      <!-- Phone (optional) -->
      <UiFormInput
        :model-value="modelValue.phone"
        @update:model-value="updateField('phone', $event)"
        label="Phone (optional)"
        placeholder="(555) 123-4567"
        type="tel"
        autocomplete="shipping tel"
        hint="For delivery updates"
      />

      <!-- Delivery Instructions (optional) -->
      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Delivery Instructions (optional)
        </label>
        <textarea
          :value="modelValue.deliveryInstructions"
          @input="updateField('deliveryInstructions', ($event.target as HTMLTextAreaElement).value)"
          placeholder="Leave at door, ring doorbell, etc."
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingAddress } from '~/types/checkout'

const props = withDefaults(defineProps<{
  modelValue: ShippingAddress
  errors?: Partial<Record<keyof ShippingAddress, string>>
  required?: boolean
}>(), {
  errors: () => ({}),
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ShippingAddress): void
  (e: 'zip-blur'): void
}>()

function updateField<K extends keyof ShippingAddress>(field: K, value: ShippingAddress[K]) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

function handleZipChange(value: string) {
  // Format ZIP code (remove non-digits, limit to 5 or 9 digits)
  const formatted = value.replace(/\D/g, '').slice(0, 9)
  updateField('zipCode', formatted)
}
</script>
