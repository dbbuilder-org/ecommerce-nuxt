<template>
  <section :class="['py-16 relative overflow-hidden', sectionClass]">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5 pointer-events-none">
      <div
        class="absolute inset-0"
        style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 50px 50px;"
      />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 :class="['text-3xl md:text-4xl font-bold mb-4', headerClass]">
          {{ title }}
          <span v-if="highlightText" :class="highlightClass">{{ highlightText }}</span>
        </h2>
        <p :class="['text-lg max-w-2xl mx-auto', subtitleClass]">
          {{ subtitle }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:exclamation-triangle" class="w-10 h-10 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Unable to load featured items</h3>
          <p class="text-gray-500 mb-6">{{ error }}</p>
          <button
            @click="$emit('retry')"
            class="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else-if="items.length > 0" class="relative">
        <!-- Navigation Arrows -->
        <button
          v-if="showNavigation && canScrollLeft"
          @click="scrollLeft"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex"
        >
          <Icon name="heroicons:chevron-left" class="w-6 h-6 text-gray-600" />
        </button>

        <button
          v-if="showNavigation && canScrollRight"
          @click="scrollRight"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex"
        >
          <Icon name="heroicons:chevron-right" class="w-6 h-6 text-gray-600" />
        </button>

        <!-- Scrollable Container -->
        <div
          ref="carouselRef"
          class="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          :class="{ 'md:grid md:grid-cols-4 md:overflow-visible': !enableCarousel }"
          @scroll="updateScrollState"
        >
          <div
            v-for="(item, index) in items"
            :key="item.id"
            :class="[
              'flex-shrink-0 w-[280px] md:w-auto',
              enableCarousel ? '' : 'md:flex-shrink'
            ]"
          >
            <ShopProductCard
              :product="item"
              @click="$emit('item-click', item)"
              @add-to-cart="$emit('add-to-cart', item)"
            />
          </div>
        </div>

        <!-- Scroll Indicators (Mobile) -->
        <div v-if="showIndicators && items.length > 1" class="flex justify-center gap-2 mt-6 md:hidden">
          <button
            v-for="(_, index) in Math.ceil(items.length / 1.5)"
            :key="index"
            @click="scrollToIndex(index)"
            :class="[
              'w-2 h-2 rounded-full transition-colors',
              currentIndex === index ? 'bg-primary-600' : 'bg-gray-300'
            ]"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:cube" class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No featured items available</h3>
          <p class="text-gray-500 mb-6">Check back later for our latest featured products!</p>
          <NuxtLink to="/shop" class="btn-primary">
            Browse All Products
          </NuxtLink>
        </div>
      </div>

      <!-- View All Button -->
      <div v-if="items.length > 0 && showViewAll" class="text-center mt-10">
        <NuxtLink
          :to="viewAllLink"
          :class="['inline-flex items-center px-8 py-4 font-semibold rounded-lg transition-all', viewAllButtonClass]"
        >
          {{ viewAllText }}
          <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/components/shop/ProductCard.vue'

const props = withDefaults(defineProps<{
  items: Product[]
  loading?: boolean
  error?: string | null
  title?: string
  highlightText?: string
  subtitle?: string
  showNavigation?: boolean
  showIndicators?: boolean
  showViewAll?: boolean
  viewAllText?: string
  viewAllLink?: string
  enableCarousel?: boolean
  variant?: 'light' | 'dark'
}>(), {
  loading: false,
  error: null,
  title: 'Featured',
  highlightText: 'Items',
  subtitle: 'Discover our handpicked selection of popular and trending products',
  showNavigation: true,
  showIndicators: true,
  showViewAll: true,
  viewAllText: 'View All Products',
  viewAllLink: '/shop',
  enableCarousel: true,
  variant: 'light',
})

const emit = defineEmits<{
  'item-click': [product: Product]
  'add-to-cart': [product: Product]
  retry: []
}>()

const carouselRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const currentIndex = ref(0)

// Theme-based classes
const sectionClass = computed(() =>
  props.variant === 'dark'
    ? 'bg-[#02233c] text-white'
    : 'bg-gradient-to-br from-gray-50 to-primary-50'
)

const headerClass = computed(() =>
  props.variant === 'dark' ? 'text-white' : 'text-gray-900'
)

const subtitleClass = computed(() =>
  props.variant === 'dark' ? 'text-gray-300' : 'text-gray-600'
)

const highlightClass = computed(() =>
  props.variant === 'dark' ? 'text-[#9bd3dd]' : 'text-primary-600'
)

const viewAllButtonClass = computed(() =>
  props.variant === 'dark'
    ? 'bg-[#9bd3dd] text-[#02233c] hover:bg-[#b5e0e7]'
    : 'bg-primary-600 text-white hover:bg-primary-700'
)

// Scroll navigation
function updateScrollState() {
  if (!carouselRef.value) return

  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10

  // Update current index for indicators
  const itemWidth = 280 + 24 // width + gap
  currentIndex.value = Math.round(scrollLeft / itemWidth)
}

function scrollLeft() {
  if (!carouselRef.value) return
  const itemWidth = 280 + 24
  carouselRef.value.scrollBy({ left: -itemWidth * 2, behavior: 'smooth' })
}

function scrollRight() {
  if (!carouselRef.value) return
  const itemWidth = 280 + 24
  carouselRef.value.scrollBy({ left: itemWidth * 2, behavior: 'smooth' })
}

function scrollToIndex(index: number) {
  if (!carouselRef.value) return
  const itemWidth = 280 + 24
  carouselRef.value.scrollTo({ left: index * itemWidth * 1.5, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollState()
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
