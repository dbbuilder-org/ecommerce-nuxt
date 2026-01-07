import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore, type CartItem } from '~/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts with empty cart', () => {
      const store = useCartStore()

      expect(store.items).toEqual([])
      expect(store.isOpen).toBe(false)
    })
  })

  describe('getters', () => {
    it('calculates itemCount correctly', () => {
      const store = useCartStore()

      expect(store.itemCount).toBe(0)

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      expect(store.itemCount).toBe(1)

      store.addItem({ id: 2, name: 'Item 2', price: 20 }, 3)
      expect(store.itemCount).toBe(4)
    })

    it('calculates subtotal correctly', () => {
      const store = useCartStore()

      expect(store.subtotal).toBe(0)

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      expect(store.subtotal).toBe(10)

      store.addItem({ id: 2, name: 'Item 2', price: 25 }, 2)
      expect(store.subtotal).toBe(60) // 10 + (25 * 2)
    })

    it('returns correct isEmpty state', () => {
      const store = useCartStore()

      expect(store.isEmpty).toBe(true)

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      expect(store.isEmpty).toBe(false)

      store.clearCart()
      expect(store.isEmpty).toBe(true)
    })

    it('formats subtotal correctly', () => {
      const store = useCartStore()

      expect(store.formattedSubtotal).toBe('$0.00')

      store.addItem({ id: 1, name: 'Item 1', price: 1234.56 })
      expect(store.formattedSubtotal).toBe('$1,234.56')
    })
  })

  describe('addItem', () => {
    it('adds a new item to cart', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Test Product', price: 29.99 })

      expect(store.items.length).toBe(1)
      expect(store.items[0]).toEqual({
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      })
    })

    it('adds item with custom quantity', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Test Product', price: 29.99 }, 5)

      expect(store.items[0].quantity).toBe(5)
    })

    it('increments quantity for existing item', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Test Product', price: 29.99 })
      store.addItem({ id: 1, name: 'Test Product', price: 29.99 })

      expect(store.items.length).toBe(1)
      expect(store.items[0].quantity).toBe(2)
    })

    it('respects maxQuantity when incrementing', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Limited Item', price: 50, maxQuantity: 3 }, 2)
      store.addItem({ id: 1, name: 'Limited Item', price: 50, maxQuantity: 3 }, 5)

      expect(store.items[0].quantity).toBe(3) // capped at maxQuantity
    })

    it('opens cart sidebar when item added', () => {
      const store = useCartStore()

      expect(store.isOpen).toBe(false)

      store.addItem({ id: 1, name: 'Test Product', price: 29.99 })

      expect(store.isOpen).toBe(true)
    })

    it('preserves optional fields', () => {
      const store = useCartStore()

      store.addItem({
        id: 1,
        name: 'Test Product',
        price: 29.99,
        image: '/images/product.jpg',
        variant: 'Large',
      })

      expect(store.items[0].image).toBe('/images/product.jpg')
      expect(store.items[0].variant).toBe('Large')
    })
  })

  describe('removeItem', () => {
    it('removes item by id', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      store.addItem({ id: 2, name: 'Item 2', price: 20 })

      store.removeItem(1)

      expect(store.items.length).toBe(1)
      expect(store.items[0].id).toBe(2)
    })

    it('does nothing if item not found', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })

      store.removeItem(999)

      expect(store.items.length).toBe(1)
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity for existing item', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      store.updateQuantity(1, 5)

      expect(store.items[0].quantity).toBe(5)
    })

    it('removes item when quantity set to 0', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      store.updateQuantity(1, 0)

      expect(store.items.length).toBe(0)
    })

    it('removes item when quantity set to negative', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      store.updateQuantity(1, -1)

      expect(store.items.length).toBe(0)
    })

    it('respects maxQuantity when updating', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Limited Item', price: 50, maxQuantity: 3 })
      store.updateQuantity(1, 10)

      expect(store.items[0].quantity).toBe(3)
    })

    it('does nothing for non-existent item', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      store.updateQuantity(999, 5)

      expect(store.items.length).toBe(1)
      expect(store.items[0].quantity).toBe(1)
    })
  })

  describe('clearCart', () => {
    it('removes all items', () => {
      const store = useCartStore()

      store.addItem({ id: 1, name: 'Item 1', price: 10 })
      store.addItem({ id: 2, name: 'Item 2', price: 20 })
      store.addItem({ id: 3, name: 'Item 3', price: 30 })

      store.clearCart()

      expect(store.items).toEqual([])
      expect(store.itemCount).toBe(0)
      expect(store.subtotal).toBe(0)
    })
  })

  describe('cart sidebar controls', () => {
    it('openCart sets isOpen to true', () => {
      const store = useCartStore()

      store.openCart()

      expect(store.isOpen).toBe(true)
    })

    it('closeCart sets isOpen to false', () => {
      const store = useCartStore()

      store.isOpen = true
      store.closeCart()

      expect(store.isOpen).toBe(false)
    })

    it('toggleCart toggles isOpen state', () => {
      const store = useCartStore()

      expect(store.isOpen).toBe(false)

      store.toggleCart()
      expect(store.isOpen).toBe(true)

      store.toggleCart()
      expect(store.isOpen).toBe(false)
    })
  })
})
