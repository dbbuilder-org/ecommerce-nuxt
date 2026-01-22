<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'
import { generateCartItemId } from '~/stores/cart'

// Types
export interface ProductImage {
  id?: number
  productImageId?: number
  imageUrl?: string
  thumbnailUrl?: string
  fileName?: string
  isVideo?: boolean
}

export interface ProductVariant {
  id: number
  productId?: number
  size?: string
  price: number
  available?: boolean
  name?: string
  originalName?: string
}

export interface Product {
  id: number
  name: string
  price: number
  description?: string
  image?: string
  available?: boolean
  isVideo?: boolean
  sizeVariations?: ProductVariant[]
  variants?: ProductVariant[]
  productTypeId?: number
  glCode_Anthology?: string
  rolePricing?: Record<string, number>
}

interface Props {
  product: Product | null
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Stores
const cartStore = useCartStore()
const toast = useToast()

// State
const quantity = ref(1)
const selectedVariant = ref<ProductVariant | null>(null)
const productImages = ref<ProductImage[]>([])
const selectedImageIndex = ref(0)
const isLoadingImages = ref(false)
const isImageZoomed = ref(false)

// Computed
const currentImageUrl = computed(() => {
  const img = productImages.value[selectedImageIndex.value]
  if (productImages.value.length > 0 && img) {
    return img.imageUrl || img.thumbnailUrl || img.fileName || ''
  }
  return props.product?.image || ''
})

const currentImageIsVideo = computed(() => {
  const img = productImages.value[selectedImageIndex.value]
  if (productImages.value.length > 0 && img) {
    return img.isVideo === true
  }
  return props.product?.isVideo === true
})

const hasVariations = computed(() => {
  if (!props.product) return false
  const variations = props.product.sizeVariations || props.product.variants || []
  if (variations.length > 1) return true
  if (variations.length === 1) {
    const variation = variations[0]
    if (variation) {
      return variation.price !== props.product.price || variation.size !== undefined
    }
  }
  return false
})

const sizeVariations = computed(() => {
  if (!props.product) return []
  return props.product.sizeVariations || props.product.variants || []
})

const currentPrice = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.price
  }
  return props.product?.price || 0
})

const isAddToCartEnabled = computed(() => {
  // For products WITH variations, check variant availability (not parent product)
  if (hasVariations.value) {
    if (!selectedVariant.value) return false
    // Treat undefined as available (only block if explicitly false)
    return selectedVariant.value.available !== false
  }
  // For products WITHOUT variations, check the product's own availability
  return props.product?.available !== false
})

// Determines if product should show as "In Stock" - for sized products, check if ANY variant is available
const isProductAvailable = computed(() => {
  if (hasVariations.value) {
    // For sized products, available if at least one variant is available
    const variants = props.product?.sizeVariations || props.product?.variants || []
    return variants.some(v => v.available !== false)
  }
  // For regular products, use the product's availability
  return props.product?.available !== false
})

const totalPrice = computed(() => currentPrice.value * quantity.value)

// Category name lookup
function getCategoryName(): string {
  if (!props.product) return 'General'

  const categoryMapping: Record<number, string> = {
    1390: 'Course Materials',
    1404: 'Books',
    1391: 'Apparel',
    1393: 'Supplies',
    1392: 'Supplies-Miscellaneous',
    1389: 'Uniforms',
    1388: 'Gift Cards',
    1406: 'Shipping & Handling',
  }

  const productTypeId = props.product.productTypeId
  if (productTypeId && categoryMapping[productTypeId]) {
    return categoryMapping[productTypeId]
  }

  // Fallback to GL Code patterns
  if (props.product.glCode_Anthology) {
    const glCode = props.product.glCode_Anthology
    if (glCode.includes('SUPPLIES') || glCode.includes('MRCSSUPL')) return 'Supplies'
    if (glCode.includes('APPAREL') || glCode.includes('MRCSAPRL')) return 'Apparel'
    if (glCode.includes('BOOK') || glCode.includes('MRCSTEXT')) return 'Books'
    if (glCode.includes('MATERIAL') || glCode.includes('MRCSCMAT')) return 'Course Materials'
    if (glCode.includes('UNIFORM') || glCode.includes('MRCSUNIF')) return 'Uniforms'
    if (glCode.includes('GIFT') || glCode.includes('MRCSGIFT')) return 'Gift Cards'
  }

  return 'General'
}

