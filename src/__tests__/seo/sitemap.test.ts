import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('sitemap contract', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'test')
    process.env.NEXT_PUBLIC_SITE_URL = 'https://alirezasafaeidev.ir'
  })

  it('contains only indexable URLs and no hash fragments', async () => {
    const { default: sitemap } = await import('@/app/sitemap')
    const entries = sitemap()

    expect(entries.length).toBeGreaterThan(0)
    entries.forEach((entry) => {
      expect(entry.url.includes('#')).toBe(false)
      expect(entry.url.startsWith('https://alirezasafaeidev.ir')).toBe(true)
    })
  })
})
