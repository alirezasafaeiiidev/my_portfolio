import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

function setBaseEnv() {
  process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS = 'false'
  process.env.API_RATE_LIMIT_MAX_REQUESTS = '20'
  process.env.API_RATE_LIMIT_WINDOW_MS = '60000'
}

describe('admin auth integration', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.ADMIN_API_TOKEN
    delete process.env.ADMIN_USERNAME
    delete process.env.ADMIN_PASSWORD
    delete process.env.ADMIN_SESSION_SECRET
    setBaseEnv()
  })

  it('returns 503 when session auth is not configured', async () => {
    const { POST } = await import('@/app/api/admin/auth/login/route')
    const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'pass' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(503)
  })

  it('creates session cookie for valid credentials', async () => {
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD = 'supersecurepassword'
    process.env.ADMIN_SESSION_SECRET = 'very-secure-session-secret-with-32-plus'

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'supersecurepassword' }),
    })

    const response = await POST(request)
    const setCookie = response.headers.get('set-cookie') || ''

    expect(response.status).toBe(200)
    expect(setCookie).toContain('asdev_admin_session=')
    expect(setCookie).toContain('HttpOnly')
  })

  it('returns session status for bearer token auth', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    const { GET } = await import('@/app/api/admin/auth/session/route')
    const request = new NextRequest('http://localhost:3000/api/admin/auth/session', {
      headers: { authorization: 'Bearer abcdefghijklmnopqrstuvwxyz' },
    })

    const response = await GET(request)
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.authenticated).toBe(true)
    expect(payload.via).toBe('bearer')
  })

  it('returns 503 for session status when admin auth is not configured', async () => {
    const { GET } = await import('@/app/api/admin/auth/session/route')
    const request = new NextRequest('http://localhost:3000/api/admin/auth/session')

    const response = await GET(request)
    const payload = await response.json()

    expect(response.status).toBe(503)
    expect(payload.authenticated).toBe(false)
    expect(payload.reason).toBe('not_configured')
  })

  it('returns 401 for session status when credentials are invalid', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'
    const { GET } = await import('@/app/api/admin/auth/session/route')
    const request = new NextRequest('http://localhost:3000/api/admin/auth/session', {
      headers: { authorization: 'Bearer wrong' },
    })

    const response = await GET(request)
    const payload = await response.json()

    expect(response.status).toBe(401)
    expect(payload.authenticated).toBe(false)
    expect(payload.reason).toBe('invalid_credentials')
  })

  it('rate limits repeated login attempts', async () => {
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD = 'supersecurepassword'
    process.env.ADMIN_SESSION_SECRET = 'very-secure-session-secret-with-32-plus'
    process.env.API_RATE_LIMIT_MAX_REQUESTS = '1'
    process.env.API_RATE_LIMIT_WINDOW_MS = '60000'

    const { POST } = await import('@/app/api/admin/auth/login/route')
    const firstAttempt = new NextRequest('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrong-password' }),
    })
    const secondAttempt = new NextRequest('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrong-password' }),
    })

    const firstResponse = await POST(firstAttempt)
    const secondResponse = await POST(secondAttempt)

    expect(firstResponse.status).toBe(401)
    expect(secondResponse.status).toBe(429)
  })
})
