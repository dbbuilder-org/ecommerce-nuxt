<template>
  <section
    class="relative min-h-[450px] md:min-h-[500px] overflow-hidden"
    :class="heroClass"
  >
    <!-- Background image if provided -->
    <template v-if="imageUrl">
      <img
        :src="imageUrl"
        :alt="title || 'Hero'"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </template>

    <!-- Gradient background fallback -->
    <div
      v-if="!imageUrl"
      class="absolute inset-0 bg-gradient-to-r from-[var(--header-color)] to-[var(--header-hover)]"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/30" />

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 h-full flex items-center">
      <div class="max-w-2xl py-16 md:py-20">
        <!-- Subtitle badge -->
        <div
          v-if="subtitle"
          class="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-white/20 text-white backdrop-blur-sm"
        >
          {{ subtitle }}
        </div>

        <!-- Title -->
        <h1 v-if="title" class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {{ title }}
        </h1>

        <!-- Description -->
        <p v-if="description" class="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
          {{ description }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            v-if="ctaPrimary"
            :to="ctaLink || '/shop'"
            class="inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 bg-white text-[var(--header-color)] hover:bg-gray-100"
          >
            {{ ctaPrimary }}
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>

          <NuxtLink
            v-if="ctaSecondary"
            to="/auth/login"
            class="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30"
          >
            {{ ctaSecondary }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HeroSection - Base hero component for landing pages
 *
 * This is the default hero section used when no theme-specific
 * override is provided. It uses CSS variables for theming.
 *
 * For theme-specific heroes, see:
 * - components/theme/windermere/WindermereHero.vue
 * - components/theme/westmoreland/WestmorelandHero.vue
 */

interface Props {
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  ctaPrimary?: string
  ctaSecondary?: string
  ctaLink?: string
  heroClass?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Welcome',
  subtitle: '',
  description: '',
  imageUrl: '',
  ctaPrimary: 'Shop Now',
  ctaSecondary: '',
  ctaLink: '/shop',
  heroClass: '',
})
</script>

<style scoped>
/* Default hero styling - can be overridden via heroClass prop */
</style>
