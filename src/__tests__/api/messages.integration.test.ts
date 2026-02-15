import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  contactMessage: {
    findMany: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/lib/db', () => ({
  db: dbMock,
}))

function setBaseEnv() {
  process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS = 'false'
  process.env.API_RATE_LIMIT_MAX_REQUESTS = '20'
  process.env.API_RATE_LIMIT_WINDOW_MS = '60000'
}

describe('public messages route auth hardening', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    delete process.env.ADMIN_API_TOKEN
    delete process.env.ADMIN_USERNAME
    delete process.env.ADMIN_PASSWORD
    delete process.env.ADMIN_SESSION_SECRET
    setBaseEnv()
  })

  it('returns 503 when admin auth is not configured', async () => {
    const { GET } = await import('@/app/api/messages/route')
    const request = new NextRequest('http://localhost:3000/api/messages')

    const response = await GET(request)
    expect(response.status).toBe(503)
  })

  it('allows bearer-authenticated requests', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    dbMock.contactMessage.findMany.mockResolvedValueOnce([])
    const { GET } = await import('@/app/api/messages/route')
    const request = new NextRequest('http://localhost:3000/api/messages', {
      headers: {
        authorization: 'Bearer abcdefghijklmnopqrstuvwxyz',
      },
    })

    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(dbMock.contactMessage.findMany).toHaveBeenCalledTimes(1)
  })
})
