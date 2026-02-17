import { JsonLd } from '@/components/seo/json-ld'
import { getSiteUrl } from '@/lib/site-config'
import type { Tool } from '@/lib/tools-registry'

type Props = {
  tool: Tool
  nonce?: string
}

export function ToolSeoContent({ tool, nonce }: Props) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}${tool.slug}`

  return (
    <JsonLd
      nonce={nonce}
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.titleFa,
        description: tool.descriptionFa,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Browser',
        url,
        keywords: tool.keywords.join(', '),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IRR',
        },
        dateModified: tool.lastModified,
        potentialAction: {
          '@type': 'UseAction',
          target: url,
        },
      }}
    />
  )
}
