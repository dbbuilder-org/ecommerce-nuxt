<template>
  <!-- Install Banner - shown when app is installable -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full"
  >
    <div
      v-if="showBanner"
      class="fixed bottom-0 inset-x-0 z-50 safe-area-inset-bottom"
    >
      <div class="bg-gray-900 text-white p-4 mx-4 mb-4 rounded-xl shadow-2xl max-w-md md:mx-auto">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="heroicons:device-phone-mobile" class="w-7 h-7 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-lg">Install App</h3>
            <p class="text-gray-300 text-sm mt-1">
              Add to your home screen for faster access and offline shopping.
            </p>
          </div>
          <button
            @click="dismissBanner"
            class="text-gray-400 hover:text-white p-1 -mr-1"
            aria-label="Dismiss"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
        <div class="flex gap-3 mt-4">
          <button
            @click="dismissBanner"
            class="flex-1 py-2.5 px-4 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Not now
          </button>
          <button
            @click="handleInstall"
            class="flex-1 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors touch-target"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Update Available Banner -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="pwa.hasUpdate.value && showUpdateBanner"
      class="fixed top-0 inset-x-0 z-50 safe-area-inset-top"
    >
      <div class="bg-blue-600 text-white px-4 py-3">
        <div class="container mx-auto flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <Icon name="heroicons:arrow-path" class="w-5 h-5 flex-shrink-0" />
            <p class="text-sm font-medium">A new version is available</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="showUpdateBanner = false"
              class="text-sm text-blue-100 hover:text-white"
            >
              Later
            </button>
            <button
              @click="handleUpdate"
              class="px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Offline Indicator -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="!pwa.isOnline.value"
      class="fixed top-0 inset-x-0 z-50 safe-area-inset-top"
    >
      <div class="bg-yellow-500 text-yellow-900 px-4 py-2">
        <div class="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
          <Icon name="heroicons:wifi" class="w-4 h-4" />
          <span>You're offline - some features may be limited</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const pwa = usePWA()
const showBanner = ref(false)
const showUpdateBanner = ref(true)

// Check if user has dismissed the install prompt recently
const DISMISS_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

const checkDismissed = () => {
  if (typeof localStorage === 'undefined') return false
  const dismissed = localStorage.getItem(DISMISS_KEY)
  if (!dismissed) return false
  const dismissedAt = parseInt(dismissed, 10)
  return Date.now() - dismissedAt < DISMISS_DURATION
}

// Initialize PWA and show banner if installable
onMounted(() => {
  pwa.initPWA()

  // Watch for installable state
  watchEffect(() => {
    if (pwa.isInstallable.value && !pwa.isInstalled.value && !checkDismissed()) {
      // Delay showing the banner to not interrupt the user immediately
      setTimeout(() => {
        showBanner.value = true
      }, 3000)
    }
  })
})

onUnmounted(() => {
  pwa.cleanup()
})

// Handle install button click
async function handleInstall() {
  const installed = await pwa.promptInstall()
  if (installed) {
    showBanner.value = false
  }
}

// Handle dismiss
function dismissBanner() {
  showBanner.value = false
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
  }
}

// Handle update
function handleUpdate() {
  pwa.applyUpdate()
}
</script>
