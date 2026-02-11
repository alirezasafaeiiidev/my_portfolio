import { NextRequest, NextResponse } from 'next/server'
import { createRequestId, withCommonApiHeaders } from '@/lib/api-security'
import { env } from '@/lib/env'

export async function GET(_request: NextRequest) {
  const requestId = createRequestId(_request)
  const startedAt = process.uptime()

  return withCommonApiHeaders(
    NextResponse.json({
      status: 'ok',
      service: 'portfolio-api',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(startedAt),
    }),
    requestId
  )
}
