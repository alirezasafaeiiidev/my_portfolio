import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { ToolSeoContent } from '@/components/seo/tool-seo-content'
import { ToolRunRecorder } from '@/components/tools/tool-run-recorder'
import { generateToolMetadata, getToolBySlug } from '@/lib/tool-seo'
import { toolsByCategory } from '@/lib/tools-registry'

export const metadata: Metadata = generateToolMetadata('/tools/image-resize')

export default async function ImageResizePage() {
  const nonce = (await headers()).get('x-csp-nonce') || undefined
  const tool = getToolBySlug('/tools/image-resize')
  const related = toolsByCategory('image').filter((t) => t.slug !== '/tools/image-resize')

  return (
    <>
      {tool && <ToolSeoContent tool={tool} nonce={nonce} />}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-primary">ابزار تصویر</p>
        <h1 className="text-3xl font-bold">تغییر اندازه تصویر</h1>
        <p className="text-muted-foreground">
          ماژول پردازش در نسخه نهایی اضافه می‌شود. این صفحه مسیر و قرارداد UX را تثبیت می‌کند.
        </p>
        <div className="rounded-lg border border-dashed border-border bg-background p-6">
          <p className="text-sm text-muted-foreground">
            انتخاب ابعاد بر اساس پیکسل یا درصد و قفل نسبت تصویر در مرحله بعد افزوده خواهد شد.
          </p>
        </div>
        <ToolRunRecorder toolId="image-resize" toolTitle="تغییر اندازه تصویر" />

        {related.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">ابزارهای مرتبط</h2>
            <div className="flex flex-wrap gap-3">
              {related.map((item) => (
                <Link key={item.id} href={item.slug} className="text-sm font-semibold text-primary">
                  {item.titleFa}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/image-tools" className="text-sm font-semibold text-primary">
            بازگشت به ابزارهای تصویر
          </Link>
          <span className="text-sm text-muted-foreground">|</span>
          <Link href="/tools" className="text-sm font-semibold text-primary">
            همه ابزارها
          </Link>
        </div>
      </div>
    </>
  )
}
