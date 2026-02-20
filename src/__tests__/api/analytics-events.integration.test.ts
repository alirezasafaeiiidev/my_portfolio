import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  analyticsEvent: {
    create: vi.fn(),
  },
}))

vi.mock('@/lib/db', () => ({
  db: dbMock,
}))

describe('analytics events API integration', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'test')
    process.env.DATABASE_URL = 'file:./test.db'
    process.env.API_RATE_LIMIT_MAX_REQUESTS = '50'
    process.env.API_RATE_LIMIT_WINDOW_MS = '60000'
  })

  it('stores a valid conversion event', async () => {
    const { POST } = await import('@/app/api/analytics/events/route')
    const request = new NextRequest('http://localhost:3000/api/analytics/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'hero_primary_click',
        category: 'conversion',
        path: '/fa/',
        locale: 'fa',
        variant: 'authority',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(dbMock.analyticsEvent.create).toHaveBeenCalledTimes(1)
  })

  it('rejects invalid payloads', async () => {
    const { POST } = await import('@/app/api/analytics/events/route')
    const request = new NextRequest('http://localhost:3000/api/analytics/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'x',
        category: 'invalid',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    expect(dbMock.analyticsEvent.create).not.toHaveBeenCalled()
  })
})
