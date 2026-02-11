import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { resolveAdminAuth } from '@/lib/admin-auth'
import { recordApiResponse } from '@/lib/metrics'
import { getRateLimitHeaders, rateLimit } from '@/lib/rate-limit'

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return 'unknown'
}

export function createRequestId(request?: NextRequest): string {
  const inboundId = request?.headers.get('x-request-id') || request?.headers.get('x-correlation-id')
  if (inboundId && inboundId.trim().length > 0) {
    return inboundId.trim()
  }
  return crypto.randomUUID()
}

export function withCommonApiHeaders(
  response: NextResponse,
  requestId: string,
  extraHeaders?: Record<string, string>
): NextResponse {
  response.headers.set('X-Request-ID', requestId)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set('Cache-Control', 'no-store')

  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      response.headers.set(key, value)
    }
  }

  recordApiResponse(response.status)

  return response
}

export async function enforceAdminAccess(request: NextRequest, requestId: string): Promise<NextResponse | null> {
  const authResult = await resolveAdminAuth(request)
  if (authResult.authorized) {
    return null
  }

  if (authResult.reason === 'not_configured') {
    return withCommonApiHeaders(
      NextResponse.json(
        { error: 'Admin authentication is not configured' },
        { status: 503 }
      ),
      requestId
    )
  }

  return withCommonApiHeaders(
    NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    requestId
  )
}

export async function checkRateLimit(request: NextRequest, keyPrefix: string) {
  const identifier = `${keyPrefix}:${getClientIp(request)}`
  const limitResult = await rateLimit(identifier, {
    windowMs: env.API_RATE_LIMIT_WINDOW_MS,
    maxRequests: env.API_RATE_LIMIT_MAX_REQUESTS,
  })
  const headers = getRateLimitHeaders(limitResult)

  return {
    allowed: limitResult.success,
    headers,
    retryAt: limitResult.resetTime.toISOString(),
  }
}
