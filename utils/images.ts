/**
 * Image Utilities - Cloudflare CDN and Azure Blob Storage Support
 *
 * Handles product image URLs for the multi-tenant ecommerce platform.
 * Images are stored in Azure Blob Storage with institution-specific containers.
 *
 * Azure Blob URL Pattern: https://fundingportalstorage.blob.core.windows.net/{institution-guid}/{filename}
 * Container name is the lowercase InstitutionGlobalKey from the database.
 *
 * Cloudflare Image Resizing:
 * - Uses /cdn-cgi/image/ endpoint for on-the-fly transformations
 * - Supports width, height, quality, format, fit options
 * - Automatically serves WebP/AVIF when supported
 *
 * Best Practices Implemented:
 * - Responsive srcset generation for different viewport sizes
 * - Lazy loading with proper size hints
 * - WebP/AVIF format negotiation via Cloudflare
 * - Placeholder images for missing content
 */

// Azure Blob Storage configuration
const BLOB_STORAGE_BASE = 'https://fundingportalstorage.blob.core.windows.net'

// Cloudflare configuration (when using Cloudflare proxy)
const CLOUDFLARE_IMAGE_PATH = '/cdn-cgi/image'

// Institution GUIDs (from database Institution.InstitutionGlobalKey)
const INSTITUTION_GUIDS: Record<string, string> = {
  windermere: 'e45fe480-8646-4dfe-91a2-79a18c961f39',
  westmoreland: '6291e60c-d6f9-4e0e-97e7-f1e8e0b3f8d0', // Placeholder - update with actual GUID
}

/**
 * Cloudflare Image Transformation Options
 */
export interface CloudflareImageOptions {
  width?: number
  height?: number
  quality?: number // 1-100, default 85
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
  gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right'
  sharpen?: number // 0-10
  blur?: number // 1-250
  background?: string // hex color for padding
}

// Placeholder image for missing product images
const PLACEHOLDER_IMAGE = '/images/placeholder-product.png'

/**
 * Check if a URL is a full external URL (https://, http://, //)
 */
export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')
}

/**
 * Check if a URL is a relative path (starts with /)
 */
export function isRelativeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.startsWith('/') && !url.startsWith('//')
}

/**
 * Get the Azure Blob Storage container name for an institution
 * Container names are lowercase GUIDs
 */
export function getInstitutionContainer(themeId: string): string {
  const guid = INSTITUTION_GUIDS[themeId]
  return guid ? guid.toLowerCase() : ''
}

/**
 * Build a product image URL from Azure Blob Storage
 *
 * @param filename - The image filename (e.g., 'product-2003916.png')
 * @param themeId - The theme/institution ID (e.g., 'windermere')
 * @returns Full Azure Blob URL or placeholder
 */
export function buildProductImageUrl(
  filename: string | null | undefined,
  themeId: string = 'westmoreland'
): string {
  if (!filename) return PLACEHOLDER_IMAGE

  // If already a full URL, return as-is
  if (isExternalUrl(filename)) return filename

  // If relative URL, return as-is (local asset)
  if (isRelativeUrl(filename)) return filename

  // Build Azure Blob URL
  const container = getInstitutionContainer(themeId)
  if (!container) {
    console.warn(`[Images] Unknown institution: ${themeId}`)
    return PLACEHOLDER_IMAGE
  }

  return `${BLOB_STORAGE_BASE}/${container}/${filename}`
}

/**
 * Build multiple product image URLs
 */
export function buildProductImageUrls(
  filenames: (string | null | undefined)[],
  themeId: string = 'westmoreland'
): string[] {
  return filenames
    .filter((f): f is string => !!f)
    .map((f) => buildProductImageUrl(f, themeId))
}

/**
 * Parse image URL to extract filename
 * Works with Azure Blob URLs and relative paths
 */
export function extractImageFilename(url: string | null | undefined): string | null {
  if (!url) return null

  // Handle Azure Blob URLs
  if (url.includes(BLOB_STORAGE_BASE)) {
    const parts = url.split('/')
    return parts[parts.length - 1] || null
  }

  // Handle relative paths
  if (isRelativeUrl(url)) {
    const parts = url.split('/')
    return parts[parts.length - 1] || null
  }

  return url
}

/**
 * Get image dimensions hints for lazy loading optimization
 */
