<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-xl font-bold text-primary-700">{{ schoolName }}</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-primary-600 font-medium"
            active-class="text-primary-600"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="text-gray-600 hover:text-primary-600 font-medium"
            active-class="text-primary-600"
          >
            Shop
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- User Menu (Desktop) -->
          <div class="hidden md:flex items-center">
            <template v-if="authStore.isAuthenticated">
              <!-- User Dropdown -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm"
                  >
                    {{ authStore.userInitials }}
                  </div>
                  <span class="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {{ authStore.userName }}
                  </span>
                  <Icon
                    name="heroicons:chevron-down"
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': userMenuOpen }"
                  />
                </button>

                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div
                    v-if="userMenuOpen"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
                  >
                    <div class="px-4 py-2 border-b">
                      <p class="text-sm font-medium text-gray-900">{{ authStore.userName }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                    </div>
                    <NuxtLink
                      to="/account"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      @click="userMenuOpen = false"
                    >
                      <Icon name="heroicons:user-circle" class="w-4 h-4 mr-2" />
                      My Account
                    </NuxtLink>
                    <NuxtLink
                      to="/orders"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      @click="userMenuOpen = false"
                    >
                      <Icon name="heroicons:clipboard-document-list" class="w-4 h-4 mr-2" />
                      Order History
                    </NuxtLink>
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </Transition>
              </div>
            </template>
            <template v-else>
              <!-- Sign In Button -->
              <button
                @click="openLogin"
                class="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Icon name="heroicons:user" class="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </template>
          </div>

          <!-- Cart Button -->
          <button
            @click="cartStore.toggleCart()"
            class="relative p-2 text-gray-600 hover:text-primary-600"
          >
            <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-gray-600">
            <Icon :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
        <nav class="container mx-auto px-4 py-4 space-y-2">
          <NuxtLink
            to="/"
            class="block py-2 text-gray-600 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="block py-2 text-gray-600 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Shop
          </NuxtLink>

          <!-- Mobile Auth Section -->
          <div class="border-t pt-4 mt-4">
            <template v-if="authStore.isAuthenticated">
              <div class="flex items-center space-x-3 py-2">
                <div
                  class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium"
                >
                  {{ authStore.userInitials }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ authStore.userName }}</p>
                  <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                </div>
              </div>
              <NuxtLink
                to="/account"
                class="block py-2 text-gray-600 hover:text-primary-600"
                @click="mobileMenuOpen = false"
              >
                My Account
              </NuxtLink>
              <NuxtLink
                to="/orders"
                class="block py-2 text-gray-600 hover:text-primary-600"
                @click="mobileMenuOpen = false"
              >
                Order History
              </NuxtLink>
              <button
                @click="handleLogout"
                class="block w-full text-left py-2 text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </template>
            <template v-else>
              <button
                @click="openLogin(); mobileMenuOpen = false"
                class="block w-full text-left py-2 text-primary-600 font-medium"
              >
                Sign In
              </button>
              <button
                @click="openRegister(); mobileMenuOpen = false"
                class="block w-full text-left py-2 text-gray-600"
              >
                Create Account
              </button>
            </template>
          </div>
        </nav>
      </div>
    </Transition>

    <!-- Auth Manager -->
    <AuthAuthManager ref="authManagerRef" />
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const schoolName = config.public.schoolName

const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const authManagerRef = ref<{ openLogin: () => void; openRegister: () => void } | null>(null)

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Check session on mount
  authStore.checkSession()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
}

function openLogin() {
  authManagerRef.value?.openLogin()
}

function openRegister() {
  authManagerRef.value?.openRegister()
}

async function handleLogout() {
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  await authStore.logout()
  toast.info('Signed out', 'You have been signed out successfully')
}
</script>
