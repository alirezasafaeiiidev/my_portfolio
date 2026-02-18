import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_ENV = { ...process.env }

describe('rate-limit', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.REDIS_REST_URL
    delete process.env.REDIS_REST_TOKEN
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('uses in-memory limiter when redis is not configured', async () => {
    const { rateLimit } = await import('@/lib/rate-limit')

    const first = await rateLimit('memory-test', { maxRequests: 1, windowMs: 1000 })
    const second = await rateLimit('memory-test', { maxRequests: 1, windowMs: 1000 })

    expect(first.success).toBe(true)
    expect(first.source).toBe('memory')
    expect(second.success).toBe(false)
  })

  it('uses redis limiter when redis env is configured', async () => {
    process.env.REDIS_REST_URL = 'https://redis.example.com'
    process.env.REDIS_REST_TOKEN = 'redis-secret-token'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ result: 2 }, { result: 1 }, { result: 60 }],
      })
    )

    const { rateLimit } = await import('@/lib/rate-limit')
    const result = await rateLimit('redis-test', { maxRequests: 5, windowMs: 60000 })

    expect(result.source).toBe('redis')
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(3)
  })

  it('falls back to memory when redis returns non-2xx', async () => {
    process.env.REDIS_REST_URL = 'https://redis.example.com'
    process.env.REDIS_REST_TOKEN = 'redis-secret-token'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    )

    const { rateLimit } = await import('@/lib/rate-limit')
    const result = await rateLimit('redis-non-2xx', { maxRequests: 1, windowMs: 1000 })
    expect(result.source).toBe('memory')
  })

  it('falls back to memory when redis throws', async () => {
    process.env.REDIS_REST_URL = 'https://redis.example.com'
    process.env.REDIS_REST_TOKEN = 'redis-secret-token'
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))

    const { rateLimit } = await import('@/lib/rate-limit')
    const result = await rateLimit('redis-throws', { maxRequests: 1, windowMs: 1000 })
    expect(result.source).toBe('memory')
  })

  it('generates rate limit headers and supports reset/status helpers', async () => {
    const { rateLimit, getRateLimitHeaders, getRateLimitStatus, resetRateLimit } = await import('@/lib/rate-limit')

    const result = await rateLimit('header-test', { maxRequests: 2, windowMs: 1000 })
    const headers = getRateLimitHeaders(result)
    expect(headers['X-RateLimit-Limit']).toBe('2')
    expect(headers['X-RateLimit-Remaining']).toBe('1')
    expect(headers['X-RateLimit-Store']).toBe('memory')

    const status = getRateLimitStatus('header-test')
    expect(status).not.toBeNull()
    resetRateLimit('header-test')
    expect(getRateLimitStatus('header-test')).toBeNull()
  })

  it('clears expired in-memory buckets on subsequent calls', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const { rateLimit } = await import('@/lib/rate-limit')
    const first = await rateLimit('expire-test', { maxRequests: 1, windowMs: 1000 })
    expect(first.success).toBe(true)

    vi.setSystemTime(new Date('2026-01-01T00:00:02.000Z'))
    const second = await rateLimit('expire-test', { maxRequests: 1, windowMs: 1000 })
    expect(second.success).toBe(true)
    expect(second.remaining).toBe(0)

    vi.useRealTimers()
  })
})
