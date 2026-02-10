import { describe, expect, it } from 'vitest'
import { parseEnv } from '@/lib/env'

describe('env', () => {
  it('uses defaults when optional vars are not provided', () => {
    const parsed = parseEnv({
      NODE_ENV: undefined,
      NEXT_PUBLIC_SITE_URL: undefined,
      NEXT_PUBLIC_ENABLE_WEB_VITALS: undefined,
      ADMIN_API_TOKEN: undefined,
      API_RATE_LIMIT_WINDOW_MS: undefined,
      API_RATE_LIMIT_MAX_REQUESTS: undefined,
    })

    expect(parsed.NODE_ENV).toBe('development')
    expect(parsed.NEXT_PUBLIC_ENABLE_WEB_VITALS).toBe('false')
    expect(parsed.API_RATE_LIMIT_WINDOW_MS).toBe(15 * 60 * 1000)
    expect(parsed.API_RATE_LIMIT_MAX_REQUESTS).toBe(5)
  })

  it('parses custom numeric limits', () => {
    const parsed = parseEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      NEXT_PUBLIC_ENABLE_WEB_VITALS: 'true',
      ADMIN_API_TOKEN: 'abcdefghijklmnopqrstuvwxyz',
      API_RATE_LIMIT_WINDOW_MS: '60000',
      API_RATE_LIMIT_MAX_REQUESTS: '12',
    })

    expect(parsed.NODE_ENV).toBe('production')
    expect(parsed.NEXT_PUBLIC_SITE_URL).toBe('https://example.com')
    expect(parsed.NEXT_PUBLIC_ENABLE_WEB_VITALS).toBe('true')
    expect(parsed.API_RATE_LIMIT_WINDOW_MS).toBe(60000)
    expect(parsed.API_RATE_LIMIT_MAX_REQUESTS).toBe(12)
  })
})

