// Debug endpoint to check runtime config (REMOVE IN PRODUCTION)
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return {
    hasPaymentApiSecret: !!config.paymentApiSecret,
    paymentApiSecretLength: config.paymentApiSecret?.length || 0,
    paymentApiBaseUrl: config.paymentApiBaseUrl,
    hasSigningKey: !!config.signingKey,
    schoolCode: config.public.schoolCode,
    env: {
      // Check various env var formats
      NUXT_PAYMENT_API_SECRET: !!process.env.NUXT_PAYMENT_API_SECRET,
      PAYMENT_API_SECRET: !!process.env.PAYMENT_API_SECRET,
    },
  }
})
