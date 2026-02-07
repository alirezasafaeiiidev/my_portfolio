import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  sanitizeInput,
  isValidUrl,
  isNonEmptyString,
  isValidName,
  isValidMessage,
  isDefined,
  isObject,
  isArray,
} from '@/lib/validators'

describe('validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test example.com')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(isValidEmail(null as any)).toBe(false)
      expect(isValidEmail(undefined as any)).toBe(false)
      expect(isValidEmail(123 as any)).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
    })

    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<')
      expect(sanitizeInput('<>test</>')).toBe('test/')
    })

    it('should limit length', () => {
      expect(sanitizeInput('a'.repeat(100), 10)).toBe('aaaaaaaaaa')
    })

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null as any)).toBe('')
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(isValidUrl(null as any)).toBe(false)
      expect(isValidUrl(undefined as any)).toBe(false)
    })
  })

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('test')).toBe(true)
      expect(isNonEmptyString('  hello  ')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString('   ')).toBe(false)
    })

    it('should return false for non-string values', () => {
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString({})).toBe(false)
    })
  })

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(isValidName('John')).toBe(true)
      expect(isValidName('Alice Smith')).toBe(true)
      expect(isValidName('محمد')).toBe(true)
    })

    it('should reject names that are too short', () => {
      expect(isValidName('A')).toBe(false)
      expect(isValidName('')).toBe(false)
    })

    it('should reject names that are too long', () => {
      expect(isValidName('A'.repeat(101))).toBe(false)
    })
  })

  describe('isValidMessage', () => {
    it('should validate correct messages', () => {
      expect(isValidMessage('Hello, this is a test message.')).toBe(true)
      expect(isValidMessage('Lorem ipsum dolor sit amet.')).toBe(true)
    })

    it('should reject messages that are too short', () => {
      expect(isValidMessage('Hi')).toBe(false)
      expect(isValidMessage('')).toBe(false)
    })

    it('should reject messages that are too long', () => {
      expect(isValidMessage('A'.repeat(2001))).toBe(false)
    })
  })

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined('value')).toBe(true)
      expect(isDefined(0)).toBe(true)
      expect(isDefined(false)).toBe(true)
      expect(isDefined({})).toBe(true)
    })

    it('should return false for undefined and null', () => {
      expect(isDefined(undefined)).toBe(false)
      expect(isDefined(null)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
    })

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false)
      expect(isObject([1, 2, 3])).toBe(false)
    })

    it('should return false for null and undefined', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(['a', 'b'])).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(123)).toBe(false)
    })
  })
})
