<template>
  <div
    class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    @click="handleClick"
  >
    <!-- Product Image -->
    <div class="aspect-square bg-gray-100 relative overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="heroicons:photo" class="w-16 h-16 text-gray-300" />
      </div>

      <!-- Availability Badge -->
      <div v-if="product.available === false" class="absolute top-2 left-2">
        <UiBadge variant="error" size="sm">Out of Stock</UiBadge>
      </div>

      <!-- Quick Add Button -->
      <button
        @click.stop="handleAddToCart"
        :disabled="product.available === false"
        class="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

const formattedPrice = computed(() => formatCurrency(props.product.price))

function handleAddToCart() {
  if (props.product.available !== false) {
    emit('addToCart', props.product)
  }
}

function handleClick() {
  emit('click', props.product)
}
</script>
