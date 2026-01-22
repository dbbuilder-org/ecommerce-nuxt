<template>
  <div class="address-autocomplete-wrapper">
    <div class="relative">
      <input
        ref="addressInputRef"
        :value="modelValue"
        @input="onManualInput"
        @focus="onFocus"
        @blur="onBlur"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[inputClass, { 'pr-10': isLoading || showClearButton }]"
        autocomplete="off"
        :data-testid="dataTestId"
      />

      <!-- Loading indicator -->
      <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Clear button -->
      <button
        v-else-if="showClearButton && modelValue"
        @click="clearInput"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Google Places indicator (when available) -->
      <div v-if="isGoogleAvailable && !isLoading && isFocused" class="absolute right-10 top-1/2 -translate-y-1/2">
        <svg class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>

    <!-- Fallback notice when Google is unavailable -->
    <div v-if="showFallbackNotice && !isGoogleAvailable && initAttempted" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-xs text-blue-700 flex items-start">
        <svg class="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Address lookup is unavailable (may be blocked by browser or network).
          Please enter your full address manually including street, city, state, and ZIP code.
        </span>
      </p>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
/// <reference types="@types/google.maps" />
/**
 * AddressAutocomplete Component
 *
 * A robust address autocomplete component using Google Places API.
 * Features:
 * - Session-based pricing for cost efficiency
 * - Graceful fallback when Google is unavailable
 * - Loading states and error handling
 * - Debounced input to reduce API calls
 *
 * @example
 * <UiAddressAutocomplete
 *   v-model="shippingAddress.line1"
 *   @place-selected="onAddressSelected"
 *   placeholder="Start typing your address..."
 * />
 */

// Type definitions for Google Maps (used when the types package is available)
type GoogleMapsAutocomplete = google.maps.places.Autocomplete
type GoogleMapsAutocompleteOptions = google.maps.places.AutocompleteOptions
type GoogleMapsAutocompleteSessionToken = google.maps.places.AutocompleteSessionToken
type GoogleMapsGeocoderAddressComponent = google.maps.GeocoderAddressComponent

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (input: HTMLInputElement, options?: GoogleMapsAutocompleteOptions) => GoogleMapsAutocomplete
          AutocompleteSessionToken: new () => GoogleMapsAutocompleteSessionToken
        }
        event?: {
          clearInstanceListeners: (instance: unknown) => void
        }
      }
    }
  }
}

export interface ParsedAddress {
  street1: string
  street2: string
  city: string
  state: string
  stateCode: string
  postalCode: string
  country: string
  countryCode: string
  formattedAddress?: string
  placeId?: string
  lat?: number
  lng?: number
}

interface Props {
  modelValue?: string
  placeholder?: string
  inputClass?: string
  disabled?: boolean
  showClearButton?: boolean
  showFallbackNotice?: boolean
  country?: string | string[]
  types?: string[]
  dataTestId?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Enter address',
  inputClass: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200',
  disabled: false,
  showClearButton: true,
  showFallbackNotice: false,
  country: 'us',
  types: () => ['address'],
  dataTestId: 'address-autocomplete'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'place-selected': [address: ParsedAddress]
  'error': [error: Error]
  'google-loaded': []
  'google-failed': [error: Error]
  'blur': []
}>()

const config = useRuntimeConfig()

// Refs
const addressInputRef = ref<HTMLInputElement | null>(null)

// State
const autocomplete = ref<GoogleMapsAutocomplete | null>(null)
const sessionToken = ref<GoogleMapsAutocompleteSessionToken | null>(null)
const isLoading = ref(false)
const isFocused = ref(false)
const error = ref<string | null>(null)
const isGoogleAvailable = ref(false)
const initAttempted = ref(false)
const pendingStreetValue = ref<string | null>(null)
const isPlaceSelecting = ref(false)
const lastTypedValue = ref('')

// Module-level state for Google Maps loading (shared across all instances)
let googleMapsPromise: Promise<void> | null = null
let googleMapsLoaded = false
let googleMapsLoadFailed = false

onMounted(() => {
  initGooglePlaces()
})

onUnmounted(() => {
  cleanup()
})

/**
 * Initialize Google Places API
 */
