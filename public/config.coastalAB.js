//api and recaptcha - COASTAL ALABAMA COMMUNITY COLLEGE
// Configuration defaults - can be overridden by environment variables during build
// See .env.example for configuration template

// ========================================
// API ENDPOINTS
// ========================================
window.VUE_CONFIG_API = "https://paymentapi-ecommerce.schoolvision.io/coastalAB/api/"
window.VUE_CONFIG_API_IMAGE = "https://paymentapi-ecommerce.schoolvision.io/coastalAB/api/"
window.VUE_CONFIG_API_ECOMMERCE = "https://paymentapi-ecommerce.schoolvision.io/coastalAB/api/ecommerce/"

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
window.PAYMENT_LOCATION_ID = 622103006  // CoastalAB location ID (TEST_ECommerce_CoastalAB database)
window.LOCATION_NAME = "Coastal Alabama Community College"
window.LOCATION_PHONE = "(251) 580-2100"
window.LOCATION_ADDRESS = "1900 US-31, Bay Minette, AL 36507"
window.LOCATION_EMAIL = "info@coastalalabama.edu"
window.ACCOUNT_TAG = " (Initial Payment)"

// ========================================
// BRANDING & ASSETS
// ========================================
window.SCHOOL_LOGO = "images/coastalAB.png"
window.USE_LOCATION_NAME_FOR_LOGO = false

// ========================================
// COLOR THEME - CoastalAB Burgundy Brand Colors
// ========================================
window.BACKGROUND_COLOR = "#FFFFFF"
window.HEADER_COLOR = "#8b2332"         // Burgundy primary
window.HEADER_HOVER = "#6b1a26"         // Dark burgundy for hover
window.FRAME_COLOR = "#6b1a26"          // Dark burgundy
window.BUTTON_COLOR = "#8b2332"         // Burgundy primary
window.BUTTON_HOVER = "#6b1a26"         // Dark burgundy for hover
window.HIGHLIGHT_BUTTON_COLOR = "#a52a3a"  // Bright burgundy
window.HIGHLIGHT_BUTTON_HOVER = "#8b2332"  // Standard burgundy for hover
window.HEADER_BUTTON_COLOR = "#6b1a26"  // Dark burgundy
window.TEXT_COLOR = "#000000"           // Black
window.LIGHT_TEXT_COLOR = "#FFFFFF"     // White
window.BUTTON_TEXT_COLOR = "#23328B"    // Blue accent
window.HEADER_TEXT_COLOR = "#FFFFFF"    // White
window.HEADER_BUTTON_TEXT_COLOR = "#23328B"  // Blue accent
window.ALERT_COLOR = "#8b2332"          // Burgundy
window.ALERT_HOVER = "#6b1a26"          // Dark burgundy for hover
window.SUCCESS_COLOR = "#699864"        // Green
window.SUCCESS_HOVER = "#527a4d"        // Darker green for hover
window.INACTIVE_COLOR = "#C3C3C3"       // Gray

// ========================================
// CUSTOM TEXT & MESSAGES
// ========================================
window.CUSTOM_WELCOME = "Welcome to Coastal Alabama Community College"
window.CUSTOM_FOOTER = ""
window.THANKS_MESSAGE_OVERRIDE = "Thank you for your purchase!"
window.THANKS_MESSAGE_OVERRIDE_NOPAYMENT = "Thank you for your order!"
window.FOOTER_COPYRIGHTLABEL = '2025 Newman Consulting, LLC dba SchoolVision'
window.LOGIN_MESSAGE = "If you have not logged in before, your password is your Student ID"

// ========================================
// FEATURE FLAGS
// ========================================
window.ACH_AVAILABLE = "False"
window.SHOW_PERSON = "True"
window.SHOW_GETIMAGE = "False"
window.SHOW_PAYMENT = "True"
window.SHOW_GETVACCINE = "False"
window.SHOW_GETDL = "True"
window.SHOW_GETDL_BACK = "False"
window.REQUIRE_LOGIN = "True"
window.SHOW_SSN = "False"
window.REQUIRE_SSN = "False"
window.REQUIRE_DL = "True"
window.REQUIRE_DL_BACK = "False"
window.SSN_LENGTH = 4
window.REQUIRE_ACCOUNT_FOR_SALE = true
window.ALLOW_ALTERNATIVE_PAYMENT = "False"
window.ALTERNATIVE_PAYMENT_TEXT = "Alternative Payment"
window.ALLOW_MULTIPLE_TOKENS = false
window.URL_PRODUCT_ONLY = false
window.SHOW_PRODUCT_DESCRIPTION = true
window.URL_PRODUCT_REQUIRE_PHONE = true
window.ID_LABEL_OVERRIDE = 'DL #'
window.SHOW_EXISTING_TOKENS = false
window.SHOW_NEXT_STEPS = false

// ========================================
// PAYMENT CONFIGURATION
// ========================================
window.INCLUDE_EXTENDED_PAYMENT_DATA = true
window.MOBILEID_URL = ""

// WorldPay Return URLs Configuration
// These URLs tell WorldPay where to redirect users after payment
window.PAYMENT_RESPONSE_URL = window.location.origin + "/payment-response"
window.PAYMENT_SUCCESS_URL = window.location.origin + "/payment-success"
window.PAYMENT_CANCEL_URL = window.location.origin + "/payment-cancelled"
window.PAYMENT_ERROR_URL = window.location.origin + "/payment-error"

// Payment Callback URL for backend notifications
// WorldPay will call this URL to notify your backend of payment status
window.PAYMENT_CALLBACK_URL = window.VUE_CONFIG_API.replace('/api/', '/api/payresponse')

// ========================================
// PROMO BANNER - CoastalAB Welcome Banner
// ========================================
window.PROMO_BANNER_ENABLED = true
window.PROMO_BANNER_TEXT = 'Welcome to Coastal Alabama Community College - Now accepting orders online!'
window.PROMO_BANNER_BG = '#6b1a26'      // Dark burgundy (matching FRAME_COLOR)
window.PROMO_BANNER_TEXT_COLOR = '#ffffff'
