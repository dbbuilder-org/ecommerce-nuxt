# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SchoolVision Ecommerce storefront built with **Nuxt 3 (v4.2.2)**, implementing a **Backend-for-Frontend (BFF)** pattern for secure API handling. API secrets remain server-side and are never exposed to the browser.

**GitHub:** `github.com/dbbuilder-org/ecommerce-nuxt`
**Live URL:** `https://ecommerce-nuxt.onrender.com`
**Predecessor:** `~/dev2/michaeljr/ecommerce-app` (Vue 2.7 SPA — has working Cloudflare Images config to reference)

## Related Projects

| Project | Path | Repo | Description |
|---------|------|------|-------------|
| .NET 10 API | `~/dev2/michaeljr/api-payment-ecommerce-dotnet10` | `dbbuilder-org/api-payment-ecommerce-dotnet10` | Backend Payment/Ecommerce API |
| VB.NET Original | `~/dev2/michaeljr/PaymentAPI-original` | — | Legacy API (being migrated) |
| Data Layer | `~/dev2/michaeljr/data-sqlserver-dotnet10` | `dbbuilder-org/data-sqlserver-dotnet10` | Clean architecture Dapper repositories |
| Email Service | `~/dev2/michaeljr/email-service-dotnet10` | — | Reusable email abstraction (SendGrid/Resend) |
| Vue 2.7 App | `~/dev2/michaeljr/ecommerce-app` | — | Previous SPA (reference for image config, theme config) |

## Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:3000)
npm run dev:westmoreland       # Start with Westmoreland theme
npm run dev:windermere         # Start with Windermere theme

# Build & Preview
npm run build                  # Production build
npm run preview                # Preview production build

# Type Checking & Linting
npm run typecheck              # Run TypeScript type checking
npm run lint                   # Run ESLint
npm run lint:fix               # Run ESLint with auto-fix

