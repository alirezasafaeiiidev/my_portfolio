// Input validation and sanitization utilities

/**
 * Validates an email address using a robust regex pattern
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string, maxLength: number = 2000): string {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input.trim()

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>]/g, '')

  // Limit length
  sanitized = sanitized.substring(0, maxLength)

  return sanitized
}

/**
 * Validates a URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates that a string is not empty and has meaningful content
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Validates a name field
 */
export function isValidName(name: string): boolean {
  if (!isNonEmptyString(name)) {
    return false
  }

  return name.length >= 2 && name.length <= 100
}

/**
 * Validates a message field
 */
export function isValidMessage(message: string): boolean {
  if (!isNonEmptyString(message)) {
    return false
  }

  return message.length >= 10 && message.length <= 2000
}

/**
 * Validates a phone number (basic format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Type guard to check if a value is defined
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

/**
 * Type guard to check if a value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Type guard to check if a value is an array
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}
