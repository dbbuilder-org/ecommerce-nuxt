<template>
  <div ref="shopPageRef" class="container mx-auto px-4 py-6 lg:py-8">
    <!-- Hero Search Bar -->
    <div class="mb-8">
      <div class="relative max-w-2xl mx-auto">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products... (use quotes for exact phrase)"
          class="w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm"
          @keydown.enter="handleSearchEnter"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>
      <p v-if="searchQuery" class="text-center text-sm text-gray-500 mt-2">
        Found {{ filteredProducts.length }} result{{ filteredProducts.length === 1 ? '' : 's' }} for "{{ searchQuery }}"
      </p>
    </div>

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
          </div>
          <span class="text-gray-500 text-sm">
            <template v-if="totalPages > 1">
              Showing {{ paginationStart }}-{{ paginationEnd }} of {{ filteredProducts.length }} products
            </template>
            <template v-else>
              {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }}
            </template>
          </span>
        </div>

        <!-- Active Filters Summary Bar -->
        <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span class="text-sm font-medium text-gray-600 mr-1">Filters:</span>
          <!-- Category Filter -->
          <span
            v-if="selectedCategory"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border border-primary-200"
          >
            {{ selectedCategory.name }}
            <button @click="handleCategoryChange(null)" class="ml-2 hover:text-primary-900">
              <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
          <!-- Search Filter -->
          <span
            v-if="searchQuery"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
          >
            <Icon name="heroicons:magnifying-glass" class="w-3.5 h-3.5 mr-1.5" />
            "{{ searchQuery }}"
            <button @click="clearSearch" class="ml-2 hover:text-blue-900">
              <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
          <!-- In Stock Filter -->
          <span
            v-if="inStockOnly"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
          >
            <Icon name="heroicons:check-circle" class="w-3.5 h-3.5 mr-1.5" />
            In Stock Only
            <button @click="inStockOnly = false" class="ml-2 hover:text-green-900">
              <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
          <!-- Price Range Filter -->
          <span
            v-if="priceMin || priceMax"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200"
          >
            <Icon name="heroicons:currency-dollar" class="w-3.5 h-3.5 mr-1" />
            {{ priceMin ? `$${priceMin}` : '$0' }} - {{ priceMax ? `$${priceMax}` : 'Any' }}
            <button @click="clearPriceRange" class="ml-2 hover:text-amber-900">
              <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
          <!-- Clear All Button -->
          <button
            v-if="activeFilterCount > 1"
            @click="handleClearAllFilters"
            class="ml-auto text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear all
          </button>
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
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
            @click="handleProductClick"
          />
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
            >
              Previous
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <template v-for="page in visiblePageNumbers" :key="page">
                <span v-if="page === '...'" class="px-2 py-1 text-gray-400">...</span>
                <button
                  v-else
                  @click="goToPage(page as number)"
                  class="w-10 h-10 text-sm font-medium rounded-lg border transition-colors"
                  :class="currentPage === page
                    ? 'bg-[var(--primary-action-bg)] text-white border-[var(--primary-action-bg)]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
              </template>
            </div>

            <!-- Next Button -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
            >
              Next
            </button>
          </div>
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

// Template ref for scroll to top
const shopPageRef = ref<HTMLElement | null>(null)

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

// Pagination state
const currentPage = ref(1)
const productsPerPage = 30

/**
 * Smart search filter with wildcard matching
 * - Spaces act as AND wildcards: "blue polo" matches items with BOTH "blue" AND "polo"
 * - Quoted phrases match exactly: '"blue polo"' matches the exact phrase
 */
function filterBySearch(product: any, searchText: string): boolean {
  // Build searchable text from product fields
  const searchable = [
    product.name,
    product.description,
    product.categoryName,
    ...(product.tags || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  // Check for exact phrase match (quoted)
  const exactPhraseMatch = searchText.match(/^["'](.+)["']$/)
  if (exactPhraseMatch) {
    const phrase = exactPhraseMatch[1]?.toLowerCase()
    return phrase ? searchable.includes(phrase) : false
  }

  // Space-delimited AND logic: all terms must match
  const terms = searchText.toLowerCase().split(/\s+/).filter(t => t.length > 0)
  return terms.every(term => searchable.includes(term))
}

// Computed filtered products (client-side filtering)
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Search filter with smart matching
  if (searchQuery.value.trim()) {
    result = result.filter((product: any) => filterBySearch(product, searchQuery.value.trim()))
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

// Pagination computed values
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / productsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  const end = start + productsPerPage
  return filteredProducts.value.slice(start, end)
})

const paginationStart = computed(() => {
  if (filteredProducts.value.length === 0) return 0
  return (currentPage.value - 1) * productsPerPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * productsPerPage, filteredProducts.value.length)
})

// Smart page number display with ellipsis
const visiblePageNumbers = computed((): (number | string)[] => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    if (total > 1) {
      pages.push(total)
    }
  }

  return pages
})

// Pagination navigation
function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page

  // Scroll to top of shop page
  nextTick(() => {
    shopPageRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Reset to page 1 when filters change
watch([searchQuery, selectedCategory, inStockOnly, priceMin, priceMax], () => {
  currentPage.value = 1
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return categorySlug.value || searchQuery.value || inStockOnly.value || priceMin.value !== undefined || priceMax.value !== undefined
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

// Handle search enter key
function handleSearchEnter() {
  // Pressing Enter just triggers the search which is already reactive
  // Reset to page 1 is handled by the watcher
}

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
  // Generate proper cart item ID (string format: productId-productSizeId)
  const cartItemId = String(product.id)
  cartStore.addItem({
    id: cartItemId,
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  })
  toast.addToCart(product.name)
}

// Page SEO
const { setPageSEO, setCategorySEO } = useSEO()
const config = useRuntimeConfig()

watch(selectedCategory, (category) => {
  if (category) {
    setCategorySEO({
      name: category.name,
      description: `Browse ${category.name} products at ${config.public.schoolName}`,
      productCount: filteredProducts.value.length,
    })
  } else {
    setPageSEO({
      title: 'Shop',
      description: `Browse all products at ${config.public.schoolName}. Uniforms, supplies, and more.`,
    })
  }
}, { immediate: true })
</script>
