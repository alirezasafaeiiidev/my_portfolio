import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getRateLimitHeaders, rateLimit } from '@/lib/rate-limit'
import { timingSafeCompare } from '@/lib/security'

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

export function createRequestId(): string {
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

  return response
}

export function enforceOptionalAdminToken(request: NextRequest, requestId: string): NextResponse | null {
  if (!env.ADMIN_API_TOKEN) {
    return null
  }

  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      requestId
    )
  }

  const token = authorization.replace('Bearer ', '').trim()
  if (!timingSafeCompare(token, env.ADMIN_API_TOKEN)) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      requestId
    )
  }

  return null
}

export function checkRateLimit(request: NextRequest, keyPrefix: string) {
  const identifier = `${keyPrefix}:${getClientIp(request)}`
  const limitResult = rateLimit(identifier, {
    windowMs: env.API_RATE_LIMIT_WINDOW_MS,
    maxRequests: env.API_RATE_LIMIT_MAX_REQUESTS,
  })
  const headers = getRateLimitHeaders(identifier, {
    windowMs: env.API_RATE_LIMIT_WINDOW_MS,
    maxRequests: env.API_RATE_LIMIT_MAX_REQUESTS,
  })

  return {
    allowed: limitResult.success,
    headers,
    retryAt: limitResult.resetTime?.toISOString(),
  }
}

