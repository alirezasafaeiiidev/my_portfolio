import type { Metadata } from 'next'
import Link from 'next/link'
import { brand } from '@/lib/brand'
import { getSiteUrl } from '@/lib/site-config'
import { Button } from '@/components/ui/button'
import { getRequestLanguage } from '@/lib/i18n/server'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: `About ${brand.brandName}`,
  description: `${brand.brandName} brand profile, principles, and consulting execution model.`,
  alternates: {
    canonical: `${siteUrl}/about-brand`,
  },
}

export default async function AboutBrandPage() {
  const lang = await getRequestLanguage()
  const copy = {
    eyebrow: lang === 'en' ? 'Brand Profile' : 'پروفایل برند',
    title: `${brand.ownerName} (${brand.brandName})`,
    positioning: lang === 'en' ? brand.positioningEn : brand.positioningFa,
    missionTitle: lang === 'en' ? 'Mission' : 'ماموریت',
    missionBody:
      lang === 'en'
        ? 'Deliver production-grade web systems with measurable stability, explicit release governance, and CI/CD hardening that survives real operational pressure.'
        : 'تحویل سیستم‌های وب production-grade با پایداری قابل اندازه‌گیری، حاکمیت انتشار شفاف، و سخت‌سازی CI/CD که فشار واقعی عملیات را تاب بیاورد.',
    principlesTitle: lang === 'en' ? 'Operating Principles' : 'اصول اجرایی',
    principles: lang === 'en'
      ? [
          'Critical risks are closed before expansion work starts.',
          'Release status must come from one auditable source of truth.',
          'SEO, security, and operations are treated as production contracts.',
          'Every delivery ends with evidence-backed documentation.',
        ]
      : [
          'ریسک‌های بحرانی قبل از توسعه قابلیت‌های جدید بسته می‌شوند.',
          'وضعیت انتشار باید از یک منبع قابل ممیزی (single source of truth) بیاید.',
          'SEO، امنیت، و عملیات به عنوان قراردادهای production دیده می‌شوند.',
          'هر تحویل با مستندات مبتنی بر شواهد پایان می‌گیرد.',
        ],
    workTitle: lang === 'en' ? 'Work With Me' : 'همکاری',
    workBody:
      lang === 'en'
        ? 'For infrastructure localization, operational resilience, or architecture governance, start with the risk assessment flow.'
        : 'برای بومی‌سازی زیرساخت، تاب‌آوری عملیاتی، یا حاکمیت معماری، از مسیر ارزیابی ریسک شروع کنید.',
    cta: lang === 'en' ? 'Request Infrastructure Risk Assessment' : 'درخواست ارزیابی ریسک زیرساخت',
  }

  return (
    <main className="container mx-auto px-4 py-24 max-w-4xl space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
        <h1 className="text-3xl md:text-4xl font-bold">
          {copy.title}
        </h1>
        <p className="text-muted-foreground">{copy.positioning}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{copy.missionTitle}</h2>
        <p className="text-muted-foreground">{copy.missionBody}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{copy.principlesTitle}</h2>
        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
          {copy.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{copy.workTitle}</h2>
        <p className="text-muted-foreground">{copy.workBody}</p>
        <Button asChild>
          <Link href="/services/infrastructure-localization#assessment">
            {copy.cta}
          </Link>
        </Button>
      </section>
    </main>
  )
}
