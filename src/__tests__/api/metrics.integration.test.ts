import { describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('metrics endpoint integration', () => {
  it('returns prometheus text response', async () => {
    vi.resetModules()
    const { GET } = await import('@/app/api/metrics/route')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/plain')
    expect(body).toContain('portfolio_api_requests_total')
    expect(body).toContain('portfolio_process_uptime_seconds')
  })
})
