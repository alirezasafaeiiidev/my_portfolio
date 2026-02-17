'use client'

import { useEffect, useState } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'

export function ServiceWorkerProvider() {
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return
    }

    let controllerChangeHandler: (() => void) | null = null

    registerServiceWorker().then((registration) => {
      if (!registration) return

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateReady(true)
          }
        })
      })
    })

    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_AVAILABLE') {
        setUpdateReady(true)
      }
      if (event.data?.type === 'UPDATED') {
        window.location.reload()
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler)
    controllerChangeHandler = () => window.location.reload()
    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler)

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler)
      if (controllerChangeHandler) {
        navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler)
      }
    }
  }, [])

  const applyUpdate = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
    })
    setUpdateReady(false)
  }

  if (!updateReady) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-background/90 px-4 py-3 shadow-lg ring-1 ring-border backdrop-blur">
      <span className="text-sm font-medium">نسخه جدید آماده است</span>
      <button
        type="button"
        className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background"
        onClick={applyUpdate}
      >
        بروزرسانی و بارگذاری
      </button>
    </div>
  )
}
