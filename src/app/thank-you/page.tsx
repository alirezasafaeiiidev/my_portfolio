import type { Metadata } from 'next'
import Link from 'next/link'
import { getRequestLanguage } from '@/lib/i18n/server'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Your request has been received. We will follow up shortly.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ThankYouPage() {
  const lang = await getRequestLanguage()
  const title = lang === 'en' ? 'Thanks. Your request is in.' : 'ممنون. درخواست شما ثبت شد.'
  const desc =
    lang === 'en'
      ? 'Your request was registered. Next, we will do an initial review and then contact you to schedule discovery.'
      : 'درخواست شما ثبت شد. در مرحله بعد، بررسی اولیه انجام می‌شود و سپس برای هماهنگی Discovery با شما تماس می‌گیریم.'
  const ctaCases = lang === 'en' ? 'View Case Studies' : 'مشاهده مطالعات موردی'
  const ctaHome = lang === 'en' ? 'Back Home' : 'بازگشت به خانه'

  return (
    <main className="container mx-auto px-4 py-28">
      <section className="mx-auto max-w-2xl space-y-6 rounded-xl border bg-card p-8 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="text-muted-foreground">{desc}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/case-studies" className="rounded-md border px-4 py-2 text-sm">
            {ctaCases}
          </Link>
          <Link href="/" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            {ctaHome}
          </Link>
        </div>
      </section>
    </main>
  )
}
