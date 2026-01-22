/**
 * API Types - Backend DTO Alignment
 *
 * These types match the PaymentAPI backend DTOs to ensure
 * frontend-backend type safety and prevent parameter mismatches.
 *
 * Naming convention: {Entity}Response, {Entity}Request
 */

// ====================
// Common Types
// ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ====================
// Product Types
// ====================

export interface ProductResponse {
  id: number
  productId: number // Alias for id
  name: string
  description?: string
  productTypeId: number
  productTypeName?: string
  categoryId: number
  categoryName?: string
  image?: string
  video?: string
  price: number
  unitPrice: number
  available: boolean
  isActive: boolean
  glCode_Anthology?: string

  // Size variations (from backend)
  sizeVariations?: ProductSizeVariation[]
  variants?: ProductSizeVariation[] // Alias

  // Calculated fields
  hasVariants?: boolean
  minPrice?: number
  maxPrice?: number
}

export interface ProductSizeVariation {
  id: number
  productSizeId: number // Alias
  size?: string
  sizeName?: string
  price: number
  unitPrice: number
  available: boolean
  isActive: boolean
  sortOrder?: number
}

export interface ProductsResponse {
  products: ProductResponse[]
  totalCount?: number
}

// ====================
// Category Types
// ====================

export interface CategoryResponse {
  id: number
  categoryId: number // Alias
  name: string
  description?: string
  slug: string
  parentId?: number
  image?: string
  sortOrder: number
  productCount: number
  isActive: boolean
}

export interface CategoriesResponse {
  categories: CategoryResponse[]
}

// ====================
// Cart Types
// ====================

export interface CartItemRequest {
  productId: number
  productSizeId?: number
  quantity: number
}

export interface CartItemResponse {
  id: string // Client-generated ID
  productId: number
  productSizeId?: number
  name: string
  description?: string
  size?: string
  price: number
  quantity: number
  image?: string
  available: boolean
}

export interface CartResponse {
  items: CartItemResponse[]
  itemCount: number
  subtotal: number
  tax: number
  total: number
}

// ====================
// Order Types
// ====================

export interface OrderResponse {
  orderId: number
  ticketId: number // Backend uses TicketID
  orderNumber: string
  status: string
  statusId: number
  createdAt: string
  completedAt?: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  items: OrderItemResponse[]
  deliveryMethod: 'pickup' | 'shipping'
  shippingAddress?: ShippingAddressResponse
  pickupLocation?: PickupLocationResponse
  customerEmail?: string
  customerName?: string
}

export interface OrderItemResponse {
  id: number
  productId: number
  productSizeId?: number
  name: string
  size?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  image?: string
}

export interface OrdersResponse {
  orders: OrderResponse[]
  totalCount: number
}

// ====================
// Shipping Types
// ====================

export interface ShippingAddressResponse {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isResidential?: boolean
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
  items: Array<{
    productId: number
    productName: string
    quantity: number
    unitPrice: number
    requiresShipping: boolean
  }>
  orderSubtotal: number
}

export interface ShippingRateResponse {
  rateId: string
  serviceName: string
  carrierName: string
  estimatedDays: number
  isGuaranteed: boolean
  amount: number
}

export interface ShippingQuoteResponse {
  Successful: boolean
  rates: ShippingRateResponse[]
  freeShippingApplied: boolean
  freeShippingThreshold?: number
  message?: string
}

// ====================
// Pickup Types
// ====================

export interface PickupLocationResponse {
  id: number
  locationId: number // Backend alias
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  stateId: string
  state?: string
  postalCode: string
  phoneNumber?: string
  emailAddress?: string
  pickupInstructions?: string
  isActive: boolean
}

export interface PickupLocationsResponse {
  locations: PickupLocationResponse[]
}

// ====================
// Payment Types
// ====================

export interface PaymentRequest {
  amount: number
  currency?: string
  items: PaymentItemRequest[]
  customer: PaymentCustomerRequest
  deliveryMethod: 'pickup' | 'shipping'
  shippingAddress?: ShippingAddressResponse
  pickupLocationId?: number
  shippingRateId?: string
  shippingAmount?: number
  returnUrl: string
  cancelUrl?: string
  metadata?: Record<string, string>
}

