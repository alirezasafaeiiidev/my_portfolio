import { NextRequest } from 'next/server'
import { env } from '@/lib/env'
import { timingSafeCompare } from '@/lib/security'

export const ADMIN_SESSION_COOKIE_NAME = 'asdev_admin_session'
export type AdminRole = 'admin'

interface AdminSessionPayload {
  sub: string
  role: AdminRole
  iat: number
  exp: number
}

type AdminAuthResult =
  | { authorized: true; role: AdminRole; via: 'session' | 'bearer' }
  | { authorized: false; reason: 'not_configured' | 'invalid_credentials' }

function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }

  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64'))
  }

  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return fromBase64(`${normalized}${padding}`)
}

async function signValue(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return toBase64Url(new Uint8Array(signature))
}

function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.replace('Bearer ', '').trim()
}

export function isSessionAuthConfigured(): boolean {
  return Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.ADMIN_SESSION_SECRET)
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(env.ADMIN_API_TOKEN || isSessionAuthConfigured())
}

export function validateAdminCredentials(username: string, password: string): boolean {
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
    return false
  }

  return (
    timingSafeCompare(username.trim(), env.ADMIN_USERNAME) &&
    timingSafeCompare(password, env.ADMIN_PASSWORD)
  )
}

export async function createAdminSessionToken(username: string): Promise<string> {
  if (!env.ADMIN_SESSION_SECRET) {
    throw new Error('ADMIN_SESSION_SECRET is required for session tokens')
  }

  const issuedAt = Math.floor(Date.now() / 1000)
  const payload: AdminSessionPayload = {
    sub: username,
    role: 'admin',
    iat: issuedAt,
    exp: issuedAt + env.ADMIN_SESSION_MAX_AGE_SECONDS,
  }

  const payloadPart = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const signaturePart = await signValue(payloadPart, env.ADMIN_SESSION_SECRET)
  return `${payloadPart}.${signaturePart}`
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  if (!env.ADMIN_SESSION_SECRET || !token.includes('.')) {
    return null
  }

  const [payloadPart, signaturePart] = token.split('.')
  const expectedSignature = await signValue(payloadPart, env.ADMIN_SESSION_SECRET)
  if (!timingSafeCompare(signaturePart, expectedSignature)) {
    return null
  }

  try {
    const payloadRaw = new TextDecoder().decode(fromBase64Url(payloadPart))
    const payload = JSON.parse(payloadRaw) as AdminSessionPayload
    const now = Math.floor(Date.now() / 1000)
    if (!payload?.sub || payload.role !== 'admin' || payload.exp <= now) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export async function resolveAdminAuth(request: NextRequest): Promise<AdminAuthResult> {
  if (!isAdminAuthConfigured()) {
    return { authorized: false, reason: 'not_configured' }
  }

  const bearerToken = getBearerToken(request)
  if (bearerToken && env.ADMIN_API_TOKEN && timingSafeCompare(bearerToken, env.ADMIN_API_TOKEN)) {
    return { authorized: true, role: 'admin', via: 'bearer' }
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  if (sessionToken) {
    const payload = await verifyAdminSessionToken(sessionToken)
    if (payload?.role === 'admin') {
      return { authorized: true, role: 'admin', via: 'session' }
    }
  }

  return { authorized: false, reason: 'invalid_credentials' }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: env.ADMIN_SESSION_MAX_AGE_SECONDS,
  }
}
