# Multi-Tenant Security Architecture

## Overview

The ecommerce-nuxt application is a multi-tenant system where each school/organization has its own deployment. Security is enforced through:

1. **Per-tenant API Keys** - Each deployment must have a unique API key
2. **Server-Side Tenant Routing** - All API calls go through Nuxt server routes
3. **Backend Validation** - PaymentAPI validates API key matches the requested tenant

## Environment Variables

Each deployment MUST configure these environment variables:

```bash
# Server-only secrets (never exposed to client)
NUXT_PAYMENT_API_SECRET=<unique-api-key-for-this-tenant>
NUXT_PAYMENT_API_BASE_URL=https://paymentapi-ecommerce-test-v2.azurewebsites.net

# Public config (identifies the tenant)
NUXT_PUBLIC_SCHOOL_CODE=westmoreland   # Must match API key's authorized tenant
NUXT_PUBLIC_SCHOOL_NAME=Westmoreland County Community College
NUXT_PUBLIC_DEFAULT_THEME=westmoreland
```

## Security Model

### How It Works

```
┌──────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│   Browser/Client │────▶│  Nuxt Server API   │────▶│   PaymentAPI     │
│                  │     │                    │     │                  │
│  No secrets      │     │  Has API key       │     │  Validates key   │
│  No direct API   │     │  Routes by tenant  │     │  against tenant  │
└──────────────────┘     └────────────────────┘     └──────────────────┘
```

1. **Client** calls Nuxt server routes (`/api/ecommerce/*`)
2. **Nuxt Server** reads `NUXT_PAYMENT_API_SECRET` and `NUXT_PUBLIC_SCHOOL_CODE`
3. **Nuxt Server** calls PaymentAPI with headers:
   - `X-API-Key: <api-secret>`
   - `X-School-Code: <school-code>`
4. **PaymentAPI** validates that the API key is authorized for the requested school code
5. **PaymentAPI** returns data only from that tenant's database

### Why This Is Secure

- **API key is server-only**: Never sent to browser, only used in server routes
- **Per-tenant keys**: Each school has a unique API key that only works for their data
- **Backend validation**: Even if someone changes `schoolCode`, the API key won't work for other tenants
- **No direct API access**: Client can't bypass Nuxt server to call PaymentAPI directly

## Deployment Configuration

### Westmoreland Deployment
```bash
NUXT_PAYMENT_API_SECRET=west-api-key-abc123...
NUXT_PUBLIC_SCHOOL_CODE=westmoreland
NUXT_PUBLIC_SCHOOL_NAME=Westmoreland County Community College
NUXT_PUBLIC_DEFAULT_THEME=westmoreland
```

### Windermere Deployment
```bash
NUXT_PAYMENT_API_SECRET=wind-api-key-xyz789...
NUXT_PUBLIC_SCHOOL_CODE=windermere
NUXT_PUBLIC_SCHOOL_NAME=Windermere Preparatory School
NUXT_PUBLIC_DEFAULT_THEME=windermere
```

## PaymentAPI Backend Requirements

The PaymentAPI MUST implement API key validation:

```vb
' Pseudo-code for PaymentAPI validation
Public Function ValidateApiKey(apiKey As String, schoolCode As String) As Boolean
    ' Look up which tenant this API key is authorized for
    Dim authorizedTenant = GetTenantForApiKey(apiKey)

    ' Reject if key is invalid or doesn't match requested tenant
    If String.IsNullOrEmpty(authorizedTenant) Then Return False
    If authorizedTenant <> schoolCode Then Return False

    Return True
End Function
```

## Footer/Contact Configuration

Footer contact information is read in this priority order:

1. **Environment variables** (highest priority - per-deployment override)
   - `NUXT_PUBLIC_CONTACT_EMAIL`
   - `NUXT_PUBLIC_CONTACT_PHONE`
   - `NUXT_PUBLIC_FOOTER_ADDRESS`
   - `NUXT_PUBLIC_SCHOOL_WEBSITE`
   - `NUXT_PUBLIC_PARENT_PORTAL`

2. **Veneer configuration** (theme-based defaults)
   - Defined in `config/themes/{theme}/veneer.ts`
   - Contains school-specific contact info, links, features

3. **Fallback defaults** (if nothing else configured)
   - Generic SchoolVision placeholders

## Azure Static Web Apps Configuration

For Azure SWA deployments, configure environment variables in the portal or `staticwebapp.config.json`:

```json
{
  "platform": {
    "apiRuntime": "node:18"
  }
}
```

Then in Azure Portal > Configuration > Application settings:
- `NUXT_PAYMENT_API_SECRET`: Your tenant's unique API key
- `NUXT_PUBLIC_SCHOOL_CODE`: Your tenant code
- etc.

## Security Checklist

- [ ] Each deployment has a unique `NUXT_PAYMENT_API_SECRET`
- [ ] API key is authorized only for the specified `NUXT_PUBLIC_SCHOOL_CODE`
- [ ] PaymentAPI validates API key matches tenant on every request
- [ ] No sensitive keys are in `NUXT_PUBLIC_*` variables
- [ ] Client-side code cannot call PaymentAPI directly (CORS blocks it)
