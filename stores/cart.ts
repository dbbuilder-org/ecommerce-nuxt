// Cart store using Pinia
// Client-side state management for shopping cart

import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
  maxQuantity?: number
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
    addItem(product: Omit<CartItem, 'quantity'>, quantity = 1) {
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

    removeItem(productId: number) {
      const index = this.items.findIndex((item) => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((item) => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else if (item.maxQuantity && quantity > item.maxQuantity) {
          item.quantity = item.maxQuantity
        } else {
          item.quantity = quantity
        }
      }
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
