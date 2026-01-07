// Form validation composable

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface FieldValidation {
  value: Ref<any>
  rules: ValidationRule[]
  touched: Ref<boolean>
  error: ComputedRef<string | null>
  isValid: ComputedRef<boolean>
  touch: () => void
  reset: () => void
}

// Common validation rules
export const rules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined
    },
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true // Let required handle empty
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return String(value).length >= min
    },
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return String(value).length <= max
    },
    message: message || `Must be no more than ${max} characters`,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      // Basic phone validation - allows various formats
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
      return phoneRegex.test(value.replace(/\s/g, ''))
    },
    message,
  }),

  numeric: (message = 'Must be a number'): ValidationRule => ({
    validate: (value) => {
      if (!value && value !== 0) return true
      return !isNaN(Number(value))
    },
    message,
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return regex.test(value)
    },
    message,
  }),
}

// Field validation hook
export function useField(initialValue: any, validationRules: ValidationRule[] = []): FieldValidation {
  const value = ref(initialValue)
  const touched = ref(false)

  const error = computed(() => {
    if (!touched.value) return null
    for (const rule of validationRules) {
      if (!rule.validate(value.value)) {
        return rule.message
      }
    }
    return null
  })

  const isValid = computed(() => {
    for (const rule of validationRules) {
      if (!rule.validate(value.value)) {
        return false
      }
    }
    return true
  })

  const touch = () => {
    touched.value = true
  }

  const reset = () => {
    value.value = initialValue
    touched.value = false
  }

  return {
    value,
    rules: validationRules,
    touched,
    error,
    isValid,
    touch,
    reset,
  }
}

// Form validation hook
export function useFormValidation<T extends Record<string, FieldValidation>>(fields: T) {
  const isValid = computed(() => {
    return Object.values(fields).every((field) => field.isValid.value)
  })

  const touchAll = () => {
    Object.values(fields).forEach((field) => field.touch())
  }

  const resetAll = () => {
    Object.values(fields).forEach((field) => field.reset())
  }

  const errors = computed(() => {
    const result: Record<string, string | null> = {}
    for (const [key, field] of Object.entries(fields)) {
      result[key] = field.error.value
    }
    return result
  })

  const hasErrors = computed(() => {
    return Object.values(fields).some((field) => field.error.value !== null)
  })

  return {
    fields,
    isValid,
    errors,
    hasErrors,
    touchAll,
    resetAll,
  }
}
