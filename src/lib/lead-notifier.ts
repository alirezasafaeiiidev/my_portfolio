import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

interface LeadNotificationPayload {
  type: 'lead' | 'contact'
  submittedAt: string
  requestId: string
  email: string
  name?: string
  organizationName?: string
  subject?: string
  summary: string
}

function hasWebhookConfig(): boolean {
  return Boolean(env.LEAD_NOTIFICATION_WEBHOOK_URL)
}

export async function notifyLeadSubmission(payload: LeadNotificationPayload): Promise<void> {
  if (!hasWebhookConfig() || !env.LEAD_NOTIFICATION_WEBHOOK_URL) {
    return
  }

  try {
    const response = await fetch(env.LEAD_NOTIFICATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      logger.warn('Lead notification webhook returned non-2xx', {
        requestId: payload.requestId,
        status: response.status,
        type: payload.type,
      })
    }
  } catch (error) {
    logger.warn('Lead notification webhook failed', {
      requestId: payload.requestId,
      type: payload.type,
      error: error instanceof Error ? error.message : 'unknown',
    })
  }
}
