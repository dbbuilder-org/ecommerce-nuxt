# Ecommerce Vue to Nuxt Migration - Gap Analysis & Roadmap

## Executive Summary

**Original Vue App**: 72 Vue components, 10 views, complex state management, multi-tenant theming
**Current Nuxt App**: 5 components, 6 pages - basic e-commerce flow only

**Migration Completion: ~15%** - Core shopping flow works, but most features missing

---

## Current State (Nuxt App)

### What's Working
| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | ✅ Complete | Hero, categories, featured products |
| Shop Page | ✅ Basic | Grid display, category filtering |
| Cart Sidebar | ✅ Complete | Add/remove items, quantity controls |
| Checkout Page | ✅ Basic | Guest info form only |
| Payment Integration | ✅ Complete | BFF pattern with HMAC signing |
| Payment Response Pages | ✅ Complete | Success, error, cancelled |
| Cart Persistence | ✅ Complete | localStorage with client plugin |
| Security Headers | ✅ Complete | CSP, HSTS, XSS via nuxt-security |
| SSR | ✅ Complete | Server-side rendering enabled |

### Current File Count
- **Components**: 5 (Header, Footer, ProductCard, CartSidebar, Filters)
- **Pages**: 6 (index, shop, checkout, payment-*)
- **Stores**: 1 (cart)
- **Server API Routes**: 3 (products, categories, initiate-payment)
- **Layouts**: 1 (default)
- **Plugins**: 1 (cart-persist.client.ts)

---

## Gap Analysis: What's Missing

### 1. UI Component Library (Priority: HIGH)
The Vue app has a complete UI system. Nuxt app has none.

| Component | Vue App | Nuxt App | Complexity |
|-----------|---------|----------|------------|
| Button.vue | ✅ | ❌ | Low |
| Card.vue | ✅ | ❌ | Low |
| Modal.vue | ✅ | ❌ | Medium |
| Input.vue | ✅ | ❌ | Low |
| Badge.vue | ✅ | ❌ | Low |
| ToastNotification.vue | ✅ | ❌ | Medium |
| ToastManager.vue | ✅ | ❌ | Medium |
| PromoBanner.vue | ✅ | ❌ | Low |
| FloatingCartButton.vue | ✅ | ❌ | Low |

**Effort**: 2-3 days

### 2. Product Features (Priority: HIGH)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| ProductDetailsModal | ✅ (30KB) | ❌ | High |
| ProductMedia (gallery) | ✅ | ❌ | Medium |
| Product Search | ✅ | ❌ | Medium |
| Inventory Filter | ✅ | ❌ | Low |
| Category Carousel | ✅ | ❌ | Medium |
| Featured Items Carousel | ✅ | ❌ | Medium |

**Effort**: 3-4 days

### 3. Authentication System (Priority: HIGH)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| LoginModal | ✅ | ❌ | High |
| SignInSignUp flow | ✅ | ❌ | High |
| Forgot Password | ✅ | ❌ | Medium |
| Update Password | ✅ | ❌ | Medium |
| Email Validation | ✅ | ❌ | Medium |
| Session Management | ✅ | ❌ | Medium |
| User Store (Pinia) | ❌ | ❌ | Medium |

**Effort**: 4-5 days

### 4. Checkout Enhancements (Priority: HIGH)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| Multi-step checkout | ✅ (52KB) | ❌ Basic | High |
| Shipping Form | ✅ | ❌ | Medium |
| Pickup Location Selector | ✅ | ❌ | Medium |
| ShippingModal | ✅ | ❌ | Medium |
| Order validation | ✅ | ❌ Partial | Medium |
| Email exists check | ✅ | ❌ | Low |

**Effort**: 3-4 days

### 5. Multi-Tenant Theming (Priority: MEDIUM)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| Theme loader system | ✅ | ❌ | High |
| Westmoreland theme | ✅ | ✅ Partial | Low |
| Windermere theme | ✅ | ❌ | Medium |
| WindermereHeader | ✅ | ❌ | Medium |
| WindermereHero | ✅ | ❌ | Medium |
| Theme CSS injection | ✅ | ❌ | Medium |
| Runtime config per school | ✅ | ✅ Partial | Low |

**Effort**: 3-4 days

### 6. Admin Panel (Priority: LOW)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| FulfillmentAdmin | ✅ (27KB) | ❌ | High |
| Admin routes | ✅ | ❌ | Medium |
| Admin auth guard | ✅ | ❌ | Medium |

**Effort**: 3-4 days

### 7. Feature Flags System (Priority: MEDIUM)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| Config module (Vuex) | ✅ | ❌ | Medium |
| API-driven flags | ✅ | ❌ | Medium |
| Feature getters | ✅ | ❌ | Low |
| Auth mode switching | ✅ | ❌ | Medium |

