<template>
  <div>
    <!-- Hero Section with Video/Image Support -->
    <UiHeroSection
      :video-src="heroConfig.videoSrc"
      :image-src="heroConfig.imageSrc"
      :gradient-class="heroConfig.gradientClass"
      :overlay-class="heroConfig.overlayClass"
      :title="`Welcome to ${schoolName}`"
      subtitle="Shop uniforms, supplies, and more for your school needs."
      cta-text="Shop Now"
      cta-link="/shop"
      :show-scroll-indicator="heroConfig.showScrollIndicator"
      container-class="min-h-[400px] md:min-h-[500px] text-white"
    >
      <!-- Shop by Category Quick Links -->
      <div v-if="displayCategories.length > 0" class="flex flex-wrap gap-3 justify-start items-center mt-6">
        <NuxtLink
          v-for="category in displayCategories.slice(0, 6)"
          :key="category.id"
          :to="`/shop?category=${getCategorySlug(category.name)}`"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white hover:text-primary-700 backdrop-blur-sm transition-all duration-200"
        >
          Shop {{ category.name }}
        </NuxtLink>
      </div>
    </UiHeroSection>

    <!-- Quick Actions / Categories -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in displayCategories"
            :key="category.id"
            :to="`/shop?category=${category.slug}`"
            class="group relative overflow-hidden rounded-xl aspect-square hover:shadow-lg transition-all duration-300"
            :class="getCategoryColorClass(category.slug)"
          >
            <!-- Category Icon -->
            <div class="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
              <Icon :name="getCategoryIcon(category.slug)" class="w-24 h-24 text-white" />
            </div>
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <!-- Content -->
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-semibold text-lg group-hover:translate-x-1 transition-transform">
                {{ category.name }}
              </h3>
              <p class="text-white/80 text-sm mt-1">
                {{ category.productCount }} {{ category.productCount === 1 ? 'product' : 'products' }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products Carousel -->
    <ShopFeaturedItems
      :items="featuredProducts"
      :loading="productsPending"
      title="Featured"
      highlight-text="Products"
      subtitle="Discover our handpicked selection of popular and trending products"
      view-all-link="/shop?category=featured-items"
      view-all-text="View All Products"
      :variant="featuredVariant"
      @retry="refreshProducts"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const schoolName = config.public.schoolName

// Hero section configuration - can be customized per theme
const heroConfig = computed(() => ({
  // Video background (takes priority if set)
  videoSrc: config.public.heroVideoSrc as string | undefined,
  // Image background (fallback if no video)
  imageSrc: config.public.heroImageSrc as string | undefined,
  // Gradient fallback (if no video or image)
  gradientClass: config.public.heroGradientClass as string || 'bg-gradient-to-r from-primary-600 to-primary-800',
  // Overlay opacity
  overlayClass: config.public.heroOverlayClass as string || 'bg-black/30',
  // Show scroll indicator
  showScrollIndicator: config.public.heroShowScrollIndicator === 'true',
}))

// Fetch categories from server API route
const { data: categoriesData } = await useFetch('/api/ecommerce/categories')
const categories = computed(() => (categoriesData.value as any)?.categories || [])

// Filter categories to show only those with products, limit to 8
const displayCategories = computed(() => {
  return categories.value
    .filter((c: any) => c.productCount > 0)
    .slice(0, 8)
})

// Fetch featured products (from Featured Items category or first products with images)
const { data: productsData, pending: productsPending, refresh: refreshProducts } = await useFetch('/api/ecommerce/products')

// Featured section variant based on theme
const { theme } = useTheme()
const featuredVariant = computed(() =>
  theme.value.id === 'windermere' ? 'dark' : 'light'
)

const featuredProducts = computed(() => {
  const products = (productsData.value as any)?.products || []

  // Try to get products from "Featured Items" category first
  const featuredCategoryProducts = products.filter(
    (p: any) => p.categoryName === 'Featured Items' || p.categoryId === 124
  )

  if (featuredCategoryProducts.length >= 4) {
    return featuredCategoryProducts.slice(0, 8)
  }

  // Fallback: Get products with images, prioritize variety
  const productsWithImages = products.filter((p: any) => p.image)

  // Shuffle and take first 8 for variety
  const shuffled = [...productsWithImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 8)
})

// Convert category name to URL-friendly slug for quick links
function getCategorySlug(categoryName: string): string {
  const name = categoryName.toLowerCase()

  // Map common category names to standardized slugs
  if (name.includes('uniform') || name.includes('apparel')) {
    return 'uniforms'
  } else if (name.includes('supplies')) {
    return 'supplies'
  } else if (name.includes('technology') || name.includes('equipment')) {
    return 'technology'
  } else if (name.includes('gift')) {
    return 'gift-cards'
  } else if (name.includes('featured')) {
    return 'featured'
  } else if (name.includes('spirit')) {
    return 'spirit'
  } else if (name.includes('pe') || name.includes('physical education') || name.includes('athletic')) {
    return 'pe'
  } else if (name.includes('cold') || name.includes('outerwear') || name.includes('jacket')) {
    return 'outerwear'
  } else if (name.includes('seasonal')) {
    return 'seasonal'
  } else if (name.includes('course') || name.includes('material')) {
    return 'course-materials'
  }

  // Default: create slug from name (lowercase, replace spaces/special chars with hyphens)
  return name.replace(/[&\s]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '')
}

// Category styling helpers
function getCategoryColorClass(slug: string): string {
  const colorMap: Record<string, string> = {
    'uniforms-apparel': 'bg-gradient-to-br from-blue-600 to-blue-800',
    'school-supplies': 'bg-gradient-to-br from-green-600 to-green-800',
    'course-materials': 'bg-gradient-to-br from-purple-600 to-purple-800',
    'technology': 'bg-gradient-to-br from-gray-700 to-gray-900',
    'gift-cards': 'bg-gradient-to-br from-amber-500 to-amber-700',
    'merchandise': 'bg-gradient-to-br from-red-600 to-red-800',
    'featured-items': 'bg-gradient-to-br from-primary-600 to-primary-800',
  }
  return colorMap[slug] || 'bg-gradient-to-br from-gray-600 to-gray-800'
}

function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'uniforms-apparel': 'heroicons:user-group',
    'school-supplies': 'heroicons:pencil',
    'course-materials': 'heroicons:book-open',
    'technology': 'heroicons:computer-desktop',
    'gift-cards': 'heroicons:gift',
    'merchandise': 'heroicons:shopping-bag',
    'featured-items': 'heroicons:star',
  }
  return iconMap[slug] || 'heroicons:cube'
}

// Page SEO
const { setPageSEO, setOrganizationSchema, setStoreSchema } = useSEO()

setPageSEO({
  title: 'Home',
  description: `Shop uniforms, supplies, and merchandise at ${schoolName}. Quality school products with secure checkout.`,
})

setOrganizationSchema()
setStoreSchema()
</script>
