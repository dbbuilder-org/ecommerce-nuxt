/**
 * Ecommerce API Route Constants
 *
 * Synced with PaymentAPI/Constants/ApiRoutes.vb
 * Last updated: 2026-01-19
 *
 * Usage: `${API_BASE}/${tenant}/api/ecommerce/${EcommerceRoutes.userBalance}`
 */

/**
 * All ecommerce API routes
 * Routes are relative to /{tenant}/api/ecommerce/
 */
export const EcommerceRoutes = {
  // Configuration & Status
  config: 'config',
  status: 'status',
  businessDayStatus: 'business-day-status',

  // Products
  products: 'products',
  productTypes: 'products/types',
  categories: 'categories',
  categoriesProducts: 'categories/products',
  categoryFilters: 'categories/filters',
  categoryInfo: 'categories/info',
  netProductCounts: 'products/counts',

  // User Management
  usersCheckEmail: 'users/check-email',
  usersCreate: 'users/create',
  guestsCreate: 'guests/create',
  guestsValidate: 'guests/validate',
  guestManagementStatus: 'guests/status',
  guestUpdate: 'guest/update',

  // Ticket Operations (POS Integration) - Phase 3C
  ticketCreate: 'ticket/create',
  ticketPayment: 'ticket/{ticketId}/payment',
  ticketRefund: 'ticket/refund',

  // User Balance (Declining Balance)
  userBalance: 'user/balance',
  userBalanceValidate: 'user/balance/validate',
  userBalancePay: 'user/balance/pay',
  userBalanceRefund: 'user/balance/refund',
  userBalanceHistory: 'user/balance/history',

  // Payments
  paymentsInitiate: 'payments/initiate',
  paymentsInitiateV2: 'payments/initiate-v2',
  paymentsInitiateV3: 'payments/initiate-v3',

  // Transactions & Receipts
  transactionsLookup: 'transactions/lookup',
  receiptsToken: 'receipts/token',
  receiptsEmail: 'receipts/email',
  receiptsSendCustomer: 'receipts/send-customer',
  notificationsPickup: 'notifications/pickup',

  // Shipping
  shippingQuotes: 'shipping/quotes',
  shippingRates: 'shipping/rates',

  // Pickup Locations
  pickupLocations: 'pickup/locations',

  // Cart
  cartRecover: 'cart/recover',
} as const

/**
 * Legacy routes - DEPRECATED
 * These will be removed after 2026-06-01
 * Use the primary routes from EcommerceRoutes instead
 */
export const LegacyEcommerceRoutes = {
  // Products (deprecated)
  productbylocation_ecommerce: 'productbylocation_ecommerce',
  producttypes_ecommerce: 'producttypes_ecommerce',
  productcategories_ecommerce: 'productcategories_ecommerce',
  productsbycategory_ecommerce: 'productsbycategory_ecommerce',
  category_filters: 'category_filters',
  categorization_info: 'categorization_info',
  net_product_counts: 'net_product_counts',

  // User Management (deprecated)
  check_email: 'check_email',
  create_user_account: 'create_user_account',
  create_guest_v2: 'create_guest_v2',
  validate_guest: 'validate_guest',
  guest_management_status: 'guest_management_status',

  // Balance (deprecated - use user/balance instead)
  balance: 'balance',
  balanceValidate: 'balance/validate',
  balancePay: 'balance/pay',
  balanceRefund: 'balance/refund',
  balanceHistory: 'balance/history',

  // Payments (deprecated)
  initiate_payment: 'initiate_payment',
  initiate_payment_v2: 'initiate_payment_v2',
  initiate_payment_v3: 'initiate_payment_v3',

  // Transactions (deprecated)
  transaction_lookup: 'transaction_lookup',
  receipt_token: 'receipt_token',
  email_receipt: 'email_receipt',

  // Status (deprecated)
  business_day_status: 'business_day_status',
} as const

/**
 * Supported tenants
 */
export const Tenants = ['westmoreland', 'windermere', 'coastalab'] as const
export type Tenant = (typeof Tenants)[number]

/**
 * Build full API URL for a route
 * @param baseUrl - API base URL (e.g., https://api.example.com)
 * @param tenant - Tenant name (westmoreland, windermere, coastalab)
 * @param route - Route constant from EcommerceRoutes
 */
export function buildApiUrl(
  baseUrl: string,
  tenant: Tenant,
  route: string
): string {
  // Remove trailing slash from baseUrl if present
  const normalizedBase = baseUrl.replace(/\/$/, '')
  return `${normalizedBase}/${tenant}/api/ecommerce/${route}`
}

/**
 * Build ticket payment URL with ticketId
 */
export function buildTicketPaymentUrl(ticketId: number): string {
  return EcommerceRoutes.ticketPayment.replace('{ticketId}', ticketId.toString())
}

/**
 * Type-safe route accessor
 */
export type EcommerceRoute = (typeof EcommerceRoutes)[keyof typeof EcommerceRoutes]
export type LegacyEcommerceRoute = (typeof LegacyEcommerceRoutes)[keyof typeof LegacyEcommerceRoutes]
