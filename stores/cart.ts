// Cart store using Pinia
// Client-side state management for shopping cart

import { defineStore } from 'pinia'

/**
 * CartItem aligns with API PaymentItemRequest
 * Uses productId and productSizeId for backend compatibility
 */
export interface CartItem {
  id: string // Client-generated unique ID (productId-productSizeId)
  productId: number
  productSizeId?: number // For size variants
  name: string
  description?: string
  size?: string // Display name for variant
  price: number
  quantity: number
  image?: string
  maxQuantity?: number
  available?: boolean
}

/**
 * Helper to generate cart item ID
 */
export function generateCartItemId(productId: number, productSizeId?: number): string {
  return productSizeId ? `${productId}-${productSizeId}` : `${productId}`
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    isOpen: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    isEmpty: (state) => state.items.length === 0,

    formattedSubtotal: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(subtotal)
    },
  },

  actions: {
    /**
     * Add item to cart - handles both simple products and variants
     */
    addItem(product: Omit<CartItem, 'quantity'>, quantity = 1) {
      // Find existing item by unique ID (productId-productSizeId combination)
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (product.maxQuantity && newQuantity > product.maxQuantity) {
          existingItem.quantity = product.maxQuantity
        } else {
          existingItem.quantity = newQuantity
        }
      } else {
        this.items.push({
          ...product,
          quantity,
        })
      }

      // Open cart sidebar when item added
      this.isOpen = true
    },

    /**
     * Remove item by unique ID (string format: productId-productSizeId)
     */
    removeItem(itemId: string) {
      const index = this.items.findIndex((item) => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    /**
     * Remove item by product ID and optional size ID
     */
    removeProduct(productId: number, productSizeId?: number) {
      const itemId = generateCartItemId(productId, productSizeId)
      this.removeItem(itemId)
    },

    /**
     * Update quantity by unique ID
     */
    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find((item) => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else if (item.maxQuantity && quantity > item.maxQuantity) {
          item.quantity = item.maxQuantity
        } else {
          item.quantity = quantity
        }
      }
    },

    /**
     * Get item by unique ID
     */
    getItem(itemId: string): CartItem | undefined {
      return this.items.find((item) => item.id === itemId)
    },

    /**
     * Check if product (with optional size) is in cart
     */
    hasProduct(productId: number, productSizeId?: number): boolean {
      const itemId = generateCartItemId(productId, productSizeId)
      return this.items.some((item) => item.id === itemId)
    },

    clearCart() {
      this.items = []
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },
  },

})
