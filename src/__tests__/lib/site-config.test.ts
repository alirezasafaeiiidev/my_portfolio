import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('site-config', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.VERCEL_URL
    vi.stubEnv('NODE_ENV', 'test')
  })

  it('uses NEXT_PUBLIC_SITE_URL when provided', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://alirezasafeidev.ir/'
    const { getSiteUrl } = await import('@/lib/site-config')
    expect(getSiteUrl()).toBe('https://alirezasafeidev.ir')
  })

  it('uses localhost fallback outside production', async () => {
    const { getSiteUrl } = await import('@/lib/site-config')
    expect(getSiteUrl()).toBe('http://localhost:3000')
  })

  it('uses production fallback when NEXT_PUBLIC_SITE_URL and VERCEL_URL are missing', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { getSiteUrl } = await import('@/lib/site-config')
    expect(getSiteUrl()).toBe('https://alirezasafeidev.ir')
  })
})
