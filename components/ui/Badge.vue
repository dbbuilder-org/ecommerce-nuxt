<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center font-semibold transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
        secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        error: 'bg-red-100 text-red-800 hover:bg-red-200',
        outline: 'bg-transparent border text-gray-700 hover:bg-gray-50',
        // Soft variants
        softSuccess: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 shadow-sm',
        softWarning: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 shadow-sm',
        softError: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 shadow-sm',
        softPrimary: 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-sm',
        softDefault: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 shadow-sm',
        // Glow variants
        glowSuccess: 'bg-green-500 text-white shadow-sm shadow-green-500/30',
        glowWarning: 'bg-yellow-500 text-white shadow-sm shadow-yellow-500/30',
        glowError: 'bg-red-500 text-white shadow-sm shadow-red-500/30',
        glowPrimary: 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md',
        md: 'px-2.5 py-1 text-sm rounded-lg',
        lg: 'px-3 py-1.5 text-base rounded-lg',
        pill: 'px-3 py-1 text-sm rounded-full'
      },
      dot: {
        true: 'pl-1.5',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      dot: false
    }
  }
)

type BadgeVariants = VariantProps<typeof badgeVariants>

interface Props {
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  dot?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  dot: false,
})

const badgeClasses = computed(() => {
  return cn(
    badgeVariants({
      variant: props.variant,
      size: props.size,
      dot: props.dot
    }),
    props.class
  )
})
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>
