<template>
  <div class="container mx-auto px-4 py-6 lg:py-8">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <!-- Mobile Filters Drawer -->
      <ShopMobileFiltersDrawer :active-filter-count="activeFilterCount" class="lg:hidden mb-2">
        <ShopFilters
          :categories="categories"
          :selected-category="selectedCategory"
          :search="searchQuery"
          :in-stock="inStockOnly"
          :price-min="priceMin"
          :price-max="priceMax"
          @update:category="handleCategoryChange"
          @update:search="handleSearchChange"
          @update:in-stock="handleInStockChange"
          @update:price-min="handlePriceMinChange"
          @update:price-max="handlePriceMaxChange"
          @clear-all="handleClearAllFilters"
        />
      </ShopMobileFiltersDrawer>

      <!-- Desktop Filters Sidebar -->
      <aside class="hidden lg:block lg:w-64 shrink-0">
        <div class="sticky top-20">
          <ShopFilters
            :categories="categories"
            :selected-category="selectedCategory"
            :search="searchQuery"
            :in-stock="inStockOnly"
            :price-min="priceMin"
            :price-max="priceMax"
            @update:category="handleCategoryChange"
            @update:search="handleSearchChange"
            @update:in-stock="handleInStockChange"
            @update:price-min="handlePriceMinChange"
            @update:price-max="handlePriceMaxChange"
            @clear-all="handleClearAllFilters"
          />
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ selectedCategory ? selectedCategory.name : 'All Products' }}
            </h1>
            <p v-if="searchQuery" class="text-sm text-gray-500 mt-1">
              Searching for "{{ searchQuery }}"
            </p>
          </div>
          <span class="text-gray-500">{{ filteredProducts.length }} products</span>
        </div>

        <!-- Active Filters Tags -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
          <span
            v-if="searchQuery"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
          >
            Search: {{ searchQuery }}
            <button @click="clearSearch" class="ml-2 hover:text-primary-900">
              <Icon name="heroicons:x-mark" class="w-3 h-3" />
            </button>
          </span>
          <span
            v-if="inStockOnly"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
          >
            In Stock Only
            <button @click="inStockOnly = false" class="ml-2 hover:text-green-900">
              <Icon name="heroicons:x-mark" class="w-3 h-3" />
            </button>
          </span>
          <span
            v-if="priceMin || priceMax"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
          >
            Price: {{ priceMin ? `$${priceMin}` : '$0' }} - {{ priceMax ? `$${priceMax}` : 'Any' }}
            <button @click="clearPriceRange" class="ml-2 hover:text-blue-900">
              <Icon name="heroicons:x-mark" class="w-3 h-3" />
            </button>
          </span>
        </div>

        <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-200 aspect-square rounded-lg mb-3" />
            <div class="bg-gray-200 h-4 rounded w-3/4 mb-2" />
            <div class="bg-gray-200 h-4 rounded w-1/2" />
          </div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
          <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500 mb-4">Try adjusting your filters or browse all products.</p>
          <button
            v-if="hasActiveFilters"
            @click="handleClearAllFilters"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ShopProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
            @click="handleProductClick"
          />
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <ShopProductDetailsModal :product="selectedProduct" :is-visible="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()

// Get category from query params
const categorySlug = computed(() => (route.query.category as string) || '')

// Fetch categories
const { data: categoriesData } = await useFetch('/api/ecommerce/categories')
const categories = computed(() => (categoriesData.value as any)?.categories || [])

const selectedCategory = computed(() => categories.value.find((c: any) => c.slug === categorySlug.value))

// Fetch products with category filter
const { data: productsData, pending } = await useFetch('/api/ecommerce/products', {
  query: {
    categoryId: computed(() => selectedCategory.value?.id),
  },
  watch: [selectedCategory],
})

const products = computed(() => (productsData.value as any)?.products || [])

// Filter state
const searchQuery = ref('')
const inStockOnly = ref(false)
const priceMin = ref<number | undefined>(undefined)
const priceMax = ref<number | undefined>(undefined)

// Computed filtered products (client-side filtering)
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (product: any) =>
        product.name?.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query)
    )
  }

  // In-stock filter
  if (inStockOnly.value) {
    result = result.filter((product: any) => product.available !== false)
  }

  // Price range filter
  if (priceMin.value !== undefined) {
    result = result.filter((product: any) => product.price >= priceMin.value!)
  }
  if (priceMax.value !== undefined) {
    result = result.filter((product: any) => product.price <= priceMax.value!)
  }

  return result
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value || inStockOnly.value || priceMin.value !== undefined || priceMax.value !== undefined
})

// Count active filters for mobile badge
const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (categorySlug.value) count++
  if (inStockOnly.value) count++
  if (priceMin.value !== undefined || priceMax.value !== undefined) count++
  return count
})

// Handle filter changes
function handleCategoryChange(category: any) {
  if (category) {
    router.push({ query: { category: category.slug } })
  } else {
    router.push({ query: {} })
  }
}

function handleSearchChange(search: string) {
  searchQuery.value = search
}

function handleInStockChange(value: boolean) {
  inStockOnly.value = value
}

function handlePriceMinChange(value: number | undefined) {
  priceMin.value = value
}

function handlePriceMaxChange(value: number | undefined) {
  priceMax.value = value
}

function clearSearch() {
  searchQuery.value = ''
}

function clearPriceRange() {
  priceMin.value = undefined
  priceMax.value = undefined
}

function handleClearAllFilters() {
  searchQuery.value = ''
  inStockOnly.value = false
  priceMin.value = undefined
  priceMax.value = undefined
  router.push({ query: {} })
}

// Product Details Modal state
const selectedProduct = ref<any>(null)
const isModalOpen = ref(false)

function handleProductClick(product: any) {
  selectedProduct.value = product
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  // Delay clearing product to allow animation to complete
  setTimeout(() => {
    selectedProduct.value = null
  }, 200)
}

// Handle add to cart
const cartStore = useCartStore()
function handleAddToCart(product: any) {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  })
  toast.addToCart(product.name)
}

// Page meta
useHead({
  title: computed(() => (selectedCategory.value ? selectedCategory.value.name : 'Shop')),
})
</script>