export function getImageSizeHints(
  variant: 'thumbnail' | 'card' | 'detail' | 'hero' = 'card'
): { width: number; height: number } {
  const sizes = {
    thumbnail: { width: 80, height: 80 },
    card: { width: 300, height: 300 },
    detail: { width: 600, height: 600 },
    hero: { width: 1200, height: 600 },
  }
  return sizes[variant]
}

/**
 * Build Cloudflare Image Transformation URL
 *
 * Cloudflare Images uses a special URL format for on-the-fly transformations:
 * /cdn-cgi/image/width=300,quality=85,format=auto/https://example.com/image.jpg
 *
 * @param imageUrl - The original image URL
 * @param options - Transformation options
 * @returns Cloudflare optimized URL
 */
export function buildCloudflareImageUrl(
  imageUrl: string,
  options: CloudflareImageOptions = {}
): string {
  if (!imageUrl || imageUrl === PLACEHOLDER_IMAGE) return imageUrl

  // Don't transform already-transformed URLs
  if (imageUrl.includes(CLOUDFLARE_IMAGE_PATH)) return imageUrl

  // Don't transform relative URLs (local assets)
  if (isRelativeUrl(imageUrl) && !imageUrl.startsWith('/images/')) return imageUrl

  // Build transformation params
  const params: string[] = []

  if (options.width) params.push(`width=${options.width}`)
  if (options.height) params.push(`height=${options.height}`)
  if (options.quality) params.push(`quality=${options.quality}`)
  if (options.format) params.push(`format=${options.format}`)
  if (options.fit) params.push(`fit=${options.fit}`)
  if (options.gravity) params.push(`gravity=${options.gravity}`)
  if (options.sharpen) params.push(`sharpen=${options.sharpen}`)
  if (options.blur) params.push(`blur=${options.blur}`)
  if (options.background) params.push(`background=${options.background}`)

  // Default to auto format for best compression
  if (!options.format) params.push('format=auto')

  // Default quality if not specified
  if (!options.quality) params.push('quality=85')

  const paramsString = params.join(',')

  // For external URLs (Azure Blob), use the full URL
  if (isExternalUrl(imageUrl)) {
    return `${CLOUDFLARE_IMAGE_PATH}/${paramsString}/${imageUrl}`
  }

  // For relative URLs, just prepend the transformation path
  return `${CLOUDFLARE_IMAGE_PATH}/${paramsString}${imageUrl}`
}

/**
 * Generate responsive srcset for images using Cloudflare
 *
 * @param imageUrl - The base image URL
 * @param widths - Array of widths for srcset (default: common responsive widths)
 * @param options - Additional Cloudflare options to apply
 * @returns srcset string for use in <img> or <source> tags
 */
