import { describe, expect, it } from 'vitest'
import { isAnalyticsEnabled } from '@/components/analytics/web-vitals'

describe('isAnalyticsEnabled', () => {
  it('returns false when both flags are disabled or missing', () => {
    expect(isAnalyticsEnabled({})).toBe(false)
    expect(
      isAnalyticsEnabled({
        NEXT_PUBLIC_ENABLE_ANALYTICS: 'false',
        NEXT_PUBLIC_ENABLE_WEB_VITALS: 'false',
      })
    ).toBe(false)
  })

  it('returns true when NEXT_PUBLIC_ENABLE_ANALYTICS is true', () => {
    expect(
      isAnalyticsEnabled({
        NEXT_PUBLIC_ENABLE_ANALYTICS: 'true',
        NEXT_PUBLIC_ENABLE_WEB_VITALS: 'false',
      })
    ).toBe(true)
  })

  it('keeps backward compatibility with NEXT_PUBLIC_ENABLE_WEB_VITALS', () => {
    expect(
      isAnalyticsEnabled({
        NEXT_PUBLIC_ENABLE_ANALYTICS: 'false',
        NEXT_PUBLIC_ENABLE_WEB_VITALS: 'true',
      })
    ).toBe(true)
  })
})
