<template>
  <section
    ref="heroRef"
    class="relative min-h-[500px] md:min-h-[550px] overflow-hidden"
    :style="heroStyle"
  >
    <!-- Image Background -->
    <template v-if="veneerConfig.assets.heroImage">
      <img
        :src="veneerConfig.assets.heroImage"
        :alt="veneerConfig.content.heroTitle"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </template>

    <!-- Gradient Background (fallback) -->
    <div
      v-else
      class="absolute inset-0"
      :style="{ background: `linear-gradient(to right, ${veneerConfig.colors.primary}, ${veneerConfig.colors.primaryDark})` }"
    />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#035891]/90 via-[#035891]/70 to-[#024572]/50" />

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 h-full flex items-center">
      <div class="max-w-2xl py-16 md:py-20">
        <!-- Badge / Subtitle -->
        <div
          v-if="veneerConfig.content.heroSubtitle"
          class="inline-flex items-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-white/20 text-white backdrop-blur-sm"
        >
          <Icon name="heroicons:academic-cap" class="w-4 h-4 mr-2" />
          {{ veneerConfig.content.heroSubtitle }}
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {{ veneerConfig.content.heroTitle }}
        </h1>

        <!-- Description -->
        <p class="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
          {{ veneerConfig.content.heroDescription }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 bg-white text-[#035891] hover:bg-gray-100"
          >
            {{ veneerConfig.content.ctaPrimary }}
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>

          <NuxtLink
            to="/course-materials"
            class="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30"
          >
            {{ veneerConfig.content.ctaSecondary }}
            <Icon name="heroicons:book-open" class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>

        <!-- Trust Band - Pickup focused -->
        <div class="mt-10 flex flex-wrap items-center gap-6 md:gap-8 text-white/80">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:map-pin" class="w-5 h-5 text-white" />
            <span class="text-sm">{{ veneerConfig.content.trustBand.pickup }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:check-badge" class="w-5 h-5 text-white" />
            <span class="text-sm">{{ veneerConfig.content.trustBand.quality }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:user-group" class="w-5 h-5 text-white" />
            <span class="text-sm">{{ veneerConfig.content.trustBand.support }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative wave -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg
        class="w-full h-16 md:h-24"
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 50C240 90 480 100 720 90C960 80 1200 50 1440 30V100H0V50Z"
          fill="white"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { westmorelandVeneerConfig } from '~/config/themes/westmoreland/veneer'

// Use veneer config for all data
const veneerConfig = westmorelandVeneerConfig

// Refs
const heroRef = ref<HTMLElement | null>(null)

// Computed styles
const heroStyle = computed(() => ({
  '--hero-primary': veneerConfig.colors.primary,
  '--hero-accent': veneerConfig.colors.accent,
}))
</script>

<style scoped>
/* Westmoreland Hero - Clean, professional style */
</style>
