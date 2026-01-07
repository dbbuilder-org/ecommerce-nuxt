// Config store using Pinia
// Manages feature flags and app configuration

import { defineStore } from 'pinia'

export interface FeatureFlags {
  // Authentication
  loginEnabled: boolean
  guestCheckoutEnabled: boolean
  emailVerificationEnabled: boolean

  // Checkout options
  showPickupLocations: boolean
  showShippingForm: boolean
  pickupLocationsEnabled: boolean
  shippingEnabled: boolean

  // Payment methods
  creditCardEnabled: boolean
  decliningBalanceEnabled: boolean

  // UI features
  showPromoBanner: boolean
  showCategoryCarousel: boolean
  showFeaturedProducts: boolean
}

export interface AppConfig {
  // School info
  schoolCode: string
  schoolName: string
  locationId: number

  // API settings
  apiBaseUrl: string

  // Feature flags
  features: FeatureFlags

  // Shipping settings
  freeShippingThreshold: number

  // Loading state
  isLoading: boolean
  isLoaded: boolean
  loadError: string | null
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  loginEnabled: true,
  guestCheckoutEnabled: true,
  emailVerificationEnabled: true,
  showPickupLocations: true,
  showShippingForm: false,
  pickupLocationsEnabled: true,
  shippingEnabled: false,
  creditCardEnabled: true,
  decliningBalanceEnabled: false,
  showPromoBanner: true,
  showCategoryCarousel: true,
  showFeaturedProducts: true,
}

export const useConfigStore = defineStore('config', {
  state: (): AppConfig => ({
    schoolCode: '',
    schoolName: '',
    locationId: 0,
    apiBaseUrl: '',
    features: { ...DEFAULT_FEATURE_FLAGS },
    freeShippingThreshold: 0,
    isLoading: false,
    isLoaded: false,
    loadError: null,
  }),

  getters: {
    // Checkout delivery options
    shouldShowPickupLocations: (state): boolean => {
      return state.features.showPickupLocations && state.features.pickupLocationsEnabled
    },

    shouldShowShippingForm: (state): boolean => {
      return state.features.showShippingForm && state.features.shippingEnabled
    },

    // Check if any delivery option is available
    hasDeliveryOptions: (state): boolean => {
      const pickup = state.features.showPickupLocations && state.features.pickupLocationsEnabled
      const shipping = state.features.showShippingForm && state.features.shippingEnabled
      return pickup || shipping
    },

    // Check if both delivery options are available (show selector)
    hasBothDeliveryOptions: (state): boolean => {
      const pickup = state.features.showPickupLocations && state.features.pickupLocationsEnabled
      const shipping = state.features.showShippingForm && state.features.shippingEnabled
      return pickup && shipping
    },

    // Payment options
    availablePaymentMethods: (state): string[] => {
      const methods: string[] = []
      if (state.features.creditCardEnabled) methods.push('credit_card')
      if (state.features.decliningBalanceEnabled) methods.push('declining_balance')
      return methods
    },

    // Auth options
    canLogin: (state): boolean => state.features.loginEnabled,
    canGuestCheckout: (state): boolean => state.features.guestCheckoutEnabled,
  },

  actions: {
    // Fetch config from API
    async fetchConfig() {
      // If already loaded successfully, skip
      if (this.isLoaded && !this.loadError) {
        return
      }

      this.isLoading = true
      this.loadError = null

      try {
        const response = await $fetch<{
          Successful: boolean
          config: {
            schoolCode: string
            schoolName: string
            locationId: number
            apiBaseUrl?: string
            features?: Partial<FeatureFlags>
            freeShippingThreshold?: number
          }
          message?: string
        }>('/api/ecommerce/config')

        if (response.Successful) {
          const cfg = response.config
          this.schoolCode = cfg.schoolCode
          this.schoolName = cfg.schoolName
          this.locationId = cfg.locationId
          this.apiBaseUrl = cfg.apiBaseUrl || ''
          this.freeShippingThreshold = cfg.freeShippingThreshold || 0

          // Merge feature flags with defaults
          if (cfg.features) {
            this.features = { ...DEFAULT_FEATURE_FLAGS, ...cfg.features }
          }

          this.isLoaded = true
        } else {
          this.loadError = response.message || 'Failed to load configuration'
        }
      } catch (error: any) {
        console.error('Error fetching config:', error)
        this.loadError = error.data?.message || 'Failed to load configuration'

        // Load defaults from runtime config
        this.loadFromRuntimeConfig()
      } finally {
        this.isLoading = false
      }
    },

    // Load from runtime config as fallback
    loadFromRuntimeConfig() {
      const config = useRuntimeConfig()
      this.schoolCode = config.public.schoolCode as string || 'westmoreland'
      this.schoolName = config.public.schoolName as string || 'School Bookstore'
      this.isLoaded = true
    },

    // Update a specific feature flag
    setFeature(feature: keyof FeatureFlags, value: boolean) {
      this.features[feature] = value
    },

    // Reset to defaults
    resetConfig() {
      this.features = { ...DEFAULT_FEATURE_FLAGS }
      this.isLoaded = false
      this.loadError = null
    },
  },
})
