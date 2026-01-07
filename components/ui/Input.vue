<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const inputVariants = cva(
  'w-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white/90 backdrop-blur-sm shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-gray-900 placeholder-gray-400',
  {
    variants: {
      variant: {
        default: 'border border-primary-200/40 focus:border-primary-300/60 focus:ring-2 focus:ring-primary-500/20',
        error: 'border border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20',
        success: 'border border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-500/20',
      },
      size: {
        sm: 'px-3 py-2.5 text-base rounded-xl min-h-[44px]',
        md: 'px-4 py-3 text-base rounded-2xl min-h-[44px]',
        lg: 'px-6 py-4 text-base sm:text-lg rounded-2xl min-h-[48px]',
      },
      hasIcon: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      { size: 'sm', hasIcon: true, class: 'pl-10' },
      { size: 'md', hasIcon: true, class: 'pl-12' },
      { size: 'lg', hasIcon: true, class: 'pl-14' }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasIcon: false
    }
  }
)

type InputVariants = VariantProps<typeof inputVariants>

interface Props {
  id?: string
  type?: string
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  placeholder: '',
  disabled: false,
  required: false,
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const slots = defineSlots<{
  icon?(): any
  suffix?(): any
}>()

const hasIcon = computed(() => !!slots.icon)

const inputClasses = computed(() => {
  return cn(
    inputVariants({
      variant: props.variant,
      size: props.size,
      hasIcon: hasIcon.value
    }),
    props.class
  )
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <!-- Icon (left) -->
    <div v-if="slots.icon" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <slot name="icon" />
    </div>

    <!-- Input Element -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :class="inputClasses"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >

    <!-- Suffix Icon (right) -->
    <div v-if="slots.suffix" class="absolute inset-y-0 right-0 pr-4 flex items-center">
      <slot name="suffix" />
    </div>
  </div>
</template>
