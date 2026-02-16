import type { Metadata } from 'next'
import { InfrastructureLeadForm } from '@/components/sections/infrastructure-lead-form'
import { getSiteUrl } from '@/lib/site-config'
import { getRequestLanguage } from '@/lib/i18n/server'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'ارزیابی و Qualification پروژه',
  description: 'اطلاعات پروژه را ثبت کنید تا مسیر همکاری و جلسه Discovery به صورت ساختاریافته پیگیری شود.',
  alternates: { canonical: `${siteUrl}/qualification` },
}

export default async function QualificationPage() {
  const lang = await getRequestLanguage()
  const title = lang === 'en' ? 'Project Qualification' : 'ارزیابی و Qualification پروژه'
  const desc =
    lang === 'en'
      ? 'Submit project details to receive a structured discovery follow-up.'
      : 'اطلاعات پروژه را ثبت کنید تا در سریع‌ترین زمان ممکن مسیر همکاری و جلسه Discovery هماهنگ شود.'

  return (
    <main className="container mx-auto px-4 py-28">
      <section className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
        <p className="text-muted-foreground">{desc}</p>
        <InfrastructureLeadForm />
      </section>
    </main>
  )
}
