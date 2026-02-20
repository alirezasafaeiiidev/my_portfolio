'use client'

type AnalyticsPayload = {
  name: string
  category: 'conversion' | 'engagement' | 'web_vital'
  locale?: 'fa' | 'en'
  variant?: string
  value?: number
  metadata?: Record<string, string | number | boolean>
}

function stringifyMetadata(metadata?: Record<string, string | number | boolean>) {
  if (!metadata) return undefined
  return Object.fromEntries(Object.entries(metadata).slice(0, 20))
}

export async function trackEvent(payload: AnalyticsPayload): Promise<void> {
  if (typeof window === 'undefined') return

  const body = {
    ...payload,
    path: window.location.pathname,
    metadata: stringifyMetadata(payload.metadata),
  }

  try {
    const serialized = JSON.stringify(body)
    if (navigator.sendBeacon) {
      const blob = new Blob([serialized], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/events', blob)
      return
    }

    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: serialized,
      keepalive: true,
    })
  } catch {
    // Avoid breaking UI for telemetry failures.
  }
}
