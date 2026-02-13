import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, createRequestId, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { isLikelySpam } from '@/lib/security'
import { isValidEmail, isValidUrl, sanitizeInput } from '@/lib/validators'
import { internalNotificationTemplate, requesterConfirmationTemplate } from '@/lib/email-templates'
import { sendEmail } from '@/lib/mailer'
import { env } from '@/lib/env'

const engineeringRequestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(255),
  company: z.string().max(160).optional().default(''),
  website: z.string().max(300).optional().default(''),
  projectType: z.string().min(2).max(120),
  budget: z.string().max(120).optional().default(''),
  timeline: z.string().max(120).optional().default(''),
  message: z.string().min(20).max(5000),
  hpField: z.string().max(200).optional().default(''),
})

type EngineeringRequestPayload = z.infer<typeof engineeringRequestSchema>

function normalizePayload(payload: EngineeringRequestPayload) {
  return {
    name: sanitizeInput(payload.name, 120),
    email: sanitizeInput(payload.email, 255).toLowerCase(),
    company: sanitizeInput(payload.company, 160),
    website: sanitizeInput(payload.website, 300),
    projectType: sanitizeInput(payload.projectType, 120),
    budget: sanitizeInput(payload.budget, 120),
    timeline: sanitizeInput(payload.timeline, 120),
    message: sanitizeInput(payload.message, 5000),
    hpField: sanitizeInput(payload.hpField, 200),
  }
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const limit = await checkRateLimit(request, 'engineering-request:post')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json(
        { success: false, message: 'Too many requests. Please try later.', retryAt: limit.retryAt },
        { status: 429 }
      ),
      requestId,
      limit.headers
    )
  }

  try {
    const body: unknown = await request.json()
    const parsed = engineeringRequestSchema.safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    const payload = normalizePayload(parsed.data)
    if (payload.hpField) {
      logger.warn('Honeypot triggered for engineering request', { requestId })
      return withCommonApiHeaders(
        NextResponse.json({ success: true, requestId }),
        requestId,
        limit.headers
      )
    }

    if (!isValidEmail(payload.email)) {
      return withCommonApiHeaders(
        NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    if (payload.website && !isValidUrl(payload.website)) {
      return withCommonApiHeaders(
        NextResponse.json({ success: false, message: 'Invalid website URL' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    if (isLikelySpam(payload.message)) {
      return withCommonApiHeaders(
        NextResponse.json({ success: false, message: 'Request blocked by anti-abuse policy' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    const created = await db.engineeringRequest.create({
      data: {
        name: payload.name,
        email: payload.email,
        company: payload.company || null,
        website: payload.website || null,
        projectType: payload.projectType,
        budget: payload.budget || null,
        timeline: payload.timeline || null,
        message: payload.message,
      },
    })

    const requesterEmail = requesterConfirmationTemplate({
      requestId: created.id,
      name: created.name,
      email: created.email,
      company: created.company || undefined,
      projectType: created.projectType,
      budget: created.budget || undefined,
      timeline: created.timeline || undefined,
      message: created.message,
    })
    const internalEmail = internalNotificationTemplate({
      requestId: created.id,
      name: created.name,
      email: created.email,
      company: created.company || undefined,
      projectType: created.projectType,
      budget: created.budget || undefined,
      timeline: created.timeline || undefined,
      message: created.message,
    })

    // Best-effort only: API must succeed even when email delivery fails.
    void sendEmail({
      to: created.email,
      subject: requesterEmail.subject,
      text: requesterEmail.text,
      html: requesterEmail.html,
    })
    if (env.ENGINEERING_NOTIFY_TO) {
      void sendEmail({
        to: env.ENGINEERING_NOTIFY_TO,
        subject: internalEmail.subject,
        text: internalEmail.text,
        html: internalEmail.html,
      })
    }

    return withCommonApiHeaders(
      NextResponse.json({ success: true, requestId: created.id }, { status: 201 }),
      requestId,
      limit.headers
    )
  } catch (error) {
    logger.error('Engineering request creation failed', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return withCommonApiHeaders(
      NextResponse.json({ success: false, message: 'Failed to submit request' }, { status: 500 }),
      requestId,
      limit.headers
    )
  }
}

