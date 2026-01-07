//api and recaptcha - LOCAL DEVELOPMENT CONFIGURATION
// This file is for LOCAL DEVELOPMENT ONLY
// Points to localhost:5000 for PaymentAPI

// ========================================
// API ENDPOINTS - LOCAL (pointing to Azure for testing)
// ========================================
window.VUE_CONFIG_API = "https://paymentapi-ecommerce-test-v2.azurewebsites.net/api/"
window.VUE_CONFIG_API_IMAGE = "https://paymentapi-ecommerce-test-v2.azurewebsites.net/api/"
window.VUE_CONFIG_API_ECOMMERCE = "https://paymentapi-ecommerce-test-v2.azurewebsites.net/api/ecommerce/"

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
window.LOCATION_NAME = "Westmoreland County Community College"
window.LOCATION_PHONE = "(724) 925-4000"
window.LOCATION_ADDRESS = "145 Pavilion Lane, Youngwood, PA 15697"
window.LOCATION_EMAIL = "info@westmoreland.edu"
window.ACCOUNT_TAG = " (Initial Payment)"

// ========================================
// BRANDING & ASSETS
// ========================================
window.SCHOOL_LOGO = "westmoreland_logo.png"
window.USE_LOCATION_NAME_FOR_LOGO = false

// ========================================
// COLOR THEME
// ========================================
window.BACKGROUND_COLOR = "#FFFFFF"
window.HEADER_COLOR = "#7EB3D7"
window.FRAME_COLOR = "#79bce1"
window.BUTTON_COLOR = "#0c85b6"
window.HIGHLIGHT_BUTTON_COLOR = "#992222"
window.HEADER_BUTTON_COLOR = "#992222"
window.TEXT_COLOR = "#0E2049"
window.LIGHT_TEXT_COLOR = "#FFFFFF"
window.BUTTON_TEXT_COLOR = "#FFFFFF"
window.HEADER_TEXT_COLOR = "#FFFFFF"
window.HEADER_BUTTON_TEXT_COLOR = "#699864"
window.ALERT_COLOR = "#E32323"
window.SUCCESS_COLOR = "#699864"
window.INACTIVE_COLOR = "#C3C3C3"

// ========================================
// CUSTOM TEXT & MESSAGES
// ========================================
window.CUSTOM_WELCOME = ""
window.CUSTOM_FOOTER = ""
window.THANKS_MESSAGE_OVERRIDE = "Thanks for your purchase!"
window.THANKS_MESSAGE_OVERRIDE_NOPAYMENT = "Thanks for your purchase!"
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
window.PAYMENT_CALLBACK_URL = window.VUE_CONFIG_API_ECOMMERCE.replace('/api/ecommerce/', '/api/payresponse')

// ========================================
// PROMO BANNER
// ========================================
window.PROMO_BANNER_ENABLED = true
window.PROMO_BANNER_TEXT = 'LOCAL DEVELOPMENT - Connected to Azure Test Backend'
window.PROMO_BANNER_BG = '#0a6b93' // Darker blue for WCAG AA contrast compliance (4.5:1 ratio)
window.PROMO_BANNER_TEXT_COLOR = '#ffffff'

