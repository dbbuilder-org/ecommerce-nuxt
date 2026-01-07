// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Enable SSR for server-side security
  ssr: true,

  // Runtime configuration - accessible in server and client
  runtimeConfig: {
    // Server-only secrets (never sent to client)
    paymentApiSecret: process.env.PAYMENT_API_SECRET || '',
    paymentApiBaseUrl: process.env.PAYMENT_API_BASE_URL || 'https://paymentapi-ecommerce-test-v2.azurewebsites.net',
    signingKey: process.env.SIGNING_KEY || '',

    // Public config (available on client)
    public: {
      schoolCode: process.env.NUXT_PUBLIC_SCHOOL_CODE || 'westmoreland',
      schoolName: process.env.NUXT_PUBLIC_SCHOOL_NAME || 'Westmoreland County Community College',
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld4dqkdAAAAAAHq9rPfvqbcStxmKtoLQ9QI96oK',
      theme: process.env.NUXT_PUBLIC_THEME || 'westmoreland',
    }
  },

  // CSS
  css: [
    '~/assets/css/main.css',
  ],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],

  // Tailwind CSS
  tailwindcss: {
    configPath: 'tailwind.config.js',
  },

  // Pinia for state management
  pinia: {
    storesDirs: ['./stores/**'],
  },

  // TypeScript
  typescript: {
    strict: true,
    shim: false,
  },

  // App configuration
  app: {
    head: {
      title: 'SchoolVision Ecommerce',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'School Ecommerce Store' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Nitro server configuration
  nitro: {
    // Server-side API routes
    routeRules: {
      '/api/**': { cors: true },
    },
  },

  // PostCSS configuration (Nuxt handles this, not standalone postcss.config.js)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Build configuration
  build: {
    transpile: ['vue-toastification'],
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
  },

  compatibilityDate: '2024-12-01',
})
