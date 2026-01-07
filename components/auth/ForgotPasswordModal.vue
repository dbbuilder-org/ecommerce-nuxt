<script setup lang="ts">
import { useField, rules } from '~/composables/useFormValidation'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  switchToLogin: []
}>()

const authStore = useAuthStore()
const toast = useToast()

// Form field
const email = useField('', [rules.required('Email is required'), rules.email()])

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

async function handleSubmit() {
  email.touch()

  if (!email.isValid.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const result = await authStore.forgotPassword(email.value.value)

  if (result.success) {
    isSubmitted.value = true
    successMessage.value = result.message || 'Password reset link sent'
    toast.success('Email sent', 'Check your inbox for the reset link')
  } else {
    errorMessage.value = result.message || 'Failed to send reset email'
  }

  isLoading.value = false
}

function resetForm() {
  email.reset()
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitted.value = false
}

function handleClose() {
  resetForm()
  emit('close')
}

function handleBackToLogin() {
  resetForm()
  emit('switchToLogin')
}
</script>

<template>
  <UiModal :is-open="isOpen" size="sm" @close="handleClose">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Reset Password</h2>
          <p class="text-sm text-gray-500">We'll send you a reset link</p>
        </div>
      </div>
    </template>

    <!-- Success State -->
    <div v-if="isSubmitted" class="text-center py-4">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
      <p class="text-gray-600 mb-6">
        If an account exists for {{ email.value.value }}, you'll receive a password reset link shortly.
      </p>
      <UiButton @click="handleBackToLogin" variant="primary" class="w-full">
        Back to Sign In
      </UiButton>
    </div>

    <!-- Form State -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-5">
      <p class="text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <!-- Email Field -->
      <div>
        <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          id="forgot-email"
          v-model="email.value.value"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          :disabled="isLoading"
          @blur="email.touch()"
          :class="[
            'w-full px-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
            'focus:ring-2 focus:ring-offset-0',
            email.error.value
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
          ]"
        />
        <p v-if="email.error.value" class="mt-1 text-sm text-red-600">{{ email.error.value }}</p>
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
        :disabled="isLoading || !email.isValid.value"
        :loading="isLoading"
        variant="primary"
        size="lg"
        class="w-full"
      >
        {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
      </UiButton>
    </form>

    <template v-if="!isSubmitted" #footer>
      <div class="text-center">
        <button
          @click="handleBackToLogin"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sign In
        </button>
      </div>
    </template>
  </UiModal>
</template>
