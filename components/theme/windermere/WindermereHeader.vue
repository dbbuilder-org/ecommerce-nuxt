<template>
  <header
    :class="[
      'sticky top-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white shadow-md' : 'bg-[#1e3a5f]'
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span :class="['text-xl font-bold', scrolled ? 'text-[#1e3a5f]' : 'text-white']">
            {{ schoolName }}
          </span>
        </NuxtLink>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              :class="[
                'w-full pl-10 pr-4 py-2 rounded-lg border transition-colors',
                scrolled
                  ? 'bg-gray-100 border-gray-200 focus:bg-white focus:border-primary-500'
                  : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20'
              ]"
              @keyup.enter="handleSearch"
            />
            <Icon
              name="heroicons:magnifying-glass"
              :class="[
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                scrolled ? 'text-gray-400' : 'text-white/60'
              ]"
            />
          </div>
        </div>

        <!-- Navigation with Mega Menu -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            :class="navLinkClass"
            active-class="!text-[#c9a227]"
          >
            Home
          </NuxtLink>

          <!-- Shop Dropdown (Mega Menu) -->
          <div class="relative" ref="megaMenuRef">
            <button
              @click="megaMenuOpen = !megaMenuOpen"
              @mouseenter="megaMenuOpen = true"
              :class="[navLinkClass, 'flex items-center space-x-1']"
            >
              <span>Shop</span>
              <Icon
                name="heroicons:chevron-down"
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': megaMenuOpen }"
              />
            </button>

            <!-- Mega Menu Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="megaMenuOpen"
                @mouseleave="megaMenuOpen = false"
                class="absolute left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-xl border p-6 z-50"
              >
                <div class="grid grid-cols-3 gap-6">
                  <!-- Categories -->
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                      <Icon name="heroicons:squares-2x2" class="w-4 h-4 mr-2 text-[#c9a227]" />
                      Categories
                    </h3>
                    <ul class="space-y-2">
                      <li v-for="cat in megaMenuCategories" :key="cat.slug">
                        <NuxtLink
                          :to="`/shop?category=${cat.slug}`"
                          class="text-gray-600 hover:text-[#1e3a5f] text-sm"
                          @click="megaMenuOpen = false"
                        >
                          {{ cat.name }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>

                  <!-- Shop by Grade -->
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                      <Icon name="heroicons:academic-cap" class="w-4 h-4 mr-2 text-[#c9a227]" />
                      Shop by Grade
                    </h3>
                    <ul class="space-y-2">
                      <li v-for="grade in grades" :key="grade.value">
                        <NuxtLink
                          :to="`/shop?grade=${grade.value}`"
                          class="text-gray-600 hover:text-[#1e3a5f] text-sm"
                          @click="megaMenuOpen = false"
                        >
                          {{ grade.label }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>

                  <!-- Featured -->
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                      <Icon name="heroicons:star" class="w-4 h-4 mr-2 text-[#c9a227]" />
                      Featured
                    </h3>
                    <ul class="space-y-2">
                      <li>
                        <NuxtLink
                          to="/shop?category=featured-items"
                          class="text-gray-600 hover:text-[#1e3a5f] text-sm"
                          @click="megaMenuOpen = false"
                        >
                          Featured Items
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink
                          to="/shop?sort=newest"
                          class="text-gray-600 hover:text-[#1e3a5f] text-sm"
                          @click="megaMenuOpen = false"
                        >
                          New Arrivals
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink
                          to="/shop?sort=popular"
                          class="text-gray-600 hover:text-[#1e3a5f] text-sm"
                          @click="megaMenuOpen = false"
                        >
                          Best Sellers
                        </NuxtLink>
                      </li>
                    </ul>

                    <!-- CTA -->
                    <NuxtLink
                      to="/shop"
                      class="mt-4 inline-flex items-center text-sm font-medium text-[#c9a227] hover:text-[#b08f1f]"
                      @click="megaMenuOpen = false"
                    >
                      View All Products
                      <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- User Menu (Desktop) -->
          <div class="hidden md:flex items-center">
            <template v-if="authStore.isAuthenticated">
              <div class="relative" ref="userMenuRef">
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  :class="[
                    'flex items-center space-x-2 p-2 rounded-lg transition-colors',
                    scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  ]"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-[#c9a227] flex items-center justify-center text-[#1e3a5f] font-medium text-sm"
                  >
                    {{ authStore.userInitials }}
                  </div>
                  <Icon
                    name="heroicons:chevron-down"
                    :class="[
                      'w-4 h-4 transition-transform',
                      scrolled ? 'text-gray-500' : 'text-white/80',
                      { 'rotate-180': userMenuOpen }
                    ]"
                  />
                </button>

                <!-- User Dropdown -->
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
              <button
                @click="openLogin"
                :class="[
                  'flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-colors',
                  scrolled ? 'text-gray-700 hover:text-[#1e3a5f]' : 'text-white hover:text-[#c9a227]'
                ]"
              >
                <Icon name="heroicons:user" class="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </template>
          </div>

          <!-- Cart Button -->
          <button
            @click="cartStore.toggleCart()"
            :class="[
              'relative p-2 transition-colors',
              scrolled ? 'text-gray-600 hover:text-[#1e3a5f]' : 'text-white hover:text-[#c9a227]'
            ]"
          >
            <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-[#c9a227] text-[#1e3a5f] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            :class="[
              'md:hidden p-2',
              scrolled ? 'text-gray-600' : 'text-white'
            ]"
          >
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
        <!-- Mobile Search -->
        <div class="container mx-auto px-4 py-3 border-b">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100 focus:bg-white focus:border-primary-500"
              @keyup.enter="handleSearch"
            />
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
          </div>
        </div>

        <nav class="container mx-auto px-4 py-4 space-y-2">
          <NuxtLink
            to="/"
            class="block py-2 text-gray-600 hover:text-[#1e3a5f]"
            @click="mobileMenuOpen = false"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="block py-2 text-gray-600 hover:text-[#1e3a5f]"
            @click="mobileMenuOpen = false"
          >
            Shop All
          </NuxtLink>

          <!-- Mobile Categories -->
          <div class="border-t pt-3 mt-3">
            <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Categories</p>
            <NuxtLink
              v-for="cat in megaMenuCategories"
              :key="cat.slug"
              :to="`/shop?category=${cat.slug}`"
              class="block py-1.5 text-gray-600 hover:text-[#1e3a5f] text-sm"
              @click="mobileMenuOpen = false"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>

          <!-- Mobile Auth -->
          <div class="border-t pt-4 mt-4">
            <template v-if="authStore.isAuthenticated">
              <div class="flex items-center space-x-3 py-2">
                <div
                  class="w-10 h-10 rounded-full bg-[#c9a227] flex items-center justify-center text-[#1e3a5f] font-medium"
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
                class="block py-2 text-gray-600 hover:text-[#1e3a5f]"
                @click="mobileMenuOpen = false"
              >
                My Account
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
                class="block w-full text-left py-2 text-[#1e3a5f] font-medium"
              >
                Sign In
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
const router = useRouter()

