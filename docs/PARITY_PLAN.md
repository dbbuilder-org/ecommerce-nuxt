# Ecommerce Nuxt - Feature Parity Plan

**Goal:** Bring ecommerce-nuxt to full feature and aesthetic parity with ecommerce-app (Vue 2 SPA).

**Source:** Analysis of 50+ commits from `../ecommerce-app` covering theming, veneer system, UI redesign, CDN integration, and feature flags.

---

## Phase 1: Theme & Design System Alignment

### 1.1 CSS Variable System Update

**Current Gap:** Nuxt uses `--theme-*` variables, ecommerce-app uses `--header-color`, `--button-color`, etc.

**Tasks:**
- [ ] Update `types/theme.ts` to include all V1 core colors from ecommerce-app's `src/themes/types.js`:
  - `headerColor`, `headerHover`, `frameColor`, `buttonColor`, `buttonHover`
  - `primaryActionBg`, `primaryActionBgHover` (critical for contrast on dark themes)
  - `highlightButtonColor`, `highlightButtonHover`, `headerButtonColor`
  - `alertColor`, `alertHover`, `successColor`, `successHover`, `inactiveColor`
- [ ] Add V2 shadows: `--shadow-soft-*`, `--shadow-glow-*`
- [ ] Add V2 gradients: `--gradient-primary`, `--gradient-accent`, etc.
- [ ] Update `CSS_VARIABLE_MAP` to use ecommerce-app's naming convention
- [ ] Update `stores/theme.ts` to apply all new CSS variables

**Reference:** `ecommerce-app/src/themes/types.js:1-140`

### 1.2 Button Component - Flat Design System (2026)

**Current Gap:** Nuxt Button has shadows, transforms, old variants. Ecommerce-app uses flat design.

**Tasks:**
- [ ] Remove all shadows, gradients, and transforms from default button states
- [ ] Update to use CSS variables: `bg-[--primary-action-bg]` instead of `bg-primary-600`
- [ ] Add new variants matching ecommerce-app's Button.vue:
  - Core: `primary`, `secondary`, `outline`, `ghost`, `header`, `link`, `soft`
  - Danger: `danger`, `dangerGhost`
  - Quantity: `quantity`, `quantityMinus`, `quantityPlus`
  - Pills: `pill`, `pillActive`
  - Legacy aliases: `solid`, `headerAction`, `themedSecondary`, etc.
- [ ] Remove `hover:scale-105` and `hover:shadow-lg` transforms
- [ ] Add `appearance-none` to prevent browser 3D styling
- [ ] Update sizes to use `rounded-lg` instead of `rounded-2xl`

**Reference:** `ecommerce-app/src/components/ui/Button.vue:43-134`

### 1.3 Tailwind Config Update

**Tasks:**
- [ ] Add V2 soft shadows to `tailwind.config.js`:
  ```js
  boxShadow: {
    'soft-sm': 'var(--shadow-soft-sm, ...)',
    'soft': 'var(--shadow-soft, ...)',
    'glow-primary': 'var(--shadow-glow-primary, ...)',
    // etc.
  }
  ```
- [ ] Add gradient background utilities
- [ ] Use `md: '812px'` custom breakpoint (matches ecommerce-app SCSS)

---

## Phase 2: Veneer System Enhancement

### 2.1 Component Registry Pattern

**Current Gap:** Nuxt has `componentOverrides` in theme config but no dynamic loading system.

**Tasks:**
- [ ] Create `utils/veneer/componentRegistry.ts`:
  ```typescript
  const baseComponents = {
    LandingPage: () => import('~/pages/index.vue'),
    AppHeader: () => import('~/components/layout/Header.vue'),
    FeaturedItems: () => import('~/components/shop/FeaturedItems.vue'),
  }

  const themeOverrides = {
    windermere: {
      LandingPage: () => import('~/components/theme/windermere/WindermereLanding.vue'),
      AppHeader: () => import('~/components/theme/windermere/WindermereHeader.vue'),
    },
  }
  ```
- [ ] Create `components/theme/ThemedComponent.vue` that uses `defineAsyncComponent`
- [ ] Export `getThemedComponent()`, `hasThemeOverride()`, `getThemeOverrides()`

**Reference:** `ecommerce-app/src/themes/veneer/componentRegistry.js`

### 2.2 ThemedComponent Wrapper

**Tasks:**
- [ ] Create `components/theme/ThemedComponent.vue` with:
  - `name` prop for component lookup
  - Loading and error states
  - Props/events pass-through using `v-bind="$attrs"` equivalent
- [ ] Use `<Suspense>` for async component loading

**Reference:** `ecommerce-app/src/themes/veneer/ThemedComponent.vue`

