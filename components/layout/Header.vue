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
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600"
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
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const schoolName = config.public.schoolName

const cartStore = useCartStore()
const mobileMenuOpen = ref(false)
</script>
