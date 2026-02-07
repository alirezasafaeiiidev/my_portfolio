'use client'

import { usePathname } from 'next/navigation'
import { Home, Briefcase, Award, BookOpen, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Portfolio', href: '#portfolio', icon: Briefcase },
  { name: 'Experience', href: '#experience', icon: Award },
  { name: 'Blog', href: '#blog', icon: BookOpen },
  { name: 'Contact', href: '#contact', icon: Mail },
]

export function BottomNav() {
  const pathname = usePathname()

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t md:hidden z-50 pb-safe">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all',
                'text-sm font-medium',
                'hover:bg-muted/50',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
              aria-label={item.name}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs">{item.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
