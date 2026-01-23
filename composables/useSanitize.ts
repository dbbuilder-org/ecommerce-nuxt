/**
 * XSS Protection Composable
 *
 * Provides HTML sanitization using DOMPurify to prevent XSS attacks.
 * Use this whenever rendering user-generated or API-sourced HTML content.
 *
 * @example
 * ```vue
 * <script setup>
 * const { sanitize, sanitizeText } = useSanitize()
 * const safeHtml = sanitize(untrustedHtml)
 * </script>
 *
 * <template>
 *   <div v-html="safeHtml"></div>
 * </template>
 * ```
 */

import DOMPurify, { type Config } from 'dompurify'

// Default DOMPurify configuration - strict but allows common formatting
const DEFAULT_CONFIG: Config = {
  ALLOWED_TAGS: [
    'b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'blockquote', 'code', 'pre',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'id', 'style',
    'src', 'alt', 'width', 'height', 'title',
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'], // Allow target="_blank" on links
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
}

// Strict config for plain text only (strips all HTML)
const TEXT_ONLY_CONFIG: Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
}

// Config for JSON-LD structured data (very strict)
const JSON_LD_CONFIG: Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
}

export function useSanitize() {
  /**
   * Sanitize HTML content, allowing safe formatting tags
   * Use for rich text content like product descriptions
   */
  function sanitize(dirty: string | null | undefined, config?: Config): string {
    if (!dirty) return ''
    if (import.meta.server) {
      // On server, strip all HTML for safety (DOMPurify needs DOM)
      return stripHtml(dirty)
    }
    return DOMPurify.sanitize(dirty, config || DEFAULT_CONFIG) as string
  }

  /**
   * Strip all HTML and return plain text
   * Use for user input that should never contain HTML
   */
  function sanitizeText(dirty: string | null | undefined): string {
    if (!dirty) return ''
    if (import.meta.server) {
      return stripHtml(dirty)
    }
    return DOMPurify.sanitize(dirty, TEXT_ONLY_CONFIG) as string
  }

  /**
   * Sanitize content for use in JSON-LD structured data
   * Escapes special characters and strips all HTML
   */
  function sanitizeForJsonLd(dirty: string | null | undefined): string {
    if (!dirty) return ''
    // First strip HTML
    const text = import.meta.server ? stripHtml(dirty) : DOMPurify.sanitize(dirty, JSON_LD_CONFIG) as string
    // Then escape for JSON
    return text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  /**
   * Sanitize a URL to prevent javascript: and data: URLs
   */
  function sanitizeUrl(url: string | null | undefined): string {
    if (!url) return ''
    const trimmed = url.trim().toLowerCase()
    // Block dangerous URL schemes
    if (
      trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('vbscript:')
    ) {
      console.warn('Blocked potentially dangerous URL:', url.substring(0, 50))
      return ''
    }
    return url
  }

  /**
   * Sanitize an object's string values recursively
   * Useful for sanitizing API response objects
   */
  function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj

    const result: Record<string, any> = Array.isArray(obj) ? [] : {}

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key] = sanitizeText(value)
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeObject(value)
      } else {
        result[key] = value
      }
    }

    return result as T
  }

  return {
    sanitize,
    sanitizeText,
    sanitizeForJsonLd,
    sanitizeUrl,
    sanitizeObject,
  }
}

/**
 * Server-side HTML stripping (no DOM available)
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim()
}

// Export types for external use
export type SanitizeConfig = Config
