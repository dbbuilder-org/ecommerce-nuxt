/**
 * Westmoreland Veneer Configuration
 *
 * Complete configuration for the Westmoreland County Community College theme including:
 * - Color palette (Blue primary with red accents)
 * - Feature flags (pickup-focused, standard features)
 * - Navigation structure
 * - Content/copy
 * - Assets
 * - Contact information
 * - Quick actions
 */

export interface WestmorelandVeneerConfig {
  displayName: string
  theme: string
  features: WestmorelandFeatures
  colors: WestmorelandColors
  assets: WestmorelandAssets
  navigation: WestmorelandNavigation
  content: WestmorelandContent
  contact: WestmorelandContact
  quickActions: WestmorelandQuickAction[]
  departments: WestmorelandDepartment[]
}

export interface WestmorelandFeatures {
  megaMenu: boolean
  searchBar: boolean
  scrollEffects: boolean
  heroSection: boolean
  quickActions: boolean
  shopByDepartment: boolean
  featuredItems: boolean
  contactInMenu: boolean
  pickupLocations: boolean
  digitalDownloads: boolean
}

export interface WestmorelandColors {
  primary: string
  primaryDark: string
  accent: string
  accentHover: string
  headerBg: string
  highlight: string
  highlightHover: string
}

export interface WestmorelandAssets {
  logo: string
  logoAlt: string
  heroImage: string
  favicon?: string
}

export interface WestmorelandNavItem {
  label: string
  path: string
  badge?: string
}

export interface WestmorelandNavigation {
  shop: {
    title: string
    items: WestmorelandNavItem[]
  }
  services: {
    title: string
    items: WestmorelandNavItem[]
  }
  help: {
    title: string
    items: WestmorelandNavItem[]
  }
}

export interface WestmorelandContent {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  ctaPrimary: string
  ctaSecondary: string
  quickActionsTitle: string
  quickActionsSubtitle: string
  welcomeMessage: string
  trustBand: {
    pickup: string
    quality: string
    support: string
  }
}

export interface WestmorelandContact {
  email: string
  phone: string
  address: string
  hours: string
}

export interface WestmorelandQuickAction {
  id: string
  label: string
  description: string
  path: string
  icon: string
  highlight?: boolean
}

export interface WestmorelandDepartment {
  id: string
  label: string
  path: string
  icon?: string
}

/**
 * Westmoreland Veneer Configuration
 * Blue theme with red accents - community college bookstore
 */
