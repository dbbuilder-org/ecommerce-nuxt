<template>
  <div>
    <!-- Quick Actions / Categories -->
    <section v-if="showCategories" class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">{{ categoriesTitle }}</h2>
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
    <ShopFeaturedItems
      v-if="showFeaturedItems"
      :items="featuredProducts"
      :loading="loading"
      :title="featuredTitle"
      :highlight-text="featuredHighlight"
      :subtitle="featuredSubtitle"
      view-all-link="/shop?category=featured-items"
      view-all-text="View All Products"
      :variant="featuredVariant"
      @retry="$emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  categories?: Array<{ id: number; name: string; slug: string; productCount: number }>
  featuredProducts?: Array<any>
  loading?: boolean
  showCategories?: boolean
  showFeaturedItems?: boolean
  categoriesTitle?: string
  featuredTitle?: string
  featuredHighlight?: string
  featuredSubtitle?: string
  featuredVariant?: 'light' | 'dark'
}>(), {
  categories: () => [],
  featuredProducts: () => [],
  loading: false,
  showCategories: true,
  showFeaturedItems: true,
  categoriesTitle: 'Shop by Category',
  featuredTitle: 'Featured',
  featuredHighlight: 'Products',
  featuredSubtitle: 'Discover our handpicked selection of popular and trending products',
  featuredVariant: 'light',
})

defineEmits<{
  retry: []
}>()

// Filter categories to show only those with products, limit to 8
const displayCategories = computed(() => {
  return props.categories
    .filter((c) => c.productCount > 0)
    .slice(0, 8)
})

// Category styling helpers
function getCategoryColorClass(slug: string): string {
  const colorMap: Record<string, string> = {
    'uniforms-apparel': 'bg-gradient-to-br from-[var(--header-color)] to-[var(--header-hover)]',
    'school-supplies': 'bg-gradient-to-br from-green-600 to-green-800',
    'course-materials': 'bg-gradient-to-br from-purple-600 to-purple-800',
    'technology': 'bg-gradient-to-br from-gray-700 to-gray-900',
    'gift-cards': 'bg-gradient-to-br from-amber-500 to-amber-700',
    'merchandise': 'bg-gradient-to-br from-red-600 to-red-800',
    'featured-items': 'bg-gradient-to-br from-[var(--button-color)] to-[var(--button-hover)]',
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
</script>
