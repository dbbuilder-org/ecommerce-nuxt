// Auth middleware for protected routes
// Redirects unauthenticated users to login

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Save the intended destination for redirect after login
    authStore.setLoginRedirect(to.fullPath)

    // Redirect to home with login prompt
    return navigateTo('/?login=true')
  }
})
