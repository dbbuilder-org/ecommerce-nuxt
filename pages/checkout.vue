<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Checkout</h1>

    <!-- Empty Cart State -->
    <div v-if="cartStore.isEmpty" class="text-center py-12">
      <Icon name="heroicons:shopping-cart" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-4">Add some items before checking out.</p>
      <NuxtLink to="/shop">
        <UiButton variant="primary">Browse Products</UiButton>
      </NuxtLink>
    </div>

    <!-- Checkout Flow -->
    <div v-else>
      <!-- Checkout Steps Indicator -->
      <CheckoutCheckoutSteps
        :current-step="checkoutStore.currentStep"
        :completed-steps="checkoutStore.completedSteps"
        @navigate="navigateToStep"
      />

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Step 1: Contact Information -->
          <UiCard v-if="checkoutStore.currentStep === 1" variant="default">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="heroicons:user" class="w-4 h-4 text-primary-600" />
                </div>
                <h2 class="text-lg font-semibold">Contact Information</h2>
              </div>
            </template>
            <template #content>
              <div class="space-y-4">
                <!-- Auth state message -->
                <div v-if="authStore.isAuthenticated" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div class="flex items-center">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500" />
                    <span class="ml-2 text-sm text-green-700">
                      Logged in as <strong>{{ authStore.userName }}</strong>
                    </span>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <UiFormInput
                    v-model="firstName.value.value"
                    label="First Name"
                    placeholder="John"
                    :error="firstName.error.value"
                    :required="true"
                    autocomplete="given-name"
                    @blur="firstName.touch()"
                  />
                  <UiFormInput
                    v-model="lastName.value.value"
                    label="Last Name"
                    placeholder="Doe"
                    :error="lastName.error.value"
                    :required="true"
                    autocomplete="family-name"
                    @blur="lastName.touch()"
                  />
                  <div class="md:col-span-2">
                    <UiFormInput
                      v-model="email.value.value"
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      :error="email.error.value"
                      :required="true"
                      autocomplete="email"
                      hint="We'll send your order confirmation here"
                      @blur="email.touch()"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <UiFormInput
                      v-model="phone.value.value"
                      label="Phone Number"
                      type="tel"
                      placeholder="(555) 123-4567"
                      :error="phone.error.value"
                      autocomplete="tel"
                      hint="Optional - for order updates"
                      @blur="phone.touch()"
                    />
                  </div>
                </div>

                <!-- Continue Button -->
                <div class="pt-4">
                  <UiButton
                    @click="continueToDelivery"
                    :disabled="!isContactValid"
                    variant="primary"
                    size="lg"
                    class="w-full"
                  >
                    Continue to Delivery
                    <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
                  </UiButton>
                </div>
              </div>
            </template>
          </UiCard>

          <!-- Step 2: Delivery -->
          <template v-if="checkoutStore.currentStep === 2">
            <!-- Delivery Method Selector (if both options available) -->
            <UiCard v-if="configStore.hasBothDeliveryOptions" variant="default">
              <template #content>
                <CheckoutDeliveryMethodSelector
                  v-model="checkoutStore.deliveryMethod"
                  :show-pickup="configStore.shouldShowPickupLocations"
                  :show-shipping="configStore.shouldShowShippingForm"
                  :free-shipping-threshold="configStore.freeShippingThreshold"
                />
              </template>
            </UiCard>

            <!-- Pickup Location Selection -->
            <UiCard
              v-if="checkoutStore.deliveryMethod === 'pickup' && configStore.shouldShowPickupLocations"
              variant="default"
            >
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon name="heroicons:building-storefront" class="w-4 h-4 text-primary-600" />
                  </div>
                  <h2 class="text-lg font-semibold">Pickup Location</h2>
                </div>
              </template>
              <template #content>
                <CheckoutPickupLocationSelector
                  v-model="checkoutStore.selectedPickupLocationId"
                  :locations="checkoutStore.pickupLocations"
                  :loading="checkoutStore.pickupLocationsLoading"
                  :error="checkoutStore.pickupLocationsError"
                  :required="true"
                  :show-validation="showDeliveryValidation"
                  @retry="checkoutStore.fetchPickupLocations()"
                />
              </template>
            </UiCard>

            <!-- Shipping Address Form -->
            <UiCard
              v-if="checkoutStore.deliveryMethod === 'shipping' && configStore.shouldShowShippingForm"
              variant="default"
            >
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon name="heroicons:truck" class="w-4 h-4 text-primary-600" />
                  </div>
                  <h2 class="text-lg font-semibold">Shipping Address</h2>
                </div>
              </template>
              <template #content>
                <CheckoutShippingAddressForm
                  v-model="checkoutStore.shippingAddress"
                  :errors="shippingAddressErrors"
                  :required="true"
                  @zip-blur="fetchShippingQuotes"
                />
              </template>
            </UiCard>

            <!-- Shipping Options -->
            <UiCard
              v-if="checkoutStore.deliveryMethod === 'shipping' && checkoutStore.isShippingAddressComplete"
              variant="default"
            >
              <template #content>
                <CheckoutShippingQuotes
                  v-model="checkoutStore.selectedShippingRateId"
                  :rates="checkoutStore.shippingRates"
                  :loading="checkoutStore.shippingRatesLoading"
                  :error="checkoutStore.shippingRatesError"
                  :free-shipping-applied="checkoutStore.freeShippingApplied"
                  :free-shipping-threshold="configStore.freeShippingThreshold"
                  :order-subtotal="cartStore.subtotal"
                  @refresh="fetchShippingQuotes"
                />
              </template>
            </UiCard>

            <!-- Navigation Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <UiButton
                @click="checkoutStore.goToPreviousStep()"
                variant="outline"
                size="lg"
                class="sm:flex-1"
              >
                <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
                Back
              </UiButton>
              <UiButton
                @click="continueToPayment"
                :disabled="!checkoutStore.isDeliveryComplete"
                variant="primary"
                size="lg"
                class="sm:flex-1"
              >
                Continue to Payment
                <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
              </UiButton>
            </div>
          </template>

          <!-- Step 3: Payment -->
          <template v-if="checkoutStore.currentStep === 3">
            <UiCard variant="default">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon name="heroicons:credit-card" class="w-4 h-4 text-primary-600" />
                  </div>
                  <h2 class="text-lg font-semibold">Payment</h2>
                </div>
              </template>
              <template #content>
                <div class="space-y-6">
                  <!-- Order Review Summary -->
                  <div class="p-4 bg-gray-50 rounded-lg space-y-3">
                    <h3 class="font-medium text-gray-900">Order Review</h3>

                    <!-- Contact Info Summary -->
                    <div class="flex items-start text-sm">
                      <Icon name="heroicons:user" class="w-4 h-4 text-gray-400 mt-0.5" />
                      <div class="ml-2">
                        <p class="text-gray-900">{{ checkoutStore.guestInfo.firstName }} {{ checkoutStore.guestInfo.lastName }}</p>
                        <p class="text-gray-500">{{ checkoutStore.guestInfo.email }}</p>
                      </div>
                      <button @click="navigateToStep(1)" class="ml-auto text-primary-600 hover:text-primary-700 text-sm">
                        Edit
                      </button>
                    </div>

                    <!-- Delivery Summary -->
                    <div class="flex items-start text-sm border-t pt-3">
                      <Icon
                        :name="checkoutStore.deliveryMethod === 'pickup' ? 'heroicons:building-storefront' : 'heroicons:truck'"
                        class="w-4 h-4 text-gray-400 mt-0.5"
                      />
                      <div class="ml-2">
                        <p class="text-gray-900">
                          {{ checkoutStore.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Shipping' }}
                        </p>
                        <p class="text-gray-500">{{ deliverySummaryText }}</p>
                      </div>
                      <button @click="navigateToStep(2)" class="ml-auto text-primary-600 hover:text-primary-700 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>

                  <!-- Payment Method Info -->
                  <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div class="flex items-start">
                      <Icon name="heroicons:lock-closed" class="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div class="ml-3">
                        <p class="font-medium text-blue-800">Secure Payment</p>
                        <p class="text-sm text-blue-700 mt-1">
                          You will be redirected to our secure payment provider to complete your purchase.
                          Your payment information is encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div
                    v-if="checkoutStore.checkoutError"
                    class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                  >
                    <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 class="font-medium text-red-800">Payment Failed</h3>
                      <p class="text-sm text-red-600 mt-1">{{ checkoutStore.checkoutError }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </UiCard>

            <!-- Navigation Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <UiButton
                @click="checkoutStore.goToPreviousStep()"
                variant="outline"
                size="lg"
                class="sm:w-auto"
              >
                <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
                Back
              </UiButton>
              <UiButton
                @click="handleCheckout"
                :disabled="checkoutStore.isProcessing || !checkoutStore.canProceedToPayment"
                variant="primary"
                size="lg"
                class="flex-1"
              >
                <Icon
                  v-if="checkoutStore.isProcessing"
                  name="heroicons:arrow-path"
                  class="w-5 h-5 mr-2 animate-spin"
                />
                {{ checkoutStore.isProcessing ? 'Processing...' : `Pay ${formattedTotal}` }}
              </UiButton>
            </div>

            <!-- Security Notice -->
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <Icon name="heroicons:lock-closed" class="w-4 h-4" />
              <span>Secure checkout powered by WorldPay</span>
            </div>
          </template>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <CheckoutOrderSummary
              :items="cartStore.items"
              :subtotal="cartStore.subtotal"
              :shipping-cost="effectiveShippingCost"
              :show-shipping="checkoutStore.deliveryMethod === 'shipping' && checkoutStore.selectedShippingRateId !== null"
              :delivery-info="deliveryInfo"
              :editable="checkoutStore.currentStep === 1"
              :discount="discountAmount"
              :promo-code="checkoutStore.promoCode?.code"
              @remove-item="removeItem"
            />

            <!-- Promo Code Input -->
            <div class="mt-4">
              <CheckoutPromoCodeInput
                :subtotal="cartStore.subtotal"
              />
            </div>

            <!-- Continue Shopping Link -->
            <div class="mt-4 text-center">
              <NuxtLink to="/shop" class="text-sm text-primary-600 hover:text-primary-700">
                <Icon name="heroicons:arrow-left" class="w-4 h-4 inline mr-1" />
                Continue Shopping
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'
import { useField, rules } from '~/composables/useFormValidation'

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const configStore = useConfigStore()
const authStore = useAuthStore()
const toast = useToast()

// Form fields with validation
const firstName = useField(checkoutStore.guestInfo.firstName, [rules.required('First name is required')])
const lastName = useField(checkoutStore.guestInfo.lastName, [rules.required('Last name is required')])
const email = useField(checkoutStore.guestInfo.email, [rules.required('Email is required'), rules.email()])
const phone = useField(checkoutStore.guestInfo.phone || '', [rules.phone()])

// Validation states
const showDeliveryValidation = ref(false)
const shippingAddressErrors = ref<Record<string, string>>({})

// Computed properties
const isContactValid = computed(() => {
  return firstName.isValid.value && lastName.isValid.value && email.isValid.value && phone.isValid.value
})

const deliverySummaryText = computed(() => {
  if (checkoutStore.deliveryMethod === 'pickup') {
    const location = checkoutStore.selectedPickupLocation
    return location ? location.name : 'Select a location'
  }
  const addr = checkoutStore.shippingAddress
  if (addr.addressLine1) {
    return `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.zipCode}`
  }
  return 'Enter shipping address'
})

const deliveryInfo = computed(() => {
  if (checkoutStore.deliveryMethod === 'pickup' && checkoutStore.selectedPickupLocation) {
    return {
      type: 'pickup' as const,
      summary: checkoutStore.selectedPickupLocation.name,
    }
  }
  if (checkoutStore.deliveryMethod === 'shipping' && checkoutStore.selectedShippingRate) {
    return {
      type: 'shipping' as const,
      summary: `${checkoutStore.selectedShippingRate.serviceName} - ${checkoutStore.formattedShippingCost}`,
    }
  }
  return null
})

// Promo code discount
const discountAmount = computed(() => {
  return checkoutStore.calculateDiscount(cartStore.subtotal)
})

// Effective shipping cost (considering promo code)
const effectiveShippingCost = computed(() => {
  if (checkoutStore.promoGivesFreeShipping) {
    return 0
  }
  return checkoutStore.shippingCost
})

const formattedTotal = computed(() => {
  const shipping = checkoutStore.deliveryMethod === 'shipping' ? effectiveShippingCost.value : 0
  const total = cartStore.subtotal - discountAmount.value + shipping
  return formatCurrency(total)
})

// Initialize on mount
onMounted(async () => {
  // Fetch config
  await configStore.fetchConfig()

  // Fetch pickup locations if enabled
  if (configStore.shouldShowPickupLocations) {
    await checkoutStore.fetchPickupLocations()
  }

  // Pre-fill from auth store if logged in
  if (authStore.isAuthenticated && authStore.user) {
    if (!firstName.value.value) firstName.value.value = authStore.user.firstName || ''
    if (!lastName.value.value) lastName.value.value = authStore.user.lastName || ''
    if (!email.value.value) email.value.value = authStore.user.email || ''
  }

  // Set default delivery method based on available options
  if (configStore.shouldShowPickupLocations && !configStore.shouldShowShippingForm) {
    checkoutStore.setDeliveryMethod('pickup')
  } else if (!configStore.shouldShowPickupLocations && configStore.shouldShowShippingForm) {
    checkoutStore.setDeliveryMethod('shipping')
  }
})

// Watch for form field changes to sync with store
watch([firstName.value, lastName.value, email.value, phone.value], () => {
  checkoutStore.setGuestInfo({
    firstName: firstName.value.value,
    lastName: lastName.value.value,
    email: email.value.value,
    phone: phone.value.value,
  })
}, { deep: true })

// Navigation functions
function navigateToStep(step: number) {
  checkoutStore.setStep(step)
}

function continueToDelivery() {
  // Touch all fields to show validation
  firstName.touch()
  lastName.touch()
  email.touch()
  phone.touch()

  if (!isContactValid.value) {
    toast.error('Please fix the errors', 'Some required fields are missing or invalid')
    return
  }

  checkoutStore.goToNextStep()
}

function continueToPayment() {
  showDeliveryValidation.value = true

  if (!checkoutStore.isDeliveryComplete) {
    if (checkoutStore.deliveryMethod === 'pickup') {
      toast.error('Select pickup location', 'Please select a pickup location to continue')
    } else {
      toast.error('Complete shipping details', 'Please complete the shipping address and select a shipping option')
    }
    return
  }

  checkoutStore.goToNextStep()
}

// Shipping quotes
async function fetchShippingQuotes() {
  if (!checkoutStore.isShippingAddressComplete) return

  await checkoutStore.fetchShippingQuotes(
    cartStore.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  )
}

// Cart actions
function removeItem(itemId: number) {
  cartStore.removeItem(itemId)
  toast.info('Item removed', 'Item has been removed from your cart')
}

// Checkout
async function handleCheckout() {
  if (checkoutStore.isProcessing) return

  checkoutStore.setProcessing(true)
  checkoutStore.setCheckoutError(null)

  try {
    // Prepare checkout data
    const checkoutData = checkoutStore.getCheckoutData()

    // Call server-side API route
    const response = await $fetch('/api/ecommerce/initiate-payment', {
      method: 'POST',
      body: {
        guestInfo: checkoutData.guestInfo,
        cartItems: cartStore.items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryMethod: checkoutData.deliveryMethod,
        pickupLocation: checkoutData.pickupLocation,
        shippingAddress: checkoutData.shippingAddress,
        shippingRate: checkoutData.shippingRate,
        // Include promo code if applied
        promoCode: checkoutData.promoCode || null,
        discount: discountAmount.value,
      },
    })

    // Redirect to WorldPay payment page
    if (response.paymentUrl) {
      toast.success('Redirecting to payment...', 'You will be redirected to secure payment')
      window.location.href = response.paymentUrl
    } else {
      throw new Error('No payment URL received')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    checkoutStore.setCheckoutError(
      error.data?.message || error.message || 'Failed to initiate payment. Please try again.'
    )
    toast.error('Checkout failed', 'There was a problem processing your order')
  } finally {
    checkoutStore.setProcessing(false)
  }
}

// Page meta
useHead({
  title: 'Checkout',
})
</script>
