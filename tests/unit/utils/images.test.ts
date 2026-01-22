import { describe, it, expect } from 'vitest'
import {
  isExternalUrl,
  isRelativeUrl,
  getInstitutionContainer,
  buildProductImageUrl,
  buildProductImageUrls,
  extractImageFilename,
  isValidImageUrl,
  getPlaceholderImage,
  buildCloudflareImageUrl,
  getOptimizedImageUrl,
  generateSrcSet,
  generateSizes,
  IMAGE_PRESETS,
} from '~/utils/images'

describe('Image Utilities', () => {
  describe('isExternalUrl', () => {
    it('returns true for https URLs', () => {
      expect(isExternalUrl('https://example.com/image.jpg')).toBe(true)
    })

    it('returns true for http URLs', () => {
      expect(isExternalUrl('http://example.com/image.jpg')).toBe(true)
    })

    it('returns true for protocol-relative URLs', () => {
      expect(isExternalUrl('//example.com/image.jpg')).toBe(true)
    })

    it('returns false for relative paths', () => {
      expect(isExternalUrl('/images/product.jpg')).toBe(false)
    })

    it('returns false for null/undefined', () => {
      expect(isExternalUrl(null)).toBe(false)
      expect(isExternalUrl(undefined)).toBe(false)
    })
  })

  describe('isRelativeUrl', () => {
    it('returns true for paths starting with /', () => {
      expect(isRelativeUrl('/images/product.jpg')).toBe(true)
    })

    it('returns false for protocol-relative URLs', () => {
      expect(isRelativeUrl('//example.com/image.jpg')).toBe(false)
    })

    it('returns false for absolute URLs', () => {
      expect(isRelativeUrl('https://example.com/image.jpg')).toBe(false)
    })

    it('returns false for null/undefined', () => {
      expect(isRelativeUrl(null)).toBe(false)
      expect(isRelativeUrl(undefined)).toBe(false)
    })
  })

  describe('getInstitutionContainer', () => {
    it('returns windermere GUID container', () => {
      const container = getInstitutionContainer('windermere')
      expect(container).toBe('e45fe480-8646-4dfe-91a2-79a18c961f39')
    })

    it('returns lowercase GUID', () => {
      const container = getInstitutionContainer('windermere')
      expect(container).toBe(container.toLowerCase())
    })

    it('returns empty string for unknown theme', () => {
      const container = getInstitutionContainer('unknown-theme')
      expect(container).toBe('')
    })
  })

  describe('buildProductImageUrl', () => {
    it('returns Azure Blob URL for windermere', () => {
      const url = buildProductImageUrl('product-123.png', 'windermere')
      expect(url).toContain('fundingportalstorage.blob.core.windows.net')
      expect(url).toContain('e45fe480-8646-4dfe-91a2-79a18c961f39')
      expect(url).toContain('product-123.png')
    })

    it('returns placeholder for null filename', () => {
      const url = buildProductImageUrl(null, 'windermere')
      expect(url).toBe('/images/placeholder-product.png')
    })

    it('returns external URL as-is', () => {
      const externalUrl = 'https://cdn.example.com/image.jpg'
      const url = buildProductImageUrl(externalUrl, 'windermere')
      expect(url).toBe(externalUrl)
    })

    it('returns relative URL as-is', () => {
      const relativeUrl = '/images/local-product.jpg'
      const url = buildProductImageUrl(relativeUrl, 'windermere')
      expect(url).toBe(relativeUrl)
    })

    it('returns placeholder for unknown theme', () => {
      const url = buildProductImageUrl('product-123.png', 'unknown-theme')
      expect(url).toBe('/images/placeholder-product.png')
    })
  })

  describe('buildProductImageUrls', () => {
    it('builds URLs for multiple filenames', () => {
      const urls = buildProductImageUrls(['img1.png', 'img2.png'], 'windermere')
      expect(urls.length).toBe(2)
      expect(urls[0]).toContain('img1.png')
      expect(urls[1]).toContain('img2.png')
    })

    it('filters out null/undefined filenames', () => {
      const urls = buildProductImageUrls(['img1.png', null, 'img2.png', undefined], 'windermere')
      expect(urls.length).toBe(2)
    })
  })

  describe('extractImageFilename', () => {
    it('extracts filename from Azure Blob URL', () => {
      const url = 'https://fundingportalstorage.blob.core.windows.net/guid/product-123.png'
      const filename = extractImageFilename(url)
      expect(filename).toBe('product-123.png')
    })

    it('extracts filename from relative path', () => {
      const filename = extractImageFilename('/images/product.jpg')
      expect(filename).toBe('product.jpg')
    })

    it('returns null for null/undefined', () => {
      expect(extractImageFilename(null)).toBeNull()
      expect(extractImageFilename(undefined)).toBeNull()
    })
  })

  describe('isValidImageUrl', () => {
    it('returns true for jpg', () => {
      expect(isValidImageUrl('/image.jpg')).toBe(true)
    })

    it('returns true for jpeg', () => {
      expect(isValidImageUrl('/image.jpeg')).toBe(true)
    })

    it('returns true for png', () => {
      expect(isValidImageUrl('/image.png')).toBe(true)
    })

    it('returns true for webp', () => {
      expect(isValidImageUrl('/image.webp')).toBe(true)
    })

    it('returns true for svg', () => {
      expect(isValidImageUrl('/image.svg')).toBe(true)
    })

    it('returns false for non-image extension', () => {
      expect(isValidImageUrl('/document.pdf')).toBe(false)
    })

    it('returns false for null/undefined', () => {
      expect(isValidImageUrl(null)).toBe(false)
      expect(isValidImageUrl(undefined)).toBe(false)
    })
  })

  describe('getPlaceholderImage', () => {
    it('returns product placeholder by default', () => {
      expect(getPlaceholderImage()).toBe('/images/placeholder-product.png')
    })

    it('returns category placeholder', () => {
      expect(getPlaceholderImage('category')).toBe('/images/placeholder-category.png')
    })

    it('returns collection placeholder', () => {
      expect(getPlaceholderImage('collection')).toBe('/images/placeholder-collection.png')
    })

    it('returns hero placeholder', () => {
      expect(getPlaceholderImage('hero')).toBe('/images/placeholder-hero.jpg')
    })
  })

  describe('Cloudflare Image Optimization', () => {
    describe('buildCloudflareImageUrl', () => {
      it('builds Cloudflare URL with width option', () => {
        const url = buildCloudflareImageUrl('https://example.com/image.jpg', { width: 300 })
        expect(url).toContain('/cdn-cgi/image/')
        expect(url).toContain('width=300')
        expect(url).toContain('https://example.com/image.jpg')
      })

      it('builds Cloudflare URL with multiple options', () => {
        const url = buildCloudflareImageUrl('https://example.com/image.jpg', {
          width: 300,
          height: 300,
          quality: 85,
          fit: 'cover',
        })
        expect(url).toContain('width=300')
        expect(url).toContain('height=300')
        expect(url).toContain('quality=85')
        expect(url).toContain('fit=cover')
      })

      it('adds default format=auto', () => {
        const url = buildCloudflareImageUrl('https://example.com/image.jpg', { width: 300 })
        expect(url).toContain('format=auto')
      })

      it('adds default quality=85 when not specified', () => {
        const url = buildCloudflareImageUrl('https://example.com/image.jpg', { width: 300 })
        expect(url).toContain('quality=85')
      })

      it('returns placeholder as-is', () => {
        const url = buildCloudflareImageUrl('/images/placeholder-product.png', { width: 300 })
        expect(url).toBe('/images/placeholder-product.png')
      })

      it('does not double-transform already optimized URLs', () => {
        const alreadyOptimized = '/cdn-cgi/image/width=300/https://example.com/image.jpg'
        const url = buildCloudflareImageUrl(alreadyOptimized, { width: 600 })
        expect(url).toBe(alreadyOptimized)
      })
    })

    describe('getOptimizedImageUrl', () => {
      it('uses card preset by default', () => {
        const url = getOptimizedImageUrl('https://example.com/image.jpg')
        expect(url).toContain('width=300')
        expect(url).toContain('height=300')
        expect(url).toContain('fit=cover')
      })

      it('uses thumbnail preset', () => {
        const url = getOptimizedImageUrl('https://example.com/image.jpg', 'thumbnail')
        expect(url).toContain('width=80')
        expect(url).toContain('height=80')
      })

      it('uses hero preset', () => {
        const url = getOptimizedImageUrl('https://example.com/image.jpg', 'hero')
        expect(url).toContain('width=1920')
        expect(url).toContain('height=600')
      })

      it('returns placeholder for null', () => {
        expect(getOptimizedImageUrl(null)).toBe('/images/placeholder-product.png')
      })
    })

    describe('generateSrcSet', () => {
      it('generates srcset with default widths', () => {
        const srcset = generateSrcSet('https://example.com/image.jpg')
        expect(srcset).toContain('320w')
        expect(srcset).toContain('640w')
        expect(srcset).toContain('960w')
        expect(srcset).toContain('1280w')
      })

      it('generates srcset with custom widths', () => {
        const srcset = generateSrcSet('https://example.com/image.jpg', [100, 200, 300])
        expect(srcset).toContain('100w')
        expect(srcset).toContain('200w')
        expect(srcset).toContain('300w')
        expect(srcset).not.toContain('320w')
      })

      it('returns placeholder as-is', () => {
        const srcset = generateSrcSet('/images/placeholder-product.png')
        expect(srcset).toBe('/images/placeholder-product.png')
      })
    })

    describe('generateSizes', () => {
      it('generates sizes with default breakpoints', () => {
        const sizes = generateSizes()
        expect(sizes).toContain('(max-width:')
        expect(sizes).toContain('vw')
      })

      it('generates sizes with custom breakpoints', () => {
        const sizes = generateSizes({ 480: '100vw', 768: '50vw' })
        expect(sizes).toContain('(max-width: 480px) 100vw')
        expect(sizes).toContain('(max-width: 768px) 50vw')
      })
    })

    describe('IMAGE_PRESETS', () => {
      it('has all expected presets', () => {
        expect(IMAGE_PRESETS.thumbnail).toBeDefined()
        expect(IMAGE_PRESETS.card).toBeDefined()
        expect(IMAGE_PRESETS.cardLarge).toBeDefined()
        expect(IMAGE_PRESETS.detail).toBeDefined()
        expect(IMAGE_PRESETS.detailLarge).toBeDefined()
        expect(IMAGE_PRESETS.hero).toBeDefined()
        expect(IMAGE_PRESETS.collection).toBeDefined()
      })

      it('presets have required properties', () => {
        expect(IMAGE_PRESETS.card.width).toBe(300)
        expect(IMAGE_PRESETS.card.height).toBe(300)
        expect(IMAGE_PRESETS.card.fit).toBe('cover')
        expect(IMAGE_PRESETS.card.quality).toBe(85)
      })
    })
  })
})
