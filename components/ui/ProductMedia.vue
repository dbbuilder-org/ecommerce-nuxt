<template>
  <div
    :class="[
      'relative overflow-hidden',
      containerClass
    ]"
  >
    <!-- Video Player -->
    <template v-if="isVideoMedia">
      <video
        ref="videoRef"
        :src="src"
        :poster="poster"
        :autoplay="autoplay"
        :loop="loop"
        :muted="muted"
        :controls="showControls && isPlaying"
        playsinline
        :class="[
          'w-full h-full object-cover',
          mediaClass
        ]"
        @loadedmetadata="handleVideoLoaded"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @error="handleError"
      >
        <source :src="src" :type="mimeType" />
        Your browser does not support the video tag.
      </video>

      <!-- Play Overlay (when not playing and not autoplay) -->
      <div
        v-if="showPlayOverlay && !isPlaying && !autoplay"
        class="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity hover:bg-black/40"
        @click="playVideo"
      >
        <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
          <Icon name="heroicons:play-solid" class="w-8 h-8 text-gray-900 ml-1" />
        </div>
      </div>

      <!-- Pause Overlay (when playing, shown on hover) -->
      <div
        v-if="isPlaying && !autoplay && allowPause"
        class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        @click="pauseVideo"
      >
        <div class="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
          <Icon name="heroicons:pause-solid" class="w-6 h-6 text-white" />
        </div>
      </div>

      <!-- Video Badge -->
      <div
        v-if="showVideoBadge"
        class="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center gap-1"
      >
        <Icon name="heroicons:video-camera" class="w-3 h-3" />
        Video
      </div>
    </template>

    <!-- Image -->
    <template v-else>
      <img
        v-if="src && !hasError"
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        :decoding="lazy ? 'async' : 'sync'"
        :class="[
          'w-full h-full object-cover',
          mediaClass
        ]"
        @error="handleError"
        @load="handleImageLoaded"
      />

      <!-- Fallback Placeholder -->
      <div
        v-else
        :class="[
          'w-full h-full flex items-center justify-center bg-gray-100',
          fallbackClass
        ]"
      >
        <Icon
          :name="isVideoMedia ? 'heroicons:video-camera' : 'heroicons:photo'"
          class="w-16 h-16 text-gray-300"
        />
      </div>
    </template>

    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-gray-100"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Slot for overlay content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// Video MIME type mappings
const VIDEO_MIME_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  wmv: 'video/x-ms-wmv',
  mkv: 'video/x-matroska',
  flv: 'video/x-flv',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
}

const VIDEO_EXTENSIONS = Object.keys(VIDEO_MIME_TYPES)

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  poster?: string
  isVideo?: boolean | null
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  showControls?: boolean
  showPlayOverlay?: boolean
  showVideoBadge?: boolean
  allowPause?: boolean
  lazy?: boolean
  containerClass?: string
  mediaClass?: string
  fallbackClass?: string
}>(), {
  alt: 'Product image',
  isVideo: null,
  autoplay: false,
  loop: false,
  muted: true,
  showControls: true,
  showPlayOverlay: true,
  showVideoBadge: true,
  allowPause: true,
  lazy: true,
  containerClass: '',
  mediaClass: '',
  fallbackClass: '',
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  load: []
  error: [error: Event]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isLoading = ref(true)
const hasError = ref(false)

// Determine if media is video (auto-detect or explicit)
const isVideoMedia = computed(() => {
  if (props.isVideo !== null) {
    return props.isVideo
  }
  return isVideoExtension(props.src)
})

// Get MIME type for video
const mimeType = computed(() => {
  if (!props.src) return 'video/mp4'
  const ext = getFileExtension(props.src).toLowerCase()
  return VIDEO_MIME_TYPES[ext] || 'video/mp4'
})

// Check if URL has video extension
function isVideoExtension(url?: string): boolean {
  if (!url) return false
  const ext = getFileExtension(url).toLowerCase()
  return VIDEO_EXTENSIONS.includes(ext)
}

// Extract file extension from URL
function getFileExtension(url: string): string {
  const cleanUrl = url.split('?')[0].split('#')[0]
  const lastDot = cleanUrl.lastIndexOf('.')
  if (lastDot === -1) return ''
  return cleanUrl.substring(lastDot + 1)
}

// Video controls
function playVideo() {
  if (videoRef.value) {
    videoRef.value.play()
  }
}

function pauseVideo() {
  if (videoRef.value) {
    videoRef.value.pause()
  }
}

function togglePlayback() {
  if (isPlaying.value) {
    pauseVideo()
  } else {
    playVideo()
  }
}

// Event handlers
function handleVideoLoaded() {
  isLoading.value = false
  emit('load')
}

function handleImageLoaded() {
  isLoading.value = false
  emit('load')
}

function handlePlay() {
  isPlaying.value = true
  emit('play')
}

function handlePause() {
  isPlaying.value = false
  emit('pause')
}

function handleEnded() {
  isPlaying.value = false
  emit('ended')
}

function handleError(event: Event) {
  isLoading.value = false
  hasError.value = true
  emit('error', event)
}

// Start loading state
onMounted(() => {
  if (!props.src) {
    isLoading.value = false
    hasError.value = true
  }
})

// Expose methods for parent components
defineExpose({
  playVideo,
  pauseVideo,
  togglePlayback,
  isPlaying,
  videoRef,
})
</script>
