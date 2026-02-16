'use client'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'
import { ArrowRight, Mail, Github, Linkedin, Twitter, Sparkles, Instagram, Send } from 'lucide-react'

export function Hero() {
  const { t } = useI18n()

  const socialLinks = [
    { href: brand.githubUrl, icon: Github, label: 'GitHub' },
    { href: brand.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    { href: brand.telegramUrl, icon: Send, label: 'Telegram' },
    { href: brand.instagramUrl, icon: Instagram, label: 'Instagram' },
    { href: brand.twitterUrl, icon: Twitter, label: 'X' },
  ].filter((item) => Boolean(item.href))

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background/95 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-5xl section-surface p-8 md:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mx-auto">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{t('hero.available')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => scrollToSection('#services')}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t('hero.viewWork')}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                window.location.href = '/services/infrastructure-localization#assessment'
              }}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              {t('hero.getInTouch')}
            </Button>
          </div>

          <div className="flex gap-3 justify-center items-center">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 h-10 w-10"
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
            {[
              { value: '5+', label: t('hero.yearsExperience') },
              { value: '50+', label: t('hero.projectsCompleted') },
              { value: '30+', label: t('hero.happyClients') },
              { value: '10+', label: t('hero.awardsWon') },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card border border-border/70">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
