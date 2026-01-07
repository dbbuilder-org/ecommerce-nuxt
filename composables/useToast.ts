// Composable for easy toast notifications
export function useToast() {
  const toastStore = useToastStore()

  return {
    success: (title: string, message?: string) => toastStore.success(title, message),
    error: (title: string, message?: string) => toastStore.error(title, message),
    info: (title: string, message?: string) => toastStore.info(title, message),
    warning: (title: string, message?: string) => toastStore.warning(title, message),
    addToCart: (productName: string) => toastStore.success(
      'Added to Cart',
      `${productName} has been added to your cart.`,
      { showActions: true }
    ),
    remove: (id: number) => toastStore.removeToast(id),
    clear: () => toastStore.clearAllToasts(),
  }
}