export const westmorelandVeneerConfig: WestmorelandVeneerConfig = {
  displayName: 'Westmoreland Bookstore',
  theme: 'westmoreland',

  features: {
    megaMenu: false, // Uses simpler navigation
    searchBar: true,
    scrollEffects: false, // Keep it simple
    heroSection: true,
    quickActions: true,
    shopByDepartment: true,
    featuredItems: true,
    contactInMenu: true,
    pickupLocations: true, // Key feature - pickup only
    digitalDownloads: true, // Course materials
  },

  colors: {
    primary: '#7EB3D7',
    primaryDark: '#5a9bc7',
    accent: '#0c85b6',
    accentHover: '#0a6b94',
    headerBg: '#7EB3D7',
    highlight: '#992222',
    highlightHover: '#7a1b1b',
  },

  assets: {
    logo: '/images/westmoreland/wccc-logo.png',
    logoAlt: 'Westmoreland County Community College Bookstore',
    heroImage: '/images/westmoreland/campus-hero.jpg',
  },

  navigation: {
    shop: {
      title: 'Shop',
      items: [
        { label: 'All Products', path: '/shop' },
        { label: 'Textbooks', path: '/shop?category=textbooks' },
        { label: 'Course Materials', path: '/shop?category=course-materials' },
        { label: 'School Supplies', path: '/shop?category=supplies' },
        { label: 'Apparel', path: '/shop?category=apparel' },
        { label: 'Gifts & Accessories', path: '/shop?category=gifts' },
      ],
    },
    services: {
      title: 'Services',
      items: [
        { label: 'Textbook Rentals', path: '/services/rentals' },
        { label: 'Course Materials List', path: '/course-materials' },
        { label: 'Buyback Program', path: '/services/buyback' },
        { label: 'Digital Downloads', path: '/services/digital' },
      ],
    },
    help: {
      title: 'Help',
      items: [
        { label: 'Contact Us', path: '/contact' },
        { label: 'Pickup Locations', path: '/pickup-locations' },
        { label: 'Return Policy', path: '/returns' },
        { label: 'FAQs', path: '/faq' },
      ],
    },
  },

  content: {
    heroTitle: 'Welcome to the Bookstore',
    heroSubtitle: 'Westmoreland County Community College',
    heroDescription: 'Your source for textbooks, course materials, and official WCCC merchandise. Order online, pick up on campus.',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'Find Your Books',
    quickActionsTitle: 'Quick Links',
    quickActionsSubtitle: 'Find what you need fast',
    welcomeMessage: 'Serving the Westmoreland community with quality educational materials',
    trustBand: {
      pickup: 'Campus Pickup',
      quality: 'Official Materials',
      support: 'Student Support',
    },
  },

  contact: {
    email: 'bookstore@westmoreland.edu',
    phone: '(724) 925-4000',
    address: '145 Pavilion Lane, Youngwood, PA 15697',
    hours: 'Mon-Fri 8am-5pm',
  },

  quickActions: [
    {
      id: 'textbooks',
      label: 'Textbooks',
      description: 'Find your required textbooks',
      path: '/shop?category=textbooks',
      icon: 'book',
      highlight: true,
    },
    {
      id: 'supplies',
      label: 'Supplies',
      description: 'Notebooks, pens, and more',
      path: '/shop?category=supplies',
      icon: 'pencil',
    },
    {
      id: 'apparel',
      label: 'WCCC Apparel',
      description: 'Show your Wolverine pride',
      path: '/shop?category=apparel',
      icon: 'tshirt',
    },
    {
      id: 'course-materials',
      label: 'Course Materials',
      description: 'Required materials by course',
      path: '/course-materials',
      icon: 'list',
    },
  ],

  departments: [
    { id: 'textbooks', label: 'Textbooks', path: '/shop?category=textbooks', icon: 'book' },
    { id: 'supplies', label: 'Supplies', path: '/shop?category=supplies', icon: 'pencil' },
    { id: 'apparel', label: 'Apparel', path: '/shop?category=apparel', icon: 'tshirt' },
    { id: 'gifts', label: 'Gifts', path: '/shop?category=gifts', icon: 'gift' },
    { id: 'technology', label: 'Technology', path: '/shop?category=technology', icon: 'computer' },
    { id: 'snacks', label: 'Snacks & Drinks', path: '/shop?category=snacks', icon: 'coffee' },
  ],
}

// Default icon path (shopping bag)
const DEFAULT_ICON_PATH = 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6'

/**
 * Get icon SVG path for quick action icons
 */
export function getWestmorelandIconPath(iconName: string): string {
  const icons: Record<string, string> = {
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    pencil: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    tshirt: 'M3 5a2 2 0 012-2h2.25a2 2 0 011.5.667L10 5h4l1.25-1.333A2 2 0 0116.75 3H19a2 2 0 012 2v2a2 2 0 01-2 2h-1v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a2 2 0 01-2-2V5z',
    list: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    gift: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    computer: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    coffee: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3',
    shopping: DEFAULT_ICON_PATH,
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    menu: 'M4 6h16M4 12h16M4 18h16',
    cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    close: 'M6 18L18 6M6 6l12 12',
    chevronDown: 'M19 9l-7 7-7-7',
    chevronRight: 'M9 5l7 7-7 7',
    check: 'M5 13l4 4L19 7',
    location: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  }
  return icons[iconName] ?? DEFAULT_ICON_PATH
}

export default westmorelandVeneerConfig
