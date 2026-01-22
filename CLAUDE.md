# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SchoolVision Ecommerce built with Nuxt 3, implementing a Backend-for-Frontend (BFF) pattern for secure API handling. The key security improvement over the previous Vue SPA is that API secrets remain server-side and are never exposed to the browser.

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
npm run test:e2e:ui            # Run E2E tests with Playwright UI
npm run test:e2e:debug         # Debug E2E tests

# Run a single test file
npx vitest run tests/unit/stores/cart.test.ts
npx playwright test tests/e2e/shop.spec.ts
```

## Architecture

### BFF Security Pattern
Browser calls `/api/ecommerce/*` routes → Nuxt server adds API key + signs requests → forwards to Payment API. API secrets (`PAYMENT_API_SECRET`, `SIGNING_KEY`) are only in `runtimeConfig` (server-side), never exposed to the client.

### Multi-Tenant Theming
- **Theme Registry:** `config/themes/` contains theme configurations (colors, features, component overrides)
- **Theme Store:** `stores/theme.ts` manages theme state and applies CSS variables to `document.documentElement`
- **Veneer System:** Themes can override components via `componentOverrides` in theme config
- **Theme Detection:** URL param > subdomain > localStorage > runtimeConfig

### Directory Structure
```
server/
├── api/
│   ├── auth/           # Login, register, session, logout
│   └── ecommerce/      # Products, categories, payments, config
└── utils/api.ts        # getApiBaseUrl(), getApiHeaders() - adds secrets

stores/                 # Pinia stores (cart, auth, theme, toast, config)
composables/            # Vue composables (useToast, useDebounce, useFormValidation)
middleware/             # Route middleware (auth.ts, admin.ts)
config/themes/          # Theme configurations per school
components/
├── ui/                 # Reusable UI (Button, Card, Modal, Input, Toast)
├── layout/             # Header, Footer
├── shop/               # ProductCard, CartSidebar, Filters
├── checkout/           # CheckoutSteps, ShippingAddressForm, OrderSummary
├── auth/               # LoginModal, RegisterModal, AuthManager
└── theme/              # ThemedComponent, school-specific overrides
```

### Server API Route Pattern
All server routes in `server/api/` use runtime config for secrets:
```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const headers = {
    'X-API-Key': config.paymentApiSecret,  // Server-only
    'X-School-Code': config.public.schoolCode,
  }
  // Forward to Payment API with headers
})
```

### State Management
- **Cart Store:** Persists items via `pinia-plugin-persistedstate`
- **Auth Store:** Manages user session, persists `user`, `isAuthenticated`, `sessionToken`
- **Theme Store:** Persists `currentThemeId`, applies CSS variables on hydration

## Environment Variables

Server-side only (never exposed to browser):
- `PAYMENT_API_SECRET` - API key for Payment API
- `PAYMENT_API_BASE_URL` - Payment API URL
- `SIGNING_KEY` - HMAC signing key

Public (available client-side via `NUXT_PUBLIC_*`):
- `NUXT_PUBLIC_SCHOOL_CODE` - School identifier (westmoreland, windermere)
- `NUXT_PUBLIC_SCHOOL_NAME` - Display name
- `NUXT_PUBLIC_THEME` - Default theme ID

## Testing Structure

- `tests/unit/` - Unit tests for utils, composables, stores (Vitest + happy-dom)
- `tests/integration/` - API route tests
- `tests/e2e/` - End-to-end browser tests (Playwright)

Coverage includes: `utils/`, `composables/`, `stores/`, `server/api/`

## Key Files

- `nuxt.config.ts` - Runtime config, security headers (CSP, CORS), route rules
- `tailwind.config.js` - Design system with CSS variable-based theming
- `server/utils/api.ts` - Server-side API utilities with secret handling
- `config/themes/index.ts` - Theme registry and helper functions
