<script setup lang="ts">
// AuthManager - Orchestrates authentication modals
// Handles switching between login, register, and forgot password flows

type AuthView = 'login' | 'register' | 'forgot-password' | null

const currentView = ref<AuthView>(null)
const showGuestCheckout = ref(true)

const authStore = useAuthStore()

// Public methods exposed via defineExpose
function openLogin(options?: { showGuestCheckout?: boolean }) {
  showGuestCheckout.value = options?.showGuestCheckout ?? true
  currentView.value = 'login'
}

function openRegister() {
  currentView.value = 'register'
}

function openForgotPassword() {
  currentView.value = 'forgot-password'
}

function closeAll() {
  currentView.value = null
}

// Expose methods for parent components
defineExpose({
  openLogin,
  openRegister,
  openForgotPassword,
  closeAll,
})

// Modal visibility computed
const isLoginOpen = computed(() => currentView.value === 'login')
const isRegisterOpen = computed(() => currentView.value === 'register')
const isForgotPasswordOpen = computed(() => currentView.value === 'forgot-password')

// View switching handlers
function switchToLogin() {
  currentView.value = 'login'
}

function switchToRegister() {
  currentView.value = 'register'
}

function switchToForgotPassword() {
  currentView.value = 'forgot-password'
}

function handleAuthSuccess() {
  closeAll()
}

function handleGuestCheckout() {
  closeAll()
  // Navigate to shop or checkout as guest
  navigateTo('/shop')
}
</script>

<template>
  <div>
    <!-- Login Modal -->
    <AuthLoginModal
      :is-open="isLoginOpen"
      :show-guest-checkout="showGuestCheckout"
      @close="closeAll"
      @success="handleAuthSuccess"
      @switch-to-register="switchToRegister"
      @switch-to-forgot-password="switchToForgotPassword"
      @guest-checkout="handleGuestCheckout"
    />

    <!-- Register Modal -->
    <AuthRegisterModal
      :is-open="isRegisterOpen"
      @close="closeAll"
      @success="handleAuthSuccess"
      @switch-to-login="switchToLogin"
    />

    <!-- Forgot Password Modal -->
    <AuthForgotPasswordModal
      :is-open="isForgotPasswordOpen"
      @close="closeAll"
      @switch-to-login="switchToLogin"
    />
  </div>
</template>
