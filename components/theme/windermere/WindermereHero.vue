<template>
  <section
    class="relative min-h-[600px] md:min-h-[700px] overflow-hidden"
    ref="heroRef"
  >
    <!-- Video Background -->
    <template v-if="videoSrc">
      <video
        ref="videoRef"
        :src="videoSrc"
        :poster="imageSrc"
        autoplay
        loop
        muted
        playsinline
        class="absolute inset-0 w-full h-full object-cover"
        :style="{ transform: `scale(${1 + parallaxOffset * 0.1})` }"
      >
        <source :src="videoSrc" type="video/mp4" />
      </video>
    </template>

    <!-- Image Background (fallback) -->
    <template v-else-if="imageSrc">
      <img
        :src="imageSrc"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover"
        :style="{ transform: `translateY(${parallaxOffset * 50}px) scale(${1 + parallaxOffset * 0.1})` }"
      />
    </template>

    <!-- Gradient Background (final fallback) -->
    <div
      v-if="!videoSrc && !imageSrc"
      class="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#152a45] to-[#0f1f33]"
    />

    <!-- Animated gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Animated circles -->
      <div
        class="absolute -top-20 -right-20 w-80 h-80 bg-[#c9a227]/10 rounded-full blur-3xl animate-pulse"
        :style="{ transform: `translate(${-parallaxOffset * 30}px, ${parallaxOffset * 20}px)` }"
      />
      <div
        class="absolute -bottom-40 -left-20 w-96 h-96 bg-[#1e3a5f]/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s;"
        :style="{ transform: `translate(${parallaxOffset * 30}px, ${-parallaxOffset * 20}px)` }"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 h-full flex items-center">
      <div
        class="max-w-2xl py-24"
        :style="{ transform: `translateY(${parallaxOffset * 30}px)`, opacity: 1 - parallaxOffset * 0.5 }"
      >
        <!-- Badge -->
        <div
          v-if="badge"
          class="inline-flex items-center px-3 py-1 mb-6 bg-[#c9a227]/20 text-[#c9a227] text-sm font-medium rounded-full backdrop-blur-sm border border-[#c9a227]/30"
        >
          <Icon name="heroicons:sparkles" class="w-4 h-4 mr-1.5" />
          {{ badge }}
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {{ title }}
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
          {{ subtitle }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            :to="ctaLink"
            class="inline-flex items-center px-8 py-4 bg-[#c9a227] text-[#1e3a5f] font-semibold rounded-lg hover:bg-[#d4af37] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {{ ctaText }}
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>

          <NuxtLink
            v-if="secondaryCtaLink"
            :to="secondaryCtaLink"
            class="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            {{ secondaryCtaText }}
            <Icon name="heroicons:play-circle" class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>

        <!-- Trust indicators -->
        <div class="mt-12 flex items-center gap-8 text-white/70">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:shield-check" class="w-5 h-5 text-[#c9a227]" />
            <span class="text-sm">Secure Checkout</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:truck" class="w-5 h-5 text-[#c9a227]" />
            <span class="text-sm">Free Shipping</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:arrow-path" class="w-5 h-5 text-[#c9a227]" />
            <span class="text-sm">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      v-if="showScrollIndicator"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      :style="{ opacity: 1 - parallaxOffset * 2 }"
    >
      <div class="flex flex-col items-center text-white/60 animate-bounce">
        <span class="text-xs uppercase tracking-wider mb-2">Scroll to explore</span>
        <Icon name="heroicons:chevron-down" class="w-6 h-6" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  videoSrc?: string
  imageSrc?: string
  title?: string
  subtitle?: string
  badge?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  showScrollIndicator?: boolean
}>(), {
  title: 'Welcome to Windermere School Store',
  subtitle: 'Shop uniforms, supplies, and everything you need for school success.',
  ctaText: 'Shop Now',
  ctaLink: '/shop',
  showScrollIndicator: true,
})

const heroRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const parallaxOffset = ref(0)

// Parallax scroll effect
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  const heroHeight = heroRef.value.offsetHeight

  // Calculate parallax offset (0 to 1 as hero scrolls out of view)
  if (rect.bottom > 0) {
    parallaxOffset.value = Math.max(0, Math.min(1, -rect.top / heroHeight))
  }
}
</script>
