/**
 * Windermere Veneer Configuration
 *
 * Extended configuration for the Windermere theme veneer.
 * This includes feature flags, layout options, assets, and
 * content that is specific to Windermere Preparatory School.
 *
 * Synced with: ecommerce-app/src/themes/veneer/windermere/config.js
 */

export interface WindermereVeneerConfig {
  name: string
  displayName: string
  parentBrand: string
  theme: string
  features: WindermereFeatures
  colors: WindermereColors
  assets: WindermereAssets
  navigation: WindermereNavigation
  content: WindermereContent
  contact: WindermereContact
  links?: WindermereLinks
  quickActions: WindermereQuickAction[]
  grades: WindermereGrade[]
  collections: WindermereCollection[]
}

export interface WindermereLinks {
  parentPortal?: string
  schoolWebsite?: string
}

export interface WindermereFeatures {
  megaMenu: boolean
  megaMenuIcons: boolean
  searchBar: boolean
  scrollEffects: boolean
  scrollHeaderShrink: boolean
  announcementBar: boolean
  parentPortalLink: boolean
  userAvatarCircle: boolean
  heroSection: boolean
  quickActions: boolean
  shopByGrade: boolean
  shopByCollection: boolean
  featuredItems: boolean
  contactInMenu: boolean
  instagramLink: boolean
  promoBanner: boolean
}

export interface WindermereColors {
  primary: string
  primaryLight: string
  primaryDark: string
  accent: string
  accentHover: string
  // Primary action buttons - dark navy for white text contrast
  primaryActionBg: string
  primaryActionBgHover: string
  headerBg: string
  menuBg: string
  menuBorder: string
  menuText: string
  menuTextHover: string
  ctaButton: string
  ctaButtonText: string
  ctaButtonHover: string
}

export interface WindermereAssetIcons {
  shop: string
  peUniforms: string
  coldDayGear: string
  spiritItems: string
  newToSchool: string
  seasonal: string
}

export interface WindermereLifestyleImages {
  studentsEntering: string
  studentsEmbracing: string
  studentSupplies: string
}

export interface WindermereAssets {
  logo: string
  logoAlt: string
  heroBackground: string
  heroBackgroundAlt: string
  favicon: string
  icons: WindermereAssetIcons
  lifestyle: WindermereLifestyleImages
}

export interface WindermereNavItem {
  label: string
  path?: string
  action?: string
  comingSoon?: boolean
}

export interface WindermereNavigation {
  shop: {
    title: string
    items: WindermereNavItem[]
  }
  browse: {
    title: string
    items: WindermereNavItem[]
  }
  discover: {
    title: string
    items: WindermereNavItem[]
  }
}

export interface WindermereContent {
  heroSubtitle: string
  heroTitle: string
  heroDescription: string
  ctaPrimary: string
  ctaSecondary: string
  quickActionsTitle: string
  quickActionsSubtitle: string
  collectionsTitle: string
  collectionsSubtitle: string
  brandStrip: string
  trustBand: {
    secure: string
    fast: string
    guest: string
  }
}

export interface WindermereContact {
  email: string
  phone: string
  phoneExtension?: string | null
  instagram: string
  website?: string
  address?: string
}

export interface WindermereQuickAction {
  id: string
  label: string
  description: string
  path?: string
  icon: string
  disabled?: boolean
}

export interface WindermereGrade {
  value: string
  label: string
}

export interface WindermereCollection {
  id: string
  label: string
  description: string | null
  icon: string
  type?: 'dropdown' | 'external'
}

/**
 * Windermere Veneer Configuration
 * Synced with: ecommerce-app/src/themes/veneer/windermere/config.js
 */
