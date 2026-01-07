<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-105 duration-300',
        secondary: 'bg-white text-primary-600 border border-primary-200/40 hover:border-primary-300/60 hover:bg-primary-50/30 focus:ring-primary-500 shadow-md hover:shadow-lg duration-300',
        outline: 'bg-transparent text-primary-600 border border-primary-200/40 hover:border-primary-300/60 hover:bg-primary-50/30 focus:ring-primary-500 duration-300',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 duration-300',
        link: 'bg-transparent text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500 duration-300',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:scale-105 duration-300',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg transform hover:scale-105 duration-300',
        // Soft variants
        soft: 'bg-gray-100/80 backdrop-blur-sm text-gray-700 shadow-soft-sm hover:shadow-soft hover:bg-gray-200/90 hover:-translate-y-0.5 duration-200',
        softPrimary: 'bg-primary-50/80 backdrop-blur-sm text-primary-700 shadow-soft-sm hover:shadow-soft hover:bg-primary-100/90 hover:-translate-y-0.5 duration-200',
        // Glass variant
        glass: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-soft hover:bg-white/30 hover:-translate-y-0.5 duration-200',
      },
      size: {
        sm: 'px-4 py-2 text-sm rounded-xl',
        md: 'px-6 py-3 text-base rounded-2xl',
        lg: 'px-8 py-4 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-2xl',
      },
      fullWidth: {
        true: 'w-full',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false
    },
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  type?: 'button' | 'submit' | 'reset'
  to?: string | object
  href?: string
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconPosition?: 'left' | 'right'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconPosition: 'left',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = defineSlots<{
  default(): any
  icon?(): any
}>()

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const buttonClasses = computed(() => {
  return cn(
    buttonVariants({
      variant: props.variant,
      size: props.size,
      fullWidth: props.fullWidth
    }),
    props.class
  )
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="to || undefined"
    :href="href || undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Icon (left) -->
    <span v-if="slots.icon && iconPosition === 'left'" class="mr-2">
      <slot name="icon" />
    </span>

    <!-- Button Content -->
    <slot />

    <!-- Icon (right) -->
    <span v-if="slots.icon && iconPosition === 'right'" class="ml-2">
      <slot name="icon" />
    </span>
  </component>
</template>
