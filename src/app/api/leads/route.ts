import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, createRequestId, withCommonApiHeaders } from '@/lib/api-security'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { isLikelySpam } from '@/lib/security'
import { isValidEmail, sanitizeInput } from '@/lib/validators'

const leadSchema = z.object({
  contactName: z.string().min(2).max(120),
  organizationName: z.string().min(2).max(180),
  organizationType: z.string().min(3).max(80),
  email: z.string().email().max(255),
  phone: z.string().max(40).optional().default(''),
  teamSize: z.string().min(1).max(40),
  currentStack: z.string().min(3).max(300),
  criticalRisk: z.string().min(10).max(2000),
  timeline: z.string().min(1).max(120),
  budgetRange: z.string().min(3).max(120),
  preferredContact: z.string().min(3).max(80),
  notes: z.string().max(2000).optional().default(''),
})

type LeadPayload = z.infer<typeof leadSchema>

function normalizePayload(input: LeadPayload): LeadPayload {
  return {
    contactName: sanitizeInput(input.contactName, 120),
    organizationName: sanitizeInput(input.organizationName, 180),
    organizationType: sanitizeInput(input.organizationType, 80),
    email: sanitizeInput(input.email, 255).toLowerCase(),
    phone: sanitizeInput(input.phone, 40),
    teamSize: sanitizeInput(input.teamSize, 40),
    currentStack: sanitizeInput(input.currentStack, 300),
    criticalRisk: sanitizeInput(input.criticalRisk, 2000),
    timeline: sanitizeInput(input.timeline, 120),
    budgetRange: sanitizeInput(input.budgetRange, 120),
    preferredContact: sanitizeInput(input.preferredContact, 80),
    notes: sanitizeInput(input.notes, 2000),
  }
}

function containsMaliciousContent(payload: LeadPayload): boolean {
  const injectionLikePattern = /(;|--|\b(drop|delete|insert|update|union|select|exec|execute)\b)/i
  const fields = [
    payload.contactName,
    payload.organizationName,
    payload.currentStack,
    payload.criticalRisk,
    payload.notes,
  ]

  return fields.some((value) => injectionLikePattern.test(value) || isLikelySpam(value))
}

function toStoredMessage(payload: LeadPayload): string {
  return [
    `contact_name: ${payload.contactName}`,
    `organization_name: ${payload.organizationName}`,
    `organization_type: ${payload.organizationType}`,
    `email: ${payload.email}`,
    `phone: ${payload.phone || 'n/a'}`,
    `team_size: ${payload.teamSize}`,
    `current_stack: ${payload.currentStack}`,
    `critical_risk: ${payload.criticalRisk}`,
    `timeline: ${payload.timeline}`,
    `budget_range: ${payload.budgetRange}`,
    `preferred_contact: ${payload.preferredContact}`,
    `notes: ${payload.notes || 'n/a'}`,
  ].join('\n')
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request)
  const limit = await checkRateLimit(request, 'leads')
  if (!limit.allowed) {
    return withCommonApiHeaders(
      NextResponse.json({ success: false, message: 'Too many requests', retryAt: limit.retryAt }, { status: 429 }),
      requestId,
      limit.headers
    )
  }

  try {
    const body: unknown = await request.json()
    const parsed = leadSchema.safeParse(body)
    if (!parsed.success) {
      return withCommonApiHeaders(
        NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors: parsed.error.issues.map((issue) => issue.message),
          },
          { status: 400 }
        ),
        requestId,
        limit.headers
      )
    }

    const payload = normalizePayload(parsed.data)
    if (!isValidEmail(payload.email)) {
      return withCommonApiHeaders(
        NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    if (containsMaliciousContent(payload)) {
      logger.warn('Blocked suspicious lead payload', {
        requestId,
        organizationName: payload.organizationName,
      })
      return withCommonApiHeaders(
        NextResponse.json({ success: false, message: 'Request blocked by security policy' }, { status: 400 }),
        requestId,
        limit.headers
      )
    }

    await db.contactMessage.create({
      data: {
        name: payload.contactName,
        email: payload.email,
        subject: `[Infra Program Lead] ${payload.organizationName}`,
        message: toStoredMessage(payload),
      },
    })

    logger.info('Infrastructure lead captured', {
      requestId,
      organizationName: payload.organizationName,
      organizationType: payload.organizationType,
      budgetRange: payload.budgetRange,
    })

    return withCommonApiHeaders(
      NextResponse.json({ success: true, message: 'Lead registered successfully' }, { status: 201 }),
      requestId,
      limit.headers
    )
  } catch (error) {
    logger.error('Lead capture failed', {
      requestId,
      error: error instanceof Error ? error.message : 'unknown',
    })

    return withCommonApiHeaders(
      NextResponse.json({ success: false, message: 'An error occurred while processing your request' }, { status: 500 }),
      requestId,
      limit.headers
    )
  }
}
