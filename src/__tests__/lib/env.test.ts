import { describe, expect, it } from 'vitest'
import { parseEnv } from '@/lib/env'

describe('env', () => {
  it('uses defaults when optional vars are not provided', () => {
    const parsed = parseEnv({
      NODE_ENV: undefined,
      NEXT_PUBLIC_SITE_URL: undefined,
      NEXT_PUBLIC_ENABLE_WEB_VITALS: undefined,
      ADMIN_API_TOKEN: undefined,
      ADMIN_USERNAME: undefined,
      ADMIN_PASSWORD: undefined,
      ADMIN_SESSION_SECRET: undefined,
      ADMIN_SESSION_MAX_AGE_SECONDS: undefined,
      REDIS_REST_URL: undefined,
      REDIS_REST_TOKEN: undefined,
      API_RATE_LIMIT_WINDOW_MS: undefined,
      API_RATE_LIMIT_MAX_REQUESTS: undefined,
    })

    expect(parsed.NODE_ENV).toBe('development')
    expect(parsed.NEXT_PUBLIC_ENABLE_WEB_VITALS).toBe('false')
    expect(parsed.ADMIN_SESSION_MAX_AGE_SECONDS).toBe(60 * 60 * 8)
    expect(parsed.API_RATE_LIMIT_WINDOW_MS).toBe(15 * 60 * 1000)
    expect(parsed.API_RATE_LIMIT_MAX_REQUESTS).toBe(5)
  })

  it('parses custom numeric limits', () => {
    const parsed = parseEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      NEXT_PUBLIC_ENABLE_WEB_VITALS: 'true',
      ADMIN_API_TOKEN: 'abcdefghijklmnopqrstuvwxyz',
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'supersecurepassword',
      ADMIN_SESSION_SECRET: 'very-secure-session-secret-with-32-plus',
      ADMIN_SESSION_MAX_AGE_SECONDS: '1800',
      REDIS_REST_URL: 'https://redis.example.com',
      REDIS_REST_TOKEN: 'redis-secret-token',
      API_RATE_LIMIT_WINDOW_MS: '60000',
      API_RATE_LIMIT_MAX_REQUESTS: '12',
    })

    expect(parsed.NODE_ENV).toBe('production')
    expect(parsed.NEXT_PUBLIC_SITE_URL).toBe('https://example.com')
    expect(parsed.NEXT_PUBLIC_ENABLE_WEB_VITALS).toBe('true')
    expect(parsed.ADMIN_SESSION_MAX_AGE_SECONDS).toBe(1800)
    expect(parsed.REDIS_REST_URL).toBe('https://redis.example.com')
    expect(parsed.API_RATE_LIMIT_WINDOW_MS).toBe(60000)
    expect(parsed.API_RATE_LIMIT_MAX_REQUESTS).toBe(12)
  })
})
