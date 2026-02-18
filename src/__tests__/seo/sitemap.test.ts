import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('sitemap contract', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'test')
    process.env.NEXT_PUBLIC_SITE_URL = 'https://alirezasafaeisystems.ir'
  })

  it('contains only indexable URLs and no hash fragments', async () => {
    const { default: sitemap } = await import('@/app/sitemap')
    const entries = sitemap()
    const expectedBase = new URL('https://alirezasafaeisystems.ir')

    expect(entries.length).toBeGreaterThan(0)
    entries.forEach((entry) => {
      const parsed = new URL(entry.url)
      expect(parsed.hash).toBe('')
      expect(parsed.origin).toBe(expectedBase.origin)
    })
  })
})
