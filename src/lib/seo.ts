import { getSiteUrl } from './site-config'
import type { Metadata } from 'next'
import { brand } from './brand'

export interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  keywords?: string[]
  author?: string
  publishDate?: string
  modifiedDate?: string
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  author,
  publishDate,
  modifiedDate,
}: SEOProps): Metadata {
  const siteName = 'Portfolio'
  const siteUrl = url || getSiteUrl()
  const defaultImage = image || '/og-image.jpg'
  const sharedOpenGraph = {
    url: siteUrl,
    title,
    description,
    siteName,
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  } satisfies NonNullable<Metadata['openGraph']>
  const openGraph: Metadata['openGraph'] = type === 'article'
    ? {
        ...sharedOpenGraph,
        type: 'article',
        publishedTime: publishDate,
        modifiedTime: modifiedDate || publishDate,
      }
    : {
        ...sharedOpenGraph,
        type: 'website',
      }

  const metadata: Metadata = {
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : [],
    openGraph,
    twitter: {
      card: type === 'article' ? 'summary_large_image' : 'summary',
      title,
      description,
      images: [defaultImage],
    },
  }

  return metadata
}

// Schema.org structured data generators
export function generatePersonSchema() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: brand.ownerName,
    jobTitle: 'Full Stack Developer',
    url: siteUrl,
    sameAs: [
      brand.githubUrl,
      brand.linkedinUrl,
      brand.twitterUrl,
    ],
    knowsAbout: [
      'Web Development',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
    ],
  }
}

export function generateWebSiteSchema() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.brandName,
    url: siteUrl,
    description: 'Professional portfolio showcasing web development projects and technical expertise',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateArticleSchema({
  title,
  description,
  publishDate,
  modifiedDate,
  author,
}: {
  title: string
  description: string
  publishDate: string
  modifiedDate?: string
  author: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Person',
      name: author,
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Project Schema (CreativeWork)
export function generateProjectSchema({
  name,
  description,
  url,
  image,
  technologies,
  author,
  dateCreated,
}: {
  name: string
  description: string
  url: string
  image?: string
  technologies?: string[]
  author?: string
  dateCreated?: string
}) {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: `${siteUrl}${url}`,
    image: image || `${siteUrl}/og-image.jpg`,
    author: author || brand.ownerName,
    dateCreated: dateCreated || new Date().toISOString(),
    keywords: technologies?.join(', '),
    applicationCategory: 'Web Application',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

// Blog Post Schema (BlogPosting)
export function generateBlogPostSchema({
  title,
  description,
  url,
  image,
  author,
  publishDate,
  modifiedDate,
  tags,
  readTime,
}: {
  title: string
  description: string
  url: string
  image?: string
  author: string
  publishDate: string
  modifiedDate?: string
  tags?: string[]
  readTime?: number
}) {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image || `${siteUrl}/og-image.jpg`,
    url: `${siteUrl}${url}`,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    keywords: tags?.join(', '),
    articleSection: 'Technology',
    wordCount: readTime ? readTime * 200 : undefined,
    timeRequired: readTime ? `PT${readTime}M` : undefined,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  }
}

// Organization Schema
export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.brandName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Professional portfolio showcasing web development projects',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: brand.contactEmail,
    },
    sameAs: [
      brand.githubUrl,
      brand.linkedinUrl,
      brand.twitterUrl,
    ],
  }
}

// TechArticle Schema
export function generateTechArticleSchema({
  title,
  description,
  url,
  author,
  publishDate,
  technologies,
}: {
  title: string
  description: string
  url: string
  author: string
  publishDate: string
  technologies?: string[]
}) {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: `${siteUrl}${url}`,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishDate,
    proficiencyLevel: 'Beginner',
    dependencies: technologies,
  }
}
