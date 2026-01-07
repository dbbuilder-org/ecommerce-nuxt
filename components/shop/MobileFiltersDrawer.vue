<template>
  <div>
    <!-- Mobile Filter Button (shown on small screens) -->
    <button
      @click="isOpen = true"
      class="lg:hidden flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
    >
      <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5" />
      Filters
      <span
        v-if="activeFilterCount > 0"
        class="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ activeFilterCount }}
      </span>
    </button>

    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="isOpen = false"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        aria-hidden="true"
      />
    </Transition>

    <!-- Drawer Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed inset-y-0 left-0 w-full max-w-xs bg-white z-50 shadow-xl lg:hidden overflow-y-auto safe-area-inset-top safe-area-inset-bottom"
      >
        <!-- Drawer Header -->
        <div class="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between z-10">
          <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            @click="isOpen = false"
            class="p-2 -mr-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 touch-target"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Filter Content -->
        <div class="p-4">
          <slot />
        </div>

        <!-- Apply Button -->
        <div class="sticky bottom-0 bg-white border-t p-4 safe-area-inset-bottom">
          <button
            @click="isOpen = false"
            class="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors touch-target"
          >
            Show Results
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeFilterCount?: number
}>()

const isOpen = ref(false)

// Close drawer on route change
const route = useRoute()
watch(() => route.fullPath, () => {
  isOpen.value = false
})

// Prevent body scroll when drawer is open
watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Touch target minimum size for accessibility */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* iOS safe area support */
.safe-area-inset-top {
  padding-top: env(safe-area-inset-top, 0px);
}

.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
