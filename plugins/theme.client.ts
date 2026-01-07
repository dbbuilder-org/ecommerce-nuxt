// Theme initialization plugin (client-side only)
// Initializes multi-tenant theming on app load

export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore()

  // Initialize theme on app load
  themeStore.initializeTheme()

  // Apply CSS variables immediately
  themeStore.applyCSSVariables()
})
