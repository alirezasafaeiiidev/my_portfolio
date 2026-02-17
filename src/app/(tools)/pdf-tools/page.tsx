import type { Metadata } from 'next'
import Link from 'next/link'
import { toolCategories, toolsByCategory } from '@/lib/tools-registry'

export const metadata: Metadata = {
  title: 'ابزارهای PDF',
  description: 'ادغام و بهینه‌سازی فایل‌های PDF برای ارسال و بایگانی.',
}

export default function PdfToolsPage() {
  const category = toolCategories.find((c) => c.id === 'pdf')
  const items = toolsByCategory('pdf')

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary">{category?.titleFa}</p>
        <h1 className="text-2xl font-bold">PDF بدون دردسر</h1>
        <p className="text-muted-foreground">{category?.descriptionFa}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((tool) => (
          <Link
            key={tool.id}
            href={tool.slug}
            className="block rounded-lg border border-border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-semibold">{tool.titleFa}</h2>
            <p className="text-sm text-muted-foreground mt-2">{tool.descriptionFa}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
