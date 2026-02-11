'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, Rss, Search, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  published: boolean
  tags: string[]
  readTime: number
  createdAt: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable Applications with Next.js 14',
    slug: 'building-scalable-applications-with-nextjs-14',
    excerpt: 'Learn how to build production-ready applications using Next.js 14 with App Router, Server Components, and best practices.',
    coverImage: '/images/blog-1.jpg',
    published: true,
    tags: ['Next.js', 'React', 'Web Development'],
    readTime: 8,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Mastering TypeScript: Advanced Patterns',
    slug: 'mastering-typescript-advanced-patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns including generics, conditional types, and utility types for better type safety.',
    coverImage: '/images/blog-2.jpg',
    published: true,
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    readTime: 10,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'State Management in 2024: A Complete Guide',
    slug: 'state-management-in-2024-a-complete-guide',
    excerpt: 'Explore modern state management solutions including Zustand, TanStack Query, and future of state in React applications.',
    coverImage: '/images/blog-3.jpg',
    published: true,
    tags: ['React', 'State Management', 'Web Development'],
    readTime: 12,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Optimizing Web Performance for Better UX',
    slug: 'optimizing-web-performance-for-better-ux',
    excerpt: 'Discover techniques to improve Core Web Vitals, reduce loading times, and create faster, more responsive web applications.',
    coverImage: '/images/blog-4.jpg',
    published: true,
    tags: ['Performance', 'Web Vitals', 'Optimization'],
    readTime: 7,
    createdAt: '2023-12-28',
  },
  {
    id: '5',
    title: 'Building Accessible UI Components',
    slug: 'building-accessible-ui-components',
    excerpt: 'Learn how to create UI components that are accessible to all users, following WCAG guidelines and best practices.',
    coverImage: '/images/blog-5.jpg',
    published: true,
    tags: ['Accessibility', 'UI/UX', 'React'],
    readTime: 9,
    createdAt: '2023-12-20',
  },
  {
    id: '6',
    title: 'Testing React Applications: From Unit to E2E',
    slug: 'testing-react-applications-from-unit-to-e2e',
    excerpt: 'Comprehensive guide to testing React applications using Jest, React Testing Library, and Cypress for reliable code.',
    coverImage: '/images/blog-6.jpg',
    published: true,
    tags: ['Testing', 'React', 'Quality Assurance'],
    readTime: 11,
    createdAt: '2023-12-15',
  },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Blog() {
  const { t, language } = useI18n()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)))

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    if (!post.published) return false

    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    return matchesTag && matchesSearch
  })

  const handleRssSubscribe = () => {
    const rssUrl = `/api/rss?lang=${language}`
    window.open(rssUrl, '_blank')
  }

  return (
    <section id="blog" className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/90 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {t('blog.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('blog.description')}
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 space-y-6"
        >
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === 'fa' ? 'جستجو در مقالات...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <motion.button
              onClick={() => setSelectedTag(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant={selectedTag === null ? 'default' : 'secondary'}
                className="cursor-pointer px-4 py-2 text-sm card-hover"
              >
                {language === 'fa' ? 'همه' : 'All'}
              </Badge>
            </motion.button>
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={selectedTag === tag ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm card-hover"
                >
                  {tag}
                  {selectedTag === tag && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              </motion.button>
            ))}
          </div>

          {/* RSS Subscribe Button */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleRssSubscribe}
                variant="outline"
                size="sm"
                className="gap-2 card-hover"
              >
                <Rss className="h-4 w-4" />
                {language === 'fa' ? 'اشتراک RSS' : 'RSS Feed'}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTag || searchQuery}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-20"
              >
                <div className="text-muted-foreground mb-4">
                  <Search className="h-16 w-16 mx-auto opacity-20 mb-4" />
                  <p className="text-lg">
                    {language === 'fa'
                      ? 'مقاله‌ای یافت نشد'
                      : 'No articles found'}
                  </p>
                  <p className="text-sm mt-2">
                    {language === 'fa'
                      ? 'لطفاً جستجو یا فیلتر خود را تغییر دهید'
                      : 'Try adjusting your search or filter'}
                  </p>
                </div>
              </motion.div>
            ) : (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  layout
                  className="h-full"
                >
                  <Card className="group h-full flex flex-col card-hover">
                    <CardHeader className="flex-shrink-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="text-4xl font-bold text-primary/20 mb-2">
                              {post.title.charAt(0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Blog Post Image
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                            onClick={() => setSelectedTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex-shrink-0 flex-col gap-4">
                      <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime} {t('blog.minRead')}
                        </div>
                      </div>
                      <Button className="w-full gap-2 card-hover shine-effect">
                        {t('blog.readArticle')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          {filteredPosts.length} {language === 'fa' ? 'مقاله' : 'article'}{filteredPosts.length !== 1 ? (language === 'fa' ? '' : 's') : ''}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" className="gap-2 card-hover">
            {t('blog.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 max-w-2xl mx-auto"
        >
          <Card className="bg-primary/5 border-primary/20 glass">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold gradient-text">
                {t('blog.subscribeNewsletter')}
              </h3>
              <p className="text-muted-foreground">
                {t('blog.newsletterDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={language === 'fa' ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                  className="flex-1 px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="shrink-0 card-hover shine-effect">
                  {t('blog.subscribe')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
