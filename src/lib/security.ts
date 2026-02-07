// Security utilities and functions

/**
 * Generates a simple math CAPTCHA question and answer
 */
export function generateMathCaptcha(): { question: string; answer: number } {
  const operators = ['+', '-', '*']
  const operator = operators[Math.floor(Math.random() * operators.length)]

  let num1: number
  let num2: number

  if (operator === '-') {
    num1 = Math.floor(Math.random() * 20) + 10
    num2 = Math.floor(Math.random() * num1)
  } else if (operator === '*') {
    num1 = Math.floor(Math.random() * 5) + 2
    num2 = Math.floor(Math.random() * 5) + 2
  } else {
    num1 = Math.floor(Math.random() * 20) + 1
    num2 = Math.floor(Math.random() * 20) + 1
  }

  let answer: number
  if (operator === '+') {
    answer = num1 + num2
  } else if (operator === '-') {
    answer = num1 - num2
  } else {
    answer = num1 * num2
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer,
  }
}

/**
 * Escapes HTML entities to prevent XSS
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Validates and sanitizes HTML content
 */
export function sanitizeHtml(input: string): string {
  // Remove script tags
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove dangerous event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  return escapeHtml(sanitized)
}

/**
 * Checks if a string contains potential SQL injection patterns
 */
export function hasSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bOR\b|\bAND\b|\bNOT\b)/i,
    /(;|--|\||\|)/,
    /(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b)/i,
    /(\bUNION\b|\bSELECT\b)/i,
    /(\bEXEC\b|\bEXECUTE\b)/i,
    /(\bxp_cmdshell\b|\bcmd\b)/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Checks if a string looks like a bot or spam
 */
export function isLikelySpam(input: string): boolean {
  const spamIndicators = [
    'viagra',
    'cialis',
    'lottery',
    'winner',
    'congratulations',
    'click here',
    'free money',
    'earn money',
    'investment opportunity',
  ]

  const lowerInput = input.toLowerCase()
  return spamIndicators.some((indicator) => lowerInput.includes(indicator))
}

/**
 * Generates a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''

  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(length)
    window.crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  return result
}

/**
 * Compares two strings in a timing-attack resistant way
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Validates that a request is coming from a trusted origin
 */
export function isTrustedOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {
    return false
  }

  return allowedOrigins.some((allowed) => {
    try {
      const allowedUrl = new URL(allowed)
      const originUrl = new URL(origin)
      return originUrl.origin === allowedUrl.origin
    } catch {
      return false
    }
  })
}

/**
 * Masks sensitive data for logging
 */
export function maskSensitiveData(
  data: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string {
  if (data.length <= visibleChars) {
    return data
  }

  return data.substring(0, visibleChars) + maskChar.repeat(data.length - visibleChars)
}

/**
 * Rate limiting types
 */
export type RateLimitWindow = 'minute' | 'hour' | 'day'

export const RATE_LIMIT_WINDOWS: Record<RateLimitWindow, number> = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
}