---

## Phase 3: Windermere Theme Complete Implementation

### 3.1 Windermere Veneer Config

**Current Gap:** Missing comprehensive veneer config with assets, colors, navigation, content.

**Tasks:**
- [ ] Create `config/themes/windermere/config.ts` with:
  - Feature flags (megaMenu, searchBar, scrollEffects, heroSection, quickActions, etc.)
  - Color palette (navy #02233c, teal accent #9bd3dd, etc.)
  - Asset paths (logo, hero backgrounds, category icons)
  - Contact information
  - Content/copy for UI elements
  - Navigation structure for mega menu
  - Quick actions configuration
  - Grades and collections data

**Reference:** `ecommerce-app/src/themes/veneer/windermere/config.js:1-170`

### 3.2 WindermereHeader Enhancement

**Tasks:**
- [ ] Update to match ecommerce-app layout:
  - Hamburger menu on LEFT (mobile convention)
  - Remove Home button (logo = home)
  - Cart + Login on right with labels
  - Mega menu navigation (desktop dropdown)
  - Mobile dropdown menu with sections
  - Scroll-aware styling with `isScrolled` state
- [ ] Add `.mega-menu-button` class with `appearance: none`
- [ ] Use windermere config for colors, navigation, contact info
- [ ] Integrate CartSidebar component

**Reference:** `ecommerce-app/src/themes/veneer/windermere/WindermereHeader.vue`

### 3.3 WindermereLanding Page

**Tasks:**
- [ ] Create/update `components/theme/windermere/WindermereLanding.vue`:
  - Hero section with campus store background
  - Navy overlay with scroll fade
  - Trust band with glass effect
  - Quick action buttons section
  - FeaturedItems integration
  - Shop by Collection section
- [ ] Use veneer config for all content/assets

**Reference:** `ecommerce-app/src/themes/veneer/windermere/WindermereLanding.vue`

---

## Phase 4: Config System & Feature Flags

### 4.1 Runtime Config Expansion

**Tasks:**
- [ ] Add to `nuxt.config.ts` runtimeConfig:
  ```typescript
  // Delivery/Shipping (Windermere = shipping only)
  showPickupLocations: true,
  showShippingForm: false,
  shippingEnabled: false,
  pickupLocationsEnabled: true,

  // CDN Configuration
  cdnEnabled: false,
  cdnBaseUrl: '',
  cdnSchoolPath: '',

  // Cloudflare Images
  cfImagesEnabled: false,
  cfImagesAccountHash: '',
  cfImagesDefaultVariant: 'card',
  ```
- [ ] Environment variable mappings for all new config

### 4.2 Feature Flag Store

**Tasks:**
- [ ] Create/update `stores/config.ts` to match ecommerce-app pattern:
  - `loadConfiguration` action that fetches from `/api/ecommerce/config`
  - Window config overrides for client-specific settings
  - Default feature flags function
  - Getters: `shouldShowPickupLocations`, `shouldShowShippingForm`, `isShippingEnabled`

**Reference:** `ecommerce-app/src/store/store.js:37-192`

### 4.3 Multi-Tenant Config Files

**Tasks:**
- [ ] Create `public/config/` directory with tenant configs
- [ ] Or use environment variables with NUXT_PUBLIC_* prefixes
- [ ] Support per-tenant overrides:
  - API endpoints
  - Colors
  - Feature flags (Windermere: shipping only, no pickup)
  - CDN paths
  - Payment URLs

---

## Phase 5: CDN & Image Optimization

### 5.1 Cloudflare R2 CDN Integration

**Tasks:**
- [ ] Add CDN config to runtime config
- [ ] Create `utils/cdn.ts` with `getProductImageUrl()`:
  ```typescript
  export function getProductImageUrl(productId: number): string {
    const config = useRuntimeConfig()
    if (config.public.cdnEnabled) {
      return `${config.public.cdnBaseUrl}/${config.public.cdnSchoolPath}/product-${productId}.png`
    }
    // Fallback to API image endpoint
    return `${config.paymentApiBaseUrl}/api/images/${productId}`
  }
  ```
- [ ] Update ProductMedia/ProductCard to use CDN URLs

### 5.2 Cloudflare Images (Auto-resize)

**Tasks:**
- [ ] Support CF Images variants: `thumb` (200px), `card` (400px), `detail` (800px)
- [ ] Create `utils/cfImages.ts`:
  ```typescript
  export function getCfImageUrl(imageId: string, variant: string = 'card'): string {
    return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
  }
  ```

---

## Phase 6: FeaturedItems & Product Cards

### 6.1 FeaturedItems Theme Support

**Tasks:**
- [ ] Already has `variant` prop for dark/light - verify Windermere navy (#02233c) is used
- [ ] Add theme detection:
  ```typescript
  const isWindermereTheme = computed(() => {
    const config = useRuntimeConfig()
    return config.public.schoolCode === 'windermere' ||
           config.public.theme === 'windermere'
  })
  ```
- [ ] Dynamic background style based on theme
- [ ] Teal highlight (#9bd3dd) for "Items" text on dark variant

### 6.2 FeaturedItemCard Theming

**Tasks:**
- [ ] Add role pricing display support
- [ ] Sharp corners (`rounded-none`) for Windermere theme
- [ ] Badge styling per theme
- [ ] Use Button component with `solid` variant

---

## Phase 7: UI Polish & Accessibility

### 7.1 Modern Flat UI (2026 Design)

**Tasks:**
- [ ] Remove all button shadows in default state
- [ ] Use color changes on hover (not elevation)
- [ ] 44px minimum touch targets
- [ ] Strong focus-visible states
- [ ] ARIA attributes on interactive elements

### 7.2 Category Pills

**Tasks:**
- [ ] Add horizontal scrollable category pills to Shop page
- [ ] Use `pill` and `pillActive` button variants
- [ ] ARIA pressed states

### 7.3 Data Test IDs

**Tasks:**
- [ ] Add `data-testid` attributes matching ecommerce-app:
  - `cart-button`, `login-button`, `logout-button`
  - `product-card-{id}`, `add-to-cart-{id}`
  - `checkout-button`, `submit-order`

**Reference:** `ecommerce-app` commit `2f3b4aa`

---

## Phase 8: Server API Enhancements

### 8.1 Missing API Routes

**Tasks:**
- [ ] Verify/add all server routes from ecommerce-app:
  - `GET /api/ecommerce/products/category/:categoryId`
  - `GET /api/ecommerce/shipping-quotes`
  - `GET /api/ecommerce/featured-products`
  - `POST /api/ecommerce/validate-promo`
- [ ] Add proper error handling and fallbacks

### 8.2 DTO/Type Alignment

**Tasks:**
- [ ] Create `types/api.ts` with interfaces matching backend DTOs:
  ```typescript
  interface ProductDTO {
    id: number
    name: string
    price: number
    available: boolean
    glCode_Anthology?: string  // Legacy field
    rolePricing?: Record<string, number>
    categoryIds?: number[]
  }
  ```
- [ ] Response transformation in server routes to normalize data

---

## Phase 9: Testing & E2E

### 9.1 E2E Test Infrastructure

**Tasks:**
- [ ] Verify Playwright config matches ecommerce-app patterns
- [ ] Add E2E tests for:
  - Home page hero section
  - Shop page filtering
  - Cart sidebar
  - Checkout flow (guest + authenticated)
  - Theme switching

### 9.2 Smoke Tests

**Tasks:**
- [ ] Add smoke test script for deployment verification
- [ ] URL validation for tenant configs

---

## Priority Order

1. **Phase 1.2** - Button flat design (affects all UI)
2. **Phase 1.1** - CSS variables (foundation for theming)
3. **Phase 3.1** - Windermere veneer config
4. **Phase 3.2-3.3** - Windermere header/landing
5. **Phase 2** - Component registry (enables veneer system)
6. **Phase 4** - Feature flags & config
7. **Phase 5** - CDN integration
8. **Phase 6-7** - UI polish
9. **Phase 8-9** - API & testing

---

## Files to Create/Modify

### New Files:
- `utils/veneer/componentRegistry.ts`
- `utils/veneer/index.ts`
- `config/themes/windermere/config.ts`
- `types/api.ts`
- `utils/cdn.ts`
- `assets/css/theme.css`

### Modified Files:
- `types/theme.ts` - Add V1 core + V2 CSS variables
- `components/ui/Button.vue` - Flat design system
- `components/theme/windermere/WindermereHeader.vue` - Full parity
- `components/theme/windermere/WindermereLanding.vue` - Full parity
- `stores/theme.ts` - Apply new CSS variables
- `stores/config.ts` - Feature flags
- `nuxt.config.ts` - Runtime config expansion
- `tailwind.config.js` - Shadows, gradients
- `components/shop/FeaturedItems.vue` - Theme detection

---

## Estimated LOC Changes

| Phase | New Lines | Modified Lines |
|-------|-----------|----------------|
| 1     | 200       | 300            |
| 2     | 150       | 50             |
| 3     | 600       | 200            |
| 4     | 200       | 100            |
| 5     | 100       | 50             |
| 6-7   | 100       | 200            |
| 8-9   | 200       | 100            |
| **Total** | **~1,550** | **~1,000** |
