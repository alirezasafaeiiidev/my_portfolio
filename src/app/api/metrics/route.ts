import { NextRequest, NextResponse } from 'next/server'
import { createRequestId, withCommonApiHeaders } from '@/lib/api-security'
import { renderPrometheusMetrics } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const body = renderPrometheusMetrics()

  return withCommonApiHeaders(
    new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    }),
    requestId
  )
}
