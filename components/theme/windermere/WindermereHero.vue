<template>
  <section
    ref="heroRef"
    class="relative min-h-[600px] md:min-h-[700px] overflow-hidden"
    :style="heroStyle"
  >
    <!-- Image Background (primary) -->
    <template v-if="veneerConfig.assets.heroBackground">
      <img
        :src="veneerConfig.assets.heroBackground"
        :alt="veneerConfig.content.heroTitle"
        class="absolute inset-0 w-full h-full object-cover"
        :style="{ transform: `translateY(${parallaxOffset * 50}px) scale(${1 + parallaxOffset * 0.1})` }"
      />
    </template>

    <!-- Alternate Image Background (fallback) -->
    <template v-else-if="veneerConfig.assets.heroBackgroundAlt">
      <img
        :src="veneerConfig.assets.heroBackgroundAlt"
        :alt="veneerConfig.content.heroTitle"
        class="absolute inset-0 w-full h-full object-cover"
        :style="{ transform: `translateY(${parallaxOffset * 50}px) scale(${1 + parallaxOffset * 0.1})` }"
      />
    </template>

    <!-- Gradient Background (final fallback) -->
    <div
      v-if="!veneerConfig.assets.heroBackground && !veneerConfig.assets.heroBackgroundAlt"
      class="absolute inset-0"
      :style="{ background: `linear-gradient(to bottom right, ${veneerConfig.colors.primary}, ${veneerConfig.colors.primaryDark})` }"
    />

    <!-- Animated gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Animated circles using accent color -->
      <div
        class="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl animate-pulse"
        :style="{
          backgroundColor: veneerConfig.colors.accent + '1a',
          transform: `translate(${-parallaxOffset * 30}px, ${parallaxOffset * 20}px)`
        }"
      />
      <div
        class="absolute -bottom-40 -left-20 w-96 h-96 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s;"
        :style="{
          backgroundColor: veneerConfig.colors.primary + '33',
          transform: `translate(${parallaxOffset * 30}px, ${-parallaxOffset * 20}px)`
        }"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 h-full flex items-center">
      <div
        class="max-w-2xl py-24"
        :style="{ transform: `translateY(${parallaxOffset * 30}px)`, opacity: 1 - parallaxOffset * 0.5 }"
      >
        <!-- Badge / Subtitle -->
        <div
          v-if="veneerConfig.content.heroSubtitle"
          class="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full backdrop-blur-sm border"
          :style="{
            backgroundColor: veneerConfig.colors.accent + '33',
            color: veneerConfig.colors.accent,
            borderColor: veneerConfig.colors.accent + '4d'
          }"
        >
          <Icon name="heroicons:sparkles" class="w-4 h-4 mr-1.5" />
          {{ veneerConfig.content.heroSubtitle }}
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {{ veneerConfig.content.heroTitle }}
        </h1>

        <!-- Description -->
        <p class="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
          {{ veneerConfig.content.heroDescription }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center px-8 py-4 font-semibold rounded-lg transition-all duration-300"
            :style="{
              backgroundColor: veneerConfig.colors.accent,
              color: veneerConfig.colors.primary
            }"
          >
            {{ veneerConfig.content.ctaPrimary }}
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>

          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            {{ veneerConfig.content.ctaSecondary }}
            <Icon name="heroicons:user" class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>

        <!-- Trust Band -->
        <div class="mt-12 flex flex-wrap items-center gap-6 md:gap-8 text-white/70">
          <div class="flex items-center gap-2">
            <Icon
              name="heroicons:shield-check"
              class="w-5 h-5"
              :style="{ color: veneerConfig.colors.accent }"
            />
            <span class="text-sm">{{ veneerConfig.content.trustBand.secure }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              name="heroicons:truck"
              class="w-5 h-5"
              :style="{ color: veneerConfig.colors.accent }"
            />
            <span class="text-sm">{{ veneerConfig.content.trustBand.fast }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              name="heroicons:user-plus"
              class="w-5 h-5"
              :style="{ color: veneerConfig.colors.accent }"
            />
            <span class="text-sm">{{ veneerConfig.content.trustBand.guest }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      v-if="veneerConfig.features.scrollEffects"
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
import { windermereVeneerConfig } from '~/config/themes/windermere/veneer'

// Use veneer config for all data
const veneerConfig = windermereVeneerConfig

// Refs
const heroRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const parallaxOffset = ref(0)

// Computed styles using veneer colors
const heroStyle = computed(() => ({
  '--hero-primary': veneerConfig.colors.primary,
  '--hero-accent': veneerConfig.colors.accent,
}))

// Parallax scroll effect (only if enabled in features)
onMounted(() => {
  if (veneerConfig.features.scrollEffects) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (veneerConfig.features.scrollEffects) {
    window.removeEventListener('scroll', handleScroll)
  }
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
