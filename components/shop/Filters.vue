<template>
  <div class="space-y-6">
    <!-- Search -->
    <div>
      <h3 class="font-semibold text-gray-900 mb-3">Search</h3>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
        <Icon
          name="heroicons:magnifying-glass"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Categories -->
    <div>
      <h3 class="font-semibold text-gray-900 mb-3">Categories</h3>
      <div class="space-y-2">
        <button
          @click="emit('update:category', null)"
          :class="[
            'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            !selectedCategory ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          All Products
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="emit('update:category', category)"
          :class="[
            'flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            selectedCategory?.id === category.id
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          <span>{{ category.name }}</span>
          <span
            v-if="category.productCount !== undefined"
            :class="[
              'text-xs px-1.5 py-0.5 rounded-full',
              selectedCategory?.id === category.id
                ? 'bg-primary-200 text-primary-800'
                : 'bg-gray-100 text-gray-500',
            ]"
          >
            {{ category.productCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Availability Filter -->
    <div>
      <h3 class="font-semibold text-gray-900 mb-3">Availability</h3>
      <div class="space-y-2">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            v-model="inStockOnly"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="text-sm text-gray-600">In stock only</span>
        </label>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <h3 class="font-semibold text-gray-900 mb-3">Price Range</h3>
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              v-model.number="minPrice"
              type="number"
              min="0"
              placeholder="Min"
              class="w-full px-4 py-2 pl-7 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <span class="text-gray-400">-</span>
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              v-model.number="maxPrice"
              type="number"
              min="0"
              placeholder="Max"
              class="w-full px-4 py-2 pl-7 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
        <button
          v-if="minPrice || maxPrice"
          @click="clearPriceRange"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear price filter
        </button>
      </div>
    </div>

    <!-- Clear All Filters -->
    <div v-if="hasActiveFilters" class="pt-4 border-t border-gray-200">
      <button
        @click="clearAllFilters"
        class="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Clear all filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
  productCount?: number
}

const props = defineProps<{
  categories: Category[]
  selectedCategory: Category | null
  search?: string
  inStock?: boolean
  priceMin?: number
  priceMax?: number
}>()

const emit = defineEmits<{
  'update:category': [category: Category | null]
  'update:search': [search: string]
  'update:inStock': [inStock: boolean]
  'update:priceMin': [min: number | undefined]
  'update:priceMax': [max: number | undefined]
  clearAll: []
}>()

// Local state for filters
const searchQuery = ref(props.search || '')
const inStockOnly = ref(props.inStock || false)
const minPrice = ref<number | undefined>(props.priceMin)
const maxPrice = ref<number | undefined>(props.priceMax)

// Debounced search
const debouncedSearch = useDebounce(searchQuery, 300)

// Watch for debounced search changes
watch(debouncedSearch, (newValue) => {
  emit('update:search', newValue)
})

// Watch other filter changes
watch(inStockOnly, (newValue) => {
  emit('update:inStock', newValue)
})

watch(minPrice, (newValue) => {
  emit('update:priceMin', newValue)
})

watch(maxPrice, (newValue) => {
  emit('update:priceMax', newValue)
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    props.selectedCategory ||
    inStockOnly.value ||
    minPrice.value ||
    maxPrice.value
  )
})

// Clear functions
function clearSearch() {
  searchQuery.value = ''
}

function clearPriceRange() {
  minPrice.value = undefined
  maxPrice.value = undefined
}

function clearAllFilters() {
  searchQuery.value = ''
  inStockOnly.value = false
  minPrice.value = undefined
  maxPrice.value = undefined
  emit('update:category', null)
  emit('clearAll')
}
</script>
