# Technical Debt & Open Issues

## Ecommerce Nuxt App - Status Report
**Last Updated:** 2026-01-07
**Compared Against:** Vue ecommerce-app (comprehensive parity check)

---

## Executive Summary

The Nuxt migration represents a **modern redesign** optimized for e-commerce. This document tracks gaps against the Vue version and new requirements for video support and theming.

### Priority Matrix

| Phase | Focus | Items | Status |
|-------|-------|-------|--------|
| **Phase 0** | Video & Theming Foundation | 6 | TODO |
| **Phase 1** | Critical E-commerce Gaps | 3 | TODO |
| **Phase 2** | Feature Parity | 4 | TODO |
| **Phase 3** | Enhancements | 3 | TODO |

### Gap Summary

| Category | Items | Critical |
|----------|-------|----------|
| Video Support | 4 | 2 |
| Theming/Veneer System | 5 | 2 |
| Missing Pages | 4 | 1 |
| Missing Components | 15+ | 3 |
| Missing Features | 8 | 2 |
| Downgraded Systems | 3 | 1 |

---

## Phase 0: Video & Theming Foundation (NEW)

### 0.1 Extensive Video Support - REQUIRED

The Nuxt app needs comprehensive video support throughout:

| Location | Requirement | Priority |
|----------|-------------|----------|
| **ProductMedia Component** | Unified image/video component with auto-detection | P0 |
| **Product Cards** | Products can have video instead of/with images | P0 |
| **Hero Sections** | Video background support (autoplay, muted, loop) | P0 |
| **Featured Items Carousel** | Mixed image/video items | P1 |
| **Category Cards** | Optional video backgrounds | P2 |
| **Product Detail Modal** | Full video player with controls | P1 |

**Video Format Support Required:**
- MP4, M4V (video/mp4)
- WebM (video/webm)
- MOV (video/quicktime)
- OGG, OGV (video/ogg)

**Video Features Required:**
- Auto-detection from file extension
- Poster/thumbnail image support
- Play/pause controls
- Autoplay (muted) for backgrounds
- Loop support
- Play overlay button
- Video badge indicator
- Mobile-friendly (playsinline for iOS)
- Error handling with fallback
- Lazy loading

### 0.2 Theme Veneer System - REQUIRED

Vue uses a sophisticated veneer system where Windermere and Westmoreland share code but diverge via component overrides:

**Architecture Required:**

```
config/themes/
├── index.ts                    # Theme system exports
├── types.ts                    # Theme type definitions
├── themeLoader.ts              # Runtime theme initialization
├── cssVariables.ts             # CSS variable injection
├── westmoreland.ts             # Westmoreland theme config
├── westmoreland2.ts            # Westmoreland V2 (soft modern)
├── windermere.ts               # Windermere theme config
├── windermere2.ts              # Windermere V2 (enhanced)
└── veneer/
    ├── index.ts                # Veneer system
    ├── componentRegistry.ts    # Component override registry
    ├── ThemedComponent.vue     # Dynamic component loader
    └── windermere/
        ├── config.ts           # Extended Windermere config
        ├── WindermereHeader.vue
        ├── WindermereHero.vue
        └── WindermereLanding.vue
```

**Theme Divergence (Vue Reference):**

| Feature | Westmoreland | Windermere |
|---------|--------------|------------|
| Header | GenericHeader | WindermereHeader (mega menu, search) |
| Hero | GenericHero | WindermereHero (video bg, scroll effects) |
| Landing | LandingPage | WindermereLanding (quick actions, collections) |
| Colors | Blue palette | Navy + teal palette |
| Mega Menu | No | Yes |
| Search Bar | No | Yes |
| Scroll Effects | No | Yes |
| Shop by Grade | No | Yes |
| Quick Actions | No | Yes |

**CSS Variables Required (V1 + V2):**

```css
/* Core Colors (18) */
--header-color, --header-hover, --frame-color, --button-color, --button-hover,
--highlight-button-color, --highlight-button-hover, --header-button-color,
--text-color, --light-text-color, --button-text-color, --header-text-color,
--header-button-text-color, --alert-color, --alert-hover, --success-color,
--success-hover, --inactive-color

/* V2 Shadows (9) */
--shadow-soft, --shadow-soft-sm, --shadow-soft-lg, --shadow-soft-xl,
--shadow-glow-primary, --shadow-glow-primary-lg, --shadow-glow-accent,
--shadow-glow-accent-lg, --shadow-glow-success

/* V2 Gradients (4) */
--gradient-primary, --gradient-accent, --gradient-success, --gradient-surface

/* V2 Glass Morphism (3) */
--glass-bg, --glass-border, --glass-bg-dark

/* V2 Border Radii (6) */
--radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-2xl, --radius-full

/* V2 Transitions (4) */
--transition-fast, --transition-normal, --transition-slow, --transition-bounce
```

---

## Phase 1: Critical E-commerce Gaps

### 1.1 Payment Response Handler - MISSING
| Item | Status | Notes |
|------|--------|-------|
| `/payment-response` page | **MISSING** | Vue has `PaymentResponse.vue` for WorldPay callbacks |
| **Impact** | Payment callbacks may not redirect properly |
| **Fix Required** | Create `pages/payment-response.vue` |

### 1.2 FeaturedItems Component - MISSING
| Item | Status | Notes |
|------|--------|-------|
| Featured products carousel | **MISSING** | Homepage lacks featured products section |
| **Vue Location** | `src/components/FeaturedItems.vue` |
| **Fix Required** | Create carousel with video support |

