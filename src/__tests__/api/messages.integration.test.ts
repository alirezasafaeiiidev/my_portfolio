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

  it('returns 400 when deleting without id', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    const { DELETE } = await import('@/app/api/messages/route')
    const request = new NextRequest('http://localhost:3000/api/messages', {
      method: 'DELETE',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
    })

    const response = await DELETE(request)
    expect(response.status).toBe(400)
  })

  it('deletes message by id', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    dbMock.contactMessage.delete.mockResolvedValueOnce({ id: 'msg_1' })
    const { DELETE } = await import('@/app/api/messages/route')
    const request = new NextRequest('http://localhost:3000/api/messages?id=msg_1', {
      method: 'DELETE',
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
    })

    const response = await DELETE(request)
    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(dbMock.contactMessage.delete).toHaveBeenCalledTimes(1)
  })

  it('returns 500 when database read fails', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    dbMock.contactMessage.findMany.mockRejectedValueOnce(new Error('db'))
    const { GET } = await import('@/app/api/messages/route')
    const request = new NextRequest('http://localhost:3000/api/messages', {
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
    })

    const response = await GET(request)
    expect(response.status).toBe(500)
  })
})
