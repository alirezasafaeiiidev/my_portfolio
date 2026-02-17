import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '../../../middleware'
import { JsonLd } from '@/components/seo/json-ld'
import { renderToStaticMarkup } from 'react-dom/server'

describe('middleware security headers', () => {
  it('adds CSP and nonce headers', async () => {
    const request = new NextRequest('http://localhost/')
    const response = await middleware(request)

    const nonce = response.headers.get('x-csp-nonce')
    const csp = response.headers.get('Content-Security-Policy')

    expect(nonce).toBeTruthy()
    expect(csp).toBeTruthy()
    expect(csp).toContain(`nonce-${nonce}`)
  })
})

describe('JsonLd nonce passthrough', () => {
  it('renders nonce on script tag when provided', () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite' }} nonce="abc123" />,
    )
    expect(html).toContain('nonce="abc123"')
  })
})
