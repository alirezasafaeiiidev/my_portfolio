import type { Metadata } from 'next'
import Link from 'next/link'
import { popularTools, toolCategories, tools } from '@/lib/tools-registry'

export const metadata: Metadata = {
  title: 'جعبه ابزار آنلاین',
  description: 'ابزارهای سبک و محلی برای پردازش فایل و محتوا بدون خروج از مرورگر.',
}

export default function ToolsHubPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">جعبه ابزار</p>
        <h1 className="text-3xl font-bold leading-tight">ابزارهای محلی و امن برای کار روزمره</h1>
        <p className="text-muted-foreground">
          همه چیز روی مرورگر شما انجام می‌شود؛ بدون نیاز به آپلود روی سرور خارجی.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">ابزارهای محبوب</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="block rounded-lg border border-border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{tool.titleFa}</h3>
              <p className="text-sm text-muted-foreground mt-2">{tool.descriptionFa}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">دسته‌بندی‌ها</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {toolCategories.map((category) => (
            <Link
              key={category.id}
              href={category.path}
              className="block rounded-lg border border-dashed border-border p-4 transition hover:bg-background"
            >
              <h3 className="font-semibold">{category.titleFa}</h3>
              <p className="text-sm text-muted-foreground mt-2">{category.descriptionFa}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">همه ابزارها</h2>
        <ul className="space-y-3">
          {tools.map((tool) => (
            <li key={tool.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
              <div>
                <p className="font-semibold">{tool.titleFa}</p>
                <p className="text-sm text-muted-foreground">{tool.descriptionFa}</p>
              </div>
              <Link href={tool.slug} className="text-sm font-semibold text-primary">
                اجرا
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
