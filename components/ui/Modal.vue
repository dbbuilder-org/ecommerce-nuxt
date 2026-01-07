<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const modalVariants = cva(
  'relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 w-full mx-4 transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'max-w-sm p-6 sm:p-8',
        md: 'max-w-md p-6 sm:p-10',
        lg: 'max-w-2xl p-6 sm:p-10',
        xl: 'max-w-4xl p-8 sm:p-12',
        full: 'max-w-7xl p-8 sm:p-12'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

type ModalVariants = VariantProps<typeof modalVariants>

interface Props {
  show: boolean
  size?: ModalVariants['size']
  title?: string
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showDecorations?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  showDecorations: true,
})

const emit = defineEmits<{
  close: []
  'update:show': [value: boolean]
}>()

const slots = defineSlots<{
  default(): any
  header?(): any
  icon?(): any
  footer?(): any
}>()

const modalClasses = computed(() => {
  return cn(
    modalVariants({ size: props.size }),
    props.class
  )
})

function close() {
  emit('close')
  emit('update:show', false)
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.show) {
    close()
  }
}

function lockBodyScroll() {
  if (import.meta.client) {
    document.body.style.overflow = 'hidden'
  }
}

function unlockBodyScroll() {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    lockBodyScroll()
    if (props.closeOnEscape && import.meta.client) {
      document.addEventListener('keydown', handleEscape)
    }
  } else {
    unlockBodyScroll()
    if (props.closeOnEscape && import.meta.client) {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})

onMounted(() => {
  if (props.show) {
    lockBodyScroll()
    if (props.closeOnEscape) {
      document.addEventListener('keydown', handleEscape)
    }
  }
})

onUnmounted(() => {
  unlockBodyScroll()
  if (props.closeOnEscape && import.meta.client) {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-50 overflow-hidden">
        <!-- Overlay with backdrop blur -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          @click="handleBackdropClick"
        />

        <!-- Modal Container -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div
            :class="modalClasses"
            @click.stop
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
          >
            <!-- Decorative Background Elements -->
            <div v-if="showDecorations" class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div class="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <!-- Modal Header -->
            <div v-if="slots.header || title" class="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <!-- Optional Icon Slot -->
                <div v-if="slots.icon" class="modal-icon w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                  <slot name="icon" />
                </div>

                <!-- Title -->
                <h2 v-if="title" id="modal-title" class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ title }}
                </h2>

                <!-- Custom Header Slot -->
                <slot name="header" />
              </div>

              <!-- Close Button -->
              <button
                v-if="showClose"
                @click="close"
                class="group w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0"
                aria-label="Close modal"
              >
                <svg
                  class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="relative z-10">
              <slot />
            </div>

            <!-- Modal Footer -->
            <div v-if="slots.footer" class="relative z-10 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active [role="dialog"],
.modal-fade-leave-active [role="dialog"] {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from [role="dialog"],
.modal-fade-leave-to [role="dialog"] {
  transform: scale(0.95);
  opacity: 0;
}
</style>
