'use client'

import { useEffect } from 'react'

type FontCdnLoaderProps = {
  enabled: boolean
  href?: string
}

export function FontCdnLoader({ enabled, href }: FontCdnLoaderProps) {
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-font-source', 'local')

    if (!enabled || !href) {
      return
    }

    const existing = document.querySelector<HTMLLinkElement>('link[data-font-cdn="true"]')
    if (existing) {
      return
    }

    let done = false
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.crossOrigin = 'anonymous'
    link.setAttribute('data-font-cdn', 'true')

    const fail = () => {
      if (done) return
      done = true
      html.setAttribute('data-font-source', 'local')
    }

    const succeed = () => {
      if (done) return
      done = true
      html.setAttribute('data-font-source', 'cdn')
    }

    const timeoutId = window.setTimeout(fail, 1800)
    link.onload = () => {
      window.clearTimeout(timeoutId)
      succeed()
    }
    link.onerror = () => {
      window.clearTimeout(timeoutId)
      fail()
    }

    document.head.appendChild(link)

    return () => {
      window.clearTimeout(timeoutId)
      link.onload = null
      link.onerror = null
    }
  }, [enabled, href])

  return null
}
