// Logout API route
// Clears user session

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'auth_session')

  if (sessionToken) {
    // Remove session from storage
    await useStorage('sessions').removeItem(sessionToken)
  }

  // Clear session cookie
  deleteCookie(event, 'auth_session')

  return {
    success: true,
    message: 'Logged out successfully',
  }
})
