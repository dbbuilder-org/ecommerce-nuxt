<script setup lang="ts">
import { useField, rules } from '~/composables/useFormValidation'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: []
  switchToLogin: []
}>()

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

// Form fields
const firstName = useField('', [rules.required('First name is required')])
const lastName = useField('', [rules.required('Last name is required')])
const email = useField('', [rules.required('Email is required'), rules.email()])
const password = useField('', [
  rules.required('Password is required'),
  rules.minLength(8, 'Password must be at least 8 characters'),
])
const confirmPassword = useField('', [rules.required('Please confirm your password')])

const errorMessage = ref('')
const isLoading = ref(false)

// Custom validation for password match
const passwordsMatch = computed(
  () => password.value.value === confirmPassword.value.value || !confirmPassword.touched.value
)

const isFormValid = computed(
  () =>
    firstName.isValid.value &&
    lastName.isValid.value &&
    email.isValid.value &&
    password.isValid.value &&
    confirmPassword.value.value === password.value.value
)

async function handleRegister() {
  // Touch all fields
  firstName.touch()
  lastName.touch()
  email.touch()
  password.touch()
  confirmPassword.touch()

  if (!isFormValid.value) {
    if (!passwordsMatch.value) {
      errorMessage.value = 'Passwords do not match'
    }
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await authStore.register({
    email: email.value.value,
    password: password.value.value,
    firstName: firstName.value.value,
    lastName: lastName.value.value,
  })

  if (result.success) {
    toast.success('Account created!', result.message || 'Welcome to the bookstore')
    resetForm()
    emit('success')
    emit('close')

    // Redirect to shop
    if (router.currentRoute.value.path !== '/shop') {
      router.push('/shop')
    }
  } else {
    errorMessage.value = result.message || 'Registration failed'
  }

  isLoading.value = false
}

function resetForm() {
  firstName.reset()
  lastName.reset()
  email.reset()
  password.reset()
  confirmPassword.reset()
  errorMessage.value = ''
}

function handleClose() {
  resetForm()
  emit('close')
}
</script>

<template>
  <UiModal :is-open="isOpen" size="md" @close="handleClose">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Create Account</h2>
          <p class="text-sm text-gray-500">Join us today</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Name Fields -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="register-first-name" class="block text-sm font-medium text-gray-700 mb-1.5">
            First Name
          </label>
          <input
            id="register-first-name"
            v-model="firstName.value.value"
            type="text"
            autocomplete="given-name"
            placeholder="John"
            :disabled="isLoading"
            @blur="firstName.touch()"
            :class="[
              'w-full px-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
              'focus:ring-2 focus:ring-offset-0',
              firstName.error.value
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
            ]"
          />
          <p v-if="firstName.error.value" class="mt-1 text-sm text-red-600">
            {{ firstName.error.value }}
          </p>
        </div>

        <div>
          <label for="register-last-name" class="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name
          </label>
          <input
            id="register-last-name"
            v-model="lastName.value.value"
            type="text"
            autocomplete="family-name"
            placeholder="Doe"
            :disabled="isLoading"
            @blur="lastName.touch()"
            :class="[
              'w-full px-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
              'focus:ring-2 focus:ring-offset-0',
              lastName.error.value
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
            ]"
          />
          <p v-if="lastName.error.value" class="mt-1 text-sm text-red-600">
            {{ lastName.error.value }}
          </p>
        </div>
      </div>

      <!-- Email Field -->
      <div>
        <label for="register-email" class="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          id="register-email"
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

      <!-- Password Field -->
      <div>
        <label for="register-password" class="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id="register-password"
          v-model="password.value.value"
          type="password"
          autocomplete="new-password"
          placeholder="At least 8 characters"
          :disabled="isLoading"
          @blur="password.touch()"
          :class="[
            'w-full px-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
            'focus:ring-2 focus:ring-offset-0',
            password.error.value
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
          ]"
        />
        <p v-if="password.error.value" class="mt-1 text-sm text-red-600">{{ password.error.value }}</p>
      </div>

      <!-- Confirm Password Field -->
      <div>
        <label for="register-confirm-password" class="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm Password
        </label>
        <input
          id="register-confirm-password"
          v-model="confirmPassword.value.value"
          type="password"
          autocomplete="new-password"
          placeholder="Confirm your password"
          :disabled="isLoading"
          @blur="confirmPassword.touch()"
          :class="[
            'w-full px-4 py-2.5 border rounded-lg text-sm transition-all outline-none',
            'focus:ring-2 focus:ring-offset-0',
            confirmPassword.error.value || (confirmPassword.touched.value && !passwordsMatch)
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200',
          ]"
        />
        <p v-if="confirmPassword.error.value" class="mt-1 text-sm text-red-600">
          {{ confirmPassword.error.value }}
        </p>
        <p
          v-else-if="confirmPassword.touched.value && !passwordsMatch"
          class="mt-1 text-sm text-red-600"
        >
          Passwords do not match
        </p>
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
        {{ isLoading ? 'Creating account...' : 'Create Account' }}
      </UiButton>
    </form>

    <template #footer>
      <div class="text-center text-sm text-gray-600">
        Already have an account?
        <button @click="emit('switchToLogin')" class="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </button>
      </div>
    </template>
  </UiModal>
</template>