export const windermereVeneerConfig: WindermereVeneerConfig = {
  // Theme identification
  name: 'windermere',
  displayName: 'Windermere Preparatory School',
  parentBrand: 'Nord Anglia Education',
  theme: 'windermere',

  // Feature flags - enable/disable Windermere-specific features
  features: {
    megaMenu: true,
    megaMenuIcons: true,
    searchBar: true,
    scrollEffects: true,
    scrollHeaderShrink: true,
    announcementBar: true,
    parentPortalLink: true,
    userAvatarCircle: true,
    heroSection: true,
    quickActions: true,
    shopByGrade: true,
    shopByCollection: true,
    featuredItems: true,
    contactInMenu: true,
    instagramLink: true,
    promoBanner: true,
  },

  // Color palette - Windermere navy scheme
  colors: {
    primary: '#02233c',
    primaryLight: '#1a3a5c',
    primaryDark: '#011829',
    accent: '#9bd3dd',
    accentHover: '#7bc4d0',
    // Primary action buttons - dark navy for white text contrast
    primaryActionBg: '#02233c',
    primaryActionBgHover: '#011a2c',
    headerBg: '#02233c',
    menuBg: '#02233c',
    menuBorder: '#0b3b57',
    menuText: '#ffffff',
    menuTextHover: '#9bd3dd',
    ctaButton: '#9bd3dd',
    ctaButtonText: '#02233c',
    ctaButtonHover: '#ffffff',
  },

  // Asset paths - Windermere-specific images and icons
  assets: {
    logo: '/nord-anglia-school_windermere_logo_horizontal_white.png',
    logoAlt: 'Nord Anglia Education - Windermere Preparatory School',
    heroBackground: '/images/campus-store.png',
    heroBackgroundAlt: '/images/campus-store-interior.jpg',
    favicon: '/images/windermere-favicon.ico',
    icons: {
      shop: '/images/spirit-items.svg',
      peUniforms: '/images/pe-uniforms.svg',
      coldDayGear: '/images/cold-day-gear.svg',
      spiritItems: '/images/spirit-items.svg',
      newToSchool: '/images/new-to-school.svg',
      seasonal: '/images/seasonal-collection.svg',
    },
    lifestyle: {
      studentsEntering: '/images/group-of-students-entering-building.jpg',
      studentsEmbracing: '/images/group-of-happy-elementary-students-standing-embrac-2024-12-13-21-50-43-utc.jpg',
      studentSupplies: '/images/handsome-boy-child-putting-new-drawing-supplies-in-2025-05-15-12-29-02-utc.jpg',
    },
  },

  // Navigation structure for mega menu
  navigation: {
    shop: {
      title: 'Shop',
      items: [
        { label: 'All Products', path: '/shop' },
        { label: 'Uniforms', path: '/shop?category=uniforms' },
        { label: 'PE Gear', path: '/shop?category=pe' },
        { label: 'Cold Day Gear', path: '/shop?category=cold-day' },
        { label: 'Spirit Items', path: '/shop?category=spirit', comingSoon: true },
      ],
    },
    browse: {
      title: 'Browse by',
      items: [
        { label: 'Gender (Boys, Girls, Unisex)', action: 'filterGender' },
        { label: 'Grade (Elementary, Middle, High)', action: 'filterGrade' },
      ],
    },
    discover: {
      title: 'Discover more',
      items: [
        { label: 'Pick up Procedure for online orders', path: '/info/pickup' },
        { label: 'Store Location', path: '/info/location' },
        { label: 'Return Policy', path: '/info/returns' },
        { label: 'Uniform Policy', path: '/info/uniform-policy' },
      ],
    },
  },

  // Content/copy for various UI elements
  content: {
    heroSubtitle: 'WELCOME TO',
    heroTitle: 'WINDERMERE E-COMMERCE STORE',
    heroDescription: 'Windermere Preparatory School is the leading international prep school in Orlando and part of the worldwide Nord Anglia family of premium international schools. We are dedicated to supporting and inspiring your child to reach their greatest potential.',
    ctaPrimary: 'SHOP UNIFORMS',
    ctaSecondary: 'SIGN IN FOR FASTER CHECKOUT',
    quickActionsTitle: 'Quick Actions',
    quickActionsSubtitle: 'Find what you need quickly with our convenient category shortcuts',
    collectionsTitle: 'Shop by Collection',
    collectionsSubtitle: 'Explore our curated collections and find exactly what you need',
    brandStrip: 'Part of the Nord Anglia Education family',
    trustBand: {
      secure: 'Secure Payments',
      fast: 'Fast Checkout',
      guest: 'Guest Checkout',
    },
  },

  // Contact information
  contact: {
    email: 'campus.store@windermereprep.com',
    phone: '(407) 905-7737',
    instagram: 'https://instagram.com/windermereprep',
    website: 'https://www.windermereprep.com',
    address: '6189 Winter Garden-Vineland Road, Windermere, FL 34786',
  },

  // External links
  links: {
    parentPortal: 'https://www.windermereprep.com/parent-portal',
    schoolWebsite: 'https://www.windermereprep.com',
  },

  // Quick action buttons for landing page
  quickActions: [
    { id: 'shop', label: 'Shop', description: 'Browse all products', icon: 'shopping-bag', path: '/shop' },
    { id: 'pe', label: 'PE Uniforms', description: 'Athletic wear & gear', icon: 'user', path: '/shop?category=pe' },
    { id: 'cold', label: 'Cold Day Gear', description: 'Jackets & warm clothing', icon: 'moon', path: '/shop?category=cold-day' },
    { id: 'spirit', label: 'Spirit Items', description: 'Coming soon', icon: 'heart', disabled: true },
  ],

  // Grade levels for dropdown
  grades: [
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: '1st', label: '1st Grade' },
    { value: '2nd', label: '2nd Grade' },
    { value: '3rd', label: '3rd Grade' },
    { value: '4th', label: '4th Grade' },
    { value: '5th', label: '5th Grade' },
    { value: '6th', label: '6th Grade' },
    { value: '7th', label: '7th Grade' },
    { value: '8th', label: '8th Grade' },
    { value: '9th', label: '9th Grade' },
    { value: '10th', label: '10th Grade' },
    { value: '11th', label: '11th Grade' },
    { value: '12th', label: '12th Grade' },
  ],

  // Collections for "Shop by Collection" section
  collections: [
    { id: 'grade', label: 'Shop by Grade', description: null, type: 'dropdown', icon: 'book' },
    { id: 'seasonal', label: 'Seasonal Collection', description: 'Current season essentials', icon: 'sun' },
    { id: 'new-to-school', label: 'New to School', description: 'Everything you need to start', icon: 'book-open' },
    { id: 'pe', label: 'PE', description: 'Physical education gear', icon: 'bolt' },
    { id: 'cold-day', label: 'Cold Day Gear', description: 'Warm clothing & accessories', icon: 'moon' },
    { id: 'website', label: 'School Website', description: 'Visit our main site', type: 'external', icon: 'external-link' },
  ],
}

// Default icon path (shopping bag)
const DEFAULT_ICON_PATH = 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6'

/**
 * Get icon SVG path for quick action icons
 */
export function getIconPath(iconName: string): string {
  const icons: Record<string, string> = {
    tshirt: 'M3 5a2 2 0 012-2h2.25a2 2 0 011.5.667L10 5h4l1.25-1.333A2 2 0 0116.75 3H19a2 2 0 012 2v2a2 2 0 01-2 2h-1v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a2 2 0 01-2-2V5z',
    pencil: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    flag: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
    ruler: 'M4 5h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM4 13h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z',
    shopping: DEFAULT_ICON_PATH,
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    menu: 'M4 6h16M4 12h16M4 18h16',
    cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6',
    close: 'M6 18L18 6M6 6l12 12',
    chevronDown: 'M19 9l-7 7-7-7',
    chevronRight: 'M9 5l7 7-7 7',
    check: 'M5 13l4 4L19 7',
  }
  return icons[iconName] ?? DEFAULT_ICON_PATH
}

export default windermereVeneerConfig
