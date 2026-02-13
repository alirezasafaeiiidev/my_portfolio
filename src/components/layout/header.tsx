'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useI18n } from '@/lib/i18n-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Languages, X, Menu, Sparkles } from 'lucide-react'

const navItems = [
  { key: 'home', name: 'nav.home', href: '#home' },
  { key: 'about', name: 'nav.about', href: '#about' },
  { key: 'portfolio', name: 'nav.portfolio', href: '#portfolio' },
  { key: 'engineering', name: 'nav.engineering', href: '/engineering' },
  { key: 'skills', name: 'nav.skills', href: '#skills' },
  { key: 'experience', name: 'nav.experience', href: '#experience' },
  { key: 'blog', name: 'nav.blog', href: '#blog' },
  { key: 'testimonials', name: 'nav.testimonials', href: '#testimonials' },
  { key: 'contact', name: 'nav.contact', href: '#contact' },
]

export function Header() {
  const { t, language, setLanguage } = useI18n()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    if (!href.startsWith('#')) {
      window.location.href = href
      return
    }
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const changeLanguage = (lang: 'en' | 'fa') => {
    setLanguage(lang)
  }

  const getNavText = (name: string): string => {
    return t(name)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#home')
              }}
              className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.span>
              {getNavText('nav.portfolio')}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {getNavText(item.name)}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"
                  layoutId="nav-underline"
                  initial={false}
                  animate={false}
                  whileInView="true"
                  viewport={{ once: true }}
                />
              </motion.button>
            ))}
            
            {/* Language & Theme Toggles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 card-hover">
                    <Languages className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    {t('nav.english')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('fa')}>
                    {t('nav.persian')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.href)}
                    className="text-lg font-medium text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {getNavText(item.name)}
                  </button>
                ))}
              </nav>
              <div className="mt-8 pt-8 border-t space-y-4">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm text-muted-foreground">Language</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => changeLanguage(language === 'en' ? 'fa' : 'en')}
                    >
                      {language === 'en' ? 'FA' : 'EN'}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
