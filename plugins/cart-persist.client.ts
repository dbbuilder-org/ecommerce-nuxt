// Client-side only plugin for cart persistence
// The .client.ts suffix ensures this only runs on the client

export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()

  // Restore cart from localStorage on client mount
  const savedCart = localStorage.getItem('cart-items')
  if (savedCart) {
    try {
      const items = JSON.parse(savedCart)
      if (Array.isArray(items)) {
        items.forEach(item => {
          cartStore.items.push(item)
        })
      }
    } catch (e) {
      console.error('Failed to restore cart:', e)
    }
  }

  // Watch for changes and persist to localStorage
  watch(
    () => cartStore.items,
    (items) => {
      localStorage.setItem('cart-items', JSON.stringify(items))
    },
    { deep: true }
  )
})
