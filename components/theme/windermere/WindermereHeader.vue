<template>
  <div>
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
    >
      <!-- Announcement Bar (hidden on scroll) -->
      <Transition name="slide-up">
        <div
          v-if="!isScrolled && showAnnouncement"
          class="bg-gradient-to-r from-teal-500 via-teal to-teal-500 text-navy-dark"
        >
          <div class="container mx-auto px-4">
            <div class="flex items-center justify-center h-8 text-xs font-medium tracking-wide">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                A Nord Anglia Education School
              </span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main Header -->
      <div
        class="transition-all duration-300"
        :class="[
          isScrolled
            ? 'bg-navy-dark/[0.98] backdrop-blur-xl shadow-2xl'
            : 'bg-gradient-to-b from-navy-dark/95 to-navy-dark/90 backdrop-blur-lg'
        ]"
      >
        <div class="container mx-auto px-4 lg:px-8">
          <div
            class="flex items-center justify-between transition-all duration-300"
            :class="isScrolled ? 'h-16' : 'h-20 lg:h-24'"
          >
            <!-- Logo Section -->
            <NuxtLink
              to="/"
              class="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy-dark rounded-lg"
            >
              <div class="relative overflow-hidden">
                <img
                  v-if="config.assets.logo"
                  :src="config.assets.logo"
                  :alt="config.displayName"
                  class="w-auto object-contain transition-all duration-300 group-hover:opacity-90"
                  :class="isScrolled ? 'h-10' : 'h-12 lg:h-16'"
                />
                <span v-else class="text-white text-xl font-bold">{{ config.displayName }}</span>
                <!-- Shine effect on hover -->
                <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </NuxtLink>

            <!-- Center Navigation (Desktop) -->
            <nav class="hidden lg:flex items-center gap-1">
              <NuxtLink
                to="/"
                class="nav-link-premium"
                :class="{ 'nav-link-active': route.path === '/' }"
              >
                <span class="relative z-10">Home</span>
              </NuxtLink>

              <!-- Shop with Mega Menu -->
              <div
                class="relative"
                @mouseenter="openMegaMenu"
                @mouseleave="closeMegaMenu"
              >
                <button
                  class="nav-link-premium inline-flex items-center gap-1.5 text-base font-bold uppercase tracking-wide"
                  :class="{ 'nav-link-active': route.path.startsWith('/shop') || showMegaMenu }"
                >
                  <span class="relative z-10">Shop</span>
                  <svg
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': showMegaMenu }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- Mega Menu Panel -->
                <Transition name="mega-menu">
                  <div
                    v-if="showMegaMenu"
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    @mouseenter="keepMegaMenuOpen"
                    @mouseleave="closeMegaMenu"
                  >
                    <!-- Menu Header -->
                    <div class="bg-gradient-to-r from-navy-dark to-navy p-4">
                      <h3 class="text-white font-semibold">Shop by Category</h3>
                      <p class="text-teal-300 text-sm">Discover quality products for students</p>
                    </div>

                    <!-- Categories Grid -->
                    <div class="p-4">
                      <div class="grid grid-cols-2 gap-2">
                        <NuxtLink
                          v-for="category in categories"
                          :key="category.id"
                          :to="`/shop?category=${category.id}`"
                          class="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          @click="closeMegaMenuImmediately"
                        >
                          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                          </div>
                          <span class="text-gray-700 font-medium group-hover:text-navy-dark transition-colors">{{ category.name }}</span>
                        </NuxtLink>
                      </div>

                      <!-- View All Link -->
                      <div class="mt-4 pt-4 border-t border-gray-100">
                        <NuxtLink
                          to="/shop"
                          class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-teal-50 transition-colors group"
                          @click="closeMegaMenuImmediately"
                        >
                          <span class="font-semibold text-gray-700 group-hover:text-teal-600">View All Products</span>
                          <svg class="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                          </svg>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Admin Link -->
              <NuxtLink
                v-if="authStore.isAuthenticated && authStore.user?.role === 'admin'"
                to="/admin"
                class="nav-link-premium"
              >
                <span class="relative z-10">Admin</span>
              </NuxtLink>

              <!-- Parent Portal Link (opens in new tab) -->
              <a
                v-if="config.links?.parentPortal"
                :href="config.links.parentPortal"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-link-premium inline-flex items-center gap-1"
              >
                <span class="relative z-10">Parent Portal</span>
                <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </nav>

            <!-- Right Actions -->
            <div class="flex items-center gap-2 lg:gap-3">
              <!-- Search (Desktop) -->
              <div v-if="config.features.searchBar" class="hidden md:block">
                <div class="relative group">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search products..."
                    class="w-48 lg:w-64 px-4 py-2 pl-10 text-sm bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent focus:bg-white/15 transition-all duration-200"
                    @keyup.enter="handleSearch"
                    @focus="searchFocused = true"
                    @blur="searchFocused = false"
                  />
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 transition-colors" :class="{ 'text-teal': searchFocused }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              <!-- Cart Button -->
              <button
                @click="cartStore.toggleCart()"
                class="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                :class="{ 'animate-pulse-once': cartPulse }"
                aria-label="Shopping cart"
                data-testid="header-cart-btn"
              >
                <svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span
                  v-if="cartStore.itemCount > 0"
                  class="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-coral to-coral-light text-white text-xs font-bold rounded-full h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center shadow-lg ring-2 ring-navy-dark"
                >
                  {{ cartStore.itemCount }}
                </span>
              </button>

              <!-- User Menu (logged in) -->
              <div v-if="authStore.isAuthenticated" class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-200"
                  data-testid="header-user-btn"
                >
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-teal-500 flex items-center justify-center shadow-inner">
                    <span class="text-navy-dark text-sm font-semibold">{{ userInitials }}</span>
                  </div>
                  <span class="hidden lg:block text-white text-sm font-medium">{{ authStore.user?.name }}</span>
                  <svg class="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- User Dropdown -->
                <Transition name="dropdown">
                  <div
                    v-if="showUserMenu"
                    class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div class="p-4 bg-gradient-to-r from-navy-dark to-navy">
                      <p class="text-white font-medium">{{ authStore.user?.name }}</p>
                      <p class="text-teal-300 text-sm truncate">{{ authStore.user?.email }}</p>
                    </div>
                    <div class="p-2">
                      <button
                        @click="handleLogout"
                        class="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Login Button (guest) -->
              <button
                v-else
                @click="openLogin"
                class="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal to-teal-500 hover:from-teal-500 hover:to-teal-600 text-navy-dark font-semibold text-sm rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-200 hover:-translate-y-0.5"
                data-testid="header-login-btn"
              >
                Sign In
              </button>

              <!-- Mobile Menu Toggle -->
              <button
                @click="toggleMobileMenu"
                class="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle menu"
                data-testid="header-menu-btn"
              >
                <svg v-if="!showMobileMenu" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Panel -->
      <Transition name="mobile-menu">
        <div
          v-if="showMobileMenu"
          class="lg:hidden bg-navy-dark/[0.98] backdrop-blur-xl border-t border-white/10"
        >
          <div class="container mx-auto px-4 py-6 space-y-4">
            <!-- Mobile Search -->
            <div v-if="config.features.searchBar" class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal"
                @keyup.enter="handleSearch"
              />
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Mobile Nav Links -->
            <nav class="space-y-1">
              <NuxtLink to="/" @click="closeMobileMenu" class="mobile-nav-link">Home</NuxtLink>
              <NuxtLink to="/shop" @click="closeMobileMenu" class="mobile-nav-link">Shop</NuxtLink>
              <NuxtLink v-if="authStore.isAuthenticated && authStore.user?.role === 'admin'" to="/admin" @click="closeMobileMenu" class="mobile-nav-link">Admin</NuxtLink>
              <a
                v-if="config.links?.parentPortal"
                :href="config.links.parentPortal"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-nav-link inline-flex items-center gap-2"
                @click="closeMobileMenu"
              >
                Parent Portal
                <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </nav>

            <!-- Mobile Login (guest) -->
            <button
              v-if="!authStore.isAuthenticated"
              @click="openLogin(); closeMobileMenu()"
              class="w-full py-3 bg-gradient-to-r from-teal to-teal-500 text-navy-dark font-semibold rounded-xl"
            >
              Sign In
            </button>

            <!-- Mobile User Info & Logout (logged in) -->
            <div v-if="authStore.isAuthenticated" class="pt-4 border-t border-white/10 space-y-3">
              <div class="flex items-center gap-3 px-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-500 flex items-center justify-center">
                  <span class="text-navy-dark font-semibold">{{ userInitials }}</span>
                </div>
                <div>
                  <p class="text-white font-medium">{{ authStore.user?.name }}</p>
                  <p class="text-white/60 text-sm">{{ authStore.user?.email }}</p>
                </div>
              </div>
              <button
                @click="handleLogout(); closeMobileMenu()"
                class="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Spacer to prevent content from hiding under fixed header -->
    <div :class="spacerClasses" class="transition-all duration-300"></div>

    <!-- Shopping Cart Sidebar -->
    <ShopCartSidebar v-if="cartStore.isOpen" @close="cartStore.closeCart()" />

    <!-- Auth Manager -->
    <AuthAuthManager ref="authManagerRef" />
  </div>
