'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'
import { ArrowRight, Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/client'
import { pickHeroVariant, type HeroVariant } from '@/lib/analytics/experiments'

function withLocale(path: string, language: 'fa' | 'en'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/${language}${normalized === '/' ? '/' : normalized}`
}

export function Hero() {
  const { t, language } = useI18n()
  const router = useRouter()
  const [variant] = useState<HeroVariant>(() => {
    if (typeof window === 'undefined') return 'authority'
    const storageKey = 'asdev_hero_variant'
    const savedVariant = window.localStorage.getItem(storageKey)
    const selected =
      savedVariant === 'authority' || savedVariant === 'risk'
        ? savedVariant
        : pickHeroVariant(`${Date.now()}_${Math.random()}_${navigator.userAgent}`)
    window.localStorage.setItem(storageKey, selected)
    return selected
  })

  useEffect(() => {
    void trackEvent({
      name: 'hero_impression',
      category: 'engagement',
      locale: language,
      variant,
    })
  }, [language, variant])

  const socialLinks = [
    { href: brand.githubUrl, icon: Github, label: 'GitHub' },
    { href: brand.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    { href: brand.telegramUrl, icon: Send, label: 'Telegram' },
    { href: brand.instagramUrl, icon: Instagram, label: 'Instagram' },
    { href: brand.twitterUrl, icon: Twitter, label: 'X' },
  ].filter((item) => Boolean(item.href))

  const variantCopy = useMemo(() => {
    if (language === 'en') {
      if (variant === 'risk') {
        return {
          title: 'Reduce operational risk before the next incident',
          description:
            'Risk map, release governance, and local-first architecture to keep critical services stable under pressure.',
          primaryCta: 'Request 30-min Discovery',
        }
      }
      return {
        title: t('hero.title'),
        description: t('hero.description'),
        primaryCta: t('hero.getInTouch'),
      }
    }

    if (variant === 'risk') {
      return {
        title: 'کاهش ریسک عملیاتی قبل از بحران بعدی',
        description: 'نقشه ریسک، حاکمیت انتشار و معماری local-first برای پایداری سرویس‌های حیاتی.',
        primaryCta: 'درخواست جلسه Discovery',
      }
    }

    return {
      title: t('hero.title'),
      description: t('hero.description'),
      primaryCta: t('hero.getInTouch'),
    }
  }, [language, t, variant])

  const chips =
    language === 'en'
      ? [
          'Domestic data-center migration',
          'Foreign dependency risk reduction',
          'Release governance and rollback drills',
          'Executive-ready technical reporting',
        ]
      : [
          'انتقال به دیتاسنتر داخلی',
          'کاهش وابستگی به سرویس خارجی',
          'حاکمیت انتشار و تمرین Rollback',
          'گزارش مدیریتی قابل ارائه',
        ]

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden subtle-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background/95 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-5xl section-surface aurora-shell p-8 md:p-12 text-center space-y-6">
          <div className="reveal-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mx-auto">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{t('hero.available')}</span>
          </div>

          <h1 className="headline-tight text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {variantCopy.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-8">
            {variantCopy.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="gap-2 shine-effect"
              onClick={() => {
                void trackEvent({
                  name: 'hero_primary_click',
                  category: 'conversion',
                  locale: language,
                  variant,
                })
                router.push(withLocale('/services/infrastructure-localization#assessment', language))
              }}
            >
              {variantCopy.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2 card-hover"
              onClick={() => {
                void trackEvent({
                  name: 'hero_secondary_click',
                  category: 'engagement',
                  locale: language,
                  variant,
                })
                router.push(withLocale('/case-studies', language))
              }}
            >
              {t('hero.viewWork')}
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            {chips.map((label, index) => (
              <span
                key={label}
                className="rounded-full border border-border/60 bg-card/70 px-3 py-1 text-sm text-foreground/90 card-hover"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-3 justify-center items-center">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 h-10 w-10 card-hover"
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
