// Admin middleware for admin-only routes
// Requires authentication AND admin/staff role

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // First check if authenticated
  if (!authStore.isAuthenticated) {
    authStore.setLoginRedirect(to.fullPath)
    return navigateTo('/?login=true')
  }

  // Then check if user has admin/staff role
  if (!authStore.isStaff) {
    // Redirect non-admin users to home with error
    return navigateTo('/?error=unauthorized')
  }
})
