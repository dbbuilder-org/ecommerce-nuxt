// SEO composable for consistent meta tags across pages
// Provides Open Graph, Twitter Cards, and structured data support

interface SEOConfig {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
  price?: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand?: string
  category?: string
}

export function useSEO() {
  const config = useRuntimeConfig()
  const route = useRoute()

  const schoolName = config.public.schoolName || 'SchoolVision Store'
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  /**
   * Set page SEO with Open Graph and Twitter Cards
   */
  function setPageSEO(options: SEOConfig) {
    const fullTitle = `${options.title} | ${schoolName}`
    const description = options.description || `Shop ${options.title} at ${schoolName}`
    const url = options.url || `${baseUrl}${route.fullPath}`
    const image = options.image || `${baseUrl}/og-image.png`

    useHead({
      title: options.title,
      meta: [
        // Basic meta
        { name: 'description', content: description },

        // Open Graph
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: image },
        { property: 'og:type', content: options.type || 'website' },
        { property: 'og:site_name', content: schoolName },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      link: [
        { rel: 'canonical', href: url },
      ],
    })
  }

  /**
   * Set product page SEO with structured data
   */
  function setProductSEO(product: {
    id: number
    name: string
    description?: string
    price: number
    image?: string
    available?: boolean
    category?: string
  }) {
    const url = `${baseUrl}/product/${product.id}`
    const image = product.image || `${baseUrl}/placeholder-product.png`

    setPageSEO({
      title: product.name,
      description: product.description || `Buy ${product.name} at ${schoolName}`,
      image,
      url,
      type: 'product',
    })

    // Add product structured data (JSON-LD)
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: image,
            url: url,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: product.available !== false
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: schoolName,
              },
            },
          }),
        },
      ],
    })
  }

  /**
   * Set category/collection page SEO
   */
  function setCategorySEO(category: {
    name: string
    description?: string
    productCount?: number
  }) {
    setPageSEO({
      title: category.name,
      description: category.description ||
        `Browse ${category.productCount || ''} ${category.name} products at ${schoolName}`,
      type: 'website',
    })

    // Add breadcrumb structured data
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Shop',
                item: `${baseUrl}/shop`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
              },
            ],
          }),
        },
      ],
    })
  }

  /**
   * Set organization structured data (for homepage)
   */
  function setOrganizationSchema() {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: schoolName,
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@schoolvision.io',
              contactType: 'customer service',
            },
          }),
        },
      ],
    })
  }

  /**
   * Set store/e-commerce structured data
   */
  function setStoreSchema() {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: schoolName,
            url: baseUrl,
            priceRange: '$',
            servesCuisine: 'School supplies and merchandise',
          }),
        },
      ],
    })
  }

  return {
    setPageSEO,
    setProductSEO,
    setCategorySEO,
    setOrganizationSchema,
    setStoreSchema,
  }
}
