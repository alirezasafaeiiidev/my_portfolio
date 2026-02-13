import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sanitizeInput } from '@/lib/validators'

const patchSchema = z.object({
  status: z.enum(['NEW', 'REVIEWED', 'ACCEPTED', 'REJECTED']).optional(),
  internalNote: z.string().max(4000).optional(),
})

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }

  const limit = await checkRateLimit(request, 'admin:engineering-requests:detail')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const { id } = await context.params
    const requestItem = await db.engineeringRequest.findUnique({ where: { id } })
    if (!requestItem) {
      return withCommonApiHeaders(NextResponse.json({ error: 'Not found' }, { status: 404 }), requestId, limit.headers)
    }
    return withCommonApiHeaders(NextResponse.json({ request: requestItem }), requestId, limit.headers)
  } catch (error) {
    logger.error('Failed to fetch engineering request detail', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Failed to fetch request detail' }, { status: 500 }),
      requestId,
      limit.headers
    )
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }

  const limit = await checkRateLimit(request, 'admin:engineering-requests:patch')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const { id } = await context.params
    const body: unknown = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json({ error: 'Validation failed' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    const payload = parsed.data
    const updated = await db.engineeringRequest.update({
      where: { id },
      data: {
        status: payload.status,
        internalNote: payload.internalNote !== undefined ? sanitizeInput(payload.internalNote, 4000) : undefined,
        reviewedAt: payload.status ? new Date() : undefined,
      },
    })

    return withCommonApiHeaders(NextResponse.json({ request: updated }), requestId, limit.headers)
  } catch (error) {
    logger.error('Failed to patch engineering request', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Failed to update request' }, { status: 500 }),
      requestId,
      limit.headers
    )
  }
}

