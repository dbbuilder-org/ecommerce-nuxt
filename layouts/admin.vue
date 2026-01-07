<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Header -->
    <header class="bg-gray-900 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin" class="flex items-center space-x-2">
              <Icon name="heroicons:cog-6-tooth" class="w-8 h-8 text-primary-400" />
              <span class="text-xl font-bold">Admin Panel</span>
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <NuxtLink
              to="/admin"
              class="text-gray-300 hover:text-white transition-colors"
              active-class="text-white font-medium"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/orders"
              class="text-gray-300 hover:text-white transition-colors"
              active-class="text-white font-medium"
            >
              Orders
            </NuxtLink>
            <NuxtLink
              to="/admin/fulfillment"
              class="text-gray-300 hover:text-white transition-colors"
              active-class="text-white font-medium"
            >
              Fulfillment
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/"
              class="text-gray-300 hover:text-white text-sm flex items-center"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
              Back to Store
            </NuxtLink>

            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium">{{ authStore.userInitials }}</span>
              </div>
              <span class="text-sm hidden lg:inline">{{ authStore.userName }}</span>
            </div>

            <button
              @click="handleLogout"
              class="text-gray-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden border-t border-gray-800">
        <div class="px-4 py-2 flex space-x-4 overflow-x-auto">
          <NuxtLink
            to="/admin"
            class="text-gray-300 hover:text-white text-sm whitespace-nowrap py-2"
            active-class="text-white font-medium"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/orders"
            class="text-gray-300 hover:text-white text-sm whitespace-nowrap py-2"
            active-class="text-white font-medium"
          >
            Orders
          </NuxtLink>
          <NuxtLink
            to="/admin/fulfillment"
            class="text-gray-300 hover:text-white text-sm whitespace-nowrap py-2"
            active-class="text-white font-medium"
          >
            Fulfillment
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Toast Manager -->
    <UiToastManager />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>
