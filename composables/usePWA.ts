// Composable for PWA functionality - service worker registration and install prompt

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const isInstallable = ref(false)
  const isInstalled = ref(false)
  const isOnline = ref(true)
  const hasUpdate = ref(false)

  // Store the install prompt event
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const registration = ref<ServiceWorkerRegistration | null>(null)

  // Check if already installed as PWA
  const checkIfInstalled = () => {
    // Check if running in standalone mode (installed as PWA)
    if (typeof window !== 'undefined') {
      isInstalled.value = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
    }
  }

  // Register service worker
  const registerServiceWorker = async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker not supported')
      return
    }

    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      })

      registration.value = reg
      console.log('[PWA] Service Worker registered:', reg.scope)

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              hasUpdate.value = true
              console.log('[PWA] New content available')
            }
          })
        }
      })

      // Check for updates periodically (every hour)
      setInterval(() => {
        reg.update()
      }, 60 * 60 * 1000)

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error)
    }
  }

  // Apply update (skip waiting and reload)
  const applyUpdate = () => {
    if (registration.value?.waiting) {
      registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  // Handle install prompt
  const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault()
    // Store the event for later use
    deferredPrompt.value = event
    isInstallable.value = true
    console.log('[PWA] Install prompt saved')
  }

  // Trigger install prompt
  const promptInstall = async () => {
    if (!deferredPrompt.value) {
      console.log('[PWA] No install prompt available')
      return false
    }

    // Show the install prompt
    await deferredPrompt.value.prompt()

    // Wait for the user's choice
    const { outcome } = await deferredPrompt.value.userChoice

    // Clear the deferred prompt
    deferredPrompt.value = null
    isInstallable.value = false

    console.log('[PWA] Install prompt outcome:', outcome)
    return outcome === 'accepted'
  }

  // Handle app installed event
  const handleAppInstalled = () => {
    isInstalled.value = true
    isInstallable.value = false
    deferredPrompt.value = null
    console.log('[PWA] App installed')
  }

  // Handle online/offline status
  const handleOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  // Initialize PWA functionality
  const initPWA = () => {
    if (typeof window === 'undefined') return

    // Check if already installed
    checkIfInstalled()

    // Register service worker
    registerServiceWorker()

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    // Listen for app installed
    window.addEventListener('appinstalled', handleAppInstalled)

    // Track online/offline status
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    isOnline.value = navigator.onLine
  }

  // Cleanup
  const cleanup = () => {
    if (typeof window === 'undefined') return

    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.removeEventListener('appinstalled', handleAppInstalled)
    window.removeEventListener('online', handleOnlineStatus)
    window.removeEventListener('offline', handleOnlineStatus)
  }

  return {
    isInstallable,
    isInstalled,
    isOnline,
    hasUpdate,
    promptInstall,
    applyUpdate,
    initPWA,
    cleanup,
  }
}
