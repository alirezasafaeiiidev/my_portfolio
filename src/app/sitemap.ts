import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-config'
import { toolCategories, tools } from '@/lib/tools-registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const now = new Date()

  const core = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/infrastructure-localization`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/qualification`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/case-studies/alirezasafaeidev-portfolio`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.82,
    },
    {
      url: `${baseUrl}/case-studies/infrastructure-localization-rescue`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies/asdev-persiantoolbox-platform`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.82,
    },
    {
      url: `${baseUrl}/case-studies/legacy-nextjs-replatform`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies/ci-cd-governance-hardening`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-brand`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  const categories = toolCategories.map((category) => ({
    url: `${baseUrl}${category.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const toolPages = tools
    .filter((tool) => tool.indexable)
    .map((tool) => ({
      url: `${baseUrl}${tool.slug}`,
      lastModified: tool.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }))

  return [...core, ...categories, ...toolPages]
}
