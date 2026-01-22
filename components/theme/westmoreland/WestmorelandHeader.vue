<template>
  <div>
    <header class="w-full bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left Side: Hamburger + Logo -->
          <div class="flex items-center gap-2">
            <!-- Menu Button - Always visible (left side) -->
            <button
              @click="toggleMobileMenu"
              class="btn-flat-header w-11 h-11 rounded-lg"
              aria-label="Open menu"
              :aria-expanded="showMobileMenu"
              data-testid="header-menu-btn"
            >
              <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Logo = Home -->
            <NuxtLink
              to="/"
              class="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
              aria-label="Go to home page"
            >
              <img
                v-if="config.assets.logo"
                :src="config.assets.logo"
                :alt="config.displayName"
                class="h-10 sm:h-12 w-auto object-contain"
              />
              <span v-else class="text-gray-900 text-xl font-bold">{{ config.displayName }}</span>
            </NuxtLink>
          </div>

          <!-- Center: Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              to="/shop"
              class="nav-link px-6 py-2.5 text-gray-700 font-bold text-base uppercase tracking-wide rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              :class="{ 'bg-[var(--button-color)] !text-white': route.path.startsWith('/shop') }"
            >
              Shop
            </NuxtLink>

            <!-- Admin Link -->
            <NuxtLink
              v-if="authStore.isAuthenticated && authStore.user?.role === 'admin'"
              to="/admin"
              class="nav-link px-5 py-2 text-gray-600 font-medium text-sm rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </span>
            </NuxtLink>
          </nav>

          <!-- Right Side: Login + Cart -->
          <div class="flex items-center gap-2">
            <!-- Login Button (for guests) -->
            <button
              v-if="!authStore.isAuthenticated"
              @click="openLogin"
              class="btn-flat-header gap-2 px-4 h-11 rounded-lg text-sm font-medium"
              data-testid="header-login-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Login</span>
            </button>

            <!-- Logoff Button (logged in) -->
            <button
              v-if="authStore.isAuthenticated"
              @click="handleLogout"
              class="btn-flat-header gap-2 px-4 h-11 rounded-lg text-sm font-medium"
              data-testid="header-logoff-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logoff</span>
            </button>

            <!-- Shopping Cart -->
            <button
              @click="cartStore.toggleCart()"
              class="btn-flat-header relative gap-2 px-4 h-11 rounded-lg text-sm font-medium"
              aria-label="Shopping cart"
              data-testid="header-cart-btn"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart</span>
              <!-- Cart badge -->
              <span
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center pointer-events-none"
                :class="{ 'bg-green-500 scale-110': cartPulse }"
              >
                {{ cartStore.itemCount }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Drawer -->
      <Transition name="dropdown">
        <div
          v-if="showMobileMenu"
          class="border-t border-gray-200 bg-white"
        >
          <nav class="container mx-auto px-4 py-4">
            <!-- Main Navigation -->
            <div class="space-y-1">
              <NuxtLink
                to="/"
                @click="closeMobileMenu"
                class="mobile-nav-link flex items-center gap-3 px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                :class="{ 'bg-gray-100 font-medium': route.path === '/' }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </NuxtLink>

              <NuxtLink
                to="/shop"
                @click="closeMobileMenu"
                class="mobile-nav-link flex items-center gap-3 px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                :class="{ 'bg-gray-100 font-medium': route.path.startsWith('/shop') }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop All Products
              </NuxtLink>
            </div>

            <!-- Categories Section -->
            <div v-if="categories.length > 0" class="mt-4 pt-4 border-t border-gray-100">
              <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Categories
              </div>
              <div class="space-y-1">
                <NuxtLink
                  v-for="category in categories.slice(0, 6)"
                  :key="category.id"
                  :to="`/shop?category=${category.id}`"
                  @click="closeMobileMenu"
                  class="mobile-nav-link flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <span class="w-5 h-5 flex items-center justify-center text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  {{ category.name }}
                </NuxtLink>
              </div>
            </div>

            <!-- Admin Link -->
            <div v-if="authStore.isAuthenticated && authStore.user?.role === 'admin'" class="mt-4 pt-4 border-t border-gray-100">
              <NuxtLink
                to="/admin"
                @click="closeMobileMenu"
                class="mobile-nav-link flex items-center gap-3 px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Portal
              </NuxtLink>
            </div>
          </nav>
        </div>
      </Transition>
    </header>

    <!-- Shopping Cart Sidebar -->
    <ShopCartSidebar v-if="cartStore.isOpen" @close="cartStore.closeCart()" />

    <!-- Auth Manager -->
    <AuthAuthManager ref="authManagerRef" />
  </div>
</template>

<script setup lang="ts">
/**
 * WestmorelandHeader - Modern flat white header design
 *
 * Features:
 * - White background with gray border (flat design)
 * - Hamburger menu on LEFT side (modern convention)
 * - Category drawer in mobile menu
 * - Clean, minimal styling
 * - Accessible focus states
 */
import { westmorelandVeneerConfig } from '~/config/themes/westmoreland/veneer'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

// Configuration
const config = westmorelandVeneerConfig

// State
const showMobileMenu = ref(false)
const cartPulse = ref(false)
const authManagerRef = ref<{ openLogin: () => void; openRegister: () => void } | null>(null)

// Categories for drawer
const categories = ref<{ id: number; name: string }[]>([])

// Event handlers
let clickHandler: ((e: MouseEvent) => void) | null = null

onMounted(async () => {
  // Close menus when clicking outside
  clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const header = document.querySelector('header')
    if (header && !header.contains(target)) {
      showMobileMenu.value = false
    }
  }
  document.addEventListener('click', clickHandler)
  authStore.checkSession()

  // Fetch categories for drawer
  try {
    const response = await $fetch<{ success: boolean; categories: { id: number; name: string }[] }>('/api/ecommerce/categories')
    if (response.success && response.categories) {
      categories.value = response.categories
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

onUnmounted(() => {
  if (clickHandler) document.removeEventListener('click', clickHandler)
})

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

function openLogin() {
  authManagerRef.value?.openLogin()
}

async function handleLogout() {
  closeMobileMenu()
  await authStore.logout()
  toast.info('Signed out', 'You have been signed out successfully')
}

// Listen for cart animation events
if (import.meta.client) {
  watch(() => cartStore.itemCount, (newCount, oldCount) => {
    if (newCount > oldCount) {
      cartPulse.value = true
      setTimeout(() => {
        cartPulse.value = false
      }, 600)
    }
  })
}
</script>

<style scoped>
/* Mobile navigation items */
.mobile-nav-link {
  font-size: 0.9375rem;
}

/* Cart badge animation */
.scale-110 {
  transform: scale(1.1);
  transition: transform 150ms ease, background-color 150ms ease;
}

/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
