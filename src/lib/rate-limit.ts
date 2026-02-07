// Rate limiting utility
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  maxRequests?: number // Max requests per window
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime?: Date
}

/**
 * Checks if a request should be rate limited
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { windowMs = 15 * 60 * 1000, maxRequests = 5 } = options // 15 minutes, 5 requests by default

  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // Clean up old records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(identifier)
  }

  const current = rateLimitStore.get(identifier) || { count: 0, resetTime: now + windowMs }

  if (current.count >= maxRequests) {
    const secondsUntilReset = Math.ceil((current.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetTime: new Date(current.resetTime),
    }
  }

  // Increment counter
  current.count += 1
  rateLimitStore.set(identifier, current)

  return {
    success: true,
    remaining: maxRequests - current.count,
  }
}

/**
 * Gets rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(
  identifier: string,
  options: RateLimitOptions = {}
): Record<string, string> {
  const { maxRequests = 5, windowMs = 15 * 60 * 1000 } = options

  const record = rateLimitStore.get(identifier)
  const remaining = record ? Math.max(0, maxRequests - record.count) : maxRequests
  const resetTime = record?.resetTime || Date.now() + windowMs

  return {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    'X-RateLimit-Policy': `fixed_window;w=${Math.ceil(windowMs / 1000)};r=${maxRequests}`,
  }
}

/**
 * Resets the rate limit for a specific identifier (for admin use)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Gets current rate limit status for an identifier
 */
export function getRateLimitStatus(identifier: string): {
  remaining: number
  resetTime: Date
} | null {
  const record = rateLimitStore.get(identifier)
  if (!record) {
    return null
  }

  return {
    remaining: Math.max(0, 5 - record.count),
    resetTime: new Date(record.resetTime),
  }
}

/**
 * Clean up old rate limit records periodically
 */
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, 60 * 1000) // Clean up every minute
}
