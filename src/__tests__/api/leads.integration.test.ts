import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  contactMessage: {
    create: vi.fn(),
  },
}))

vi.mock('@/lib/db', () => ({
  db: dbMock,
}))

describe('lead API integration', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'test')
    process.env.API_RATE_LIMIT_MAX_REQUESTS = '20'
    process.env.API_RATE_LIMIT_WINDOW_MS = '60000'
  })

  it('stores a valid lead request', async () => {
    const { POST } = await import('@/app/api/leads/route')
    const request = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contactName: 'Ali Safaei',
        organizationName: 'Industrial Co',
        organizationType: 'government_contractor',
        email: 'lead@example.com',
        phone: '09120000000',
        teamSize: '12',
        currentStack: 'Next.js + PostgreSQL',
        criticalRisk: 'No disaster recovery test and no release governance.',
        timeline: '30 days',
        budgetRange: '60-120m-irr',
        preferredContact: 'email',
        notes: 'Need risk assessment this month.',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(dbMock.contactMessage.create).toHaveBeenCalledTimes(1)
  })

  it('rejects invalid payload', async () => {
    const { POST } = await import('@/app/api/leads/route')
    const request = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contactName: 'A',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    expect(dbMock.contactMessage.create).not.toHaveBeenCalled()
  })
})