</template>

<script setup lang="ts">
/**
 * WindermereHeader - Premium Windermere header with teal/coral color scheme
 *
 * Features:
 * - Fixed positioning with scroll-aware height changes
 * - Announcement bar that hides on scroll
 * - Premium teal (#00b4a6) / coral (#ff6b35) color scheme
 * - Logo shine effect on hover
 * - User avatar with initials circle
 * - Mega menu with category icons grid
 * - Premium nav link underline animations
 * - Cart badge with coral gradient
 */
import { windermereVeneerConfig } from '~/config/themes/windermere/veneer'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

// Configuration
const config = windermereVeneerConfig

// State
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showMegaMenu = ref(false)
const megaMenuTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const cartPulse = ref(false)
const isScrolled = ref(false)
const searchQuery = ref('')
const searchFocused = ref(false)
const showAnnouncement = ref(true)
const authManagerRef = ref<{ openLogin: () => void; openRegister: () => void } | null>(null)

// Categories for mega menu
const categories = ref<{ id: number; name: string }[]>([])

// Computed
const userInitials = computed(() => {
  const name = authStore.user?.name
  if (name) {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return 'U'
})

const spacerClasses = computed(() => {
  if (isScrolled.value) {
    return 'h-16'
  }
  return showAnnouncement.value ? 'h-28 lg:h-32' : 'h-20 lg:h-24'
})

// Event handlers
let clickHandler: ((e: MouseEvent) => void) | null = null

onMounted(async () => {
  // Handle scroll for header effects
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Close menus when clicking outside
  clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const header = document.querySelector('header')
    if (header && !header.contains(target)) {
      showUserMenu.value = false
      showMegaMenu.value = false
    }
  }
  document.addEventListener('click', clickHandler)

  // Check auth
  authStore.checkSession()

  // Fetch categories for mega menu
  try {
    const response = await $fetch<{ success: boolean; categories: { id: number; name: string }[] }>('/api/ecommerce/categories')
    if (response.success && response.categories) {
      categories.value = response.categories.slice(0, 6) // Limit to 6 for the grid
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (clickHandler) document.removeEventListener('click', clickHandler)
  if (megaMenuTimeout.value) clearTimeout(megaMenuTimeout.value)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 50
  if (window.scrollY > 200) {
    showAnnouncement.value = false
  } else {
    showAnnouncement.value = true
  }
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

function openMegaMenu() {
  if (megaMenuTimeout.value) {
    clearTimeout(megaMenuTimeout.value)
    megaMenuTimeout.value = null
  }
  showMegaMenu.value = true
}

function keepMegaMenuOpen() {
  if (megaMenuTimeout.value) {
    clearTimeout(megaMenuTimeout.value)
    megaMenuTimeout.value = null
  }
}

function closeMegaMenu() {
  megaMenuTimeout.value = setTimeout(() => {
    showMegaMenu.value = false
  }, 150)
}

function closeMegaMenuImmediately() {
  if (megaMenuTimeout.value) {
    clearTimeout(megaMenuTimeout.value)
    megaMenuTimeout.value = null
  }
  showMegaMenu.value = false
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { search: searchQuery.value.trim() } })
    searchQuery.value = ''
    closeMobileMenu()
  }
}

function openLogin() {
  authManagerRef.value?.openLogin()
}

async function handleLogout() {
  showUserMenu.value = false
  closeMobileMenu()
  await authStore.logout()
  toast.info('Signed out', 'You have been signed out successfully')
}

// Watch cart for pulse animation
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
/* Premium Navigation Link */
.nav-link-premium {
  position: relative;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  transition: all 200ms ease;
}

.nav-link-premium:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link-premium::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #00b4a6, #00a094);
  border-radius: 9999px;
  transition: width 200ms ease;
}

