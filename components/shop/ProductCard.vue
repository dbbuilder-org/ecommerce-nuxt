<template>
  <div
    class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Product Image/Video -->
    <div class="aspect-square bg-gray-100 relative overflow-hidden">
      <UiProductMedia
        ref="mediaRef"
        :src="mediaSrc"
        :alt="product.name"
        :poster="product.image"
        :is-video="hasVideo"
        :autoplay="false"
        :loop="true"
        :muted="true"
        :show-controls="false"
        :show-play-overlay="false"
        :show-video-badge="hasVideo"
        :lazy="true"
        container-class="w-full h-full"
        :media-class="hasVideo ? '' : 'group-hover:scale-105 transition-transform duration-300'"
      />

      <!-- Availability Badge -->
      <div v-if="product.available === false" class="absolute top-2 left-2 z-10">
        <UiBadge variant="error" size="sm">Out of Stock</UiBadge>
      </div>

      <!-- Quick Add Button -->
      <button
        @click.stop="handleAddToCart"
        :disabled="product.available === false"
        class="absolute bottom-2 right-2 z-10 bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Icon name="heroicons:plus" class="w-5 h-5" />
      </button>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <h3 class="font-medium text-gray-900 truncate">{{ product.name }}</h3>
      <p class="text-primary-600 font-semibold mt-1">{{ formattedPrice }}</p>
      <p v-if="product.description" class="text-sm text-gray-500 mt-1 line-clamp-2">
        {{ product.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'

export interface Product {
  id: number
  name: string
  price: number
  description?: string
  image?: string
  video?: string
  available?: boolean
  sizeVariations?: Array<{
    id: number
    size?: string
    price: number
    available?: boolean
  }>
  variants?: Array<{
    id: number
    size?: string
    price: number
    available?: boolean
  }>
  productTypeId?: number
  glCode_Anthology?: string
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
  click: [product: Product]
}>()

const mediaRef = ref<{ playVideo: () => void; pauseVideo: () => void } | null>(null)

const formattedPrice = computed(() => formatCurrency(props.product.price))

// Check if product has video
const hasVideo = computed(() => !!props.product.video)

// Use video if available, otherwise image
const mediaSrc = computed(() => props.product.video || props.product.image)

function handleAddToCart() {
  if (props.product.available !== false) {
    emit('addToCart', props.product)
  }
}

function handleClick() {
  emit('click', props.product)
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
