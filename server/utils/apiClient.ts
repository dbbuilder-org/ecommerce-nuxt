/**
 * Multi-tenant API Client Utility
 *
 * Provides consistent API URL building and request handling
 * for the multi-tenant ecommerce backend (PaymentAPI).
 *
 * URL Pattern: {baseUrl}/{tenant}/api/ecommerce/{route}
 */

import type { H3Event } from 'h3'
import { EcommerceRoutes, buildApiUrl, type Tenant } from '~/constants/apiRoutes'

export interface ApiClientConfig {
  baseUrl: string
  apiKey: string
  tenant: Tenant
}

/**
 * Get API client configuration from runtime config
 */
export function getApiClientConfig(event: H3Event): ApiClientConfig {
  const config = useRuntimeConfig(event)
  const tenant = (config.public.schoolCode || 'westmoreland') as Tenant

  return {
    baseUrl: config.paymentApiBaseUrl || '',
    apiKey: config.paymentApiSecret || '',
    tenant,
  }
}

/**
 * Build a full API URL for a route
 */
export function buildEcommerceApiUrl(
  baseUrl: string,
  tenant: Tenant,
  route: string
): string {
  return buildApiUrl(baseUrl, tenant, route)
}

/**
 * Get standard headers for API requests
 */
export function getApiHeaders(config: ApiClientConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': config.apiKey,
    'X-School-Code': config.tenant,
  }
}

/**
 * Make a GET request to the ecommerce API
 */
export async function apiGet<T = any>(
  event: H3Event,
  route: string,
  query?: Record<string, any>
): Promise<T> {
  const config = getApiClientConfig(event)
  const url = buildEcommerceApiUrl(config.baseUrl, config.tenant, route)

  return await $fetch<T>(url, {
    method: 'GET',
    headers: getApiHeaders(config),
    query,
  })
}

/**
 * Make a POST request to the ecommerce API
 */
export async function apiPost<T = any>(
  event: H3Event,
  route: string,
  body?: any,
  query?: Record<string, any>
): Promise<T> {
  const config = getApiClientConfig(event)
  const url = buildEcommerceApiUrl(config.baseUrl, config.tenant, route)

  return await $fetch<T>(url, {
    method: 'POST',
    headers: getApiHeaders(config),
    body,
    query,
  })
}

/**
 * Make a PUT request to the ecommerce API
 */
export async function apiPut<T = any>(
  event: H3Event,
  route: string,
  body?: any
): Promise<T> {
  const config = getApiClientConfig(event)
  const url = buildEcommerceApiUrl(config.baseUrl, config.tenant, route)

  return await $fetch<T>(url, {
    method: 'PUT',
    headers: getApiHeaders(config),
    body,
  })
}

/**
 * Make a DELETE request to the ecommerce API
 */
export async function apiDelete<T = any>(
  event: H3Event,
  route: string,
  query?: Record<string, any>
): Promise<T> {
  const config = getApiClientConfig(event)
  const url = buildEcommerceApiUrl(config.baseUrl, config.tenant, route)

  return await $fetch<T>(url, {
    method: 'DELETE',
    headers: getApiHeaders(config),
    query,
  })
}

/**
 * Export route constants for convenience
 */
export { EcommerceRoutes }