// Methods
function closeModal() {
  emit('close')
}

function selectImage(index: number) {
  if (index >= 0 && index < productImages.value.length) {
    selectedImageIndex.value = index
  }
}

function previousImage() {
  if (productImages.value.length > 1) {
    selectedImageIndex.value =
      selectedImageIndex.value > 0
        ? selectedImageIndex.value - 1
        : productImages.value.length - 1
  }
}

function nextImage() {
  if (productImages.value.length > 1) {
    selectedImageIndex.value =
      selectedImageIndex.value < productImages.value.length - 1
        ? selectedImageIndex.value + 1
        : 0
  }
}

// Fullscreen image zoom
function toggleImageZoom() {
  if (currentImageIsVideo.value) return
  isImageZoomed.value = !isImageZoomed.value
  if (isImageZoomed.value) {
    document.addEventListener('keydown', handleZoomKeydown)
  } else {
    document.removeEventListener('keydown', handleZoomKeydown)
  }
}

function closeZoom() {
  isImageZoomed.value = false
  document.removeEventListener('keydown', handleZoomKeydown)
}

function handleZoomKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      closeZoom()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

function increaseQuantity() {
  if (quantity.value < 99) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function selectVariant(variant: ProductVariant) {
  if (variant.available !== false) {
    selectedVariant.value = variant
  }
}

function addToCart() {
  if (!isAddToCartEnabled.value || !props.product) return

  const productToAdd = selectedVariant.value || props.product
  const productName = selectedVariant.value
    ? `${selectedVariant.value.originalName || selectedVariant.value.name || props.product.name}`
    : props.product.name

  // Determine IDs - variants use their own ID as productSizeId
  const productId = props.product.id
  const productSizeId = selectedVariant.value?.id

  // Add to cart with proper CartItem structure
  cartStore.addItem(
    {
      id: generateCartItemId(productId, productSizeId),
      productId,
      productSizeId,
      name: productName,
      price: currentPrice.value,
      image: props.product.image,
      size: selectedVariant.value?.size,
    },
    quantity.value
  )

  // Show toast
  const message = quantity.value > 1 ? `${quantity.value} x ${productName}` : productName
  toast.addToCart(message)

  // Reset state and close
  quantity.value = 1
  selectedVariant.value = null
  closeModal()
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.opacity = '0.3'
  }
}

// Watchers
watch(
  () => props.product,
  (newProduct) => {
    // Reset state when product changes
    selectedVariant.value = null
    quantity.value = 1
    productImages.value = []
    selectedImageIndex.value = 0
  }
)

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      quantity.value = 1
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

