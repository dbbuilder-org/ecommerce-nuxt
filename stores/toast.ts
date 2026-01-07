// Toast store using Pinia
// Manages toast notifications globally

import { defineStore } from 'pinia'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration: number
  showActions?: boolean
  autoClose: boolean
}

export interface ToastOptions {
  type?: Toast['type']
  title: string
  message?: string
  duration?: number
  showActions?: boolean
  autoClose?: boolean
}

interface ToastState {
  toasts: Toast[]
  nextId: number
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: [],
    nextId: 1,
  }),

  actions: {
    addToast(options: ToastOptions): number {
      const toast: Toast = {
        id: this.nextId++,
        type: options.type || 'success',
        title: options.title,
        message: options.message,
        duration: options.duration || 4000,
        showActions: options.showActions || false,
        autoClose: options.autoClose !== false,
      }

      this.toasts.push(toast)

      // Limit to 5 toasts maximum
      if (this.toasts.length > 5) {
        this.toasts.shift()
      }

      // Auto-remove if autoClose is enabled
      if (toast.autoClose) {
        setTimeout(() => {
          this.removeToast(toast.id)
        }, toast.duration)
      }

      return toast.id
    },

    removeToast(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    clearAllToasts() {
      this.toasts = []
    },

    // Convenience methods
    success(title: string, message?: string, options?: Partial<ToastOptions>) {
      return this.addToast({ ...options, type: 'success', title, message })
    },

    error(title: string, message?: string, options?: Partial<ToastOptions>) {
      return this.addToast({ ...options, type: 'error', title, message })
    },

    info(title: string, message?: string, options?: Partial<ToastOptions>) {
      return this.addToast({ ...options, type: 'info', title, message })
    },

    warning(title: string, message?: string, options?: Partial<ToastOptions>) {
      return this.addToast({ ...options, type: 'warning', title, message })
    },
  },
})
