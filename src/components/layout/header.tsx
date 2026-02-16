'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'
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
  { key: 'services', name: 'nav.services', href: '#services' },
  { key: 'caseStudies', name: 'nav.caseStudies', href: '#case-studies' },
  { key: 'contact', name: 'nav.contact', href: '#contact' },
]

export function Header() {
  const { t, language, setLanguage } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

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
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (href.startsWith('#')) {
      const target = `/${href}`
      if (pathname !== '/') {
        router.push(target)
      } else {
        window.location.hash = href.slice(1)
      }
    }
  }

  const changeLanguage = (lang: 'en' | 'fa') => {
    setLanguage(lang)
    // Refresh server components (SSR sections) to match cookie-based language.
    router.refresh()
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
          <Link
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#home')
            }}
            className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <Sparkles className="h-6 w-6" />
            {brand.brandName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {getNavText(item.name)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
            
            {/* Language & Theme Toggles */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 card-hover"
                    aria-label={t('ui.changeLanguage')}
                  >
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
            </div>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileMenuOpen ? t('ui.closeMenu') : t('ui.openMenu')}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'fa' ? 'left' : 'right'} className="w-72">
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
                  <span className="text-sm text-muted-foreground">{t('ui.language')}</span>
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
                  <span className="text-sm text-muted-foreground">{t('ui.theme')}</span>
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
