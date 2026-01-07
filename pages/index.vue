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
            v-for="category in displayCategories"
            :key="category.id"
            :to="`/shop?category=${category.slug}`"
            class="group relative overflow-hidden rounded-xl aspect-square hover:shadow-lg transition-all duration-300"
            :class="getCategoryColorClass(category.slug)"
          >
            <!-- Category Icon -->
            <div class="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
              <Icon :name="getCategoryIcon(category.slug)" class="w-24 h-24 text-white" />
            </div>
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <!-- Content -->
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-semibold text-lg group-hover:translate-x-1 transition-transform">
                {{ category.name }}
              </h3>
              <p class="text-white/80 text-sm mt-1">
                {{ category.productCount }} {{ category.productCount === 1 ? 'product' : 'products' }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Featured Products</h2>
          <NuxtLink
            to="/shop?category=featured-items"
            class="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All Featured
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4 inline" />
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="productsPending" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="bg-gray-200 aspect-square rounded-lg mb-3" />
            <div class="bg-gray-200 h-4 rounded w-3/4 mb-2" />
            <div class="bg-gray-200 h-4 rounded w-1/2" />
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ShopProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No featured products available</p>
        </div>

        <div class="text-center mt-8">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Products
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
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

// Filter categories to show only those with products, limit to 8
const displayCategories = computed(() => {
  return categories.value
    .filter((c: any) => c.productCount > 0)
    .slice(0, 8)
})

// Fetch featured products (from Featured Items category or first products with images)
const { data: productsData, pending: productsPending } = await useFetch('/api/ecommerce/products')

const featuredProducts = computed(() => {
  const products = (productsData.value as any)?.products || []

  // Try to get products from "Featured Items" category first
  const featuredCategoryProducts = products.filter(
    (p: any) => p.categoryName === 'Featured Items' || p.categoryId === 124
  )

  if (featuredCategoryProducts.length >= 4) {
    return featuredCategoryProducts.slice(0, 8)
  }

  // Fallback: Get products with images, prioritize variety
  const productsWithImages = products.filter((p: any) => p.image)

  // Shuffle and take first 8 for variety
  const shuffled = [...productsWithImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 8)
})

// Category styling helpers
function getCategoryColorClass(slug: string): string {
  const colorMap: Record<string, string> = {
    'uniforms-apparel': 'bg-gradient-to-br from-blue-600 to-blue-800',
    'school-supplies': 'bg-gradient-to-br from-green-600 to-green-800',
    'course-materials': 'bg-gradient-to-br from-purple-600 to-purple-800',
    'technology': 'bg-gradient-to-br from-gray-700 to-gray-900',
    'gift-cards': 'bg-gradient-to-br from-amber-500 to-amber-700',
    'merchandise': 'bg-gradient-to-br from-red-600 to-red-800',
    'featured-items': 'bg-gradient-to-br from-primary-600 to-primary-800',
  }
  return colorMap[slug] || 'bg-gradient-to-br from-gray-600 to-gray-800'
}

function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'uniforms-apparel': 'heroicons:user-group',
    'school-supplies': 'heroicons:pencil',
    'course-materials': 'heroicons:book-open',
    'technology': 'heroicons:computer-desktop',
    'gift-cards': 'heroicons:gift',
    'merchandise': 'heroicons:shopping-bag',
    'featured-items': 'heroicons:star',
  }
  return iconMap[slug] || 'heroicons:cube'
}

// Page meta
useHead({
  title: 'Home',
})
</script>
