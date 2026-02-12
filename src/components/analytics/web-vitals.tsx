'use client'

import { useEffect } from 'react'
import { env } from '@/lib/env'

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
  useEffect(() => {
    const isEnabled = isAnalyticsEnabled(env)
    if (!isEnabled) {
      return
    }

    if (typeof window !== 'undefined' && 'performance' in window) {
      const reportWebVitals = async () => {
        const vitals = {
          LCP: await getLCP(),
          FID: await getFID(),
          CLS: await getCLS(),
          FCP: await getFCP(),
          TTFB: await getTTFB(),
        }
        void vitals

        // Send to your analytics service
        // await fetch('/api/analytics/web-vitals', {
        //   method: 'POST',
        //   body: JSON.stringify(vitals),
        // })
      }

      // Report vitals after page load
      window.addEventListener('load', reportWebVitals)

      return () => {
        window.removeEventListener('load', reportWebVitals)
      }
    }
  }, [])

  return null
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