export function generateSrcSet(
  imageUrl: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  options: Omit<CloudflareImageOptions, 'width'> = {}
): string {
  if (!imageUrl || imageUrl === PLACEHOLDER_IMAGE) return imageUrl

  return widths
    .map((width) => {
      const url = buildCloudflareImageUrl(imageUrl, { ...options, width })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Generate responsive sizes attribute for srcset
 *
 * @param breakpoints - Object mapping viewport widths to image widths
 * @returns sizes attribute string
 */
export function generateSizes(
  breakpoints: Record<number, string> = {
    640: '100vw',
    768: '50vw',
    1024: '33vw',
  }
): string {
  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([a], [b]) => Number(b) - Number(a))

  const sizes = sortedBreakpoints
    .map(([viewport, size]) => `(max-width: ${viewport}px) ${size}`)
    .join(', ')

  // Add default size for larger viewports
  return `${sizes}, 25vw`
}

/**
 * Validate image URL (basic check)
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const lowerUrl = url.toLowerCase()
  return imageExtensions.some((ext) => lowerUrl.includes(ext))
}

/**
 * Get placeholder for missing images based on context
 */
export function getPlaceholderImage(
  type: 'product' | 'category' | 'collection' | 'hero' = 'product'
): string {
  const placeholders: Record<string, string> = {
    product: '/images/placeholder-product.png',
    category: '/images/placeholder-category.png',
    collection: '/images/placeholder-collection.png',
    hero: '/images/placeholder-hero.jpg',
  }
  return placeholders[type] || PLACEHOLDER_IMAGE
}

// ============================================
// Cloudflare Image Presets - Common Use Cases
// ============================================

/**
 * Preset configurations for common image use cases
 * These align with UI component expectations
 */
export const IMAGE_PRESETS = {
  // Thumbnail - Small images in lists, cart items
  thumbnail: {
    width: 80,
    height: 80,
    fit: 'cover' as const,
    quality: 80,
  },

  // Card - Product cards in grids
  card: {
    width: 300,
    height: 300,
    fit: 'cover' as const,
    quality: 85,
  },

  // CardLarge - Featured product cards
  cardLarge: {
    width: 400,
    height: 400,
    fit: 'cover' as const,
    quality: 85,
  },

  // Detail - Product detail page main image
  detail: {
    width: 600,
    height: 600,
    fit: 'contain' as const,
    quality: 90,
  },

  // DetailLarge - Zoomed/expanded product image
  detailLarge: {
    width: 1200,
    height: 1200,
    fit: 'contain' as const,
    quality: 90,
  },

  // Hero - Hero/banner images
  hero: {
    width: 1920,
    height: 600,
    fit: 'cover' as const,
    quality: 85,
  },

  // Collection - Collection/category images
  collection: {
    width: 600,
    height: 400,
    fit: 'cover' as const,
    quality: 85,
  },
} as const

export type ImagePreset = keyof typeof IMAGE_PRESETS

/**
 * Get optimized image URL using a preset configuration
 *
 * @param imageUrl - The base image URL
 * @param preset - The preset name (thumbnail, card, detail, hero, etc.)
 * @returns Cloudflare optimized URL with preset options
 */
export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  preset: ImagePreset = 'card'
): string {
  if (!imageUrl) return PLACEHOLDER_IMAGE

  const presetOptions = IMAGE_PRESETS[preset]
  return buildCloudflareImageUrl(imageUrl, presetOptions)
}

/**
 * Get optimized product image URL for a specific theme
 * Combines Azure Blob URL building with Cloudflare optimization
 *
 * @param filename - The image filename
 * @param themeId - The theme/institution ID
 * @param preset - The image preset to use
 * @returns Fully optimized image URL
 */
export function getOptimizedProductImage(
  filename: string | null | undefined,
  themeId: string = 'westmoreland',
  preset: ImagePreset = 'card'
): string {
  // First build the Azure Blob URL
  const baseUrl = buildProductImageUrl(filename, themeId)

  // Then apply Cloudflare optimization
  return getOptimizedImageUrl(baseUrl, preset)
}

/**
 * Generate responsive image attributes for <img> tag
 * Returns srcset, sizes, and src attributes
 *
 * @param imageUrl - The base image URL
 * @param preset - The preset for default sizing
 * @returns Object with src, srcset, and sizes attributes
 */
export function getResponsiveImageAttrs(
  imageUrl: string | null | undefined,
  preset: ImagePreset = 'card'
): { src: string; srcset: string; sizes: string } {
  if (!imageUrl) {
    return {
      src: PLACEHOLDER_IMAGE,
      srcset: PLACEHOLDER_IMAGE,
      sizes: '100vw',
    }
  }

  const presetOptions = IMAGE_PRESETS[preset]
  const srcsetWidths = getSrcSetWidthsForPreset(preset)

  return {
    src: buildCloudflareImageUrl(imageUrl, presetOptions),
    srcset: generateSrcSet(imageUrl, srcsetWidths, {
      quality: presetOptions.quality,
      fit: presetOptions.fit,
    }),
    sizes: getSizesForPreset(preset),
  }
}

/**
 * Get appropriate srcset widths for a preset
 */
function getSrcSetWidthsForPreset(preset: ImagePreset): number[] {
  switch (preset) {
    case 'thumbnail':
      return [80, 160] // 1x and 2x for high DPI
    case 'card':
    case 'cardLarge':
      return [200, 300, 400, 600]
    case 'detail':
    case 'detailLarge':
      return [400, 600, 800, 1200]
    case 'hero':
      return [640, 960, 1280, 1920]
    case 'collection':
      return [300, 450, 600, 900]
    default:
      return [320, 640, 960, 1280]
  }
}

/**
 * Get appropriate sizes attribute for a preset
 */
function getSizesForPreset(preset: ImagePreset): string {
  switch (preset) {
    case 'thumbnail':
      return '80px'
    case 'card':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px'
    case 'cardLarge':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'
    case 'detail':
    case 'detailLarge':
      return '(max-width: 768px) 100vw, 50vw'
    case 'hero':
      return '100vw'
    case 'collection':
      return '(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px'
    default:
      return '100vw'
  }
}
