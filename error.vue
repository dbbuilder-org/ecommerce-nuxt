<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <div
          :class="[
            'w-24 h-24 mx-auto rounded-full flex items-center justify-center',
            is404 ? 'bg-blue-100' : 'bg-red-100'
          ]"
        >
          <Icon
            :name="is404 ? 'heroicons:map' : 'heroicons:exclamation-triangle'"
            :class="[
              'w-12 h-12',
              is404 ? 'text-blue-600' : 'text-red-600'
            ]"
          />
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        {{ errorMessage }}
      </p>

      <!-- Error Details (Development only) -->
      <div
        v-if="isDev && error?.stack"
        class="mb-8 text-left bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
      >
        <pre class="text-xs whitespace-pre-wrap">{{ error.stack }}</pre>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleError"
          class="btn-primary"
        >
          <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
          {{ is404 ? 'Go Home' : 'Try Again' }}
        </button>
        <NuxtLink to="/shop" class="btn-secondary">
          <Icon name="heroicons:shopping-bag" class="w-5 h-5 mr-2" />
          Browse Products
        </NuxtLink>
      </div>

      <!-- Help Link -->
      <p class="mt-8 text-sm text-gray-500">
        Need help?
        <a href="mailto:support@schoolvision.io" class="text-primary-600 hover:text-primary-700">
          Contact Support
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isDev = import.meta.dev

const is404 = computed(() => props.error?.statusCode === 404)

const errorMessage = computed(() => {
  if (is404.value) {
    return "The page you're looking for doesn't exist or has been moved."
  }
  return props.error?.message || "An unexpected error occurred. Please try again."
})

function handleError() {
  if (is404.value) {
    clearError({ redirect: '/' })
  } else {
    clearError({ redirect: window.location.pathname })
  }
}

useHead({
  title: is404.value ? 'Page Not Found' : 'Error',
})
</script>
