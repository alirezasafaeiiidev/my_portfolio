import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from '@/lib/admin-auth'
import { env } from '@/lib/env'

const ADMIN_LOGIN_PATH = '/admin/login'

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value)
  }
  if (env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
  return response
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const correlationId =
    request.headers.get('x-request-id') ||
    request.headers.get('x-correlation-id') ||
    crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', correlationId)
  requestHeaders.set('x-correlation-id', correlationId)

  if (pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH) {
    if (!isAdminAuthConfigured()) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = ADMIN_LOGIN_PATH
      loginUrl.searchParams.set('error', 'auth_not_configured')
      const response = NextResponse.redirect(loginUrl)
      response.headers.set('X-Request-ID', correlationId)
      response.headers.set('X-Correlation-ID', correlationId)
      return withSecurityHeaders(response)
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
    const session = token ? await verifyAdminSessionToken(token) : null
    if (!session) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = ADMIN_LOGIN_PATH
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.headers.set('X-Request-ID', correlationId)
      response.headers.set('X-Correlation-ID', correlationId)
      return withSecurityHeaders(response)
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('X-Request-ID', correlationId)
  response.headers.set('X-Correlation-ID', correlationId)
  return withSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
}
