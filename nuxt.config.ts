// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Enable SSR for server-side security
  ssr: true,

  // Future compatibility options
  // Note: compatibilityVersion: 4 causes manifest issues with current Nuxt 3.x
  // Enable when migrating to Nuxt 4 stable
  // future: {
  //   compatibilityVersion: 4,
  // },

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
    'nuxt-security',
  ],

  // Security configuration (OWASP best practices)
  security: {
    headers: {
      // Content Security Policy
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        'img-src': ["'self'", "data:", "https:", "blob:"],
        'font-src': ["'self'", "https://fonts.gstatic.com"],
        'connect-src': ["'self'", "https://paymentapi-ecommerce-test-v2.azurewebsites.net", "https://*.schoolvision.io"],
        'frame-src': ["'self'", "https://www.google.com"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
      },
      // Strict Transport Security
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true,
      },
      // Prevent XSS attacks
      xXSSProtection: '1; mode=block',
      // Prevent MIME type sniffing
      xContentTypeOptions: 'nosniff',
      // Control referrer information
      referrerPolicy: 'strict-origin-when-cross-origin',
      // Permissions Policy (formerly Feature Policy)
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
      },
    },
    // Rate limiting for API routes
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000, // 5 minutes
    },
    // Request size limiter
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000, // 2MB
      maxUploadFileRequestInBytes: 8000000, // 8MB
    },
    // XSS validator for inputs
    xssValidator: true,
    // CORS handler
    corsHandler: {
      origin: [
        'https://westmoreland-staging.schoolvision.io',
        'https://windermere-staging.schoolvision.io',
        'https://ecommerce-nuxt.vercel.app',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
    // Hide X-Powered-By header
    hidePoweredBy: true,
  },

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
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'School Ecommerce Store - Secure Online Shopping' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Nitro server configuration
  nitro: {
    // Compression
    compressPublicAssets: true,

    // Route rules for hybrid rendering
    routeRules: {
      // API routes - no caching, CORS enabled
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
      },
      // Static pages - prerender
      '/': { prerender: true },
      // Shop page - ISR with 1 hour cache
      '/shop': { isr: 3600 },
      // Payment pages - no cache (dynamic)
      '/checkout': { ssr: true },
      '/payment-success': { ssr: true },
      '/payment-cancelled': { ssr: true },
      '/payment-error': { ssr: true },
    },
  },

  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Build configuration
  build: {
    transpile: [],
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
    build: {
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },
  },

  // Experimental features
  experimental: {
    // Payload extraction for better hydration
    payloadExtraction: true,
    // Tree-shake client-only components
    treeshakeClientOnly: true,
  },

  compatibilityDate: '2025-01-01',
})
