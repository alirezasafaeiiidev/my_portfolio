import Link from 'next/link'
import { getRequestLanguage } from '@/lib/i18n/server'

function getPrinciples(lang: 'fa' | 'en') {
  if (lang === 'en') {
    return [
      'Production-first quality gates before every release',
      'Clear delivery evidence for technical and executive stakeholders',
      'Maintainable architecture with explicit operational ownership',
    ]
  }

  return [
    'گیت‌های کیفیت قبل از هر release (نه بعد از وقوع مشکل)',
    'شواهد تحویل شفاف برای تیم فنی و ذی‌نفع مدیریتی',
    'معماری قابل نگهداری با مالکیت عملیاتی صریح',
  ]
}

export async function AboutSummary() {
  const lang = await getRequestLanguage()
  const principles = getPrinciples(lang)
  const eyebrow = lang === 'en' ? 'How I Work' : 'شیوه همکاری'
  const title = lang === 'en' ? 'Engineering Discipline, Not Guesswork' : 'مهندسی منظم، نه حدس و گمان'
  const desc =
    lang === 'en'
      ? 'I work with founders and technical teams that need predictable delivery in production. Scope, risk, and delivery evidence stay explicit from day one.'
      : 'با تیم‌هایی کار می‌کنم که تحویل قابل پیش‌بینی در تولید می‌خواهند. از روز اول scope، ریسک، و شواهد تحویل شفاف می‌ماند.'
  const ctaQual = lang === 'en' ? 'Request Project Qualification' : 'درخواست ارزیابی و Qualification'
  const ctaBrand = lang === 'en' ? 'Read Brand & Delivery Standards' : 'استانداردهای برند و تحویل'

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl section-surface p-8 md:p-10 space-y-6">
          <p className="text-sm font-semibold text-primary">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{desc}</p>

          <ul className="space-y-2 text-sm text-muted-foreground list-disc ps-5">
            {principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Link href="/qualification" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
              {ctaQual}
            </Link>
            <Link href="/about-brand" className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted">
              {ctaBrand}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
