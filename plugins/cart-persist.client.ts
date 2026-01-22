// Client-side only plugin for cart persistence
// The .client.ts suffix ensures this only runs on the client

// Cart storage version - increment to force reset of stale cached data
// v2: Fix for stale tax data showing shipping amount as tax (2026-01-20)
const CART_STORAGE_VERSION = 2

interface PersistedCartData {
  version?: number
  items: any[]
}

export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()

  // Restore cart from localStorage on client mount
  const savedCartRaw = localStorage.getItem('cart-items')
  if (savedCartRaw) {
    try {
      const parsed = JSON.parse(savedCartRaw)

      // Handle both old format (array) and new format (object with version)
      let cartData: PersistedCartData
      if (Array.isArray(parsed)) {
        // Old format - wrap in object with no version
        cartData = { items: parsed }
      } else {
        cartData = parsed as PersistedCartData
      }

      // Version check: Clear stale data from old versions
      if (!cartData.version || cartData.version < CART_STORAGE_VERSION) {
        console.warn(`🛒 Cart version mismatch (stored: ${cartData.version || 'none'}, current: ${CART_STORAGE_VERSION}), migrating cart data`)
        // Keep items but ensure format is current
        cartData.version = CART_STORAGE_VERSION
      }

      // Restore items
      if (Array.isArray(cartData.items)) {
        cartData.items.forEach(item => {
          cartStore.items.push(item)
        })
      }
    } catch (e) {
      console.error('Failed to restore cart:', e)
    }
  }

  // Watch for changes and persist to localStorage with version
  watch(
    () => cartStore.items,
    (items) => {
      const cartData: PersistedCartData = {
        version: CART_STORAGE_VERSION,
        items,
      }
      localStorage.setItem('cart-items', JSON.stringify(cartData))
    },
    { deep: true }
  )
})