**Effort**: 1-2 days

### 8. Services & API Layer (Priority: HIGH)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| ecommerceApi.js | ✅ | ❌ | High |
| SessionManager | ✅ | ❌ | Medium |
| CartPersistenceManager | ✅ | ✅ Basic | Medium |
| repository.js | ✅ | ❌ | Medium |
| camera.js | ✅ | ❌ | Low |
| toastService.js | ✅ | ❌ | Low |

**Effort**: 2-3 days

### 9. Legacy Workflow System (Priority: LOW)
Start.vue and screen components for legacy payment flows.

| Feature | Vue App | Nuxt App | Decision |
|---------|---------|----------|----------|
| Start.vue (31KB) | ✅ | ❌ | May deprecate |
| 13 screen components | ✅ | ❌ | May deprecate |
| WorkflowRouter | ✅ | ❌ | May deprecate |
| Action modals (6) | ✅ | ❌ | Migrate needed ones |

**Recommendation**: Evaluate if legacy flows are still needed

### 10. PWA & Progressive Features (Priority: LOW)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| PwaInstallPrompt | ✅ | ❌ | Medium |
| Service Worker | ✅ | ❌ | Medium |
| Manifest | ✅ | ❌ | Low |
| Offline support | ✅ | ❌ | High |

**Effort**: 2-3 days

### 11. Testing (Priority: MEDIUM)
| Feature | Vue App | Nuxt App | Complexity |
|---------|---------|----------|------------|
| Unit tests (*.test.ts) | ✅ 20+ files | ❌ | High |
| E2E tests (Playwright) | ✅ Config | ❌ | High |
| Test utilities | ✅ | ❌ | Medium |

**Effort**: 3-5 days

---

## Technical Debt in Current Nuxt App

1. **tailwind.config.js** - Contains old `./src/**` paths (non-critical, works anyway)
2. **No composables** - Should extract reusable logic
3. **No error boundaries** - Need global error handling
4. **No loading states** - Need skeleton loaders
5. **No form validation library** - Should add Zod/Vee-validate
6. **Hard-coded locationId** - Should be dynamic per school
7. **No API error handling UI** - Need user-friendly error messages
8. **No SEO optimization** - Need meta tags per page
9. **Missing reCAPTCHA** - Referenced in config but not implemented

---

## Migration Roadmap

### Phase 1: Core E-commerce Enhancement (Week 1-2)
**Goal**: Feature parity for basic shopping experience

1. [ ] UI Component Library
   - [ ] Button, Card, Badge, Input components
   - [ ] Modal component with portal
   - [ ] Toast notification system

2. [ ] Product Enhancements
   - [ ] Product Details Modal
   - [ ] Product search functionality
   - [ ] Inventory filtering (available only)
   - [ ] Product image gallery

3. [ ] Checkout Improvements
   - [ ] Multi-step checkout flow
   - [ ] Email validation (check existing user)
   - [ ] Phone number formatting
   - [ ] Form validation with Zod

### Phase 2: Authentication & User Management (Week 2-3)
**Goal**: Full authentication system

1. [ ] Auth Components
   - [ ] LoginModal component
   - [ ] SignIn/SignUp flow
   - [ ] Forgot password flow
   - [ ] Password update

2. [ ] Auth Store (Pinia)
   - [ ] User state management
   - [ ] Session handling
   - [ ] Token management

3. [ ] Auth API Routes
   - [ ] /api/auth/login
   - [ ] /api/auth/register
   - [ ] /api/auth/verify-email
   - [ ] /api/auth/forgot-password

4. [ ] Route Guards
   - [ ] Auth middleware
   - [ ] Protected routes

### Phase 3: Multi-Tenant & Theming (Week 3-4)
**Goal**: Support multiple schools

1. [ ] Theme System
   - [ ] Theme configuration loader
   - [ ] CSS variable injection
   - [ ] Runtime theme switching

2. [ ] School-Specific Components
   - [ ] WindermereHeader
   - [ ] WindermereHero
   - [ ] Theme-aware layouts

3. [ ] Environment Configuration
   - [ ] Per-school env files
   - [ ] Dynamic locationId
   - [ ] School-specific features

### Phase 4: Advanced Features (Week 4-5)
**Goal**: Shipping, fulfillment, feature flags

1. [ ] Shipping & Pickup
   - [ ] ShippingModal
   - [ ] PickupLocationSelector
   - [ ] Address validation

2. [ ] Feature Flags
   - [ ] Config store (Pinia)
   - [ ] API integration
   - [ ] Feature toggles in UI

3. [ ] Additional API Routes
   - [ ] /api/ecommerce/config
   - [ ] /api/ecommerce/locations
   - [ ] /api/ecommerce/validate-email

