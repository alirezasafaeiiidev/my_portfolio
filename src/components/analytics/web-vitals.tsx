'use client'

import { useEffect } from 'react'

export function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const reportWebVitals = async () => {
        const vitals = {
          LCP: await getLCP(),
          FID: await getFID(),
          CLS: await getCLS(),
          FCP: await getFCP(),
          TTFB: await getTTFB(),
        }

        // Send to analytics
        console.log('Web Vitals:', vitals)

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
      const entry = entries[entries.length - 1] as any
      resolve(entry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  })
}

async function getFID() {
  return new Promise<number>((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const entry = entries[0] as any
      resolve(entry.processingStart - entry.startTime)
    }).observe({ entryTypes: ['first-input'] })
  })
}

async function getCLS() {
  return new Promise<number>((resolve) => {
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      for (const entry of entries) {
        const clsEntry = entry as any
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
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
  const navigation = performance.getEntriesByType('navigation')[0] as any
  return navigation.responseStart - navigation.requestStart
}
