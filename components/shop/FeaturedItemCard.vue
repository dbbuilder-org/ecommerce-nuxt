<template>
  <div
    class="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-full"
    @click="handleCardClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-500 border border-gray-100 hover:border-[var(--button-color)]/30 overflow-hidden h-full flex flex-col">
      <!-- Product Image -->
      <div class="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-100">
        <UiProductMedia
          v-if="hasVideo"
          ref="mediaRef"
          :src="mediaSrc"
          :alt="product.name"
          :poster="product.image"
          :is-video="true"
          :autoplay="false"
          :loop="true"
          :muted="true"
          :show-controls="false"
          :show-play-overlay="false"
          :show-video-badge="true"
          :lazy="index >= 4"
          container-class="w-full h-full"
          media-class=""
        />
        <img
          v-else
          :src="product.image || '/images/placeholder.png'"
          :alt="product.name"
          width="400"
          height="300"
          :loading="index < 4 ? 'eager' : 'lazy'"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          @error="handleImageError"
        />

        <!-- Featured Badge -->
        <div class="absolute top-3 left-3 z-10">
          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span>Featured</span>
          </div>
        </div>

        <!-- Out of Stock Badge -->
        <div v-if="!isAvailable" class="absolute top-3 right-3 z-10">
          <UiBadge variant="error" size="sm">Out of Stock</UiBadge>
        </div>

        <!-- Video Badge -->
        <div v-if="hasVideo" class="absolute bottom-3 left-3 z-10">
          <div class="bg-black/60 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span>Video</span>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-4 sm:p-5 flex-grow flex flex-col">
        <!-- Product Name -->
        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--button-color)] transition-colors duration-300 line-clamp-2">
          {{ product.name }}
        </h3>

        <!-- Price Section -->
        <div class="mb-4">
          <!-- Role-based pricing (when logged in with discounted price) -->
          <div v-if="showRolePricing" class="space-y-1">
            <div class="text-xl sm:text-2xl font-bold text-green-600">
              {{ formatCurrency(displayPrice) }}
            </div>
            <div class="text-sm text-gray-500 line-through">
              {{ formatCurrency(product.price) }}
            </div>
            <div class="inline-flex items-center gap-1 text-xs text-[var(--button-color)] font-semibold bg-[var(--button-color)]/10 px-2 py-0.5 rounded-full">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              Member Price
            </div>
          </div>
          <!-- Regular pricing -->
          <div v-else class="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[var(--button-color)] transition-colors duration-300">
            {{ formatCurrency(displayPrice) }}
          </div>
        </div>

        <!-- Spacer to push buttons to bottom -->
        <div class="flex-grow"></div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mt-4">
          <!-- Add to Cart Button -->
          <button
            @click.stop="handleAddToCart"
            :disabled="!isAvailable"
            class="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            :class="[
              isAvailable
                ? 'bg-[var(--primary-action-bg)] text-white hover:bg-[var(--primary-action-bg-hover)] hover:shadow-glow-primary'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="isAvailable">Add to Cart</span>
            <span v-else>Out of Stock</span>
          </button>

          <!-- Quick View Button -->
          <button
            @click.stop="handleQuickView"
            class="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[var(--button-color)] hover:text-[var(--button-color)] hover:bg-[var(--button-color)]/5 transition-all duration-200"
            aria-label="Quick view product details"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'
import type { Product } from '~/components/shop/ProductCard.vue'

const props = withDefaults(defineProps<{
  product: Product
  index?: number
}>(), {
  index: 0
})

const emit = defineEmits<{
  click: [product: Product]
  addToCart: [product: Product]
  quickView: [product: Product]
}>()

const authStore = useAuthStore()

const mediaRef = ref<{ playVideo: () => void; pauseVideo: () => void } | null>(null)

// Check if product has video
const hasVideo = computed(() => !!props.product.video)

// Use video if available, otherwise image
const mediaSrc = computed(() => props.product.video || props.product.image)

// Calculate display price (with role-based pricing if applicable)
const displayPrice = computed(() => {
  // For now, just return the base price
  // Role-based pricing can be added when the pricing store is available
  return props.product.price
})

// Show role pricing badge if user is logged in and has a discounted price
const showRolePricing = computed(() => {
  // This would check if the user has a member discount
  // For now, return false - can be implemented when pricing system is integrated
  return false
})

// Check if product is available
const isAvailable = computed(() => {
  return props.product.available !== false
})

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder.png'
}

function handleCardClick() {
  emit('click', props.product)
}

function handleAddToCart() {
  if (isAvailable.value) {
    emit('addToCart', props.product)
  }
}

function handleQuickView() {
  emit('quickView', props.product)
}

// Play video on hover
function handleMouseEnter() {
  if (hasVideo.value && mediaRef.value) {
    mediaRef.value.playVideo()
  }
}

// Pause video on mouse leave
function handleMouseLeave() {
  if (hasVideo.value && mediaRef.value) {
    mediaRef.value.pauseVideo()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