# Testing
npm run test                   # Run unit/integration tests (Vitest)
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage report
npm run test:e2e               # Run E2E tests (Playwright)
```

## Architecture

### BFF Security Pattern

Browser calls `/api/ecommerce/*` routes → Nuxt server adds `X-API-Key` + `X-School-Code` headers → forwards to .NET 10 API at `{baseUrl}/{tenant}/api/ecommerce/{route}`.

Secrets (`NUXT_PAYMENT_API_SECRET`, `NUXT_SIGNING_KEY`) live in `runtimeConfig` (server-only), never sent to the client.

### Server API Client (Single Source of Truth)

**File:** `server/utils/apiClient.ts`

All server routes MUST use the shared API client — never construct URLs manually:

```typescript
import { getApiClientConfig, buildEcommerceApiUrl, getApiHeaders } from '~/server/utils/apiClient'

export default defineEventHandler(async (event) => {
  const clientConfig = getApiClientConfig(event)
  const url = buildEcommerceApiUrl(clientConfig.baseUrl, clientConfig.tenant, 'categories')
  const response = await $fetch(url, {
    headers: getApiHeaders(clientConfig),
  })
})
```

**URL Pattern:** `{baseUrl}/{tenant}/api/ecommerce/{route}`
- Example: `https://payment-api-dotnet10.onrender.com/westmoreland/api/ecommerce/products/all-categorized`

### API Route Constants

**File:** `constants/apiRoutes.ts`

Route constants synced with `PaymentAPI/Constants/ApiRoutes.vb`. All ecommerce route strings are relative to `/{tenant}/api/ecommerce/`.

**Tenants:** `westmoreland`, `windermere`, `coastalab`

### Multi-Tenant Theming

- **Theme Registry:** `config/themes/` — colors, features, component overrides per school
- **Theme Store:** `stores/theme.ts` — applies CSS variables to `document.documentElement`
- **Detection order:** URL param → subdomain → localStorage → runtimeConfig

### Directory Structure

```
server/
├── api/
│   ├── auth/              # Login, register, session, logout, forgot-password
│   ├── ecommerce/         # Products, categories, payments, config, shipping
│   │   ├── products/      # featured.get.ts
│   │   └── user/          # balance.get.ts, balance/*.post.ts
│   ├── admin/             # orders.get.ts
│   └── health.get.ts      # Health check for Render
└── utils/
    └── apiClient.ts       # getApiClientConfig, buildEcommerceApiUrl, getApiHeaders

stores/                    # Pinia stores (cart, auth, theme, toast, config)
composables/               # Vue composables (useToast, useDebounce, useFormValidation)
constants/apiRoutes.ts     # Route constants and buildApiUrl()
utils/images.ts            # Image URL builders (Cloudflare Images, Azure Blob, presets)
config/themes/             # Theme configurations per school
components/
├── ui/                    # Reusable: Button, Card, Modal, Input, Toast
├── layout/                # Header, Footer
├── shop/                  # ProductCard, CartSidebar, ProductDetailsModal, Filters
├── checkout/              # CheckoutSteps, ShippingAddressForm, OrderSummary
└── auth/                  # LoginModal, RegisterModal, AuthManager
```

## Server API Endpoints

### Ecommerce

| BFF Route | Backend Route | Method | Status |
|-----------|--------------|--------|--------|
| `/api/ecommerce/products` | `products/all-categorized` | GET | ✅ Integrated |
| `/api/ecommerce/products/featured` | `products/featured` | GET | ✅ Integrated |
| `/api/ecommerce/categories` | `categories` | GET | ✅ Integrated |
| `/api/ecommerce/pickup-locations` | `pickup_locations` | GET | ✅ Integrated |
| `/api/ecommerce/config` | `config` | GET | ✅ Integrated |
| `/api/ecommerce/initiate-payment` | `initiate_payment_v2` | POST | ✅ Integrated (HMAC signed) |
| `/api/ecommerce/validate-email` | `check_email` | POST | ✅ Integrated |
| `/api/ecommerce/email-receipt` | `send-customer-receipt` | POST | ✅ Integrated |
| `/api/ecommerce/receipt` | `receipt` | POST | ✅ Integrated |
| `/api/ecommerce/orders` | `orders` | GET | ⬜ TODO |
| `/api/ecommerce/validate-promo` | `validate-promo` | POST | ⬜ TODO |
| `/api/ecommerce/shipping-quotes` | `shipping/quotes` | POST | ⬜ TODO (mock data in dev) |

### Auth & Admin

| Route | Method | Status |
|-------|--------|--------|
| `/api/auth/login` | POST | ✅ |
| `/api/auth/register` | POST | ✅ |
| `/api/auth/session` | GET | ✅ |
| `/api/auth/logout` | POST | ✅ |
| `/api/auth/forgot-password` | POST | ✅ |
| `/api/admin/orders` | GET | ✅ |
| `/api/health` | GET | ✅ (Render health check) |

## Image Handling

**File:** `utils/images.ts`

### Cloudflare Images (Primary — All Tenants)

The .NET 10 API's `/getimage/{filename}/{ext}` endpoint redirects to Cloudflare Images:
```
https://imagedelivery.net/Evc8v3QiTuuXFNXzX2AbZg/{schoolPath}-{filename}/{variant}
```

- **Account Hash:** `Evc8v3QiTuuXFNXzX2AbZg`
- **Variants:** `thumb` (200px), `card` (400px), `detail` (800px), `public` (original)
- **Image ID format:** `{tenant}-product-{productId}` (no file extension)
- **DB format:** `Product.ImageFilename = 'product-{productId}.png'`

### Azure Blob Storage (Fallback)

If Cloudflare is disabled per tenant, the API falls back to Azure Blob:
```
https://fundingportalstorage.blob.core.windows.net/{institutionGlobalKey}/{filename}.{ext}
```

### Product Image URL Flow

1. DB returns `imageFilename: "product-2010593.png"`
2. `products.get.ts` constructs: `{apiBaseUrl}/{tenant}/api/getimage/product-2010593/png`
3. .NET API redirects to: `https://imagedelivery.net/Evc8v3QiTuuXFNXzX2AbZg/westmoreland-product-2010593/public`

### Category Images

Static assets in `/images/{school}/` or Cloudflare Images with IDs like `westmoreland-category-apparel`.

### Reference

For Cloudflare Images upload script and configuration examples, see:
- `~/dev2/michaeljr/ecommerce-app/scripts/upload-westmoreland-to-cloudflare.sh`
- `~/dev2/michaeljr/ecommerce-app/public/config.westmoreland.js`

## Environment Variables

### Server-side (never exposed to browser)

| Variable | Render Key | Description |
|----------|-----------|-------------|
| `NUXT_PAYMENT_API_SECRET` | `NUXT_PAYMENT_API_SECRET` | API key for .NET 10 API |
| `NUXT_PAYMENT_API_BASE_URL` | `NUXT_PAYMENT_API_BASE_URL` | API base URL (e.g., `https://payment-api-dotnet10.onrender.com`) |
| `NUXT_ECOMMERCE_API_BASE` | `NUXT_ECOMMERCE_API_BASE` | Same as above (legacy alias) |
| `NUXT_ECOMMERCE_API_KEY` | `NUXT_ECOMMERCE_API_KEY` | Same as PAYMENT_API_SECRET (legacy alias) |
| `NUXT_SIGNING_KEY` | `NUXT_SIGNING_KEY` | HMAC-SHA256 signing key for payment requests |

### Public (available client-side via `NUXT_PUBLIC_*`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_PUBLIC_SCHOOL_CODE` | `westmoreland` | Multi-tenant identifier |
| `NUXT_PUBLIC_SCHOOL_NAME` | `Westmoreland County Community College` | Display name |
| `NUXT_PUBLIC_THEME` | `westmoreland` | Default theme ID |
| `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` | — | Google reCAPTCHA v2 site key |

## Deployment (Render)

**Service:** `ecommerce-nuxt` on Render
**Type:** Docker (multi-stage Node 20 Alpine)
**Port:** 10000
**Health Check:** `GET /api/health`
**Branch:** `main` (auto-deploy on push)

### Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV NODE_ENV=production HOST=0.0.0.0 PORT=10000
EXPOSE 10000
CMD ["node", ".output/server/index.mjs"]
```

### Required Render Env Vars

```
NUXT_PAYMENT_API_BASE_URL=https://payment-api-dotnet10.onrender.com
NUXT_PAYMENT_API_SECRET=ecommerce-key-2025
NUXT_ECOMMERCE_API_BASE=https://payment-api-dotnet10.onrender.com
NUXT_ECOMMERCE_API_KEY=ecommerce-key-2025
NUXT_PUBLIC_SCHOOL_CODE=westmoreland
```

## Security Features

1. **BFF Pattern** — secrets in `runtimeConfig` (server-only)
2. **HMAC-SHA256 Signing** — payment initiation requests signed with timestamp
3. **Server-Controlled Return URLs** — prevents redirect injection
4. **CSP Headers** — whitelisted origins only
5. **HSTS** — enforced HTTPS in production
6. **Rate Limiting** — 150 tokens per 5 minutes (nuxt-security)
7. **XSS Prevention** — DOMPurify + Zod validation
8. **CORS** — restricted to known origins

## Testing

- `tests/unit/` — Vitest + happy-dom for stores, composables, utils
- `tests/integration/` — API route tests
- `tests/e2e/` — Playwright browser tests

## Key Decisions

- **Why BFF over direct API calls:** Vue SPA exposed API keys in browser JS. Nuxt SSR keeps secrets server-side.
- **Why apiClient utility:** Prevents URL construction bugs (missing tenant prefix caused 401 errors).
- **Why Cloudflare Images via API redirect:** Single image endpoint works with both Cloudflare and Azure Blob based on tenant config.
