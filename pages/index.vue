<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Welcome to {{ schoolName }}
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100">
            Shop uniforms, supplies, and more for your school needs.
          </p>
          <NuxtLink
            to="/shop"
            class="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            Shop Now
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Quick Actions / Categories -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/shop?category=${category.slug}`"
            class="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square hover:shadow-lg transition-shadow"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-semibold text-lg">{{ category.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ShopProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div class="text-center mt-8">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Products
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const schoolName = config.public.schoolName

// Fetch categories from server API route
const { data: categoriesData } = await useFetch('/api/ecommerce/categories')
const categories = computed(() => (categoriesData.value as any)?.categories || [])

// Fetch products from server API route
const { data: productsData } = await useFetch('/api/ecommerce/products', {
  query: { limit: 8 },
})
const featuredProducts = computed(() => (productsData.value as any)?.products || [])

// Page meta
useHead({
  title: 'Home',
})
</script>
