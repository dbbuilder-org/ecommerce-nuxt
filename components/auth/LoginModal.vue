<script setup lang="ts">
import { useField, rules } from '~/composables/useFormValidation'

interface Props {
  isOpen: boolean
  showGuestCheckout?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showGuestCheckout: true,
})

const emit = defineEmits<{
  close: []
  success: []
  switchToRegister: []
  switchToForgotPassword: []
  guestCheckout: []
}>()

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

// Form fields
const email = useField('', [rules.required('Email is required'), rules.email()])
const password = useField('', [rules.required('Password is required')])

const errorMessage = ref('')
const isLoading = ref(false)

const isFormValid = computed(() => email.isValid.value && password.isValid.value)

async function handleLogin() {
  // Touch all fields
  email.touch()
  password.touch()

  if (!isFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  const result = await authStore.login(email.value.value, password.value.value)

  if (result.success) {
    toast.success('Welcome back!', `Signed in as ${authStore.userName}`)
    resetForm()
    emit('success')
    emit('close')

    // Redirect if needed
    const redirectUrl = authStore.loginRedirectUrl || '/shop'
    authStore.setLoginRedirect(null)
    if (router.currentRoute.value.path !== redirectUrl) {
      router.push(redirectUrl)
    }
  } else {
    errorMessage.value = result.message || 'Login failed'
  }

  isLoading.value = false
}

function resetForm() {
  email.reset()
  password.reset()
  errorMessage.value = ''
}

function handleClose() {
  resetForm()
  emit('close')
}

function handleGuestCheckout() {
  resetForm()
  emit('guestCheckout')
  emit('close')
}

// Focus email on open
const emailInputRef = ref<HTMLInputElement | null>(null)
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        emailInputRef.value?.focus()
      })
    }
  }
)
</script>

<template>
  <UiModal :is-open="isOpen" size="md" @close="handleClose">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Sign In</h2>
          <p class="text-sm text-gray-500">Welcome back to the bookstore</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email Field -->
      <div>
        <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          <input
            id="login-email"
            ref="emailInputRef"
            v-model="email.value.value"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :disabled="isLoading"
            @blur="email.touch()"
            :class="[
              'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
              'focus:ring-2 focus:ring-offset-0',
              email.error.value
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
            ]"
          />
        </div>
        <p v-if="email.error.value" class="mt-1 text-sm text-red-600">{{ email.error.value }}</p>
      </div>

      <!-- Password Field -->
      <div>
        <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <input
            id="login-password"
            v-model="password.value.value"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            :disabled="isLoading"
            @blur="password.touch()"
            :class="[
              'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
              'focus:ring-2 focus:ring-offset-0',
              password.error.value
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
            ]"
          />
        </div>
        <p v-if="password.error.value" class="mt-1 text-sm text-red-600">{{ password.error.value }}</p>
      </div>

      <!-- Forgot Password Link -->
      <div class="flex justify-end">
        <button
          type="button"
          @click="emit('switchToForgotPassword')"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Forgot password?
        </button>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
      >
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-red-600 text-sm">{{ errorMessage }}</span>
      </div>

      <!-- Submit Button -->
      <UiButton
        type="submit"
        :disabled="isLoading || !isFormValid"
        :loading="isLoading"
        variant="primary"
        size="lg"
        class="w-full"
      >
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </UiButton>
    </form>

    <template #footer>
      <div class="space-y-4">
        <!-- Register Link -->
        <div class="text-center text-sm text-gray-600">
          Don't have an account?
          <button
            @click="emit('switchToRegister')"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create one
          </button>
        </div>

        <!-- Guest Checkout -->
        <div v-if="showGuestCheckout" class="pt-4 border-t">
          <UiButton @click="handleGuestCheckout" variant="outline" size="md" class="w-full">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Continue as Guest
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>
