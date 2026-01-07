# SchoolVision Ecommerce - Nuxt 3

A secure, server-rendered ecommerce platform for schools built with Nuxt 3.

## Why Nuxt 3?

This is a complete rewrite of the Vue SPA ecommerce app with a **critical security improvement**:

### The Problem with SPAs
In the original Vue SPA, API keys and secrets were stored in JavaScript files that get sent to the browser. Anyone could:
- Open DevTools and extract the API key
- Copy the frontend and reuse the API key
- Create fake frontends that call our API

### The Nuxt 3 Solution
With Nuxt 3's server-side capabilities:
- **API secrets stay on the server** - Never sent to the browser
- **Server API routes (BFF pattern)** - Browser calls `/api/ecommerce/*`, which our server handles
- **Request signing** - Server signs requests with HMAC for additional security
- **Validated redirects** - Return URLs are controlled server-side

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ──────► │   Nuxt 3    │ ──────► │ Payment API │
│             │         │   Server    │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              └── API key stored here (never sent to browser)
                              └── Signs requests with HMAC
                              └── Validates return URLs
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# IMPORTANT: Add your PAYMENT_API_SECRET (server-side only)
```

### Development

```bash
# Start development server
npm run dev

# Start with specific school theme
npm run dev:westmoreland
npm run dev:windermere
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── app.vue                 # Root component
├── nuxt.config.ts          # Nuxt configuration
├── pages/                  # Auto-routed pages
│   ├── index.vue           # Home page
│   ├── shop.vue            # Product listing
│   └── checkout.vue        # Checkout flow
├── components/             # Vue components
│   ├── layout/             # Header, Footer, etc.
│   └── shop/               # Product cards, cart, etc.
├── server/                 # Server-side code
│   ├── api/                # API routes (BFF)
│   │   └── ecommerce/      # Ecommerce API proxies
│   └── utils/              # Server utilities
├── stores/                 # Pinia state management
├── composables/            # Vue composables
├── assets/                 # CSS, images
└── public/                 # Static files
```

## Server API Routes

The key security feature. These run on the server and proxy requests to the Payment API:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/ecommerce/products` | GET | Fetch products |
| `/api/ecommerce/categories` | GET | Fetch categories |
| `/api/ecommerce/initiate-payment` | POST | Start payment flow |

Example server route (`server/api/ecommerce/initiate-payment.post.ts`):

```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // This secret is ONLY on the server - browser never sees it
  const response = await $fetch(paymentApiUrl, {
    headers: {
      'X-API-Key': config.paymentApiSecret,  // Server-only!
    },
    body: await readBody(event),
  })

  return response
})
```

## Environment Variables

### Server-Side Only (Secret)
```bash
PAYMENT_API_SECRET=xxx        # API key for Payment API
SIGNING_KEY=xxx               # HMAC signing key
PAYMENT_API_BASE_URL=xxx      # Payment API URL
```

### Public (Safe for browser)
```bash
NUXT_PUBLIC_SCHOOL_CODE=westmoreland
NUXT_PUBLIC_SCHOOL_NAME=Westmoreland County Community College
NUXT_PUBLIC_THEME=westmoreland
```

## Multi-School Support

Configure different schools via environment variables:

```bash
# Westmoreland
NUXT_PUBLIC_SCHOOL_CODE=westmoreland
NUXT_PUBLIC_SCHOOL_NAME=Westmoreland County Community College

# Windermere
NUXT_PUBLIC_SCHOOL_CODE=windermere
NUXT_PUBLIC_SCHOOL_NAME=Windermere Preparatory School
```

## Deployment

### Azure App Service (Recommended)
Nuxt 3 runs as a Node.js server on Azure App Service.

### Vercel
Zero-config deployment with automatic scaling.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

## License

Proprietary - SchoolVision
