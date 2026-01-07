//api and recaptcha - WINDERMERE PREPARATORY SCHOOL
// Configuration for Windermere Preparatory School - A Nord Anglia Education School
// Color scheme based on school branding: Navy blue, white, and teal accents

// ========================================
// API ENDPOINTS
// ========================================
window.VUE_CONFIG_API = "https://paymentapi-ecommerce.schoolvision.io/windermere/api/"
window.VUE_CONFIG_API_IMAGE = "https://paymentapi-ecommerce.schoolvision.io/windermere/api/"
window.VUE_CONFIG_API_ECOMMERCE = "https://paymentapi-ecommerce.schoolvision.io/windermere/api/ecommerce/"

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
window.PAYMENT_LOCATION_ID = 57737001
window.LOCATION_NAME = "Windermere Preparatory School"
window.LOCATION_PHONE = "(407) 905-7737"
window.LOCATION_ADDRESS = "6189 Winter Garden-Vineland Road, Windermere, FL 34786"
window.LOCATION_EMAIL = "admissions@windermereprep.com"
window.ACCOUNT_TAG = " (Tuition Payment)"

// ========================================
// BRANDING & ASSETS
// ========================================
window.SCHOOL_LOGO = "images/windermere.png"
window.USE_LOCATION_NAME_FOR_LOGO = false

// ========================================
// COLOR THEME - Windermere Prep / Nord Anglia Branding
// Navy blue primary, white backgrounds, teal/green accents
// ========================================
window.BACKGROUND_COLOR = "#FFFFFF"              // Clean white background
window.HEADER_COLOR = "#0E2049"                  // Navy blue from logo
window.HEADER_HOVER = "#081633"                  // Darker navy for hover
window.FRAME_COLOR = "#1A3A5C"                   // Slightly lighter navy for frames
window.BUTTON_COLOR = "#0E2049"                  // Navy blue primary buttons
window.BUTTON_HOVER = "#081633"                  // Darker navy for hover
window.HIGHLIGHT_BUTTON_COLOR = "#00A99D"        // Teal accent (Nord Anglia green/teal)
window.HIGHLIGHT_BUTTON_HOVER = "#008a81"        // Darker teal for hover
window.HEADER_BUTTON_COLOR = "#00A99D"           // Teal for header action buttons
window.TEXT_COLOR = "#2C3E50"                    // Dark gray for readability
window.LIGHT_TEXT_COLOR = "#FFFFFF"              // White text on dark backgrounds
window.BUTTON_TEXT_COLOR = "#FFFFFF"             // White text on buttons
window.HEADER_TEXT_COLOR = "#FFFFFF"             // White text in header
window.HEADER_BUTTON_TEXT_COLOR = "#FFFFFF"      // White text on header buttons
window.ALERT_COLOR = "#D9534F"                   // Professional red for alerts
window.ALERT_HOVER = "#c9302c"                   // Darker red for hover
window.SUCCESS_COLOR = "#5CB85C"                 // Green for success messages
window.SUCCESS_HOVER = "#449d44"                 // Darker green for hover
window.INACTIVE_COLOR = "#B0BEC5"                // Light gray for inactive states

// ========================================
// CUSTOM TEXT & MESSAGES
// ========================================
window.CUSTOM_WELCOME = "Welcome to Windermere Preparatory School's secure payment portal."
window.CUSTOM_FOOTER = "Windermere Preparatory School is proud to be part of Nord Anglia Education, the world's leading international schools organization."
window.THANKS_MESSAGE_OVERRIDE = "Thank you for your payment to Windermere Preparatory School!"
window.THANKS_MESSAGE_OVERRIDE_NOPAYMENT = "Thank you for completing your registration!"
window.FOOTER_COPYRIGHTLABEL = '2025 Windermere Preparatory School'
window.LOGIN_MESSAGE = "If you have not logged in before, your password is your Student ID"

// ========================================
// FEATURE FLAGS
// ========================================
window.ACH_AVAILABLE = "True"
window.SHOW_PERSON = "True"
window.SHOW_GETIMAGE = "True"
window.SHOW_PAYMENT = "True"
window.SHOW_GETVACCINE = "False"
window.SHOW_GETDL = "False"
window.SHOW_GETDL_BACK = "False"
window.REQUIRE_LOGIN = "True"
window.SHOW_SSN = "False"
window.REQUIRE_SSN = "False"
window.REQUIRE_DL = "False"
window.REQUIRE_DL_BACK = "False"
window.SSN_LENGTH = 4
window.REQUIRE_ACCOUNT_FOR_SALE = true
window.ALLOW_ALTERNATIVE_PAYMENT = "False"
window.ALTERNATIVE_PAYMENT_TEXT = "Alternative Payment"
window.ALLOW_MULTIPLE_TOKENS = true
window.URL_PRODUCT_ONLY = false
window.SHOW_PRODUCT_DESCRIPTION = true
window.URL_PRODUCT_REQUIRE_PHONE = true
window.ID_LABEL_OVERRIDE = 'Student ID'
window.SHOW_EXISTING_TOKENS = true
window.SHOW_NEXT_STEPS = false

// ========================================
// DELIVERY/SHIPPING CONFIGURATION
// Per PDF requirements: Shipping only, NO pickup locations
// ========================================
window.SHOW_PICKUP_LOCATIONS = false       // Disable pickup locations
window.SHOW_SHIPPING_FORM = true           // Enable shipping address form
window.SHIPPING_ENABLED = true             // Enable shipping functionality
window.PICKUP_LOCATIONS_ENABLED = false    // Disable pickup location selection

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
// PROMO BANNER
// ========================================
window.PROMO_BANNER_ENABLED = false
window.PROMO_BANNER_TEXT = 'Secure payment portal for Windermere Preparatory School families'
window.PROMO_BANNER_BG = '#0E2049'
window.PROMO_BANNER_TEXT_COLOR = '#ffffff'
