// Session check API route
// Validates current user session

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'auth_session')

  if (!sessionToken) {
    return {
      authenticated: false,
      user: null,
    }
  }

  try {
    // Get session from storage
    const session = await useStorage('sessions').getItem(sessionToken)

    if (!session || !session.user) {
      // Invalid or expired session
      deleteCookie(event, 'auth_session')
      return {
        authenticated: false,
        user: null,
      }
    }

    // Check session age (7 days max)
    const sessionAge = Date.now() - session.createdAt
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

    if (sessionAge > maxAge) {
      // Session expired
      await useStorage('sessions').removeItem(sessionToken)
      deleteCookie(event, 'auth_session')
      return {
        authenticated: false,
        user: null,
      }
    }

    return {
      authenticated: true,
      user: session.user,
    }
  } catch (error) {
    console.error('Session check error:', error)
    return {
      authenticated: false,
      user: null,
    }
  }
})
