import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site-config'
import { tools } from './tools-registry'

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug)
}

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug)
  const siteUrl = getSiteUrl()

  if (!tool) {
    return {
      title: 'ابزار',
      description: 'ابزارهای محلی برای پردازش فایل و محتوا',
      robots: { index: false },
    }
  }

  return {
    title: `${tool.titleFa} | جعبه ابزار`,
    description: tool.descriptionFa,
    keywords: tool.keywords,
    alternates: {
      canonical: `${siteUrl}${tool.slug}`,
    },
    openGraph: {
      type: 'website',
      title: tool.titleFa,
      description: tool.descriptionFa,
      url: `${siteUrl}${tool.slug}`,
      locale: 'fa_IR',
      siteName: 'ASDEV Tools',
    },
    robots: {
      index: tool.indexable,
      follow: tool.indexable,
    },
  }
}