.nav-link-premium:hover::after {
  width: 50%;
}

.nav-link-active {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link-active::after {
  width: 75%;
}

/* Mobile Nav Link */
.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 200ms ease;
}

.mobile-nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Slide-up transition for announcement bar */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Mega menu transition */
.mega-menu-enter-active,
.mega-menu-leave-active {
  transition: all 0.2s ease;
}

.mega-menu-enter-from,
.mega-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) translateX(-50%);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile menu transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Teal color utilities for focus states */
.focus\:ring-teal:focus {
  --tw-ring-color: #00b4a6;
}

.focus-visible\:ring-teal:focus-visible {
  --tw-ring-color: #00b4a6;
}

/* Text teal for search focus */
.text-teal {
  color: #00b4a6;
}

/* Teal-50 and teal-100 for mega menu icons */
.from-teal-50 {
  --tw-gradient-from: #f0fdfa var(--tw-gradient-from-position);
}

.to-teal-100 {
  --tw-gradient-to: #ccfbf1 var(--tw-gradient-to-position);
}

.bg-teal-50 {
  background-color: #f0fdfa;
}

.hover\:bg-teal-50:hover {
  background-color: #f0fdfa;
}

/* Shadow utilities for login button */
.shadow-teal-500\/25 {
  --tw-shadow-color: rgb(0 160 148 / 0.25);
}

.shadow-teal-500\/40 {
  --tw-shadow-color: rgb(0 160 148 / 0.4);
}

.hover\:shadow-teal-500\/40:hover {
  --tw-shadow-color: rgb(0 160 148 / 0.4);
}
</style>
