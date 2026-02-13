import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

interface MailPayload {
  to: string
  subject: string
  text: string
  html?: string
}

async function sendWithResend(payload: MailPayload): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.ENGINEERING_FROM || !env.RESEND_API_URL) {
    return false
  }

  const response = await fetch(env.RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.ENGINEERING_FROM,
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  })

  return response.ok
}

async function sendWithSmtp(payload: MailPayload): Promise<boolean> {
  logger.warn('SMTP provider is configured but not implemented in runtime', {
    to: payload.to,
  })
  return false
}

export async function sendEmail(payload: MailPayload): Promise<boolean> {
  try {
    if (env.EMAIL_PROVIDER === 'resend') {
      return await sendWithResend(payload)
    }
    if (env.EMAIL_PROVIDER === 'smtp') {
      return await sendWithSmtp(payload)
    }
    return false
  } catch (error) {
    logger.error('Email delivery failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return false
  }
}
