import { NextResponse } from 'next/server'

// Mock blog posts data - در حالت واقعی این از database می‌آید
const blogPosts = [
  {
    id: '1',
    title: {
      en: 'How to Build a Modern Portfolio with Next.js 16',
      fa: 'چگونه با Next.js 16 یک پورتفولیو مدرن بسازیم',
    },
    description: {
      en: 'Learn how to create a stunning portfolio website using the latest features of Next.js 16, TypeScript, and Tailwind CSS.',
      fa: 'با استفاده از آخرین ویژگی‌های Next.js 16، TypeScript و Tailwind CSS یک وب‌سایت پورتفولیو خیره‌کننده بسازید.',
    },
    content: {
      en: `<p>In this comprehensive guide, we'll explore the latest features of Next.js 16...</p>`,
      fa: `<p>در این راهنمای جامع، آخرین ویژگی‌های Next.js 16 را بررسی می‌کنیم...</p>`,
    },
    author: 'Your Name',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Portfolio'],
    image: '/blog/nextjs-portfolio.jpg',
    slug: 'how-to-build-modern-portfolio-nextjs-16',
  },
  {
    id: '2',
    title: {
      en: 'Mastering TypeScript: Best Practices for 2024',
      fa: 'تسلط بر TypeScript: بهترین شیوه‌ها برای 2024',
    },
    description: {
      en: 'Discover the essential TypeScript best practices that every developer should know in 2024.',
      fa: 'با بهترین شیوه‌های ضروری TypeScript که هر توسعه‌دهنده در سال 2024 باید بداند آشنا شوید.',
    },
    content: {
      en: `<p>TypeScript has become an essential tool for modern web development...</p>`,
      fa: `<p>TypeScript به ابزاری ضروری برای توسعه وب مدرن تبدیل شده است...</p>`,
    },
    author: 'Your Name',
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    image: '/blog/typescript-best-practices.jpg',
    slug: 'mastering-typescript-best-practices-2024',
  },
  {
    id: '3',
    title: {
      en: 'Building Responsive UIs with Tailwind CSS',
      fa: 'ساخت UIهای ریسپانسیو با Tailwind CSS',
    },
    description: {
      en: 'A complete guide to building beautiful and responsive user interfaces using Tailwind CSS utility classes.',
      fa: 'راهنمای کامل برای ساخت رابط‌های کاربری زیبا و ریسپانسیو با استفاده از کلاس‌های کاربردی Tailwind CSS.',
    },
    content: {
      en: `<p>Tailwind CSS revolutionized the way we style web applications...</p>`,
      fa: `<p>Tailwind CSS روش استایل‌دهی به برنامه‌های وب را متحول کرد...</p>`,
    },
    author: 'Your Name',
    publishedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    tags: ['Tailwind CSS', 'CSS', 'Responsive Design'],
    image: '/blog/tailwind-responsive.jpg',
    slug: 'building-responsive-uis-tailwind-css',
  },
]

interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
  author?: string
  category?: string[]
}

function generateRSSFeed(items: RSSItem[], language: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com'
  const feedTitle = language === 'fa' ? 'پورتفولیو - بلاگ' : 'Portfolio - Blog'
  const feedDescription = language === 'fa'
    ? 'آخرین مقالات و نکات در مورد توسعه وب و برنامه‌نویسی'
    : 'Latest articles and insights about web development and programming'

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedTitle}</title>
    <description>${feedDescription}</description>
    <link>${siteUrl}</link>
    <language>${language === 'fa' ? 'fa-ir' : 'en-us'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss?lang=${language}" rel="self" type="application/rss+xml"/>
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.author ? `<author>${item.author}</author>` : ''}
      ${item.category ? item.category.map(cat => `<category><![CDATA[${cat}]]></category>`).join('') : ''}
    </item>`).join('\n')}
  </channel>
</rss>`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const language = (searchParams.get('lang') || 'en') as 'en' | 'fa'

  // Generate RSS items
  const rssItems: RSSItem[] = blogPosts.map(post => ({
    title: post.title[language],
    description: post.description[language],
    link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com'}#blog`,
    pubDate: post.publishedAt.toUTCString(),
    guid: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com'}/blog/${post.slug}`,
    author: post.author,
    category: post.tags,
  }))

  // Sort by publication date (newest first)
  rssItems.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )

  // Generate RSS feed
  const rss = generateRSSFeed(rssItems, language)

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  })
}
