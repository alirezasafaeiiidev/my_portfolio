import { NextRequest, NextResponse } from 'next/server'
import { resolveAdminAuth } from '@/lib/admin-auth'
import { createRequestId, withCommonApiHeaders } from '@/lib/api-security'

export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const authResult = await resolveAdminAuth(request)

  if (!authResult.authorized) {
    const status = authResult.reason === 'not_configured' ? 503 : 401
    return withCommonApiHeaders(
      NextResponse.json({ authenticated: false, reason: authResult.reason }, { status }),
      requestId
    )
  }

  return withCommonApiHeaders(
    NextResponse.json({ authenticated: true, role: authResult.role, via: authResult.via }),
    requestId
  )
}
