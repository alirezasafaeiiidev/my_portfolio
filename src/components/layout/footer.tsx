'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'

const socialLinks = [
  {
    name: 'GitHub',
    href: brand.social.github,
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: brand.social.linkedin,
    icon: Linkedin,
  },
  {
    name: 'X',
    href: brand.social.x,
    icon: Twitter,
  },
  {
    name: 'Email',
    href: `mailto:${brand.email}`,
    icon: Mail,
  },
].filter((item) => item.href.length > 0)

const quickLinks = [
  { key: 'quickHome', href: '#home' },
  { key: 'quickPortfolio', href: '#portfolio' },
  { key: 'quickSkills', href: '#skills' },
  { key: 'quickContact', href: '#contact' },
]

export function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {brand.shortNameEn}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {t(`footer.${link.key}`)}
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 3 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.social')}</h4>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 h-12 w-12 card-hover relative overflow-hidden group"
                    asChild
                  >
                    <Link
                      href={social.href}
                      target={social.href.startsWith('mailto') ? undefined : '_blank'}
                      rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      aria-label={social.name}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        <social.icon className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.getInTouch')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('footer.haveProject')}
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="default"
                className="w-full card-hover shine-effect"
                onClick={() => window.location.href = `mailto:${brand.email}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                {t('contact.sendMessage')}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} {t('footer.copyright')}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 text-center md:text-right">
            {t('footer.madeWith')}
            <Heart className="h-4 w-4 fill-primary text-primary" />
          </p>
        </div>
      </div>
    </footer>
  )
}
