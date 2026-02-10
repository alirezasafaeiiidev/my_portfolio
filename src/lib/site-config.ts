import { env } from '@/lib/env'

const LOCAL_DEFAULT_SITE_URL = 'http://localhost:3000'

export function getSiteUrl(): string {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) {
    return LOCAL_DEFAULT_SITE_URL
  }

  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}
