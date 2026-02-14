import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Selected delivery case studies with measurable outcomes, constraints, and operational evidence.',
  alternates: { canonical: `${siteUrl}/case-studies` },
}

const cases = [
  {
    title: 'Infrastructure Localization Rescue',
    sector: 'B2B SaaS',
    outcome: 'Stability incidents reduced by 62% in 6 weeks',
    href: '/case-studies/infrastructure-localization-rescue',
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="container mx-auto px-4 py-28">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Proof-Backed Delivery</p>
          <h1 className="text-3xl font-bold md:text-5xl">Case Studies</h1>
          <p className="text-muted-foreground">Each case includes context, constraints, actions, outcomes, and accepted evidence.</p>
        </header>

        <div className="grid gap-4">
          {cases.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-6">
              <p className="text-xs font-medium text-primary">{item.sector}</p>
              <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.outcome}</p>
              <Link href={item.href} className="mt-4 inline-flex rounded-md border px-4 py-2 text-sm">
                Open Full Case
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
