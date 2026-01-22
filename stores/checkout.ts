// Checkout store using Pinia
// Manages checkout flow state

import { defineStore } from 'pinia'
import type {
  CheckoutState,
  DeliveryMethod,
  PickupLocation,
  ShippingAddress,
  ShippingRate,
  GuestInfo,
  PromoCode,
} from '~/types/checkout'
import {
  DEFAULT_GUEST_INFO,
  DEFAULT_SHIPPING_ADDRESS,
} from '~/types/checkout'

export const useCheckoutStore = defineStore('checkout', {
  state: (): CheckoutState => ({
    // Step tracking
    currentStep: 1,
    completedSteps: [],

    // Guest/Contact info
    guestInfo: { ...DEFAULT_GUEST_INFO },

    // Delivery method
    deliveryMethod: 'pickup',

    // Pickup
    pickupLocations: [],
    selectedPickupLocationId: null,
    pickupLocationsLoading: false,
    pickupLocationsError: null,

    // Shipping
    shippingAddress: { ...DEFAULT_SHIPPING_ADDRESS },
    shippingRates: [],
    selectedShippingRateId: null,
    shippingRatesLoading: false,
    shippingRatesError: null,
    freeShippingApplied: false,
    freeShippingThreshold: 0,

    // Promo code
    promoCode: null,
    promoCodeInput: '',
    promoCodeLoading: false,
    promoCodeError: null,

    // Processing
    isProcessing: false,
    checkoutError: null,
  }),

  getters: {
    // Selected pickup location object
    selectedPickupLocation: (state): PickupLocation | null => {
      if (!state.selectedPickupLocationId) return null
      return state.pickupLocations.find(loc => loc.id === state.selectedPickupLocationId) || null
    },

    // Selected shipping rate object
    selectedShippingRate: (state): ShippingRate | null => {
      if (!state.selectedShippingRateId) return null
      return state.shippingRates.find(rate => rate.rateId === state.selectedShippingRateId) || null
    },

    // Check if contact info is complete
    isContactComplete: (state): boolean => {
      return !!(
        state.guestInfo.firstName.trim() &&
        state.guestInfo.lastName.trim() &&
        state.guestInfo.email.trim()
      )
    },

    // Check if delivery info is complete
    isDeliveryComplete(state): boolean {
      if (state.deliveryMethod === 'pickup') {
        return state.selectedPickupLocationId !== null
      }
      // Shipping requires address and selected rate
      const addr = state.shippingAddress
      const hasAddress = !!(
        addr.firstName.trim() &&
        addr.lastName.trim() &&
        addr.addressLine1.trim() &&
        addr.city.trim() &&
        addr.state.trim() &&
        addr.zipCode.trim()
      )
      return hasAddress && state.selectedShippingRateId !== null
    },

    // Check if shipping address is complete (for fetching quotes)
    isShippingAddressComplete: (state): boolean => {
      const addr = state.shippingAddress
      return !!(
        addr.addressLine1.trim() &&
        addr.city.trim() &&
        addr.state.trim() &&
        addr.zipCode.trim()
      )
    },

    // Shipping cost
    shippingCost(): number {
      const rate = this.selectedShippingRate
      return rate ? rate.amount : 0
    },

    // Can proceed to payment
    canProceedToPayment(): boolean {
      return this.isContactComplete && this.isDeliveryComplete
    },

    // Formatted shipping cost
    formattedShippingCost(): string {
      const cost = this.shippingCost
      if (cost === 0) return 'FREE'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(cost)
    },

    // Promo code discount calculation
    hasPromoCode: (state): boolean => !!state.promoCode,

    // Calculate discount amount based on subtotal
    calculateDiscount: (state) => (subtotal: number): number => {
      if (!state.promoCode) return 0

      const promo = state.promoCode

      // Check minimum order amount
      if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
        return 0
      }

      let discount = 0

      switch (promo.discountType) {
        case 'percentage':
          discount = (subtotal * promo.discountValue) / 100
          break
        case 'fixed':
          discount = promo.discountValue
          break
        case 'freeShipping':
          // Free shipping is handled separately
          return 0
      }

      // Apply max discount cap if set
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount
      }

      // Ensure discount doesn't exceed subtotal
      return Math.min(discount, subtotal)
    },

    // Check if promo gives free shipping
    promoGivesFreeShipping: (state): boolean => {
      return state.promoCode?.discountType === 'freeShipping'
    },
  },

  actions: {
    // Step navigation
    setStep(step: number) {
      this.currentStep = step
    },

    completeStep(step: number) {
      if (!this.completedSteps.includes(step)) {
        this.completedSteps.push(step)
      }
    },

    goToNextStep() {
      this.completeStep(this.currentStep)
      this.currentStep++
    },

    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    // Guest info
    setGuestInfo(info: Partial<GuestInfo>) {
      this.guestInfo = { ...this.guestInfo, ...info }
    },

    // Delivery method
    setDeliveryMethod(method: DeliveryMethod) {
      this.deliveryMethod = method
      // Clear selections when switching
      if (method === 'pickup') {
        this.selectedShippingRateId = null
      } else {
        this.selectedPickupLocationId = null
      }
    },

    // Pickup locations
    async fetchPickupLocations() {
      if (this.pickupLocations.length > 0) {
        // Already loaded, skip
        return
      }

      this.pickupLocationsLoading = true
      this.pickupLocationsError = null

      try {
        const response = await $fetch<{ Successful: boolean; pickupLocations: PickupLocation[]; message?: string }>(
          '/api/ecommerce/pickup-locations'
        )

        if (response.Successful) {
          this.pickupLocations = response.pickupLocations
        } else {
          this.pickupLocationsError = response.message || 'Failed to load pickup locations'
        }
      } catch (error: any) {
        console.error('Error fetching pickup locations:', error)
        this.pickupLocationsError = error.data?.message || 'Failed to load pickup locations'
      } finally {
        this.pickupLocationsLoading = false
      }
    },

    selectPickupLocation(locationId: number | null) {
      this.selectedPickupLocationId = locationId
    },

    // Shipping address
    setShippingAddress(address: Partial<ShippingAddress>) {
      const oldAddress = JSON.stringify(this.shippingAddress)
      this.shippingAddress = { ...this.shippingAddress, ...address }
      const newAddress = JSON.stringify(this.shippingAddress)

      // Clear stale shipping rates when address changes
      // Both shipping and tax are address-dependent, so they must be recalculated
      if (oldAddress !== newAddress && this.shippingRates.length > 0) {
        this.shippingRates = []
        this.selectedShippingRateId = null
        this.shippingRatesError = null
      }
    },

    // Shipping rates
    async fetchShippingQuotes(cartItems: { id: number; name: string; price: number; quantity: number }[]) {
      if (!this.isShippingAddressComplete) {
        this.shippingRatesError = 'Please complete the shipping address first'
        return
      }

      this.shippingRatesLoading = true
      this.shippingRatesError = null
      this.shippingRates = []
      this.selectedShippingRateId = null

      try {
        const addr = this.shippingAddress

        // Defensive validation: filter out invalid items and ensure proper types
        const validatedItems = cartItems
          .filter(item => item && item.id)  // Filter out invalid items
          .map(item => ({
            // Use productId (database ID) - ensure numeric type
            productId: parseInt(String(item.id), 10) || 0,
            productName: item.name || 'Unknown Product',
            quantity: parseInt(String(item.quantity), 10) || 1,
            unitPrice: parseFloat(String(item.price)) || 0,
            requiresShipping: true,
          }))
          .filter(item => item.productId > 0)  // Ensure valid productId

        // Validate request has items before calling API
        if (validatedItems.length === 0) {
          console.warn('⚠️ No valid items in cart for shipping quote')
          this.shippingRatesError = 'No shippable items in cart'
          this.shippingRatesLoading = false
          return
        }

        const response = await $fetch<{
          Successful: boolean
          rates: ShippingRate[]
          freeShippingApplied: boolean
          freeShippingThreshold?: number
          message?: string
        }>('/api/ecommerce/shipping-quotes', {
          method: 'POST',
          body: {
            toAddress: {
              name: `${addr.firstName} ${addr.lastName}`.trim(),
              street1: addr.addressLine1,
              street2: addr.addressLine2 || '',
              city: addr.city,
              state: addr.state,
              postalCode: addr.zipCode,
              country: addr.country || 'US',
              isResidential: true,
            },
            items: validatedItems,
            orderSubtotal: validatedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
          },
        })

        if (response.Successful) {
          this.shippingRates = response.rates
          this.freeShippingApplied = response.freeShippingApplied
          this.freeShippingThreshold = response.freeShippingThreshold || 0

          // Auto-select first rate if available
          if (response.rates.length > 0) {
            const firstRate = response.rates[0]
            if (firstRate) {
              this.selectedShippingRateId = firstRate.rateId
            }
          }
        } else {
          this.shippingRatesError = response.message || 'Failed to get shipping quotes'
        }
      } catch (error: any) {
        console.error('Error fetching shipping quotes:', error)
        this.shippingRatesError = error.data?.message || 'Failed to get shipping quotes'
      } finally {
        this.shippingRatesLoading = false
      }
    },

    selectShippingRate(rateId: string | null) {
      this.selectedShippingRateId = rateId
    },

    // Promo code actions
    setPromoCodeInput(code: string) {
      this.promoCodeInput = code
      this.promoCodeError = null
    },

    async applyPromoCode(subtotal: number) {
      const code = this.promoCodeInput.trim().toUpperCase()

      if (!code) {
        this.promoCodeError = 'Please enter a promo code'
        return false
      }

      this.promoCodeLoading = true
      this.promoCodeError = null

      try {
        const response = await $fetch<{
          success: boolean
          promoCode?: PromoCode
          message?: string
        }>('/api/ecommerce/validate-promo', {
          method: 'POST',
          body: {
            code,
            subtotal,
          },
        })

        if (response.success && response.promoCode) {
          this.promoCode = response.promoCode
          this.promoCodeInput = ''
          return true
        } else {
          this.promoCodeError = response.message || 'Invalid promo code'
          return false
        }
      } catch (error: any) {
        console.error('Error validating promo code:', error)
        this.promoCodeError = error.data?.message || 'Failed to validate promo code'
        return false
      } finally {
        this.promoCodeLoading = false
      }
    },

    removePromoCode() {
      this.promoCode = null
      this.promoCodeInput = ''
      this.promoCodeError = null
    },

    // Processing state
    setProcessing(processing: boolean) {
      this.isProcessing = processing
    },

    setCheckoutError(error: string | null) {
      this.checkoutError = error
    },

    // Reset checkout state
    resetCheckout() {
      this.currentStep = 1
      this.completedSteps = []
      this.guestInfo = { ...DEFAULT_GUEST_INFO }
      this.deliveryMethod = 'pickup'
      this.selectedPickupLocationId = null
      this.shippingAddress = { ...DEFAULT_SHIPPING_ADDRESS }
      this.shippingRates = []
      this.selectedShippingRateId = null
      this.shippingRatesError = null
      this.freeShippingApplied = false
      this.promoCode = null
      this.promoCodeInput = ''
      this.promoCodeLoading = false
      this.promoCodeError = null
      this.isProcessing = false
      this.checkoutError = null
    },

    // Prepare checkout data for payment
    getCheckoutData() {
      const data: any = {
        guestInfo: this.guestInfo,
        deliveryMethod: this.deliveryMethod,
      }

      if (this.deliveryMethod === 'pickup') {
        data.pickupLocation = this.selectedPickupLocation
      } else {
        data.shippingAddress = this.shippingAddress
        data.shippingRate = this.selectedShippingRate
      }

      // Include promo code if applied
      if (this.promoCode) {
        data.promoCode = this.promoCode
      }

      return data
    },
  },

  persist: {
    pick: [
      'guestInfo',
      'deliveryMethod',
      'selectedPickupLocationId',
      'shippingAddress',
      'selectedShippingRateId',
      'currentStep',
      'completedSteps',
      'promoCode',
    ],
  },
})