// Cleanup
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleZoomKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible && product"
        class="fixed inset-0 z-[9999] overflow-y-auto"
        @click="closeModal"
      >
        <!-- Background Overlay -->
        <div class="fixed inset-0 bg-black/75 backdrop-blur-lg transition-opacity duration-300" />

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-0 sm:p-4">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            appear
          >
            <div
              class="relative bg-white rounded-none sm:rounded-3xl shadow-2xl w-full sm:max-w-6xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden transform transition-all"
              @click.stop
            >
              <!-- Close Button -->
              <button
                @click="closeModal"
                class="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/95 backdrop-blur-sm rounded-full shadow-lg w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Close product details"
              >
                <svg class="w-6 h-6 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Modal Content -->
              <div class="flex flex-col lg:flex-row h-full max-h-[90vh]">
                <!-- Left Side - Image Gallery -->
                <div class="lg:w-3/5 bg-gray-50">
                  <div class="p-6 h-full flex flex-col">
                    <!-- Main Image -->
                    <div class="flex-1 mb-4">
                      <div class="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-white rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                        <!-- Image Display -->
                        <img
                          v-if="currentImageUrl && !currentImageIsVideo"
                          :src="currentImageUrl"
                          :alt="product.name"
                          loading="lazy"
                          decoding="async"
                          class="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                          @error="handleImageError"
                        />
                        <!-- Video Display -->
                        <video
                          v-else-if="currentImageUrl && currentImageIsVideo"
                          :src="currentImageUrl"
                          controls
                          class="w-full h-full object-contain"
                        />
                        <!-- Placeholder -->
                        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                          <Icon name="heroicons:photo" class="w-24 h-24 text-gray-300" />
                        </div>

                        <!-- Navigation Arrows (when multiple images) -->
                        <template v-if="productImages.length > 1">
                          <button
                            @click.stop="previousImage"
                            class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                            aria-label="Previous image"
                          >
                            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            @click.stop="nextImage"
                            class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                            aria-label="Next image"
                          >
                            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </template>

                        <!-- Image Counter -->
                        <div
                          v-if="productImages.length > 1"
                          class="absolute bottom-4 left-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm"
                        >
                          {{ selectedImageIndex + 1 }} / {{ productImages.length }}
                        </div>

                        <!-- Zoom Button (for images only) -->
                        <button
                          v-if="currentImageUrl && !currentImageIsVideo"
                          @click.stop="toggleImageZoom"
                          class="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                          aria-label="Zoom image"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Thumbnail Gallery -->
                    <div v-if="productImages.length > 0" class="flex space-x-2 overflow-x-auto pb-2">
                      <button
                        v-for="(image, index) in productImages"
                        :key="image.id || image.productImageId || index"
                        @click="selectImage(index)"
                        class="relative flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden transition-all duration-200"
                        :class="
                          selectedImageIndex === index
                            ? 'ring-2 ring-primary-500 ring-offset-2'
                            : 'border border-gray-200 hover:border-primary-300'
                        "
                      >
                        <img
                          :src="image.imageUrl || image.thumbnailUrl || image.fileName"
                          :alt="`${product.name} - ${image.isVideo ? 'Video' : 'Image'} ${index + 1}`"
                          loading="lazy"
                          decoding="async"
                          class="w-full h-full object-cover"
                          @error="handleImageError"
                        />
                        <!-- Video Indicator -->
                        <div
                          v-if="image.isVideo"
                          class="absolute inset-0 flex items-center justify-center bg-black/30"
                        >
                          <div class="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Side - Product Information -->
                <div class="lg:w-2/5 overflow-y-auto">
                  <div class="p-6 lg:p-8">
                    <!-- Product Title -->
                    <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {{ product.name }}
                    </h1>

                    <!-- Availability Badge - For sized products, show availability based on variants -->
                    <div class="mb-6">
                      <UiBadge
                        v-if="isProductAvailable"
                        variant="success"
                        size="md"
                      >
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        In Stock
                      </UiBadge>
                      <UiBadge v-else variant="error" size="md">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Out of Stock
                      </UiBadge>
                    </div>

                    <!-- Price Section -->
                    <div class="mb-8">
                      <div class="text-3xl sm:text-4xl font-bold text-gray-900">
                        {{ formatCurrency(currentPrice) }}
                      </div>
                    </div>

                    <!-- Product Description -->
                    <div class="mb-8">
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p v-if="product.description" class="text-gray-600 leading-relaxed">
                        {{ product.description }}
                      </p>
                      <p v-else class="text-gray-600 leading-relaxed">
                        This is a high-quality {{ product.name.toLowerCase() }} from our {{ getCategoryName() }}
                        collection. Perfect for students and professionals alike.
                      </p>
                    </div>

                    <!-- Product Specifications -->
                    <div class="mb-8">
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                      <div class="bg-gray-50 rounded-2xl p-4 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-gray-600">Product ID:</span>
                          <span class="font-medium">{{ product.id }}</span>
                        </div>
                        <div v-if="product.productTypeId" class="flex justify-between">
                          <span class="text-gray-600">Category:</span>
                          <span class="font-medium">{{ getCategoryName() }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Availability:</span>
                          <span
                            class="font-medium"
                            :class="isProductAvailable ? 'text-green-600' : 'text-red-600'"
                          >
                            {{ isProductAvailable ? 'In Stock' : 'Out of Stock' }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Size Selection (if product has variants) -->
                    <div v-if="hasVariations" class="mb-6">
                      <label class="text-sm font-medium text-gray-700 mb-3 block">Select Size:</label>
                      <div class="flex flex-wrap gap-2">
                        <UiButton
                          v-for="variant in sizeVariations"
                          :key="`${variant.productId || variant.id}-${variant.size}`"
                          @click="selectVariant(variant)"
                          :disabled="variant.available === false"
                          :variant="selectedVariant && selectedVariant.id === variant.id ? 'primary' : 'outline'"
                          size="sm"
                          class="relative min-w-[60px]"
                        >
                          {{ variant.size }}
                          <span
                            v-if="variant.available === false"
                            class="absolute -top-1 -right-1 text-xs text-red-500"
                          >
                            X
                          </span>
                        </UiButton>
                      </div>
                    </div>

                    <!-- Quantity Selector -->
                    <div class="mb-8">
                      <div class="flex items-center space-x-4 mb-4">
                        <label class="text-sm font-medium text-gray-700">Quantity:</label>
                        <div class="flex items-center border border-gray-300 rounded-2xl">
                          <button
                            @click="decreaseQuantity"
                            :disabled="quantity <= 1"
                            class="px-3 py-2 rounded-l-2xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <input
                            v-model.number="quantity"
                            type="number"
                            min="1"
                            max="99"
                            class="w-16 px-3 py-2 text-center border-0 focus:ring-0 focus:outline-none"
                          />
                          <button
                            @click="increaseQuantity"
                            :disabled="quantity >= 99"
                            class="px-3 py-2 rounded-r-2xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- Add to Cart Button -->
                      <UiButton
                        @click="addToCart"
                        :disabled="!isAddToCartEnabled"
                        variant="primary"
                        size="lg"
                        class="w-full shadow-lg"
                      >
                        <span v-if="!isProductAvailable">Out of Stock</span>
                        <span v-else-if="hasVariations && !selectedVariant">Select a Size</span>
                        <span v-else>Add to Cart - {{ formatCurrency(totalPrice) }}</span>
                      </UiButton>
                    </div>

                    <!-- Social Sharing -->
                    <div class="border-t border-gray-200 pt-6">
                      <h3 class="text-sm font-medium text-gray-900 mb-3">Share this product</h3>
                      <div class="flex space-x-3">
                        <button
                          class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          aria-label="Share on Twitter"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                            />
                          </svg>
                        </button>
                        <button
                          class="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"
                          aria-label="Share on Facebook"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            />
                          </svg>
                        </button>
                        <button
                          class="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                          aria-label="Share via link"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Fullscreen Image Zoom Overlay -->
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isImageZoomed && currentImageUrl && !currentImageIsVideo"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95"
        @click="closeZoom"
      >
        <!-- Close Button -->
        <button
          @click.stop="closeZoom"
          class="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close zoom"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Zoomed Image -->
        <img
          :src="currentImageUrl"
          :alt="product?.name"
          class="max-w-[95vw] max-h-[95vh] object-contain"
          @click.stop
        />

        <!-- Navigation Arrows (when multiple images) -->
        <template v-if="productImages.length > 1">
          <button
            @click.stop="previousImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </template>

        <!-- Image Counter -->
        <div
          v-if="productImages.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm"
        >
          {{ selectedImageIndex + 1 }} / {{ productImages.length }}
        </div>

        <!-- Keyboard hints -->
        <div class="absolute bottom-4 right-4 text-white/50 text-xs hidden sm:block">
          ESC to close • ← → to navigate
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Custom scrollbar for modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Remove number input arrows */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
