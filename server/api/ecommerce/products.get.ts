// Server-side API route for fetching products
// This keeps API credentials secure on the server
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl
  const locationId = 622103005 // Westmoreland location ID

  // Use all-categorized endpoint for efficient loading
  const apiUrl = `${apiBaseUrl}/api/ecommerce/products/all-categorized`

  try {
    const response = await $fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
      },
      query: {
        locationId,
        availableOnly: false,
      },
    })

    // Transform products to add image URLs
    const data = response as any
    if (data.products && Array.isArray(data.products)) {
      data.products = data.products.map((product: any) => ({
        ...product,
        id: product.productId || product.id,
        image: getProductImageUrl(product.imageFilename, apiBaseUrl, schoolCode),
      }))
    }

    return data
  } catch (error: any) {
    console.error('Products API Error:', error?.data || error?.message || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to fetch products',
    })
  }
})

// Transform imageFilename to full image URL
// Format: {baseUrl}/{schoolCode}/api/getimage/{filename_without_extension}/{extension}
function getProductImageUrl(imageFilename: string | undefined, apiBaseUrl: string, schoolCode: string): string | undefined {
  if (!imageFilename || imageFilename.trim() === '') {
    return undefined
  }

  let cleanFilename = imageFilename.trim()

  // Fix common extension issues in the data
  cleanFilename = cleanFilename.replace(/\/jpg$/, '.jpg')
  cleanFilename = cleanFilename.replace(/\/j$/, '.jpg')
  cleanFilename = cleanFilename.replace(/\/jpeg$/, '.jpeg')
  cleanFilename = cleanFilename.replace(/\/png$/, '.png')

  // Fix truncated .jpg extension
  if (cleanFilename.endsWith('.j')) {
    cleanFilename = cleanFilename + 'pg'
  }

  // Split filename and extension
  const lastDotIndex = cleanFilename.lastIndexOf('.')
  if (lastDotIndex > 0) {
    const name = cleanFilename.substring(0, lastDotIndex)
    const ext = cleanFilename.substring(lastDotIndex + 1)

    // Use the correct API getimage endpoint
    return `${apiBaseUrl}/${schoolCode}/api/getimage/${encodeURIComponent(name)}/${ext}`
  }

  return undefined
}
