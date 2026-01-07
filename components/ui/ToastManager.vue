<script setup lang="ts">
const toastStore = useToastStore()
const cartStore = useCartStore()
const router = useRouter()

function handleViewCart(toastId: number) {
  cartStore.openCart()
  toastStore.clearAllToasts()
}

function handleContinueShopping(toastId: number) {
  toastStore.removeToast(toastId)
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-0 right-0 z-[100] pointer-events-none p-4 space-y-2 max-w-sm w-full">
      <UiToast
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :toast="toast"
        class="pointer-events-auto"
        @close="toastStore.removeToast(toast.id)"
        @view-cart="handleViewCart(toast.id)"
        @continue-shopping="handleContinueShopping(toast.id)"
      />
    </div>
  </Teleport>
</template>
