import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '@/proxy'

describe('proxy locale routing', () => {
  it('redirects localized /fa path to internal root and sets lang cookie', async () => {
    const request = new NextRequest('https://alirezasafaeisystems.ir/fa')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/')
    expect(response.cookies.get('lang')?.value).toBe('fa')
  })

  it('redirects localized /en path to internal route and sets english cookie', async () => {
    const request = new NextRequest('https://alirezasafaeisystems.ir/en/services')
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/services')
    expect(response.cookies.get('lang')?.value).toBe('en')
  })

  it('serves non-localized root directly without locale redirect loop', async () => {
    const request = new NextRequest('https://alirezasafaeisystems.ir/')
    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })
})
