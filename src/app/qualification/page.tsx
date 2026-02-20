import type { Metadata } from 'next'
import Link from 'next/link'
import { InfrastructureLeadForm } from '@/components/sections/infrastructure-lead-form'
import { getSiteUrl } from '@/lib/site-config'
import { getRequestLanguage } from '@/lib/i18n/server'

const siteUrl = getSiteUrl()

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage()
  const isEn = lang === 'en'
  const canonicalPath = `/${lang}/qualification`
  return {
    title: isEn ? 'Project Qualification' : 'ارزیابی و Qualification پروژه',
    description: isEn
      ? 'Submit project details to receive a structured discovery follow-up.'
      : 'اطلاعات پروژه را ثبت کنید تا مسیر همکاری و جلسه Discovery به صورت ساختاریافته پیگیری شود.',
    alternates: {
      canonical: canonicalPath,
      languages: {
        'fa-IR': `${siteUrl}/fa/qualification`,
        'en-US': `${siteUrl}/en/qualification`,
      },
    },
  }
}

export default async function QualificationPage() {
  const lang = await getRequestLanguage()
  const withLocale = (path: string) => `/${lang}${path}`
  const title = lang === 'en' ? 'Project Qualification' : 'ارزیابی و Qualification پروژه'
  const desc =
    lang === 'en'
      ? 'Submit project details to receive a structured discovery follow-up.'
      : 'اطلاعات پروژه را ثبت کنید تا در سریع‌ترین زمان ممکن مسیر همکاری و جلسه Discovery هماهنگ شود.'
  const trust =
    lang === 'en'
      ? ['NDA available on request', 'Initial response within one business day', 'Evidence-backed delivery model']
      : ['امکان امضای NDA', 'پاسخ اولیه حداکثر تا یک روز کاری', 'مدل تحویل مبتنی بر شواهد']
  const back = lang === 'en' ? 'Back to home' : 'بازگشت به خانه'

  return (
    <main className="container mx-auto px-4 py-28 subtle-grid">
      <section className="mx-auto max-w-3xl space-y-5">
        <div className="section-surface aurora-shell p-6 md:p-8 space-y-4">
          <h1 className="headline-tight text-3xl font-bold md:text-5xl">{title}</h1>
          <p className="text-muted-foreground leading-8">{desc}</p>
          <div className="flex flex-wrap gap-2">
            {trust.map((item) => (
              <span key={item} className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
        <InfrastructureLeadForm />
        <div className="text-sm text-muted-foreground">
          <Link href={withLocale('/')} className="underline">
            {back}
          </Link>
        </div>
      </section>
    </main>
  )
}