async function initGooglePlaces() {
  initAttempted.value = true

  // Check for API key from runtime config
  const apiKey = config.public.googlePlacesApiKey as string | undefined
  if (!apiKey) {
    console.warn('[AddressAutocomplete] No Google Places API key configured. Falling back to manual input.')
    isGoogleAvailable.value = false
    return
  }

  // If already failed, don't retry
  if (googleMapsLoadFailed) {
    isGoogleAvailable.value = false
    return
  }

  // If already loaded successfully
  if (googleMapsLoaded && window.google?.maps?.places) {
    isGoogleAvailable.value = true
    setupAutocomplete()
    return
  }

  // Load Google Maps script
  try {
    isLoading.value = true
    await loadGoogleMapsScript(apiKey)
    googleMapsLoaded = true
    isGoogleAvailable.value = true
    emit('google-loaded')
    setupAutocomplete()
  } catch (err) {
    console.error('[AddressAutocomplete] Failed to load Google Maps:', err)
    googleMapsLoadFailed = true
    isGoogleAvailable.value = false
    error.value = null // Don't show error to user, just fallback silently
    emit('google-failed', err as Error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Load Google Maps JavaScript API
 */
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // Return existing promise if loading in progress
  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      resolve()
      return
    }

    // Create script element
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true

    // Set timeout for script load (10 seconds)
    const timeout = setTimeout(() => {
      reject(new Error('Google Maps script load timeout'))
    }, 10000)

    script.onload = () => {
      clearTimeout(timeout)
      // Wait a bit for the API to fully initialize
      setTimeout(() => {
        if (window.google?.maps?.places) {
          resolve()
        } else {
          reject(new Error('Google Maps Places API not available after load'))
        }
      }, 100)
    }

    script.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Failed to load Google Maps script'))
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}

/**
 * Setup Google Places Autocomplete on the input
 */
function setupAutocomplete() {
  if (!window.google?.maps?.places || !addressInputRef.value) {
    return
  }

  try {
    // Create new session token for cost-efficient billing
    sessionToken.value = new window.google.maps.places.AutocompleteSessionToken()

    // Configure autocomplete options
    const options: GoogleMapsAutocompleteOptions = {
      types: props.types,
      fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
    }

    // Add country restriction
    if (props.country) {
      options.componentRestrictions = {
        country: Array.isArray(props.country) ? props.country : [props.country]
      }
    }

    // Create autocomplete instance
    autocomplete.value = new window.google.maps.places.Autocomplete(
      addressInputRef.value,
      options
    )

    // Listen for place selection
    autocomplete.value.addListener('place_changed', onPlaceChanged)
  } catch (err) {
    console.error('[AddressAutocomplete] Failed to setup autocomplete:', err)
    isGoogleAvailable.value = false
  }
}

/**
 * Handle place selection from autocomplete
 */
function onPlaceChanged() {
  if (!autocomplete.value) return

  const place = autocomplete.value.getPlace()

  if (!place || !place.address_components) {
    // User pressed enter without selecting a place
    return
  }

  // Set flag to indicate we're processing a place selection
  isPlaceSelecting.value = true

  // Parse address components
  const addressData = parseAddressComponents(place.address_components)
  addressData.formattedAddress = place.formatted_address
  addressData.placeId = place.place_id

  if (place.geometry?.location) {
    addressData.lat = place.geometry.location.lat()
    addressData.lng = place.geometry.location.lng()
  }

  // Determine the value to use for the input field
  const inputValue = addressData.street1 || place.formatted_address || ''

  // Store the value we want to persist
  pendingStreetValue.value = inputValue

  console.log('[AddressAutocomplete] Place selected:', {
    street1: addressData.street1,
    formattedAddress: place.formatted_address,
    inputValue: inputValue
  })

  // Immediately set the input value
  if (addressInputRef.value) {
    addressInputRef.value.value = inputValue
  }

  // Emit structured address data for parent to process other fields FIRST
  emit('place-selected', addressData)

  // Small delay then emit v-model
  setTimeout(() => {
    emit('update:modelValue', inputValue)
  }, 10)

  // Force the input value after Vue's update cycle
  nextTick(() => {
    if (addressInputRef.value && pendingStreetValue.value) {
      addressInputRef.value.value = pendingStreetValue.value
    }
  })

  // Multiple delayed checks to handle Google's async behavior
  const enforceValue = () => {
    if (addressInputRef.value && pendingStreetValue.value) {
      if (addressInputRef.value.value !== pendingStreetValue.value) {
        console.log('[AddressAutocomplete] Enforcing value:', pendingStreetValue.value)
        addressInputRef.value.value = pendingStreetValue.value
        emit('update:modelValue', pendingStreetValue.value)
      }
    }
  }

  setTimeout(enforceValue, 50)
  setTimeout(enforceValue, 150)
  setTimeout(enforceValue, 300)

  // Clear the selection flag after all checks are done
  setTimeout(() => {
    isPlaceSelecting.value = false
    pendingStreetValue.value = null
    if (addressInputRef.value?.value) {
      lastTypedValue.value = addressInputRef.value.value
    }
  }, 500)

  // Create new session token for next search
  if (window.google?.maps?.places) {
    sessionToken.value = new window.google.maps.places.AutocompleteSessionToken()
  }
}

/**
 * Parse Google address components into structured format
 */
function parseAddressComponents(components: GoogleMapsGeocoderAddressComponent[]): ParsedAddress {
  const result: ParsedAddress = {
    street1: '',
    street2: '',
    city: '',
    state: '',
    stateCode: '',
    postalCode: '',
    country: '',
    countryCode: ''
  }

  let streetNumber = ''
  let route = ''

  for (const component of components) {
    const type = component.types[0]

    switch (type) {
      case 'street_number':
        streetNumber = component.long_name
        break
      case 'route':
        route = component.long_name
        break
      case 'subpremise':
        result.street2 = component.long_name
        break
      case 'locality':
        result.city = component.long_name
        break
      case 'administrative_area_level_1':
        result.state = component.long_name
        result.stateCode = component.short_name
        break
      case 'postal_code':
        result.postalCode = component.long_name
        break
      case 'country':
        result.country = component.long_name
        result.countryCode = component.short_name
        break
    }
  }

  // Combine street number and route
  result.street1 = [streetNumber, route].filter(Boolean).join(' ')

  return result
}

/**
 * Handle manual input
 */
function onManualInput(event: Event) {
  if (isPlaceSelecting.value) {
    console.log('[AddressAutocomplete] Ignoring input during place selection')
    return
  }
  const target = event.target as HTMLInputElement
  const value = target.value
  if (value) {
    lastTypedValue.value = value
  }
  emit('update:modelValue', value)
}

/**
 * Handle input focus
 */
function onFocus() {
  isFocused.value = true
  error.value = null
}

/**
 * Handle input blur
 */
function onBlur() {
  setTimeout(() => {
    isFocused.value = false

    // Preserve manually entered value on blur
    if (addressInputRef.value && !isPlaceSelecting.value) {
      const currentInputValue = addressInputRef.value.value
      const valueToRestore = props.modelValue || lastTypedValue.value

      if (!currentInputValue && valueToRestore) {
        console.log('[AddressAutocomplete] Restoring value on blur:', valueToRestore)
        addressInputRef.value.value = valueToRestore
        emit('update:modelValue', valueToRestore)
      } else if (currentInputValue && currentInputValue !== props.modelValue) {
        console.log('[AddressAutocomplete] Syncing input value on blur:', currentInputValue)
        emit('update:modelValue', currentInputValue)
      }
    }
  }, 200)
  emit('blur')
}

/**
 * Clear the input
 */
function clearInput() {
  lastTypedValue.value = ''
  emit('update:modelValue', '')
  addressInputRef.value?.focus()
}

/**
 * Cleanup on component destroy
 */
function cleanup() {
  if (autocomplete.value && window.google?.maps?.event) {
    window.google.maps.event.clearInstanceListeners(autocomplete.value)
    autocomplete.value = null
  }
}
</script>

<style scoped>
/* Style Google's autocomplete dropdown */
.address-autocomplete-wrapper :deep(.pac-container) {
  z-index: 9999 !important;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.address-autocomplete-wrapper :deep(.pac-item) {
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.address-autocomplete-wrapper :deep(.pac-item:hover) {
  background-color: #f3f4f6;
}

.address-autocomplete-wrapper :deep(.pac-item-selected) {
  background-color: #eff6ff;
}

.address-autocomplete-wrapper :deep(.pac-icon) {
  display: none;
}

.address-autocomplete-wrapper :deep(.pac-item-query) {
  font-weight: 500;
  color: #111827;
}
</style>
