import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { createRequestId, getClientIp } from '@/lib/api-security'

describe('api-security', () => {
  it('extracts client ip from x-forwarded-for', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-forwarded-for': '203.0.113.10, 10.0.0.1',
      },
    })

    expect(getClientIp(request)).toBe('203.0.113.10')
  })

  it('extracts client ip from x-real-ip when x-forwarded-for is missing', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-real-ip': '198.51.100.5',
      },
    })

    expect(getClientIp(request)).toBe('198.51.100.5')
  })

  it('returns unknown when no client ip header exists', () => {
    const request = new NextRequest('http://localhost:3000/api/test')
    expect(getClientIp(request)).toBe('unknown')
  })

  it('creates UUID-like request ids', () => {
    const id = createRequestId()
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })
})