export interface PaymentItemRequest {
  productId: number
  productSizeId?: number
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface PaymentCustomerRequest {
  email: string
  firstName: string
  lastName: string
  phone?: string
  personId?: number
  walletId?: number
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  orderId?: number
  ticketId?: number
  error?: string
  message?: string
}

// ====================
// Receipt Types
// ====================

export interface ReceiptRequest {
  orderId?: number
  ticketId?: number
  email: string
  includeDetails?: boolean
}

export interface ReceiptResponse {
  success: boolean
  message?: string
  receiptUrl?: string
}

// ====================
// User/Auth Types
// ====================

export interface UserResponse {
  id: number
  personId: number // Backend alias
  email: string
  name: string
  firstName?: string
  lastName?: string
  walletId?: number
  role?: string
  avatar?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  user?: UserResponse
  token?: string
  sessionId?: string
  error?: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface RegisterResponse {
  success: boolean
  user?: UserResponse
  message?: string
  error?: string
}

// ====================
// Balance/Wallet Types (Declining Balance)
// ====================

export interface BalanceResponse {
  balance: number
  currency: string
  walletId?: number
  lastUpdated?: string
}

/**
 * Declining balance account information
 */
export interface DecliningBalanceAccount {
  accountId: number
  accountName: string
  balance: number
  availableBalance: number
  currency: string
  accountTypeId: number
  accountTypeName?: string
  isActive: boolean
  expirationDate?: string
  walletId?: number
}

/**
 * Get user's declining balance accounts response
 */
export interface UserBalanceResponse {
  accounts: DecliningBalanceAccount[]
  totalBalance: number
  currency: string
}

/**
 * Validate balance payment request
 */
export interface ValidateBalancePaymentRequest {
  accountId: number
  amount: number
  walletId?: number
}

/**
 * Validate balance payment response
 */
export interface ValidateBalancePaymentResponse {
  Successful: boolean
  IsValid: boolean
  AccountID: number
  RequestedAmount: number
  AvailableBalance: number
  InsufficientFunds: boolean
  AccountInactive: boolean
  AccountExpired: boolean
  Message?: string
}

/**
 * Process balance payment request
 */
export interface ProcessBalancePaymentRequest {
  accountId: number
  amount: number
  walletId?: number
  ticketId?: number
  description?: string
}

/**
 * Process balance payment response
 */
export interface ProcessBalancePaymentResponse {
  Successful: boolean
  AccountTransactionID: number
  AccountID: number
  Amount: number
  NewBalance: number
  Message?: string
}

/**
 * Refund balance payment request
 */
export interface RefundBalancePaymentRequest {
  originalAccountTransactionId: number
  amount?: number // null = full refund
  reason?: string
}

/**
 * Refund balance payment response
 */
export interface RefundBalancePaymentResponse {
  Successful: boolean
  RefundAccountTransactionID: number
  AccountID: number
  RefundAmount: number
  NewBalance: number
  Message?: string
}

/**
 * Balance transaction history item
 */
export interface BalanceTransactionHistoryItem {
  accountTransactionId: number
  accountId: number
  transactionType: 'Payment' | 'Refund' | 'Deposit' | 'Adjustment'
  amount: number
  balanceAfter: number
  description?: string
  ticketId?: number
  createdAt: string
  createdBy?: string
}

/**
 * Balance transaction history response
 */
export interface BalanceTransactionHistoryResponse {
  transactions: BalanceTransactionHistoryItem[]
  accountId: number
  totalCount: number
}

// ====================
// Ticket Operations (POS Integration - Phase 3C)
// ====================

/**
 * Payment type for ticket payments
 */
export type TicketPaymentType = 'DecliningBalance' | 'CreditCard' | 'Cash' | 'Check' | 'GiftCard'

/**
 * Request to create a ticket with payment for single product purchase
 */
export interface CreateTicketRequest {
  SalonBusinessDayID: number
  AccountID?: number | null
  ProductID: number
  Quantity?: number // Default: 1
  UnitPrice: number
  AccountTransactionID?: number | null
  SkipPaymentItem?: boolean // Default: false, set true for split payments
  TerminalID?: number | null
  EmployeeID?: number | null
  SerialNumber?: string | null
  ProductOptionsString?: string | null
  // Per-order delivery address (stored on Ticket, not Guest)
  FirstName_Delivery?: string | null
  LastName_Delivery?: string | null
  AddressLine1_Delivery?: string | null
  AddressLine2_Delivery?: string | null
  AddressLine3_Delivery?: string | null
  City_Delivery?: string | null
  StateID_Delivery?: number | null
  PostalCode_Delivery?: string | null
  PostalCodeExtension_Delivery?: string | null
  PhoneNumber_Home_Delivery?: string | null
  PhoneNumber_Auxiliary_Delivery?: string | null
  EmailAddress_Delivery?: string | null
}

/**
 * Response from creating a ticket
 */
export interface CreateTicketResponse {
  Successful: boolean
  TicketID: number
  TicketLineItemID: number
  TicketPaymentID: number
  TicketPaymentItemID: number
  Message?: string
}

/**
 * Request to add a payment item to an existing ticket
 * Supports split payments: declining balance + credit card, multiple cards, etc.
 */
export interface AddPaymentItemRequest {
  TicketID: number
  PaymentAmount: number
  PaymentType: TicketPaymentType
  PaymentSubType?: string | null // For CreditCard: Visa, MasterCard, etc.
  GuestID_PaidBy?: number | null
  AccountTransactionID?: number | null // Required for DecliningBalance
  CardNumberLast4?: string | null
  AuthorizationCode?: string | null
  TerminalID?: number | null
}

/**
 * Response from adding a payment item
 */
export interface AddPaymentItemResponse {
  Successful: boolean
  TicketPaymentItemID: number
  PaymentType: string
  PaymentAmount: number
  Message?: string
}

/**
 * Request to create a refund ticket for an existing purchase
 */
export interface CreateRefundTicketRequest {
  OriginalTicketID: number
  OriginalTicketLineItemID: number
  RefundAccountTransactionID: number // From Ecommerce_RefundBalancePayment
  RefundQuantity?: number | null // null = full refund
  Reason?: string | null
}

/**
 * Response from creating a refund ticket
 */
export interface CreateRefundTicketResponse {
  Successful: boolean
  RefundTicketID: number
  RefundTicketLineItemID: number
  RefundTicketPaymentID: number
  RefundTicketPaymentItemID: number
  Message?: string
}

/**
 * Request to update guest information
 * Note: FirstName, LastName, EmailAddress are protected for employee-linked guests
 */
export interface UpdateGuestRequest {
  GuestID: number
  FirstName?: string | null
  LastName?: string | null
  EmailAddress?: string | null
  PhoneNumber_Home?: string | null
  PhoneNumber_Auxiliary?: string | null
  // Delivery address (always updatable, even for linked guests)
  FirstName_Delivery?: string | null
  LastName_Delivery?: string | null
  AddressLine1_Delivery?: string | null
  AddressLine2_Delivery?: string | null
  AddressLine3_Delivery?: string | null
  City_Delivery?: string | null
  StateID_Delivery?: number | null
  PostalCode_Delivery?: string | null
  PostalCodeExtension_Delivery?: string | null
  PhoneNumber_Home_Delivery?: string | null
  PhoneNumber_Auxiliary_Delivery?: string | null
  EmailAddress_Delivery?: string | null
}

/**
 * Response from updating guest information
 */
export interface UpdateGuestResponse {
  Successful: boolean
  GuestID: number
  IsLinkedGuest: boolean // True if guest is linked via Employee table
  EmployeeLinked: boolean
  FieldsUpdated: number
  Message?: string
}

// ====================
// Business Day Types
// ====================

export interface BusinessDayStatusResponse {
  isOpen: boolean
  currentBusinessDay?: string
  message?: string
  storeHours?: {
    open: string
    close: string
  }
}

// ====================
// Type Guards
// ====================

export function isProductResponse(obj: unknown): obj is ProductResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'price' in obj
  )
}

export function isOrderResponse(obj: unknown): obj is OrderResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('orderId' in obj || 'ticketId' in obj) &&
    'status' in obj
  )
}

export function isUserResponse(obj: unknown): obj is UserResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  )
}
