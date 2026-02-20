'use client'

import { useEffect } from 'react'
import { env } from '@/lib/env'
import { useI18n } from '@/lib/i18n-context'

export function isAnalyticsEnabled(config: {
  NEXT_PUBLIC_ENABLE_ANALYTICS?: string
  NEXT_PUBLIC_ENABLE_WEB_VITALS?: string
}): boolean {
  return (
    config.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' ||
    config.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true'
  )
}

export function WebVitals() {
  const { language } = useI18n()

  useEffect(() => {
    const isEnabled = isAnalyticsEnabled(env)
    if (!isEnabled) {
      return
    }

    if (typeof window !== 'undefined' && 'performance' in window) {
      const reportWebVitals = async () => {
        const vitals = {
          LCP: await withTimeout(getLCP(), 2500),
          FID: await withTimeout(getFID(), 2500),
          CLS: await withTimeout(getCLS(), 2500),
          FCP: await withTimeout(getFCP(), 2500),
          TTFB: await withTimeout(getTTFB(), 2500),
        }

        await fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...vitals,
            locale: language,
            path: window.location.pathname,
          }),
          keepalive: true,
        })
      }

      // Report vitals after page load
      const onLoad = () => {
        void reportWebVitals()
      }
      window.addEventListener('load', onLoad)

      return () => {
        window.removeEventListener('load', onLoad)
      }
    }
  }, [language])

  return null
}

async function withTimeout(promise: Promise<number>, timeoutMs: number): Promise<number> {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => resolve(0), timeoutMs)
    promise
      .then((value) => {
        window.clearTimeout(timeout)
        resolve(value)
      })
      .catch(() => {
        window.clearTimeout(timeout)
        resolve(0)
      })
  })
}

async function getLCP() {
  return new Promise<number>((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const entry = entries[entries.length - 1]
      resolve(entry?.startTime ?? 0)
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  })
}

async function getFID() {
  return new Promise<number>((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const entry = entries[0] as PerformanceEntry & { processingStart?: number }
      resolve((entry.processingStart ?? 0) - (entry.startTime ?? 0))
    }).observe({ entryTypes: ['first-input'] })
  })
}

async function getCLS() {
  return new Promise<number>((resolve) => {
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      for (const entry of entries) {
        const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value ?? 0
        }
      }
      resolve(clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  })
}

async function getFCP() {
  return new Promise<number>((resolve) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries[0]
      resolve(fcpEntry.startTime)
      observer.disconnect()
    })
    observer.observe({ entryTypes: ['paint'] })
  })
}

async function getTTFB() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (!navigation) {
    return 0
  }
  return navigation.responseStart - navigation.requestStart
}
