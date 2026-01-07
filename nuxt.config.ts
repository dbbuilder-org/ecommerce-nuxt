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
  // Server-side env vars are automatically mapped: runtimeConfig.fooBar -> NUXT_FOO_BAR
  runtimeConfig: {
    // Server-only secrets (never sent to client)
    // Auto-mapped from NUXT_PAYMENT_API_SECRET, NUXT_PAYMENT_API_BASE_URL, NUXT_SIGNING_KEY
    paymentApiSecret: '',
    paymentApiBaseUrl: 'https://paymentapi-ecommerce-test-v2.azurewebsites.net',
    signingKey: '',

    // Ecommerce API base
    ecommerceApiBase: 'https://paymentapi-ecommerce-test-v2.azurewebsites.net',
    ecommerceApiKey: '',

    // Public config (available on client)
    // Auto-mapped from NUXT_PUBLIC_* env vars
    public: {
      schoolCode: 'westmoreland',
      schoolName: 'Westmoreland County Community College',
      recaptchaSiteKey: '6Ld4dqkdAAAAAAHq9rPfvqbcStxmKtoLQ9QI96oK',
      defaultTheme: 'westmoreland',

      // Hero section configuration (theme-customizable)
      heroVideoSrc: '', // e.g., '/videos/hero-bg.mp4' or external URL
      heroImageSrc: '', // e.g., '/images/hero-bg.jpg' - fallback if no video
      heroGradientClass: 'bg-gradient-to-r from-primary-600 to-primary-800', // fallback gradient
      heroOverlayClass: 'bg-black/30', // overlay opacity
      heroShowScrollIndicator: 'false',
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
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
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
        'media-src': ["'self'", "data:", "https:", "blob:"],
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'School Ecommerce Store - Secure Online Shopping' },
        { name: 'format-detection', content: 'telephone=no' },
        // PWA & Mobile Web App
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'SchoolVision Store' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
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
      // Home page - SSR (prerender disabled for now)
      '/': { ssr: true },
      // Shop page - SSR with caching
      '/shop': { ssr: true, swr: 3600 },
      // Payment pages - SSR (no cache)
      '/checkout': { ssr: true },
      '/payment-response': { ssr: true },
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
  },

  compatibilityDate: '2026-01-07',
})
