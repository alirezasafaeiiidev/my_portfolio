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
})