### Phase 5: Admin & Operations (Week 5-6)
**Goal**: Admin functionality

1. [ ] Admin Panel
   - [ ] FulfillmentAdmin page
   - [ ] Order management
   - [ ] Admin authentication

2. [ ] Reporting
   - [ ] Transaction history
   - [ ] Sales reports

### Phase 6: Polish & Testing (Week 6-7)
**Goal**: Production readiness

1. [ ] Testing
   - [ ] Unit tests for components
   - [ ] E2E tests for flows
   - [ ] API route tests

2. [ ] PWA Features
   - [ ] Install prompt
   - [ ] Service worker
   - [ ] Offline fallback

3. [ ] Performance
   - [ ] Image optimization
   - [ ] Code splitting audit
   - [ ] Lighthouse optimization

4. [ ] Documentation
   - [ ] API documentation
   - [ ] Deployment guide
   - [ ] Configuration guide

---

## File-by-File Migration Checklist

### Components to Create
- [ ] components/ui/Button.vue
- [ ] components/ui/Card.vue
- [ ] components/ui/Modal.vue
- [ ] components/ui/Input.vue
- [ ] components/ui/Badge.vue
- [ ] components/ui/Toast.vue
- [ ] components/ui/ToastManager.vue
- [ ] components/ui/PromoBanner.vue
- [ ] components/product/ProductDetailsModal.vue
- [ ] components/product/ProductMedia.vue
- [ ] components/product/CategoryCarousel.vue
- [ ] components/product/FeaturedItems.vue
- [ ] components/auth/LoginModal.vue
- [ ] components/auth/SignUpForm.vue
- [ ] components/auth/ForgotPassword.vue
- [ ] components/checkout/ShippingForm.vue
- [ ] components/checkout/PickupSelector.vue
- [ ] components/checkout/CheckoutSteps.vue

### Pages to Create
- [ ] pages/admin/index.vue
- [ ] pages/admin/fulfillments.vue
- [ ] pages/account/index.vue (optional)

### Stores to Create
- [ ] stores/user.ts (authentication)
- [ ] stores/config.ts (feature flags)
- [ ] stores/toast.ts (notifications)
- [ ] stores/products.ts (product cache)

### Server Routes to Create
- [ ] server/api/auth/login.post.ts
- [ ] server/api/auth/register.post.ts
- [ ] server/api/auth/verify-email.post.ts
- [ ] server/api/auth/forgot-password.post.ts
- [ ] server/api/ecommerce/config.get.ts
- [ ] server/api/ecommerce/locations.get.ts
- [ ] server/api/ecommerce/validate-email.post.ts
- [ ] server/api/admin/fulfillments.get.ts

### Composables to Create
- [ ] composables/useAuth.ts
- [ ] composables/useToast.ts
- [ ] composables/useProduct.ts
- [ ] composables/useTheme.ts
- [ ] composables/useFeatureFlags.ts

### Middleware to Create
- [ ] middleware/auth.ts
- [ ] middleware/admin.ts

---

## Estimated Effort Summary

| Phase | Features | Effort |
|-------|----------|--------|
| Phase 1 | Core E-commerce | 8-10 days |
| Phase 2 | Authentication | 6-8 days |
| Phase 3 | Multi-Tenant | 5-7 days |
| Phase 4 | Advanced Features | 5-7 days |
| Phase 5 | Admin | 4-6 days |
| Phase 6 | Polish & Testing | 5-7 days |
| **Total** | **Full Migration** | **33-45 days** |

---

## Recommendations

### Immediate Actions
1. **Create UI component library first** - Everything else depends on it
2. **Add ProductDetailsModal** - Critical for shopping experience
3. **Implement toast notifications** - Needed for UX feedback

### Architecture Decisions Needed
1. **Legacy workflow system** - Keep or deprecate Start.vue and screens?
2. **PWA support** - Is offline mode required?
3. **Camera integration** - Is this feature still used?

### Quick Wins
1. Fix tailwind.config.js content paths
2. Add SEO meta tags to all pages
3. Add skeleton loading states
4. Implement reCAPTCHA (config exists, code missing)

---

## Version Milestone Targets

### v1.0.0 - MVP (Current + Phase 1)
- Basic shopping flow ✅
- Product details modal
- UI components
- Toast notifications
- Form validation

### v1.1.0 - Authentication
- User login/register
- Session management
- Protected routes
- Email verification

### v1.2.0 - Multi-Tenant
- Theme system
- Windermere support
- School-specific configs

### v1.3.0 - Full Feature Parity
- Shipping/pickup
- Feature flags
- Admin panel
- All Vue app features

### v2.0.0 - Enhanced
- PWA support
- Full test coverage
- Performance optimized
- Production hardened
