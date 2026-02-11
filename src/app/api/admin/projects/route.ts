import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, createRequestId, enforceAdminAccess, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { isValidUrl, sanitizeInput } from '@/lib/validators'

const projectCreateSchema = z.object({
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(400),
  longDescription: z.string().max(2000).optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]),
  featured: z.boolean().optional().default(false),
  order: z.number().int().nonnegative().optional().default(0),
})

// GET all projects
export async function GET(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }
  const limit = await checkRateLimit(request, 'admin:projects:get')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const projects = await db.project.findMany({
      orderBy: { order: 'asc' },
    })

    return withCommonApiHeaders(NextResponse.json({ projects }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error fetching admin projects', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
      ),
      requestId,
      limit.headers
    )
  }
}

// POST create project
export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const unauthorized = await enforceAdminAccess(request, requestId)
  if (unauthorized) {
    return unauthorized
  }
  const limit = await checkRateLimit(request, 'admin:projects:post')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ error: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const body: unknown = await request.json()
    const parsed = projectCreateSchema.safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json(
          {
            error: 'Validation failed',
            details: parsed.error.issues.map((issue) => issue.message),
          },
          { status: 400 }
        ),
        requestId,
        limit.headers
      )
    }
    const data = parsed.data
    if ((data.githubUrl && !isValidUrl(data.githubUrl)) || (data.liveUrl && !isValidUrl(data.liveUrl))) {
      return withCommonApiHeaders(
        NextResponse.json({ error: 'Invalid URL format for githubUrl/liveUrl' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    const project = await db.project.create({
      data: {
        title: sanitizeInput(data.title, 140),
        description: sanitizeInput(data.description, 400),
        longDescription: data.longDescription ? sanitizeInput(data.longDescription, 2000) : undefined,
        githubUrl: data.githubUrl?.trim(),
        liveUrl: data.liveUrl?.trim(),
        tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
        featured: data.featured,
        order: data.order,
      },
    })

    return withCommonApiHeaders(NextResponse.json({ project }, { status: 201 }), requestId, limit.headers)
  } catch (error) {
    logger.error('Error creating admin project', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
      ),
      requestId,
      limit.headers
    )
  }
}
