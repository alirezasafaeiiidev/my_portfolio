'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command'
import { toolCategories, tools } from '@/lib/tools-registry'

type PaletteEntry = {
  id: string
  label: string
  href: string
  category: 'tools' | 'categories' | 'pages'
  search: string
}

const staticPages: PaletteEntry[] = [
  {
    id: 'page-tools',
    label: 'همه ابزارها',
    href: '/tools',
    category: 'pages',
    search: 'tools ابزارها جعبه ابزار',
  },
  {
    id: 'page-dashboard',
    label: 'Dashboard ابزارها',
    href: '/dashboard',
    category: 'pages',
    search: 'dashboard history export import داشبورد تاریخچه',
  },
  {
    id: 'page-services',
    label: 'Services',
    href: '/services',
    category: 'pages',
    search: 'services سرویس خدمات',
  },
  {
    id: 'page-case-studies',
    label: 'Case Studies',
    href: '/case-studies',
    category: 'pages',
    search: 'case study مطالعه موردی',
  },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isK = event.key.toLowerCase() === 'k'
      if ((event.ctrlKey || event.metaKey) && isK) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const entries = useMemo<PaletteEntry[]>(() => {
    const toolEntries = tools.map((tool) => ({
      id: `tool-${tool.id}`,
      label: tool.titleFa,
      href: tool.slug,
      category: 'tools' as const,
      search: `${tool.titleFa} ${tool.descriptionFa} ${tool.keywords.join(' ')}`,
    }))

    const categoryEntries = toolCategories.map((category) => ({
      id: `category-${category.id}`,
      label: category.titleFa,
      href: category.path,
      category: 'categories' as const,
      search: `${category.titleFa} ${category.descriptionFa}`,
    }))

    return [...toolEntries, ...categoryEntries, ...staticPages]
  }, [])

  const openRoute = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="hidden lg:flex h-9 items-center gap-2 text-xs text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        جستجو
        <span className="rounded border border-border px-1.5 py-0.5 text-[10px]">Ctrl/⌘+K</span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="جستجوی سریع"
        description="جستجو در ابزارها و صفحات"
      >
        <CommandInput placeholder="نام ابزار یا صفحه را بنویس..." />
        <CommandList>
          <CommandEmpty>نتیجه‌ای پیدا نشد.</CommandEmpty>

          <CommandGroup heading="ابزارها">
            {entries
              .filter((entry) => entry.category === 'tools')
              .map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.label} ${entry.search}`}
                  onSelect={() => openRoute(entry.href)}
                >
                  {entry.label}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="دسته‌بندی‌ها">
            {entries
              .filter((entry) => entry.category === 'categories')
              .map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.label} ${entry.search}`}
                  onSelect={() => openRoute(entry.href)}
                >
                  {entry.label}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="صفحات">
            {entries
              .filter((entry) => entry.category === 'pages')
              .map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.label} ${entry.search}`}
                  onSelect={() => openRoute(entry.href)}
                >
                  {entry.label}
                  {entry.href === '/tools' && <CommandShortcut>Enter</CommandShortcut>}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
