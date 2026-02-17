const CACHE_VERSION = 'v2-2026-02-17'
const SHELL_CACHE = `portfolio-shell-${CACHE_VERSION}`
const RUNTIME_CACHE = `portfolio-runtime-${CACHE_VERSION}`
const OFFLINE_URL = '/offline'

const SHELL_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/favicon.svg',
  '/tools',
  '/pdf-tools',
  '/image-tools',
]

const STATIC_CACHE_PATHS = ['/_next/static/', '/fonts/', '/images/', '/icons/']
const STATIC_EXTENSIONS = ['.css', '.js', '.woff2', '.woff', '.ttf', '.png', '.jpg', '.jpeg', '.svg', '.webp']

let hasActiveControllerOnInstall = false

const isStaticAsset = (url) =>
  STATIC_CACHE_PATHS.some((path) => url.pathname.startsWith(path)) ||
  STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))

const notifyClients = async (type, payload = {}) => {
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach((client) => client.postMessage({ type, ...payload }))
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('install', (event) => {
  hasActiveControllerOnInstall = !!self.registration.active
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(SHELL_CACHE)
        await cache.addAll(SHELL_ASSETS)
      } catch {
        // do not block install on cache errors
      }

      if (!hasActiveControllerOnInstall) {
        self.skipWaiting()
      } else {
        await notifyClients('UPDATE_AVAILABLE', { version: CACHE_VERSION })
      }
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      const stale = keys.filter((key) => ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
      await Promise.all(stale.map((key) => caches.delete(key)))

      await self.clients.claim()
      if (hasActiveControllerOnInstall) {
        await notifyClients('UPDATED', { version: CACHE_VERSION })
      }
    })(),
  )
})

const cacheFirst = async (request) => {
  const cached = await caches.match(request)
  if (cached) {
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()))
        }
      })
      .catch(() => {})
    return cached
  }
  const response = await fetch(request)
  if (response.ok) {
    caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()))
  }
  return response
}

const networkFirst = async (request) => {
  try {
    const response = await fetch(request)
    if (response.ok) {
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()))
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return caches.match(OFFLINE_URL)
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(networkFirst(request))
})
