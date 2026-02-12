/**
 * Tests for Security Utilities
 * Testing critical security functions for data sanitization and validation
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  generateMathCaptcha,
  escapeHtml,
  hasSqlInjection,
  isLikelySpam,
  generateSecureToken,
  timingSafeCompare,
  isTrustedOrigin,
  maskSensitiveData,
} from '@/lib/security'

describe('generateMathCaptcha', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should generate a captcha with a question and answer', () => {
    const captcha = generateMathCaptcha()
    expect(captcha).toHaveProperty('question')
    expect(captcha).toHaveProperty('answer')
    expect(typeof captcha.question).toBe('string')
    expect(typeof captcha.answer).toBe('number')
  })

  it('should generate valid math questions', () => {
    const captcha = generateMathCaptcha()
    expect(captcha.question).toMatch(/^\d+\s*[\+\-\*]\s*\d+\s*=\s*\?$/)
  })

  it('should generate deterministic addition captcha when random sequence is mocked', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(0.1) // operator '+'
    randomSpy.mockReturnValueOnce(0.2) // num1 => 5
    randomSpy.mockReturnValueOnce(0.3) // num2 => 7

    const captcha = generateMathCaptcha()
    expect(captcha.question).toBe('5 + 7 = ?')
    expect(captcha.answer).toBe(12)
  })

  it('should generate deterministic subtraction captcha when random sequence is mocked', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(0.5) // operator '-'
    randomSpy.mockReturnValueOnce(0.6) // num1 => 22
    randomSpy.mockReturnValueOnce(0.4) // num2 => 8

    const captcha = generateMathCaptcha()
    expect(captcha.question).toBe('22 - 8 = ?')
    expect(captcha.answer).toBe(14)
  })

  it('should generate deterministic multiplication captcha when random sequence is mocked', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(0.9) // operator '*'
    randomSpy.mockReturnValueOnce(0.1) // num1 => 2
    randomSpy.mockReturnValueOnce(0.8) // num2 => 6

    const captcha = generateMathCaptcha()
    expect(captcha.question).toBe('2 * 6 = ?')
    expect(captcha.answer).toBe(12)
  })
})

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')

    expect(escapeHtml('<div>Content</div>'))
      .toBe('&lt;div&gt;Content&lt;/div&gt;')

    expect(escapeHtml('a & b'))
      .toBe('a &amp; b')

    expect(escapeHtml('a "b" c'))
      .toBe('a &quot;b&quot; c')
  })

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('should handle strings without HTML', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })

  it('should escape single quotes', () => {
    expect(escapeHtml("It's a test")).toContain('&#039;')
  })

  it('should escape angle brackets in malicious code', () => {
    const input = '<img src=x onerror=alert(1)>'
    const result = escapeHtml(input)
    expect(result).toContain('&lt;')
    expect(result).toContain('&gt;')
  })
})

describe('hasSqlInjection', () => {
  it('should detect SQL injection patterns', () => {
    expect(hasSqlInjection("' OR '1'='1")).toBe(true)
    expect(hasSqlInjection('" OR "1"="1')).toBe(true)
    expect(hasSqlInjection('1; DROP TABLE users;')).toBe(true)
    expect(hasSqlInjection("' UNION SELECT * FROM users")).toBe(true)
  })

  it('should not flag safe input', () => {
    expect(hasSqlInjection("John Doe")).toBe(false)
    expect(hasSqlInjection("john.doe@example.com")).toBe(false)
    expect(hasSqlInjection("123-456-7890")).toBe(false)
    expect(hasSqlInjection("Hello, how are you?")).toBe(false)
  })

  it('should detect various SQL injection techniques', () => {
    expect(hasSqlInjection("' OR 1=1--")).toBe(true)
    expect(hasSqlInjection("admin'--")).toBe(true)
    expect(hasSqlInjection("' OR 'x'='x")).toBe(true)
    expect(hasSqlInjection("1' ORDER BY 1--")).toBe(true)
  })
})

describe('isLikelySpam', () => {
  it('should detect common spam patterns', () => {
    expect(isLikelySpam('This is a lottery winner')).toBe(true)
    expect(isLikelySpam('click here for free money')).toBe(true)
    expect(isLikelySpam('Viagra cialis online')).toBe(true)
    expect(isLikelySpam('Congratulations! You won!')).toBe(true)
  })

  it('should not flag legitimate messages', () => {
    expect(isLikelySpam('Hello, I have a project for you')).toBe(false)
    expect(isLikelySpam('I would like to collaborate')).toBe(false)
    expect(isLikelySpam('Can we schedule a meeting?')).toBe(false)
  })

  it('should handle case insensitivity', () => {
    expect(isLikelySpam('VIAGRA')).toBe(true)
    expect(isLikelySpam('LOTTERY')).toBe(true)
  })
})

describe('generateSecureToken', () => {
  it('should generate a random token', () => {
    const token = generateSecureToken()
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('should generate unique tokens', () => {
    const token1 = generateSecureToken()
    const token2 = generateSecureToken()
    expect(token1).not.toBe(token2)
  })

  it('should generate tokens with specified length', () => {
    const token16 = generateSecureToken(16)
    const token32 = generateSecureToken(32)
    expect(token16.length).toBe(16)
    expect(token32.length).toBe(32)
  })

  it('should generate tokens with safe characters', () => {
    const token = generateSecureToken()
    expect(token).toMatch(/^[A-Za-z0-9!@#$%^&*]+$/)
  })
})

describe('timingSafeCompare', () => {
  it('should return true for matching strings', () => {
    expect(timingSafeCompare('hello', 'hello')).toBe(true)
    expect(timingSafeCompare('12345', '12345')).toBe(true)
    expect(timingSafeCompare('', '')).toBe(true)
  })

  it('should return false for non-matching strings', () => {
    expect(timingSafeCompare('hello', 'world')).toBe(false)
    expect(timingSafeCompare('12345', '12346')).toBe(false)
    expect(timingSafeCompare('hello', 'HELLO')).toBe(false)
  })

  it('should return false for different length strings', () => {
    expect(timingSafeCompare('a', 'ab')).toBe(false)
  })
})

describe('isTrustedOrigin', () => {
  it('should accept trusted origins', () => {
    const trustedOrigins = ['http://localhost:3000', 'https://trusted-origin.example']
    expect(isTrustedOrigin('http://localhost:3000', trustedOrigins)).toBe(true)
    expect(isTrustedOrigin('https://trusted-origin.example', trustedOrigins)).toBe(true)
  })

  it('should reject untrusted origins', () => {
    const trustedOrigins = ['http://localhost:3000']
    expect(isTrustedOrigin('http://evil.com', trustedOrigins)).toBe(false)
    expect(isTrustedOrigin('https://attacker.com', trustedOrigins)).toBe(false)
  })

  it('should return false for null origin', () => {
    const trustedOrigins = ['http://localhost:3000']
    expect(isTrustedOrigin(null, trustedOrigins)).toBe(false)
  })

  it('should match origins with paths', () => {
    const trustedOrigins = ['https://trusted-origin.example']
    expect(isTrustedOrigin('https://trusted-origin.example/path', trustedOrigins)).toBe(true)
  })
})

describe('maskSensitiveData', () => {
  it('should mask long email addresses', () => {
    expect(maskSensitiveData('user@example.com').length).toBeGreaterThan(4)
    expect(maskSensitiveData('user@example.com').startsWith('user')).toBe(true)
  })

  it('should mask phone numbers', () => {
    expect(maskSensitiveData('123-456-7890').startsWith('123-')).toBe(true)
    expect(maskSensitiveData('123-456-7890').length).toBe(12)
  })

  it('should handle custom visible chars', () => {
    expect(maskSensitiveData('1234567890', 2)).toBe('12********')
  })

  it('should handle custom mask character', () => {
    expect(maskSensitiveData('user@example.com', 4, 'X')).toBe('userXXXXXXXXXXXX')
  })

  it('should preserve data type', () => {
    const result = maskSensitiveData('test@example.com')
    expect(typeof result).toBe('string')
  })

  it('should return unchanged for short strings', () => {
    expect(maskSensitiveData('a@b.c', 10)).toBe('a@b.c')
    expect(maskSensitiveData('abc', 5)).toBe('abc')
  })
})

describe('Security integration tests', () => {
  it('should generate secure tokens for session management', () => {
    const token = generateSecureToken(32)
    expect(token).toBeDefined()
    expect(token.length).toBe(32)
    expect(token).toMatch(/^[A-Za-z0-9!@#$%^&*]+$/)
  })

  it('should prevent SQL injection detection', () => {
    const userInput = "admin' OR '1'='1"
    const hasInjection = hasSqlInjection(userInput)
    expect(hasInjection).toBe(true)
  })

  it('should generate valid math captchas', () => {
    const captcha = generateMathCaptcha()
    expect(captcha.answer).toBeGreaterThanOrEqual(0)
    expect(captcha.question).toMatch(/\d+\s*[\+\-\*]\s*\d+\s*=/)
  })
})
