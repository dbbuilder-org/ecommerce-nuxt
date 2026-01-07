<template>
  <section
    :class="[
      'relative overflow-hidden',
      containerClass
    ]"
  >
    <!-- Video Background -->
    <template v-if="hasVideo">
      <video
        ref="videoRef"
        :src="videoSrc"
        :poster="imageSrc"
        autoplay
        loop
        muted
        playsinline
        class="absolute inset-0 w-full h-full object-cover"
        @loadeddata="videoLoaded = true"
      >
        <source :src="videoSrc" :type="videoMimeType" />
      </video>
    </template>

    <!-- Image Background -->
    <template v-else-if="imageSrc">
      <img
        :src="imageSrc"
        :alt="imageAlt"
        loading="eager"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </template>

    <!-- Gradient Background (fallback or overlay base) -->
    <div
      v-if="!hasVideo && !imageSrc"
      :class="[
        'absolute inset-0',
        gradientClass || 'bg-gradient-to-r from-primary-600 to-primary-800'
      ]"
    />

    <!-- Overlay -->
    <div
      :class="[
        'absolute inset-0',
        overlayClass || 'bg-black/40'
      ]"
    />

    <!-- Content -->
    <div
      :class="[
        'relative z-10',
        contentClass || 'container mx-auto px-4 py-16 md:py-24'
      ]"
    >
      <div :class="textContainerClass || 'max-w-3xl'">
        <!-- Title -->
        <h1
          v-if="title"
          :class="[
            'font-bold mb-4',
            titleClass || 'text-4xl md:text-5xl text-white'
          ]"
        >
          {{ title }}
        </h1>

        <!-- Subtitle -->
        <p
          v-if="subtitle"
          :class="[
            'mb-8',
            subtitleClass || 'text-xl md:text-2xl text-white/90'
          ]"
        >
          {{ subtitle }}
        </p>

        <!-- CTA Button -->
        <NuxtLink
          v-if="ctaLink"
          :to="ctaLink"
          :class="[
            'inline-flex items-center transition-colors',
            ctaClass || 'px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50'
          ]"
        >
          {{ ctaText || 'Learn More' }}
          <Icon v-if="showCtaIcon" name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
        </NuxtLink>

        <!-- Custom slot for additional content -->
        <slot />
      </div>
    </div>

    <!-- Scroll Indicator (optional) -->
    <div
      v-if="showScrollIndicator"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce"
    >
      <Icon name="heroicons:chevron-down" class="w-8 h-8 text-white/80" />
    </div>

    <!-- Video Loading Indicator -->
    <div
      v-if="hasVideo && !videoLoaded"
      class="absolute inset-0 bg-gray-900 flex items-center justify-center z-5"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Video MIME type mappings
const VIDEO_MIME_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
}

const props = withDefaults(defineProps<{
  // Background options
  videoSrc?: string
  imageSrc?: string
  imageAlt?: string
  gradientClass?: string
  overlayClass?: string

  // Content options
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  showCtaIcon?: boolean
  showScrollIndicator?: boolean

  // Styling classes
  containerClass?: string
  contentClass?: string
  textContainerClass?: string
  titleClass?: string
  subtitleClass?: string
  ctaClass?: string
}>(), {
  imageAlt: 'Hero background',
  showCtaIcon: true,
  showScrollIndicator: false,
  containerClass: 'min-h-[400px] md:min-h-[500px]',
})

const videoRef = ref<HTMLVideoElement | null>(null)
const videoLoaded = ref(false)

// Check if video is provided
const hasVideo = computed(() => !!props.videoSrc)

// Get MIME type for video
const videoMimeType = computed(() => {
  if (!props.videoSrc) return 'video/mp4'
  const cleanUrl = props.videoSrc.split('?')[0].split('#')[0]
  const lastDot = cleanUrl.lastIndexOf('.')
  if (lastDot === -1) return 'video/mp4'
  const ext = cleanUrl.substring(lastDot + 1).toLowerCase()
  return VIDEO_MIME_TYPES[ext] || 'video/mp4'
})

// Expose video control methods
defineExpose({
  videoRef,
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
})
</script>
