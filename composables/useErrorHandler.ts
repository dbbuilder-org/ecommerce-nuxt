// Centralized error handling composable
// Provides consistent error handling across the application

interface ApiError {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: {
    message?: string
    errors?: string[]
  }
}

interface ErrorContext {
  operation?: string
  silent?: boolean
  fallbackMessage?: string
}

export function useErrorHandler() {
  const toast = useToast()

  /**
   * Parse error into user-friendly message
   */
  function parseError(error: unknown): string {
    if (!error) return 'An unexpected error occurred'

    // Handle fetch errors
    if (typeof error === 'object') {
      const apiError = error as ApiError

      // Check for API error message
      if (apiError.data?.message) return apiError.data.message
      if (apiError.statusMessage) return apiError.statusMessage
      if (apiError.message) return apiError.message

      // Handle common HTTP status codes
      if (apiError.statusCode) {
        switch (apiError.statusCode) {
          case 400:
            return 'Invalid request. Please check your input.'
          case 401:
            return 'Please sign in to continue.'
          case 403:
            return 'You do not have permission to perform this action.'
          case 404:
            return 'The requested resource was not found.'
          case 422:
            return 'Validation failed. Please check your input.'
          case 429:
            return 'Too many requests. Please try again later.'
          case 500:
            return 'Server error. Please try again later.'
          case 502:
          case 503:
          case 504:
            return 'Service temporarily unavailable. Please try again later.'
          default:
            return `An error occurred (${apiError.statusCode})`
        }
      }
    }

    // Handle string errors
    if (typeof error === 'string') return error

    // Handle Error instances
    if (error instanceof Error) return error.message

    return 'An unexpected error occurred'
  }

  /**
   * Get error status code
   */
  function getErrorCode(error: unknown): number {
    if (typeof error === 'object' && error !== null) {
      const apiError = error as ApiError
      return apiError.statusCode || 500
    }
    return 500
  }

  /**
   * Handle API error with toast notification
   */
  function handleApiError(
    error: unknown,
    context: ErrorContext = {}
  ): string {
    const message = context.fallbackMessage || parseError(error)
    const operation = context.operation || 'Operation'

    // Log error for debugging
    if (import.meta.dev) {
      console.error(`[${operation}] Error:`, error)
    }

    // Show toast notification unless silent
    if (!context.silent) {
      const statusCode = getErrorCode(error)

      if (statusCode === 401) {
        toast.warning('Authentication Required', message)
      } else if (statusCode >= 500) {
        toast.error('Server Error', message)
      } else {
        toast.error(`${operation} Failed`, message)
      }
    }

    return message
  }

  /**
   * Handle form validation errors
   */
  function handleValidationErrors(
    errors: Record<string, string | string[]>
  ): string[] {
    const messages: string[] = []

    for (const [field, error] of Object.entries(errors)) {
      if (Array.isArray(error)) {
        messages.push(...error)
      } else {
        messages.push(error)
      }
    }

    if (messages.length > 0) {
      toast.error('Validation Error', messages[0])
    }

    return messages
  }

  /**
   * Wrap async function with error handling
   */
  async function withErrorHandling<T>(
    fn: () => Promise<T>,
    context: ErrorContext = {}
  ): Promise<T | null> {
    try {
      return await fn()
    } catch (error) {
      handleApiError(error, context)
      return null
    }
  }

  /**
   * Check if error is a specific status code
   */
  function isErrorCode(error: unknown, code: number): boolean {
    return getErrorCode(error) === code
  }

  /**
   * Check if error is authentication related
   */
  function isAuthError(error: unknown): boolean {
    const code = getErrorCode(error)
    return code === 401 || code === 403
  }

  /**
   * Check if error is a network/server error
   */
  function isServerError(error: unknown): boolean {
    const code = getErrorCode(error)
    return code >= 500
  }

  return {
    parseError,
    getErrorCode,
    handleApiError,
    handleValidationErrors,
    withErrorHandling,
    isErrorCode,
    isAuthError,
    isServerError,
  }
}
