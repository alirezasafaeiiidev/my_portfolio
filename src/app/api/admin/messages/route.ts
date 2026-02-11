import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

// GET all contact messages
export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }
  const limit = await checkRateLimit(request, 'admin:messages:get')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return withCommonApiHeaders(NextResponse.json({ messages }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error fetching admin messages', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
      ),
      requestId,
      limit.headers
    )
  }
}

// DELETE message
export async function DELETE(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }
  const limit = await checkRateLimit(request, 'admin:messages:delete')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return withCommonApiHeaders(
        NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
        ),
        requestId,
        limit.headers
      )
    }

    await db.contactMessage.delete({
      where: { id },
    })

    return withCommonApiHeaders(NextResponse.json({ success: true }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error deleting admin message', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
      ),
      requestId,
      limit.headers
    )
  }
}