const scrolled = ref(false)
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const megaMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const megaMenuRef = ref<HTMLElement | null>(null)
const authManagerRef = ref<{ openLogin: () => void; openRegister: () => void } | null>(null)

// Categories for mega menu
const megaMenuCategories = [
  { name: 'Uniforms & Apparel', slug: 'uniforms-apparel' },
  { name: 'School Supplies', slug: 'school-supplies' },
  { name: 'Course Materials', slug: 'course-materials' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Merchandise', slug: 'merchandise' },
]

// Grades for shop by grade
const grades = [
  { label: 'Pre-K', value: 'prek' },
  { label: 'Kindergarten', value: 'k' },
  { label: 'Elementary (1-5)', value: 'elementary' },
  { label: 'Middle School (6-8)', value: 'middle' },
  { label: 'High School (9-12)', value: 'high' },
]

// Nav link class based on scroll state
const navLinkClass = computed(() =>
  scrolled.value
    ? 'text-gray-600 hover:text-[#1e3a5f] font-medium'
    : 'text-white hover:text-[#c9a227] font-medium'
)

// Handle scroll for header transparency
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial scroll position
  authStore.checkSession()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
  if (megaMenuRef.value && !megaMenuRef.value.contains(event.target as Node)) {
    megaMenuOpen.value = false
  }
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { search: searchQuery.value } })
    mobileMenuOpen.value = false
  }
}

function openLogin() {
  authManagerRef.value?.openLogin()
}

async function handleLogout() {
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  await authStore.logout()
  toast.info('Signed out', 'You have been signed out successfully')
}
</script>
