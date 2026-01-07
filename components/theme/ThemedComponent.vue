<template>
  <component
    :is="resolvedComponent"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * ThemedComponent - Dynamic component loader for veneer system
 * Automatically loads theme-specific component overrides when available
 *
 * Usage:
 * <ThemedComponent name="Header" />
 *
 * This will render:
 * - WindermereHeader if theme is windermere and override exists
 * - Header for all other themes
 */

const props = defineProps<{
  name: string
  fallback?: string
}>()

const { hasComponentOverride, getComponentOverride } = useTheme()

// Resolve which component to use
const resolvedComponent = computed(() => {
  // Check if theme has an override for this component
  if (hasComponentOverride(props.name)) {
    const override = getComponentOverride(props.name)
    // Return the override component name
    // Nuxt auto-imports components, so we can use resolveComponent
    return override
  }

  // Use fallback or original component name
  return props.fallback || props.name
})
</script>
