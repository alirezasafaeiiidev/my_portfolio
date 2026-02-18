import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isSessionAuthConfigured,
  validateAdminCredentials,
  ADMIN_SESSION_COOKIE_NAME,
} from '@/lib/admin-auth'
import { checkRateLimit, createRequestId, withCommonApiHeaders } from '@/lib/api-security'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const limit = await checkRateLimit(request, 'admin:login')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  if (!isSessionAuthConfigured()) {
    return withCommonApiHeaders(
      NextResponse.json(
        { error: 'Admin session authentication is not configured' },
        { status: 503 }
      ),
      requestId,
      limit.headers
    )
  }

  try {
    const body: unknown = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json({ error: 'Invalid login payload' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    const { username, password } = parsed.data
    if (!validateAdminCredentials(username, password)) {
      return withCommonApiHeaders(
        NextResponse.json({ error: 'Invalid username or password' }, { status: 401 }),
        requestId,
        limit.headers
      )
    }

    const token = await createAdminSessionToken(username)
    const response = withCommonApiHeaders(
      NextResponse.json({ success: true, role: 'admin' }),
      requestId,
      limit.headers
    )
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, getAdminSessionCookieOptions())
    return response
  } catch {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Failed to process login request' }, { status: 400 }),
      requestId,
      limit.headers
    )
  }
}
