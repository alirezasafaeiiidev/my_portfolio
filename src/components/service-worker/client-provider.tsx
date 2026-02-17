'use client'

import { useEffect, useState } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'
import { UpdateBanner } from '@/components/service-worker/update-banner'

export function ServiceWorkerProvider() {
  const [updateReady, setUpdateReady] = useState(false)
  const [updateVersion, setUpdateVersion] = useState<string | null>(null)

  const isDismissedVersion = (version: string | null) => {
    if (!version || typeof window === 'undefined') return false
    return localStorage.getItem('sw:update-dismissed') === version
  }

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
        const version = event.data?.version || null
        setUpdateVersion(version)
        if (!isDismissedVersion(version)) {
          setUpdateReady(true)
        }
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

  const dismissUpdate = () => {
    if (updateVersion) {
      localStorage.setItem('sw:update-dismissed', updateVersion)
    }
    setUpdateReady(false)
  }

  if (!updateReady) return null

  return <UpdateBanner onUpdateNow={applyUpdate} onLater={dismissUpdate} />
}
