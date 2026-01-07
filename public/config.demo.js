//api and recaptcha - SCHOOLVISION DEMO
// Default configuration for unrecognized hostnames
// Showcases SchoolVision ecommerce platform capabilities

// ========================================
// API ENDPOINTS (uses Westmoreland demo data)
// ========================================
window.VUE_CONFIG_API = "https://paymentapi-ecommerce.schoolvision.io/westmoreland/api/"
window.VUE_CONFIG_API_IMAGE = "https://paymentapi-ecommerce.schoolvision.io/westmoreland/api/"
window.VUE_CONFIG_API_ECOMMERCE = "https://paymentapi-ecommerce.schoolvision.io/westmoreland/api/ecommerce/"

// ========================================
// HERO BACKGROUND
// ========================================
window.HERO_BACKGROUND_IMAGE = "/img/hero-background.jpg"

// ========================================
// AUTHENTICATION & SECURITY
// ========================================
window.RECAPTCHA = '6Ld4dqkdAAAAAAHq9rPfvqbcStxmKtoLQ9QI96oK'
window.ECOMMERCE_API_KEY = "ecommerce-key-2025"
window.ECOMMERCE_GUEST_USER = "ecommerce_guest"
window.ECOMMERCE_GUEST_KEY = "readonly_guest_2024"

// ========================================
// LOCATION INFORMATION
// ========================================
window.PAYMENT_LOCATION_ID = 622103005
window.LOCATION_NAME = "SchoolVision Demo Store"
window.LOCATION_PHONE = "(555) 123-4567"
window.LOCATION_ADDRESS = "Demo Mode - Contact SchoolVision for your school"
window.LOCATION_EMAIL = "demo@schoolvision.io"
window.ACCOUNT_TAG = " (Demo)"

// ========================================
// BRANDING & ASSETS
// ========================================
window.SCHOOL_LOGO = "images/SV-logoicon-Small.png"
window.USE_LOCATION_NAME_FOR_LOGO = true

// ========================================
// COLOR THEME - SchoolVision Brand Colors
// Modern teal/blue gradient with professional accents
// ========================================
window.BACKGROUND_COLOR = "#F8FAFC"              // Slight off-white for softer look
window.HEADER_COLOR = "#0891B2"                  // SchoolVision teal
window.HEADER_HOVER = "#0E7490"                  // Darker teal for hover
window.FRAME_COLOR = "#06B6D4"                   // Lighter cyan accent
window.BUTTON_COLOR = "#0891B2"                  // Teal primary buttons
window.BUTTON_HOVER = "#0E7490"                  // Darker teal for hover
window.HIGHLIGHT_BUTTON_COLOR = "#F59E0B"        // Amber accent for CTAs
window.HIGHLIGHT_BUTTON_HOVER = "#D97706"        // Darker amber for hover
window.HEADER_BUTTON_COLOR = "#F59E0B"           // Amber for header action buttons
window.TEXT_COLOR = "#1E293B"                    // Slate gray for readability
window.LIGHT_TEXT_COLOR = "#FFFFFF"              // White text on dark backgrounds
window.BUTTON_TEXT_COLOR = "#FFFFFF"             // White text on buttons
window.HEADER_TEXT_COLOR = "#FFFFFF"             // White text in header
window.HEADER_BUTTON_TEXT_COLOR = "#FFFFFF"      // White text on header buttons
window.ALERT_COLOR = "#DC2626"                   // Red for alerts
window.ALERT_HOVER = "#B91C1C"                   // Darker red for hover
window.SUCCESS_COLOR = "#16A34A"                 // Green for success messages
window.SUCCESS_HOVER = "#15803D"                 // Darker green for hover
window.INACTIVE_COLOR = "#94A3B8"                // Slate gray for inactive states

// ========================================
// CUSTOM TEXT & MESSAGES
// ========================================
window.CUSTOM_WELCOME = "Welcome to the SchoolVision Demo Store"
window.CUSTOM_FOOTER = "This is a demonstration of SchoolVision's ecommerce platform. Contact us to set up your school's store."
window.THANKS_MESSAGE_OVERRIDE = "Thanks for exploring SchoolVision!"
window.THANKS_MESSAGE_OVERRIDE_NOPAYMENT = "Thanks for exploring SchoolVision!"
window.FOOTER_COPYRIGHTLABEL = '2025 SchoolVision - Demo Mode'
window.LOGIN_MESSAGE = "Demo Mode: Use Student ID 'demo123' with password 'demo123'"

// ========================================
// FEATURE FLAGS
// ========================================
window.ACH_AVAILABLE = "False"
window.SHOW_PERSON = "True"
window.SHOW_GETIMAGE = "False"
window.SHOW_PAYMENT = "True"
window.SHOW_GETVACCINE = "False"
window.SHOW_GETDL = "False"
window.SHOW_GETDL_BACK = "False"
window.REQUIRE_LOGIN = "False"                   // Allow guest browsing in demo
window.SHOW_SSN = "False"
window.REQUIRE_SSN = "False"
window.REQUIRE_DL = "False"
window.REQUIRE_DL_BACK = "False"
window.SSN_LENGTH = 4
window.REQUIRE_ACCOUNT_FOR_SALE = false          // Allow guest checkout in demo
window.ALLOW_ALTERNATIVE_PAYMENT = "False"
window.ALTERNATIVE_PAYMENT_TEXT = "Alternative Payment"
window.ALLOW_MULTIPLE_TOKENS = false
window.URL_PRODUCT_ONLY = false
window.SHOW_PRODUCT_DESCRIPTION = true
window.URL_PRODUCT_REQUIRE_PHONE = false
window.ID_LABEL_OVERRIDE = 'Student ID'
window.SHOW_EXISTING_TOKENS = false
window.SHOW_NEXT_STEPS = false

// ========================================
// DEMO MODE FLAG
// ========================================
window.IS_DEMO_MODE = true
window.DEMO_CONTACT_URL = "https://schoolvision.io/contact"

// ========================================
// PAYMENT CONFIGURATION
// ========================================
window.INCLUDE_EXTENDED_PAYMENT_DATA = true
window.MOBILEID_URL = ""

// WorldPay Return URLs Configuration
window.PAYMENT_RESPONSE_URL = window.location.origin + "/payment-response"
window.PAYMENT_SUCCESS_URL = window.location.origin + "/payment-success"
window.PAYMENT_CANCEL_URL = window.location.origin + "/payment-cancelled"
window.PAYMENT_ERROR_URL = window.location.origin + "/payment-error"

// Payment Callback URL for backend notifications
window.PAYMENT_CALLBACK_URL = window.VUE_CONFIG_API.replace('/api/', '/api/payresponse')

// ========================================
// PROMO BANNER - Demo Mode Indicator
// ========================================
window.PROMO_BANNER_ENABLED = true
window.PROMO_BANNER_TEXT = 'DEMO MODE - Explore SchoolVision ecommerce platform'
window.PROMO_BANNER_BG = '#F59E0B'               // Amber/orange for visibility
window.PROMO_BANNER_TEXT_COLOR = '#1E293B'       // Dark text on amber
