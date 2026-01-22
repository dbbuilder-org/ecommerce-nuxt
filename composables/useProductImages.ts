/**
 * Product Images Composable
 *
 * Provides reactive access to product image utilities with theme awareness.
 * Integrates with the theme store for institution-specific image URLs.
 *
 * Features:
 * - Theme-aware Azure Blob Storage URL building
 * - Cloudflare image optimization with presets
 * - Responsive srcset/sizes generation
 * - Lazy loading with size hints
 */
import { useThemeStore } from '~/stores/theme'
import {
  buildProductImageUrl,
  buildProductImageUrls,
  getPlaceholderImage,
  getImageSizeHints,
  isValidImageUrl,
  isExternalUrl,
  isRelativeUrl,
  // Cloudflare functions
  buildCloudflareImageUrl,
  getOptimizedImageUrl,
  getOptimizedProductImage,
  getResponsiveImageAttrs,
  generateSrcSet,
  generateSizes,
  IMAGE_PRESETS,
  type CloudflareImageOptions,
  type ImagePreset,
} from '~/utils/images'

export function useProductImages() {
  const themeStore = useThemeStore()

  // Get the current theme ID for image URLs
  const currentThemeId = computed(() => themeStore.currentThemeId)

  /**
   * Build a product image URL for the current theme
   */
  function getImageUrl(filename: string | null | undefined): string {
    return buildProductImageUrl(filename, currentThemeId.value)
  }

  /**
   * Build multiple product image URLs for the current theme
   */
  function getImageUrls(filenames: (string | null | undefined)[]): string[] {
    return buildProductImageUrls(filenames, currentThemeId.value)
  }

  /**
   * Get optimized product image URL using Cloudflare
   *
   * @param filename - The image filename
   * @param preset - The optimization preset (thumbnail, card, detail, hero)
   * @returns Cloudflare-optimized URL
   */
  function getOptimizedImage(
    filename: string | null | undefined,
    preset: ImagePreset = 'card'
  ): string {
    return getOptimizedProductImage(filename, currentThemeId.value, preset)
  }

  /**
   * Get responsive image attributes for an <img> tag
   * Returns { src, srcset, sizes } for optimal responsive loading
   *
   * @param filename - The image filename
   * @param preset - The optimization preset
   * @returns Object with src, srcset, and sizes attributes
   */
  function getResponsiveImage(
    filename: string | null | undefined,
    preset: ImagePreset = 'card'
  ): { src: string; srcset: string; sizes: string } {
    const baseUrl = getImageUrl(filename)
    return getResponsiveImageAttrs(baseUrl, preset)
  }

  /**
   * Get custom optimized image with specific options
   *
   * @param filename - The image filename
   * @param options - Cloudflare optimization options
   * @returns Cloudflare-optimized URL
   */
  function getCustomOptimizedImage(
    filename: string | null | undefined,
    options: CloudflareImageOptions
  ): string {
    const baseUrl = getImageUrl(filename)
    return buildCloudflareImageUrl(baseUrl, options)
  }

  /**
   * Get the main image from a product (handles various data structures)
   * Now returns Cloudflare-optimized URL
   */
  function getProductMainImage(
    product: { imageUrl?: string; image?: string; images?: string[]; thumbnailUrl?: string } | null | undefined,
    preset: ImagePreset = 'card'
  ): string {
    if (!product) return getPlaceholderImage('product')

    // Try imageUrl first
    if (product.imageUrl) {
      return getOptimizedImage(product.imageUrl, preset)
    }

    // Try image (singular)
    if (product.image) {
      return getOptimizedImage(product.image, preset)
    }

    // Try first image from images array
    if (product.images && product.images.length > 0) {
      return getOptimizedImage(product.images[0], preset)
    }

    // Try thumbnailUrl as fallback
    if (product.thumbnailUrl) {
      return getOptimizedImage(product.thumbnailUrl, preset)
    }

    return getPlaceholderImage('product')
  }

  /**
   * Get all images for a product with optional optimization
   */
  function getProductImages(
    product: { imageUrl?: string; image?: string; images?: string[]; thumbnailUrl?: string } | null | undefined,
    preset?: ImagePreset
  ): string[] {
    if (!product) return [getPlaceholderImage('product')]

    const urls: string[] = []

    // Add main image
    if (product.imageUrl) {
      urls.push(preset ? getOptimizedImage(product.imageUrl, preset) : getImageUrl(product.imageUrl))
    } else if (product.image) {
      urls.push(preset ? getOptimizedImage(product.image, preset) : getImageUrl(product.image))
    }

    // Add all images from array
    if (product.images) {
      const imageList = product.images.map((img) =>
        preset ? getOptimizedImage(img, preset) : getImageUrl(img)
      )
      urls.push(...imageList)
    }

    // Deduplicate
    const uniqueUrls = [...new Set(urls)]
    return uniqueUrls.length > 0 ? uniqueUrls : [getPlaceholderImage('product')]
  }

  /**
   * Get a category image (with optional optimization)
   */
  function getCategoryImage(
    imageUrl: string | null | undefined,
    preset: ImagePreset = 'collection'
  ): string {
    if (!imageUrl) return getPlaceholderImage('category')
    return getOptimizedImage(imageUrl, preset)
  }

  /**
   * Get a collection image (with optional optimization)
   */
  function getCollectionImage(
    imageUrl: string | null | undefined,
    preset: ImagePreset = 'collection'
  ): string {
    if (!imageUrl) return getPlaceholderImage('collection')
    return getOptimizedImage(imageUrl, preset)
  }

  /**
   * Get a hero image (with optional optimization)
   */
  function getHeroImage(
    imageUrl: string | null | undefined
  ): string {
    if (!imageUrl) return getPlaceholderImage('hero')
    return getOptimizedImage(imageUrl, 'hero')
  }

  /**
   * Check if an image URL is valid
   */
  function isValid(url: string | null | undefined): boolean {
    return isValidImageUrl(url)
  }

  /**
   * Get size hints for lazy loading optimization
   */
  function getSizeHints(variant: 'thumbnail' | 'card' | 'detail' | 'hero' = 'card') {
    return getImageSizeHints(variant)
  }

  return {
    // State
    currentThemeId,

    // Basic URL Building
    getImageUrl,
    getImageUrls,

    // Cloudflare Optimized (recommended)
    getOptimizedImage,
    getResponsiveImage,
    getCustomOptimizedImage,

    // Product-specific
    getProductMainImage,
    getProductImages,

    // Category/Collection/Hero
    getCategoryImage,
    getCollectionImage,
    getHeroImage,

    // Utilities
    isValid,
    getSizeHints,
    isExternalUrl,
    isRelativeUrl,
    getPlaceholderImage,

    // Exports for direct use
    IMAGE_PRESETS,
    generateSrcSet,
    generateSizes,
  }
}
