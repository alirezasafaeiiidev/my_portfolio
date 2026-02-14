import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE_NAME,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from '@/lib/admin-auth'
import { env } from '@/lib/env'

const ADMIN_LOGIN_PATH = '/admin/login'

const BASE_SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}

export function getCacheControl(pathname: string): string {
  if (
    pathname.startsWith('/api/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/') ||
    pathname === '/auth' ||
    pathname.startsWith('/auth/')
  ) {
    return 'no-store, no-cache, must-revalidate, max-age=0'
  }
  return 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
}

function buildCsp(nonce: string): string {
  const scriptSources = [`'self'`, `'nonce-${nonce}'`]
  const styleSources = [`'self'`, `'nonce-${nonce}'`]

  if (env.NODE_ENV !== 'production') {
    scriptSources.push("'unsafe-eval'")
    styleSources.push("'unsafe-inline'")
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `style-src ${styleSources.join(' ')}`,
    `script-src ${scriptSources.join(' ')}`,
    "connect-src 'self'",
  ].join('; ')
}

function withSecurityHeaders(response: NextResponse, pathname: string, nonce: string): NextResponse {
  for (const [header, value] of Object.entries(BASE_SECURITY_HEADERS)) {
    response.headers.set(header, value)
  }
  response.headers.set('Content-Security-Policy', buildCsp(nonce))
  response.headers.set('Cache-Control', getCacheControl(pathname))
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
  const nonce = crypto.randomUUID().replace(/-/g, '')
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', correlationId)
  requestHeaders.set('x-correlation-id', correlationId)
  requestHeaders.set('x-csp-nonce', nonce)

  if (pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH) {
    if (!isAdminAuthConfigured()) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = ADMIN_LOGIN_PATH
      loginUrl.searchParams.set('error', 'auth_not_configured')
      const response = NextResponse.redirect(loginUrl)
      response.headers.set('X-Request-ID', correlationId)
      response.headers.set('X-Correlation-ID', correlationId)
      response.headers.set('x-csp-nonce', nonce)
      return withSecurityHeaders(response, pathname, nonce)
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
      response.headers.set('x-csp-nonce', nonce)
      return withSecurityHeaders(response, pathname, nonce)
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('X-Request-ID', correlationId)
  response.headers.set('X-Correlation-ID', correlationId)
  response.headers.set('x-csp-nonce', nonce)
  return withSecurityHeaders(response, pathname, nonce)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
}
