import { describe, expect, it } from 'vitest'
import { getCacheControl } from '@/proxy'

describe('proxy cache contract', () => {
  it('sets no-store for sensitive routes', () => {
    expect(getCacheControl('/api/contact')).toContain('no-store')
    expect(getCacheControl('/admin')).toContain('no-store')
    expect(getCacheControl('/account/settings')).toContain('no-store')
    expect(getCacheControl('/auth/login')).toContain('no-store')
  })

  it('keeps SWR for safe public routes', () => {
    expect(getCacheControl('/')).toContain('stale-while-revalidate')
    expect(getCacheControl('/services/infrastructure-localization')).toContain('stale-while-revalidate')
  })
})