### 1.3 Cart Persistence Downgrade
- **Vue Version:** Advanced cart persistence with:
  - School-specific isolation (per-school carts)
  - 24-hour expiration with automatic cleanup
  - Payment recovery system (30-minute timeout recovery)
  - Session management (60-minute timeout)
- **Nuxt Version:** Basic persistence via `pinia-plugin-persistedstate`
- **Missing:**
  - [ ] School-specific cart isolation
  - [ ] Cart expiration time management
  - [ ] Payment recovery after timeout

---

## Phase 2: Feature Parity

### 2.1 ProductMedia Component
- Advanced image zoom/gallery
- Video playback support
- Poster images
- Error handling

### 2.2 CategoryCarousel Component
- Horizontal scrolling category cards
- Optional video backgrounds
- Touch/swipe support

### 2.3 Session Timeout Handling
- 60-minute session timeout (Vue reference)
- Warning before timeout
- Auto-logout

### 2.4 Feature Flag Test Page
- `/test-flags` route for debugging
- Display all feature flags
- Configuration status

---

## Phase 3: Enhancements

### 3.1 Server-side Search
- Search API endpoint
- Autocomplete suggestions
- Search analytics

### 3.2 Sitemap Generation
- Dynamic sitemap for products
- Category pages
- SEO optimization

### 3.3 Analytics Integration
- Google Analytics 4
- Conversion tracking
- E-commerce events

---

## Completed Items (2026-01-07)

- [x] Receipt API (`/api/ecommerce/receipt`)
- [x] Email Receipt API (`/api/ecommerce/email-receipt`)
- [x] Orders API (`/api/ecommerce/orders`)
- [x] Validate Promo API (`/api/ecommerce/validate-promo`)
- [x] Account page with profile, orders, settings
- [x] Promo code support in checkout
- [x] Error handling composable
- [x] Global error page
- [x] SEO composable with Open Graph/JSON-LD
- [x] Product image URL transformation
- [x] Category field transformation
- [x] Database fix for IsActive flag

---

## Vue → Nuxt Feature Parity Matrix

### Core E-commerce Features
| Feature | Vue | Nuxt | Status |
|---------|-----|------|--------|
| Shop/Browse Products | ✓ | ✓ | PARITY |
| Product Details | ✓ | Partial | Missing ProductMedia |
| Shopping Cart | ✓ | ✓ | PARITY (simplified) |
| Checkout Flow | ✓ | ✓ | PARITY |
| Payment Processing | ✓ | ✓ | PARITY |
| Payment Response | ✓ | ✗ | **MISSING** |
| Authentication | ✓ | ✓ | PARITY |
| Promo Codes | ✗ | ✓ | NEW |

### Video Support
| Feature | Vue | Nuxt | Status |
|---------|-----|------|--------|
| ProductMedia component | ✓ | ✗ | **MISSING** |
| Video in product cards | ✓ | ✗ | **MISSING** |
| Hero video backgrounds | ✓ | ✗ | **MISSING** |
| Video auto-detection | ✓ | ✗ | **MISSING** |
| Video poster images | ✓ | ✗ | **MISSING** |

### Theming System
| Feature | Vue | Nuxt | Status |
|---------|-----|------|--------|
| Base themes | ✓ | Partial | Missing V2 variants |
| Veneer system | ✓ | ✗ | **MISSING** |
| Component overrides | ✓ | ✗ | **MISSING** |
| CSS variable injection | ✓ | ✗ | **MISSING** |
| WindermereHeader | ✓ | ✗ | **MISSING** |
| WindermereHero | ✓ | ✗ | **MISSING** |
| Mega menu | ✓ | ✗ | **MISSING** |

### Legacy Features (Intentionally Removed)
| Feature | Vue | Nuxt | Status |
|---------|-----|------|--------|
| Legacy Payment Portal | ✓ | ✗ | REMOVED |
| Multi-step Workflow | ✓ | ✗ | REMOVED |
| Camera/Identity | ✓ | ✗ | REMOVED |
| Image Editing | ✓ | ✗ | REMOVED |

---

## Implementation Order

### Phase 0: Video & Theming Foundation
```
0.1 Create ProductMedia.vue component (video/image unified)
0.2 Update ProductCard.vue to use ProductMedia
0.3 Add video background support to hero sections
0.4 Create theme veneer system infrastructure
0.5 Create Windermere theme overrides (Header, Hero, Landing)
0.6 Test and commit → Tag v1.7.0-phase0
```

### Phase 1: Critical Gaps
```
1.1 Create /payment-response page
1.2 Create FeaturedItems carousel with video support
1.3 Implement cart expiration/recovery
1.4 Test and commit → Tag v1.7.0-phase1
```

### Phase 2: Feature Parity
```
2.1 Add ProductMedia zoom/gallery features
2.2 Create CategoryCarousel component
2.3 Implement session timeout
2.4 Create feature flag test page
2.5 Test and commit → Tag v1.7.0-phase2
```

### Phase 3: Enhancements
```
3.1 Server-side search API
3.2 Sitemap generation
3.3 Analytics integration
3.4 Test and commit → Tag v1.7.0
```

---

## Notes

- **Nuxt App:** https://ecommerce-nuxt-seven.vercel.app
- **Vue App (staging):** https://westmoreland-staging.schoolvision.io
- **Backend API:** https://paymentapi-ecommerce-test-v2.azurewebsites.net
- **Database:** sqltest.schoolvision.net / TEST_ECOMMERCE_WESTMORELAND

### Intentionally Omitted Features
1. **Legacy Payment Portal** - Replaced with standard e-commerce checkout
2. **Multi-step Workflow Engine** - Not needed for e-commerce focus
3. **Camera/Identity Verification** - Out of scope for e-commerce
4. **Image Editing** - Out of scope for e-commerce
