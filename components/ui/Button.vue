<script setup lang="ts">
/**
 * Button Component - Flat Design System (2026)
 *
 * Design principles:
 * - No shadows, gradients, or transforms in default state
 * - Color changes on hover (not elevation)
 * - 44px minimum touch targets
 * - Strong focus-visible states for accessibility
 * - Uses CSS variables for theming
 */
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const buttonVariants = cva(
  // Base styles - flat design, no transforms, appearance-none removes browser 3D styling
  'inline-flex items-center justify-center font-semibold appearance-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // =============================================
        // CENTRALIZED FLAT BUTTON SYSTEM (2026)
        // All buttons should use these variants
        // No shadows, gradients, or transforms
        // =============================================

        // PRIMARY - Main call-to-action (Add to Cart, Submit, etc.)
        // Uses --primary-action-bg for contrast (dark navy on Windermere vs teal accent)
        primary: 'bg-[--primary-action-bg] text-white hover:bg-[--primary-action-bg-hover] focus-visible:ring-[--primary-action-bg]',

        // SECONDARY - Outlined, less emphasis
        secondary: 'bg-transparent text-[--button-color] border-2 border-[--button-color] hover:bg-[--button-color] hover:text-white focus-visible:ring-[--button-color]',

        // OUTLINE - Subtle outline, minimal
        outline: 'bg-transparent text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus-visible:ring-gray-400',

        // GHOST - No border, just hover background
        ghost: 'bg-transparent text-gray-700 hover:bg-black/5 focus-visible:ring-gray-400',

        // HEADER - For header actions (cart, login, menu)
        header: 'bg-transparent text-gray-600 border border-transparent hover:bg-black/[0.04] hover:border-black/[0.08] focus-visible:ring-[--button-color]',

        // DANGER - Destructive actions (remove, delete)
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',

        // DANGER-GHOST - Subtle destructive (remove from cart)
        dangerGhost: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 focus-visible:ring-red-500',

        // SUCCESS - Confirmations
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',

        // QUANTITY - For +/- stepper buttons
        quantity: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-[--button-color]',

        // QUANTITY-MINUS - Decrease with red hint
        quantityMinus: 'bg-white text-gray-700 border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 focus-visible:ring-red-500',

        // QUANTITY-PLUS - Increase with green hint
        quantityPlus: 'bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600 focus-visible:ring-green-500',

        // PILL - Category/filter pills
        pill: 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-full focus-visible:ring-[--button-color]',

        // PILL-ACTIVE - Selected pill state
        pillActive: 'bg-[--button-color] text-white border border-[--button-color] rounded-full focus-visible:ring-[--button-color]',

        // LINK - Text-only button that looks like a link
        link: 'bg-transparent text-[--button-color] hover:underline underline-offset-4 focus-visible:ring-[--button-color]',

        // SOFT - Subtle background, low emphasis
        soft: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-400',

        // =============================================
        // LEGACY ALIASES (map to new variants)
        // For backwards compatibility with existing code
        // =============================================
        solid: 'bg-[--primary-action-bg] text-white hover:bg-[--primary-action-bg-hover] focus-visible:ring-[--primary-action-bg]',
        headerAction: 'bg-transparent text-gray-600 border border-transparent hover:bg-black/[0.04] hover:border-black/[0.08] focus-visible:ring-[--button-color]',
        themedSecondary: 'bg-transparent text-[--button-color] border-2 border-[--button-color] hover:bg-[--button-color] hover:text-white focus-visible:ring-[--button-color]',
        themedGhost: 'bg-transparent text-gray-700 hover:bg-black/5 focus-visible:ring-gray-400',
        themedDanger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        themedSuccess: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',

        // GLASS - For overlays and dark backgrounds
        glass: 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 focus-visible:ring-white/50',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm rounded-lg min-h-[36px]',
        md: 'px-4 py-2.5 text-sm rounded-lg min-h-[44px]',
        lg: 'px-6 py-3 text-base rounded-lg min-h-[48px]',
        icon: 'h-11 w-11 rounded-lg',
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

// List of all valid variants for prop validation
const VALID_VARIANTS = [
  // Core variants
  'primary', 'secondary', 'outline', 'ghost', 'header', 'link', 'soft',
  'danger', 'dangerGhost', 'success',
  'quantity', 'quantityMinus', 'quantityPlus',
  'pill', 'pillActive',
  // Legacy aliases
  'solid', 'headerAction', 'themedSecondary', 'themedGhost', 'themedDanger', 'themedSuccess',
  'destructive', 'glass'
] as const

type ValidVariant = typeof VALID_VARIANTS[number]

interface Props {
  variant?: ValidVariant
  size?: 'sm' | 'md' | 'lg' | 'icon'
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
      variant: props.variant as ButtonVariants['variant'],
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

<style scoped>
/* Ensure flat styling across all browsers */
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-shadow: none;
}
</style>
