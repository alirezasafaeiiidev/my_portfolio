import type { Metadata } from 'next'
import Link from 'next/link'
import { InfrastructureLeadForm } from '@/components/sections/infrastructure-lead-form'
import { getSiteUrl } from '@/lib/site-config'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Infrastructure Localization & Operational Resilience Program',
  description:
    '4-week consulting program for infrastructure risk audit, sanction-resilient architecture design, governance hardening, and executive delivery.',
  alternates: {
    canonical: `${siteUrl}/services/infrastructure-localization`,
  },
  openGraph: {
    title: 'Infrastructure Localization & Operational Resilience Program',
    description:
      'Audit dependencies, reduce operational fragility, and build production stability with a structured 4-week program.',
    url: `${siteUrl}/services/infrastructure-localization`,
    type: 'website',
  },
}

const weeklyPlan = [
  {
    title: 'Week 1 — Risk & Dependency Audit',
    items: ['External dependency mapping', 'Single point of failure identification', 'Deployment structure review'],
  },
  {
    title: 'Week 2 — Localization Architecture Design',
    items: ['Sanction-resilient architecture blueprint', 'Environment separation and failover design', 'Self-hosted alternatives mapping'],
  },
  {
    title: 'Week 3 — Governance & Automation',
    items: ['Release/deploy standardization', 'Manual-risk reduction', 'Policy and ownership framework'],
  },
  {
    title: 'Week 4 — Documentation & Executive Report',
    items: ['Executive-ready risk report', 'Final architecture diagrams', 'Implementation roadmap'],
  },
]

export default function InfrastructureLocalizationServicePage() {
  return (
    <main className="container mx-auto px-4 py-28">
      <div className="mx-auto max-w-5xl space-y-12">
        <section className="space-y-4">
          <p className="text-sm font-semibold text-primary">Flagship Consulting Offer</p>
          <h1 className="text-3xl font-bold md:text-5xl">Infrastructure Localization & Operational Resilience Program</h1>
          <p className="text-lg text-muted-foreground">
            برنامه 4 هفته‌ای برای کاهش ریسک عملیاتی، حذف وابستگی‌های آسیب‌پذیر در برابر تحریم، و ایجاد پایداری واقعی در محیط production.
          </p>
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            بازه سرمایه‌گذاری: <strong>60 تا 120 میلیون تومان</strong> (بسته به دامنه و پیچیدگی)
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {weeklyPlan.map((week) => (
            <article key={week.title} className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold">{week.title}</h2>
              <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                {week.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border bg-card p-6">
          <h2 className="text-2xl font-semibold">Deliverables</h2>
          <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
            <li>Dependency Risk Map</li>
            <li>Architecture Blueprint</li>
            <li>Governance Policy Document</li>
            <li>Disaster Recovery Plan</li>
            <li>Executive Summary Report</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Scope excludes feature development and daily support operations unless explicitly added by amendment.
          </p>
        </section>

        <section id="assessment" className="space-y-4">
          <h2 className="text-2xl font-semibold">Request Infrastructure Risk Assessment</h2>
          <p className="text-sm text-muted-foreground">
            فرم زیر را کامل کنید تا ارزیابی اولیه و جلسه Discovery برنامه‌ریزی شود.
          </p>
          <InfrastructureLeadForm />
        </section>

        <section className="text-sm text-muted-foreground">
          <Link className="underline" href="/">
            بازگشت به صفحه اصلی
          </Link>
        </section>
      </div>
    </main>
  )
}
