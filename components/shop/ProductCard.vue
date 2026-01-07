<template>
  <div class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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

      <!-- Quick Add Button -->
      <button
        @click="handleAddToCart"
        class="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-700"
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
interface Product {
  id: number
  name: string
  price: number
  description?: string
  image?: string
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
}>()

const formattedPrice = computed(() =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.product.price)
)

function handleAddToCart() {
  emit('addToCart', props.product)
}
</script>
