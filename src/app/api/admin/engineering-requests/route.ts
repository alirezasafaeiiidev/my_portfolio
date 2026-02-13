import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }

  const limit = await checkRateLimit(request, 'admin:engineering-requests:get')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const requests = await db.engineeringRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    return withCommonApiHeaders(NextResponse.json({ requests }), requestId, limit.headers)
  } catch (error) {
    logger.error('Failed to fetch engineering requests', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Failed to fetch engineering requests' }, { status: 500 }),
      requestId,
      limit.headers
    )
  }
}

