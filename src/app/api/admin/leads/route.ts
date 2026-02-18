import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

const leadStatusSchema = z.enum(['new', 'qualified', 'disqualified', 'archived'])

export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) return unauthorized

  const limit = await checkRateLimit(request, 'admin:leads:get')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return withCommonApiHeaders(NextResponse.json({ leads }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error fetching admin leads', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 }), requestId, limit.headers)
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) return unauthorized

  const limit = await checkRateLimit(request, 'admin:leads:patch')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const body: unknown = await request.json()
    const parsed = z.object({ id: z.string().min(10), status: leadStatusSchema }).safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json({ error: 'Validation failed', details: parsed.error.issues.map((issue) => issue.message) }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    const lead = await db.lead.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    })

    return withCommonApiHeaders(NextResponse.json({ lead }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error updating admin lead', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(NextResponse.json({ error: 'Failed to update lead' }, { status: 500 }), requestId, limit.headers)
  }
}

