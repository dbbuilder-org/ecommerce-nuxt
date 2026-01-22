<script setup lang="ts">
/**
 * ThemedComponent - Veneer System Wrapper
 *
 * This component dynamically loads the appropriate themed version of a component
 * based on the current theme. It handles async loading, error states, and prop passing.
 *
 * Usage:
 * <ThemedComponent name="Header" :some-prop="value" />
 *
 * The component will:
 * 1. Check if the current theme has an override for "Header"
 * 2. If yes, load the themed component (e.g., WindermereHeader)
 * 3. If no, load the base component (e.g., Header)
 * 4. Pass all props/attrs to the loaded component
 */
import { computed, defineAsyncComponent, h, defineComponent, type Component } from 'vue'
import { useThemeStore } from '~/stores/theme'
import { getThemedComponentLoader, hasThemeOverride } from '~/utils/veneer/componentRegistry'

const props = defineProps<{
  /**
   * The base component name to render (e.g., 'Header', 'HeroSection')
   */
  name: string

  /**
   * Optional override theme ID (defaults to current theme)
   */
  theme?: string

  /**
   * Fallback component name if the requested component isn't in the registry
   */
  fallback?: string
}>()

const themeStore = useThemeStore()

// Initialize theme on mount
onMounted(() => {
  themeStore.initializeTheme()
})

// Get the current theme ID (prop override or store)
const currentThemeId = computed(() => props.theme || themeStore.currentThemeId)

// Check if using a themed override
const isUsingOverride = computed(() =>
  hasThemeOverride(props.name, currentThemeId.value)
)

// Loading placeholder component
const LoadingPlaceholder = defineComponent({
  name: 'LoadingPlaceholder',
  render() {
    return h('div', {
      class: 'animate-pulse bg-gray-100 rounded min-h-[50px]',
      'aria-label': 'Loading...',
    })
  },
})

// Error placeholder component
const ErrorPlaceholder = defineComponent({
  name: 'ErrorPlaceholder',
  props: {
    error: { type: Error, default: null },
  },
  render() {
    return h('div', {
      class: 'p-4 border border-red-200 bg-red-50 rounded text-red-600 text-sm',
    }, [
      h('p', { class: 'font-semibold' }, 'Failed to load component'),
      this.error && h('p', { class: 'text-xs mt-1' }, String(this.error.message)),
    ])
  },
})

// Resolve the async component
const resolvedComponent = computed<Component | null>(() => {
  const loader = getThemedComponentLoader(props.name, currentThemeId.value)

  if (!loader) {
    // If no loader found and fallback provided, try to use fallback
    if (props.fallback) {
      return resolveComponent(props.fallback) as Component
    }
    console.warn(`[ThemedComponent] No component found for "${props.name}"`)
    return null
  }

  return defineAsyncComponent({
    loader,
    loadingComponent: LoadingPlaceholder,
    errorComponent: ErrorPlaceholder,
    delay: 100,
    timeout: 15000,
    onError(error, retry, fail) {
      console.error(`[ThemedComponent] Failed to load "${props.name}":`, error)
      fail()
    },
  })
})

// Get all other attrs to pass through
const attrs = useAttrs()
</script>

<template>
  <component
    v-if="resolvedComponent"
    :is="resolvedComponent"
    v-bind="attrs"
  >
    <slot />
    <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData || {}" />
    </template>
  </component>
  <div v-else class="themed-component-not-found p-4 border border-dashed border-gray-300 rounded text-center text-gray-500 text-sm">
    Component "{{ name }}" not found in registry
  </div>
</template>
