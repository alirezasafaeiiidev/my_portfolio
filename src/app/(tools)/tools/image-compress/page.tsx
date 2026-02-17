import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { ToolSeoContent } from '@/components/seo/tool-seo-content'
import { BatchQueueDemo } from '@/components/tools/batch-queue-demo'
import { generateToolMetadata, getToolBySlug } from '@/lib/tool-seo'
import { toolsByCategory } from '@/lib/tools-registry'

export const metadata: Metadata = generateToolMetadata('/tools/image-compress')

export default async function ImageCompressPage() {
  const nonce = (await headers()).get('x-csp-nonce') || undefined
  const tool = getToolBySlug('/tools/image-compress')
  const related = toolsByCategory('image').filter((t) => t.slug !== '/tools/image-compress')

  return (
    <>
      {tool && <ToolSeoContent tool={tool} nonce={nonce} />}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-primary">ابزار تصویر</p>
        <h1 className="text-3xl font-bold">فشرده‌سازی تصویر</h1>
        <p className="text-muted-foreground">
          نسخه کامل این ابزار در تسک P0-09 تکمیل می‌شود. همه پردازش‌ها روی دستگاه شما انجام خواهد شد.
        </p>
        <div className="rounded-lg border border-dashed border-border bg-background p-6">
          <p className="text-sm text-muted-foreground">
            ورودی‌ها، تنظیم کیفیت و پیش‌نمایش در نسخه نهایی اضافه می‌شوند.
          </p>
        </div>

        <BatchQueueDemo />

        {tool?.faqs && (
          <div className="space-y-3 rounded-lg border border-border bg-background p-4">
            <h2 className="text-lg font-semibold">سوالات متداول</h2>
            <ul className="space-y-2">
              {tool.faqs.map((faq) => (
                <li key={faq.question} className="text-sm">
                  <p className="font-semibold">{faq.question}</p>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

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
