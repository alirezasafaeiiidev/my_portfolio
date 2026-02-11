import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE_NAME, getAdminSessionCookieOptions } from '@/lib/admin-auth'
import { createRequestId, withCommonApiHeaders } from '@/lib/api-security'

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const response = withCommonApiHeaders(
    NextResponse.json({ success: true }),
    requestId
  )

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  })

  return response
}
