// Checkout type definitions

export type DeliveryMethod = 'pickup' | 'shipping'

export interface PickupLocation {
  id: number
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  stateId: string
  postalCode: string
  phoneNumber?: string
  emailAddress?: string
  pickupInstructions?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  deliveryInstructions?: string
}

export interface ShippingRate {
  rateId: string
  serviceName: string
  carrierName: string
  estimatedDays: number
  isGuaranteed: boolean
  amount: number // 0 = FREE
}

export interface ShippingQuoteRequest {
  toAddress: {
    name: string
    street1: string
    street2?: string
    city: string
    state: string
    postalCode: string
    country: string
    isResidential: boolean
  }
  items: {
    productId: number
    productName: string
    quantity: number
    unitPrice: number
    requiresShipping: boolean
  }[]
  orderSubtotal: number
}

export interface ShippingQuoteResponse {
  Successful: boolean
  rates: ShippingRate[]
  freeShippingApplied: boolean
  freeShippingThreshold?: number
  message?: string
}

export interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed' | 'freeShipping'
  discountValue: number // percentage (0-100) or fixed amount
  description?: string
  minOrderAmount?: number
  maxDiscount?: number
  expiresAt?: string
}

export interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface CheckoutState {
  // Step tracking
  currentStep: number
  completedSteps: number[]

  // Guest/Contact info
  guestInfo: GuestInfo

  // Delivery method
  deliveryMethod: DeliveryMethod

  // Pickup
  pickupLocations: PickupLocation[]
  selectedPickupLocationId: number | null
  pickupLocationsLoading: boolean
  pickupLocationsError: string | null

  // Shipping
  shippingAddress: ShippingAddress
  shippingRates: ShippingRate[]
  selectedShippingRateId: string | null
  shippingRatesLoading: boolean
  shippingRatesError: string | null
  freeShippingApplied: boolean
  freeShippingThreshold: number

  // Promo code
  promoCode: PromoCode | null
  promoCodeInput: string
  promoCodeLoading: boolean
  promoCodeError: string | null

  // Processing
  isProcessing: boolean
  checkoutError: string | null
}

export const CHECKOUT_STEPS = [
  { id: 1, name: 'Contact', icon: 'heroicons:user' },
  { id: 2, name: 'Delivery', icon: 'heroicons:truck' },
  { id: 3, name: 'Payment', icon: 'heroicons:credit-card' },
] as const

export const DEFAULT_GUEST_INFO: GuestInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

export const DEFAULT_SHIPPING_ADDRESS: ShippingAddress = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  phone: '',
  deliveryInstructions: '',
}
