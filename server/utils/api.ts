// Server utilities for API calls
// These run ONLY on the server - secrets are safe

import { H3Event } from 'h3'

/**
 * Get the base API URL for the current school
 */
export function getApiBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'
  return `${config.paymentApiBaseUrl}/${schoolCode}/api`
}

/**
 * Get common headers for API requests (includes secrets)
 * @deprecated Use getApiHeaders from apiClient.ts instead
 */
export function getApiHeadersFromEvent(event: H3Event): Record<string, string> {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'

  return {
    'Content-Type': 'application/json',
    'X-API-Key': config.paymentApiSecret,
    'X-School-Code': schoolCode,
  }
}

/**
 * Get the frontend origin from the request
 */
export function getFrontendOrigin(event: H3Event): string {
  const config = useRuntimeConfig()
  const schoolCode = config.public.schoolCode || 'westmoreland'

  // Priority: Origin header > Referer > Default
  const origin = getRequestHeader(event, 'origin')
  if (origin) return origin

  const referer = getRequestHeader(event, 'referer')
  if (referer) {
    try {
      const url = new URL(referer)
      return url.origin
    } catch {
      // Invalid URL, continue to default
    }
  }

  // Default based on school code
  return `https://${schoolCode}-staging.schoolvision.io`
}

/**
 * Validate that origin is from an allowed domain
 */
export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false

  try {
    const url = new URL(origin)
    const host = url.hostname.toLowerCase()

    // Allow localhost for development
    if (host === 'localhost' || host === '127.0.0.1') {
      return true
    }

    // Allow SchoolVision domains
    if (host.endsWith('.schoolvision.io') || host.endsWith('.schoolvision.net')) {
      return true
    }

    // Allow Azure Static Web Apps (our frontends)
    if (host.endsWith('.azurestaticapps.net')) {
      return true
    }

    return false
  } catch {
    return false
  }
}
