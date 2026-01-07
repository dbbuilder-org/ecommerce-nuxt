<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const cardVariants = cva(
  'bg-white h-full flex flex-col transition-all',
  {
    variants: {
      variant: {
        default: 'border border-gray-200 transition-shadow duration-300',
        elevated: 'shadow-md hover:shadow-lg transition-shadow duration-300',
        outlined: 'border-2 border-primary-200 transition-shadow duration-300',
        flat: 'border-none transition-shadow duration-300',
        soft: 'shadow-soft hover:shadow-soft-lg border-0 bg-gradient-surface transition-all duration-300',
        softElevated: 'shadow-soft-lg hover:shadow-soft-xl border-0 bg-gradient-surface transition-all duration-300',
        glass: 'bg-white/80 backdrop-blur-lg border border-white/50 shadow-soft-lg transition-all duration-300'
      },
      size: {
        sm: 'rounded-xl',
        md: 'rounded-2xl',
        lg: 'rounded-3xl'
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-1 transform transition-all duration-300',
        false: ''
      }
    },
    compoundVariants: [
      {
        variant: 'soft',
        interactive: true,
        class: 'hover:shadow-soft-lg'
      },
      {
        variant: 'softElevated',
        interactive: true,
        class: 'hover:shadow-soft-xl'
      },
      {
        variant: 'elevated',
        interactive: true,
        class: 'hover:shadow-lg hover:scale-[1.02]'
      }
    ],
    defaultVariants: {
      variant: 'elevated',
      size: 'md',
      padding: 'md',
      interactive: false
    }
  }
)

type CardVariants = VariantProps<typeof cardVariants>

interface Props {
  variant?: CardVariants['variant']
  size?: CardVariants['size']
  padding?: CardVariants['padding']
  interactive?: boolean
  headerClass?: string
  contentClass?: string
  footerClass?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  size: 'md',
  padding: 'md',
  interactive: false,
  headerClass: '',
  contentClass: '',
  footerClass: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = defineSlots<{
  default(): any
  header?(): any
  footer?(): any
}>()

const cardClasses = computed(() => {
  return cn(
    cardVariants({
      variant: props.variant,
      size: props.size,
      padding: props.padding,
      interactive: props.interactive
    }),
    props.class
  )
})

const headerClasses = computed(() => {
  const basePadding = props.padding === 'md' ? 'px-6 py-4' : props.padding === 'lg' ? 'px-8 py-6' : 'px-4 py-3'
  return cn(
    'border-b border-gray-200',
    basePadding,
    props.headerClass
  )
})

const contentClasses = computed(() => cn(props.contentClass))

const footerClasses = computed(() => {
  const basePadding = props.padding === 'md' ? 'px-6 py-4' : props.padding === 'lg' ? 'px-8 py-6' : 'px-4 py-3'
  return cn(
    'border-t border-gray-200',
    basePadding,
    props.footerClass
  )
})

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- Card Header -->
    <div v-if="slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <!-- Card Content -->
    <div :class="contentClasses" class="flex-grow flex flex-col">
      <slot />
    </div>

    <!-- Card Footer -->
    <div v-if="slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>
