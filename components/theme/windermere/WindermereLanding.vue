<template>
  <div>
    <!-- Quick Actions -->
    <section class="py-8 bg-white border-b">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-4 md:gap-8">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.link"
            class="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-xl hover:bg-[#1e3a5f] hover:text-white transition-all duration-300 group"
          >
            <div class="w-10 h-10 bg-[#c9a227]/10 rounded-lg flex items-center justify-center group-hover:bg-white/20">
              <Icon :name="action.icon" class="w-5 h-5 text-[#c9a227]" />
            </div>
            <span class="font-medium">{{ action.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Shop by Grade (Windermere-specific) -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Shop by Grade</h2>
          <p class="text-gray-600 mt-2">Find everything your student needs</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <NuxtLink
            v-for="grade in grades"
            :key="grade.value"
            :to="`/shop?grade=${grade.value}`"
            class="group relative overflow-hidden rounded-xl bg-white border-2 border-transparent hover:border-[#c9a227] transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <div class="p-6 text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon :name="grade.icon" class="w-8 h-8 text-[#c9a227]" />
              </div>
              <h3 class="font-semibold text-gray-900">{{ grade.label }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ grade.sublabel }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Collections -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Featured Collections</h2>
            <p class="text-gray-600 mt-1">Curated selections for every need</p>
          </div>
          <NuxtLink
            to="/shop"
            class="hidden md:flex items-center text-[#1e3a5f] hover:text-[#c9a227] font-medium"
          >
            View All
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="collection in collections"
            :key="collection.slug"
            :to="`/shop?collection=${collection.slug}`"
            class="group relative overflow-hidden rounded-2xl aspect-[4/3]"
          >
            <!-- Background -->
            <div :class="['absolute inset-0', collection.bgClass]" />

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <!-- Content -->
            <div class="absolute inset-0 p-6 flex flex-col justify-end">
              <div class="mb-2">
                <Icon
                  :name="collection.icon"
                  class="w-10 h-10 text-[#c9a227] mb-3 group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 class="text-xl font-bold text-white group-hover:text-[#c9a227] transition-colors">
                {{ collection.name }}
              </h3>
              <p class="text-white/80 text-sm mt-1">{{ collection.description }}</p>
              <div class="mt-3 flex items-center text-[#c9a227] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Shop Collection</span>
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/shop?category=${category.slug}`"
            class="group relative overflow-hidden rounded-xl aspect-square"
            :class="category.bgClass"
          >
            <!-- Icon -->
            <div class="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
              <Icon :name="category.icon" class="w-24 h-24 text-white" />
            </div>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <!-- Content -->
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-semibold text-lg group-hover:translate-x-1 transition-transform">
                {{ category.name }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Featured Products</h2>
          <NuxtLink
            to="/shop?category=featured-items"
            class="text-[#1e3a5f] hover:text-[#c9a227] font-medium text-sm"
          >
            View All Featured
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4 inline" />
          </NuxtLink>
        </div>

        <!-- Products slot for parent to inject -->
        <slot name="featured-products" />
      </div>
    </section>

    <!-- Newsletter / CTA -->
    <section class="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33]">
      <div class="container mx-auto px-4 text-center">
        <Icon name="heroicons:envelope" class="w-12 h-12 text-[#c9a227] mx-auto mb-4" />
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p class="text-white/80 mb-8 max-w-xl mx-auto">
          Get notified about new products, special offers, and school events.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-[#c9a227] transition-colors"
          />
          <button
            class="px-6 py-3 bg-[#c9a227] text-[#1e3a5f] font-semibold rounded-lg hover:bg-[#d4af37] transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Quick action items
const quickActions = [
  { label: 'New Arrivals', icon: 'heroicons:sparkles', link: '/shop?sort=newest' },
  { label: 'Best Sellers', icon: 'heroicons:fire', link: '/shop?sort=popular' },
  { label: 'Uniforms', icon: 'heroicons:user-group', link: '/shop?category=uniforms-apparel' },
  { label: 'Supplies', icon: 'heroicons:pencil', link: '/shop?category=school-supplies' },
]

// Grade levels
const grades = [
  { label: 'Pre-K', sublabel: 'Ages 3-4', value: 'prek', icon: 'heroicons:puzzle-piece' },
  { label: 'Elementary', sublabel: 'K-5th', value: 'elementary', icon: 'heroicons:academic-cap' },
  { label: 'Middle', sublabel: '6-8th', value: 'middle', icon: 'heroicons:book-open' },
  { label: 'High School', sublabel: '9-12th', value: 'high', icon: 'heroicons:building-library' },
  { label: 'Staff', sublabel: 'Faculty', value: 'staff', icon: 'heroicons:briefcase' },
]

// Featured collections
const collections = [
  {
    name: 'Back to School',
    slug: 'back-to-school',
    description: 'Everything for a great start',
    icon: 'heroicons:academic-cap',
    bgClass: 'bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33]',
  },
  {
    name: 'Spirit Wear',
    slug: 'spirit-wear',
    description: 'Show your school pride',
    icon: 'heroicons:heart',
    bgClass: 'bg-gradient-to-br from-[#c9a227] to-[#8b6914]',
  },
  {
    name: 'Athletic Gear',
    slug: 'athletic',
    description: 'For every sport and activity',
    icon: 'heroicons:trophy',
    bgClass: 'bg-gradient-to-br from-[#059669] to-[#047857]',
  },
]

// Categories
const categories = [
  { name: 'Uniforms', slug: 'uniforms-apparel', icon: 'heroicons:user-group', bgClass: 'bg-gradient-to-br from-[#1e3a5f] to-[#152a45]' },
  { name: 'Supplies', slug: 'school-supplies', icon: 'heroicons:pencil', bgClass: 'bg-gradient-to-br from-[#059669] to-[#047857]' },
  { name: 'Technology', slug: 'technology', icon: 'heroicons:computer-desktop', bgClass: 'bg-gradient-to-br from-gray-700 to-gray-900' },
  { name: 'Merchandise', slug: 'merchandise', icon: 'heroicons:shopping-bag', bgClass: 'bg-gradient-to-br from-[#c9a227] to-[#8b6914]' },
]
</script>
