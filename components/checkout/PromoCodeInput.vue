<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <!-- Applied Promo Code -->
    <div v-if="checkoutStore.promoCode" class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name="heroicons:tag" class="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p class="font-medium text-gray-900">{{ checkoutStore.promoCode.code }}</p>
          <p class="text-sm text-green-600">{{ checkoutStore.promoCode.description || discountDescription }}</p>
        </div>
      </div>
      <button
        @click="removePromoCode"
        class="text-gray-400 hover:text-gray-600 p-1"
        title="Remove promo code"
      >
        <Icon name="heroicons:x-mark" class="w-5 h-5" />
      </button>
    </div>

    <!-- Promo Code Input -->
    <div v-else>
      <button
        v-if="!showInput"
        @click="showInput = true"
        class="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        <Icon name="heroicons:tag" class="w-4 h-4" />
        Have a promo code?
      </button>

      <div v-else class="space-y-3">
        <div class="flex gap-2">
          <input
            v-model="codeInput"
            type="text"
            placeholder="Enter promo code"
            class="input flex-1 uppercase"
            :disabled="checkoutStore.promoCodeLoading"
            @keyup.enter="applyCode"
          />
          <button
            @click="applyCode"
            :disabled="!codeInput.trim() || checkoutStore.promoCodeLoading"
            class="btn-primary whitespace-nowrap"
          >
            <Icon
              v-if="checkoutStore.promoCodeLoading"
              name="heroicons:arrow-path"
              class="w-4 h-4 animate-spin"
            />
            <span v-else>Apply</span>
          </button>
        </div>

        <!-- Error Message -->
        <p v-if="checkoutStore.promoCodeError" class="text-sm text-red-600 flex items-center gap-1">
          <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
          {{ checkoutStore.promoCodeError }}
        </p>

        <!-- Cancel Button -->
        <button
          @click="cancelInput"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  subtotal: number
}>()

const emit = defineEmits<{
  applied: []
  removed: []
}>()

const checkoutStore = useCheckoutStore()
const toast = useToast()

const showInput = ref(false)
const codeInput = ref('')

const discountDescription = computed(() => {
  const promo = checkoutStore.promoCode
  if (!promo) return ''

  switch (promo.discountType) {
    case 'percentage':
      return `${promo.discountValue}% off`
    case 'fixed':
      return `$${promo.discountValue} off`
    case 'freeShipping':
      return 'Free shipping'
    default:
      return ''
  }
})

async function applyCode() {
  if (!codeInput.value.trim()) return

  checkoutStore.setPromoCodeInput(codeInput.value)
  const success = await checkoutStore.applyPromoCode(props.subtotal)

  if (success) {
    toast.success('Promo code applied', discountDescription.value)
    codeInput.value = ''
    showInput.value = false
    emit('applied')
  }
}

function removePromoCode() {
  checkoutStore.removePromoCode()
  toast.info('Promo code removed', 'Discount has been removed from your order')
  emit('removed')
}

function cancelInput() {
  showInput.value = false
  codeInput.value = ''
  checkoutStore.promoCodeError = null
}
</script>
