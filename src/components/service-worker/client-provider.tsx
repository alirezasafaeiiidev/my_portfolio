'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'

export function ServiceWorkerProvider() {
  useEffect(() => {
    // Only register in production
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker()
    }
  }, [])

  return null
}
