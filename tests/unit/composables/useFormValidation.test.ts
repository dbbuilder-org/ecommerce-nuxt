import { describe, it, expect, beforeEach } from 'vitest'
import { ref, computed, nextTick } from 'vue'
import { rules, useField, useFormValidation } from '~/composables/useFormValidation'

describe('Form Validation', () => {
  describe('rules.required', () => {
    const requiredRule = rules.required()

    it('fails for empty string', () => {
      expect(requiredRule.validate('')).toBe(false)
      expect(requiredRule.validate('   ')).toBe(false) // whitespace only
    })

    it('passes for non-empty string', () => {
      expect(requiredRule.validate('hello')).toBe(true)
      expect(requiredRule.validate(' a ')).toBe(true)
    })

    it('fails for null and undefined', () => {
      expect(requiredRule.validate(null)).toBe(false)
      expect(requiredRule.validate(undefined)).toBe(false)
    })

    it('passes for numbers including zero', () => {
      expect(requiredRule.validate(0)).toBe(true)
      expect(requiredRule.validate(123)).toBe(true)
    })

    it('handles arrays', () => {
      expect(requiredRule.validate([])).toBe(false)
      expect(requiredRule.validate([1, 2, 3])).toBe(true)
    })

    it('uses custom message', () => {
      const customRule = rules.required('Name is required')
      expect(customRule.message).toBe('Name is required')
    })
  })

  describe('rules.email', () => {
    const emailRule = rules.email()

    it('validates correct email formats', () => {
      expect(emailRule.validate('test@example.com')).toBe(true)
      expect(emailRule.validate('user.name@domain.co')).toBe(true)
      expect(emailRule.validate('user+tag@example.org')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(emailRule.validate('invalid')).toBe(false)
      expect(emailRule.validate('missing@')).toBe(false)
      expect(emailRule.validate('@nodomain.com')).toBe(false)
      expect(emailRule.validate('spaces not@allowed.com')).toBe(false)
    })

    it('passes for empty values (let required handle it)', () => {
      expect(emailRule.validate('')).toBe(true)
      expect(emailRule.validate(null)).toBe(true)
      expect(emailRule.validate(undefined)).toBe(true)
    })
  })

  describe('rules.minLength', () => {
    const minLength5 = rules.minLength(5)

    it('validates strings meeting minimum length', () => {
      expect(minLength5.validate('12345')).toBe(true)
      expect(minLength5.validate('123456')).toBe(true)
    })

    it('rejects strings below minimum length', () => {
      expect(minLength5.validate('1234')).toBe(false)
      expect(minLength5.validate('a')).toBe(false)
    })

    it('passes for empty values', () => {
      expect(minLength5.validate('')).toBe(true)
      expect(minLength5.validate(null)).toBe(true)
    })

    it('generates correct default message', () => {
      expect(minLength5.message).toBe('Must be at least 5 characters')
    })

    it('uses custom message', () => {
      const customRule = rules.minLength(3, 'Too short!')
      expect(customRule.message).toBe('Too short!')
    })
  })

  describe('rules.maxLength', () => {
    const maxLength10 = rules.maxLength(10)

    it('validates strings within maximum length', () => {
      expect(maxLength10.validate('1234567890')).toBe(true)
      expect(maxLength10.validate('short')).toBe(true)
    })

    it('rejects strings exceeding maximum length', () => {
      expect(maxLength10.validate('12345678901')).toBe(false)
      expect(maxLength10.validate('this is way too long')).toBe(false)
    })

    it('passes for empty values', () => {
      expect(maxLength10.validate('')).toBe(true)
    })
  })

  describe('rules.phone', () => {
    const phoneRule = rules.phone()

    it('validates various phone formats', () => {
      expect(phoneRule.validate('1234567890')).toBe(true)
      expect(phoneRule.validate('123-456-7890')).toBe(true)
      expect(phoneRule.validate('(123) 456-7890')).toBe(true)
      expect(phoneRule.validate('+1 123 456 7890')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(phoneRule.validate('123')).toBe(false) // too short
      expect(phoneRule.validate('abcdefghij')).toBe(false) // non-numeric
    })

    it('passes for empty values', () => {
      expect(phoneRule.validate('')).toBe(true)
      expect(phoneRule.validate(null)).toBe(true)
    })
  })

  describe('rules.numeric', () => {
    const numericRule = rules.numeric()

    it('validates numeric values', () => {
      expect(numericRule.validate(123)).toBe(true)
      expect(numericRule.validate('456')).toBe(true)
      expect(numericRule.validate(0)).toBe(true)
      expect(numericRule.validate('0')).toBe(true)
      expect(numericRule.validate(3.14)).toBe(true)
    })

    it('rejects non-numeric values', () => {
      expect(numericRule.validate('abc')).toBe(false)
      expect(numericRule.validate('12abc')).toBe(false)
    })

    it('passes for empty values', () => {
      expect(numericRule.validate('')).toBe(true)
      expect(numericRule.validate(null)).toBe(true)
    })
  })

  describe('rules.pattern', () => {
    const zipCodeRule = rules.pattern(/^\d{5}(-\d{4})?$/, 'Invalid zip code')

    it('validates matching patterns', () => {
      expect(zipCodeRule.validate('12345')).toBe(true)
      expect(zipCodeRule.validate('12345-6789')).toBe(true)
    })

    it('rejects non-matching patterns', () => {
      expect(zipCodeRule.validate('1234')).toBe(false)
      expect(zipCodeRule.validate('ABCDE')).toBe(false)
    })

    it('uses custom message', () => {
      expect(zipCodeRule.message).toBe('Invalid zip code')
    })
  })

  describe('useField', () => {
    it('initializes with correct default values', () => {
      const field = useField('initial')

      expect(field.value.value).toBe('initial')
      expect(field.touched.value).toBe(false)
      expect(field.error.value).toBe(null)
      expect(field.isValid.value).toBe(true)
    })

    it('does not show error until touched', () => {
      const field = useField('', [rules.required()])

      expect(field.error.value).toBe(null) // not touched yet
      expect(field.isValid.value).toBe(false) // but still invalid

      field.touch()
      expect(field.error.value).toBe('This field is required')
    })

    it('validates and shows errors correctly', () => {
      const field = useField('', [rules.required(), rules.email()])

      field.touch()
      expect(field.error.value).toBe('This field is required')

      field.value.value = 'invalid'
      expect(field.error.value).toBe('Please enter a valid email address')

      field.value.value = 'test@example.com'
      expect(field.error.value).toBe(null)
      expect(field.isValid.value).toBe(true)
    })

    it('resets field to initial state', () => {
      const field = useField('initial', [rules.required()])

      field.value.value = 'changed'
      field.touch()

      field.reset()

      expect(field.value.value).toBe('initial')
      expect(field.touched.value).toBe(false)
    })

    it('stores validation rules', () => {
      const validationRules = [rules.required(), rules.email()]
      const field = useField('', validationRules)

      expect(field.rules).toBe(validationRules)
      expect(field.rules.length).toBe(2)
    })
  })

  describe('useFormValidation', () => {
    it('validates multiple fields', () => {
      const emailField = useField('', [rules.required(), rules.email()])
      const nameField = useField('', [rules.required()])

      const form = useFormValidation({ email: emailField, name: nameField })

      expect(form.isValid.value).toBe(false)

      emailField.value.value = 'test@example.com'
      nameField.value.value = 'John'

      expect(form.isValid.value).toBe(true)
    })

    it('touches all fields at once', () => {
      const field1 = useField('', [rules.required()])
      const field2 = useField('', [rules.required()])

      const form = useFormValidation({ field1, field2 })

      expect(field1.touched.value).toBe(false)
      expect(field2.touched.value).toBe(false)

      form.touchAll()

      expect(field1.touched.value).toBe(true)
      expect(field2.touched.value).toBe(true)
    })

    it('resets all fields at once', () => {
      const field1 = useField('initial1', [rules.required()])
      const field2 = useField('initial2', [rules.required()])

      field1.value.value = 'changed1'
      field2.value.value = 'changed2'
      field1.touch()
      field2.touch()

      const form = useFormValidation({ field1, field2 })
      form.resetAll()

      expect(field1.value.value).toBe('initial1')
      expect(field2.value.value).toBe('initial2')
      expect(field1.touched.value).toBe(false)
      expect(field2.touched.value).toBe(false)
    })

    it('aggregates errors correctly', () => {
      const email = useField('invalid', [rules.email()])
      const name = useField('', [rules.required()])

      email.touch()
      name.touch()

      const form = useFormValidation({ email, name })

      expect(form.errors.value.email).toBe('Please enter a valid email address')
      expect(form.errors.value.name).toBe('This field is required')
      expect(form.hasErrors.value).toBe(true)
    })

    it('hasErrors is false when all fields are valid', () => {
      const email = useField('test@example.com', [rules.email()])
      const name = useField('John', [rules.required()])

      email.touch()
      name.touch()

      const form = useFormValidation({ email, name })

      expect(form.hasErrors.value).toBe(false)
    })
  })
})
