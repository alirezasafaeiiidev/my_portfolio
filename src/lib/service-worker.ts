export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null)
  }

  return navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.warn('Service Worker registered with scope:', registration.scope)
      return registration
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error)
      return null
    })
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error)
      })
  }
}
