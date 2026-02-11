import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const ORIGINAL_ENV = { ...process.env }

function restoreEnv() {
  process.env = { ...ORIGINAL_ENV }
}

describe('admin-auth', () => {
  beforeEach(() => {
    restoreEnv()
    vi.resetModules()
  })

  afterEach(() => {
    restoreEnv()
    vi.resetModules()
  })

  it('returns not_configured when no admin auth env exists', async () => {
    delete process.env.ADMIN_API_TOKEN
    delete process.env.ADMIN_USERNAME
    delete process.env.ADMIN_PASSWORD
    delete process.env.ADMIN_SESSION_SECRET

    const { resolveAdminAuth } = await import('@/lib/admin-auth')
    const request = new NextRequest('http://localhost:3000/api/admin/messages')
    const result = await resolveAdminAuth(request)

    expect(result).toEqual({ authorized: false, reason: 'not_configured' })
  })

  it('authorizes bearer token when ADMIN_API_TOKEN is configured', async () => {
    process.env.ADMIN_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz'

    const { resolveAdminAuth } = await import('@/lib/admin-auth')
    const request = new NextRequest('http://localhost:3000/api/admin/messages', {
      headers: {
        authorization: 'Bearer abcdefghijklmnopqrstuvwxyz',
      },
    })
    const result = await resolveAdminAuth(request)

    expect(result).toMatchObject({ authorized: true, role: 'admin', via: 'bearer' })
  })

  it('creates and verifies signed admin session token', async () => {
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD = 'supersecurepassword'
    process.env.ADMIN_SESSION_SECRET = 'very-secure-session-secret-with-32-plus'

    const { createAdminSessionToken, verifyAdminSessionToken } = await import('@/lib/admin-auth')
    const token = await createAdminSessionToken('admin')
    const verifiedPayload = await verifyAdminSessionToken(token)
    expect(verifiedPayload?.role).toBe('admin')
    expect(verifiedPayload?.sub).toBe('admin')

    const tampered = `${token}tampered`
    const tamperedPayload = await verifyAdminSessionToken(tampered)
    expect(tamperedPayload).toBeNull()
  })
})
