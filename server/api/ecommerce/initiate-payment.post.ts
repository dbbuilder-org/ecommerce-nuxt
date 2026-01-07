// Server-side API route for payment initiation
// CRITICAL: This keeps payment API credentials secure on the server
// The frontend NEVER sees the payment API secret
import { createHmac } from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const schoolCode = config.public.schoolCode || 'westmoreland'
  const apiBaseUrl = config.paymentApiBaseUrl

  // Get the origin from the request for return URLs
  const origin = getRequestHeader(event, 'origin') ||
                 getRequestHeader(event, 'referer')?.split('/').slice(0, 3).join('/') ||
                 `https://${schoolCode}-staging.schoolvision.io`

  // Validate required fields
  if (!body.cartItems || !Array.isArray(body.cartItems) || body.cartItems.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart items are required',
    })
  }

  // Sign the request for additional security (server-side only)
  const timestamp = Date.now()
  const signature = createRequestSignature(body, timestamp, config.signingKey)

  try {
    const response = await $fetch(`${apiBaseUrl}/${schoolCode}/api/ecommerce/initiate_payment_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.paymentApiSecret,
        'X-School-Code': schoolCode,
        'X-Request-Timestamp': timestamp.toString(),
        'X-Request-Signature': signature,
      },
      body: {
        ...body,
        // Override return URLs with server-known origin
        // This prevents attackers from injecting malicious return URLs
        returnUrls: {
          successUrl: `${origin}/payment-success`,
          cancelUrl: `${origin}/payment-cancelled`,
          errorUrl: `${origin}/payment-error`,
        },
        // Include server timestamp for replay attack prevention
        serverTimestamp: timestamp,
      },
    })

    // Return payment URL to client (safe - just a redirect URL)
    return {
      success: true,
      paymentUrl: (response as any).paymentUrl,
      transactionReference: (response as any).transactionReference,
      ticketPaymentItemId: (response as any).ticketPaymentItemId,
    }
  } catch (error: any) {
    console.error('Payment Initiation Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to initiate payment',
    })
  }
})

// Create HMAC signature for request verification
function createRequestSignature(body: any, timestamp: number, signingKey: string): string {
  if (!signingKey) return ''

  const payload = JSON.stringify({
    timestamp,
    cartTotal: body.cartItems?.reduce((sum: number, item: any) =>
      sum + (item.price * item.quantity), 0) || 0,
    itemCount: body.cartItems?.length || 0,
  })

  return createHmac('sha256', signingKey)
    .update(payload)
    .digest('hex')
}
