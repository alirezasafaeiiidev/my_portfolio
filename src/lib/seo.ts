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
}: SEOProps) {
  const siteName = 'Portfolio'
  const siteUrl = url || 'https://yourportfolio.com'
  const defaultImage = image || '/og-image.jpg'

  const metadata: Record<string, string | number | boolean | object> = {
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : [],
    openGraph: {
      type,
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
    },
    twitter: {
      card: type === 'article' ? 'summary_large_image' : 'summary',
      title,
      description,
      images: [defaultImage],
    },
  }

  // Add article specific metadata
  if (type === 'article' && publishDate) {
    metadata.openGraph.publishedTime = publishDate
    metadata.openGraph.modifiedTime = modifiedDate || publishDate
  }

  return metadata
}

// Schema.org structured data generators
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Your Name',
    jobTitle: 'Full Stack Developer',
    url: 'https://yourportfolio.com',
    sameAs: [
      'https://github.com/yourusername',
      'https://linkedin.com/in/yourusername',
      'https://twitter.com/yourusername',
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
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Portfolio',
    url: 'https://yourportfolio.com',
    description: 'Professional portfolio showcasing web development projects and technical expertise',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://yourportfolio.com/search?q={search_term_string}',
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
  const siteUrl = 'https://yourportfolio.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: `${siteUrl}${url}`,
    image: image || `${siteUrl}/og-image.jpg`,
    author: author || 'Your Name',
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
  const siteUrl = 'https://yourportfolio.com'

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
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Portfolio',
    url: 'https://yourportfolio.com',
    logo: 'https://yourportfolio.com/logo.png',
    description: 'Professional portfolio showcasing web development projects',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@example.com',
    },
    sameAs: [
      'https://github.com/yourusername',
      'https://linkedin.com/in/yourusername',
      'https://twitter.com/yourusername',
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
  const siteUrl = 'https://yourportfolio.com'

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

