<template>
  <div class="space-y-6">
    <div>
      <h3 class="font-semibold text-gray-900 mb-3">Categories</h3>
      <div class="space-y-2">
        <button
          @click="emit('update:category', null)"
          :class="[
            'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            !selectedCategory ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          All Products
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="emit('update:category', category)"
          :class="[
            'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            selectedCategory?.id === category.id ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
}

defineProps<{
  categories: Category[]
  selectedCategory: Category | null
}>()

const emit = defineEmits<{
  'update:category': [category: Category | null]
}>()
</script>
