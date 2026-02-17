import { env } from '@/lib/env'

const LOCAL_DEFAULT_SITE_URL = 'http://localhost:3000'
const PRODUCTION_FALLBACK_SITE_URL = 'https://alirezasafeidev.ir'

export function getSiteUrl(): string {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim()
  if (raw) {
    return raw.endsWith('/') ? raw.slice(0, -1) : raw
  }

  if (env.NODE_ENV === 'production') {
    const vercelUrl = process.env.VERCEL_URL?.trim()
    if (vercelUrl) {
      return `https://${vercelUrl.replace(/^https?:\/\//, '')}`
    }
    return PRODUCTION_FALLBACK_SITE_URL
  }

  return LOCAL_DEFAULT_SITE_URL
}
