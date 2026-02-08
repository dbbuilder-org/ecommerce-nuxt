/**
 * Health check endpoint for Render and load balancers
 * GET /api/health
 */
export default defineEventHandler(() => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'ecommerce-nuxt'
  }
})
