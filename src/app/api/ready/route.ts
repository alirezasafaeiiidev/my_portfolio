import { NextRequest, NextResponse } from 'next/server'
import { createRequestId, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)

  try {
    await db.$queryRaw`SELECT 1`
    return withCommonApiHeaders(
      NextResponse.json(
        {
          status: 'ready',
          checks: {
            database: 'ok',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      ),
      requestId
    )
  } catch (error) {
    void error
    return withCommonApiHeaders(
      NextResponse.json(
        {
          status: 'not_ready',
          checks: {
            database: 'error',
          },
          error: 'database unavailable',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      ),
      requestId
    )
  }
}
