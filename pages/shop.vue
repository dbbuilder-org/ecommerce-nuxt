<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <aside class="lg:w-64 shrink-0">
        <ShopFilters
          :categories="categories"
          :selected-category="selectedCategory"
          @update:category="handleCategoryChange"
        />
      </aside>

      <!-- Products Grid -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ selectedCategory ? selectedCategory.name : 'All Products' }}
          </h1>
          <span class="text-gray-500">
            {{ products.length }} products
          </span>
        </div>

        <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-200 aspect-square rounded-lg mb-3" />
            <div class="bg-gray-200 h-4 rounded w-3/4 mb-2" />
            <div class="bg-gray-200 h-4 rounded w-1/2" />
          </div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-12">
          <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500">Try adjusting your filters or browse all products.</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ShopProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// Get category from query params
const categorySlug = computed(() => route.query.category as string || '')

// Fetch categories
const { data: categoriesData } = await useFetch('/api/ecommerce/categories')
const categories = computed(() => (categoriesData.value as any)?.categories || [])

const selectedCategory = computed(() =>
  categories.value.find((c: any) => c.slug === categorySlug.value)
)

// Fetch products with category filter
const { data: productsData, pending } = await useFetch('/api/ecommerce/products', {
  query: {
    categoryId: computed(() => selectedCategory.value?.id),
  },
  watch: [selectedCategory],
})

const products = computed(() => (productsData.value as any)?.products || [])

// Handle category change
function handleCategoryChange(category: any) {
  if (category) {
    router.push({ query: { category: category.slug } })
  } else {
    router.push({ query: {} })
  }
}

// Handle add to cart
const cartStore = useCartStore()
function handleAddToCart(product: any) {
  cartStore.addItem(product)
}

// Page meta
useHead({
  title: computed(() =>
    selectedCategory.value ? selectedCategory.value.name : 'Shop'
  ),
})
</script>
