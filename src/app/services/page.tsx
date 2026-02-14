import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Services',
  description: 'Productized consulting offers for infrastructure resilience, project rescue, and operational hardening.',
  alternates: { canonical: `${siteUrl}/services` },
}

const offers = [
  {
    title: 'Quick Stability Audit',
    summary: 'Fast risk scan for production instability, dependency fragility, and operational blind spots.',
    deliverables: ['Risk report', 'Priority action list', 'Evidence checklist'],
  },
  {
    title: 'Local Resilience Program',
    summary: 'Core offer for sanction-resilient architecture, deployment hardening, and reporting discipline.',
    deliverables: ['Architecture blueprint', 'Runbook package', 'Delivery evidence'],
  },
  {
    title: 'Project Rescue to Production',
    summary: 'Stabilize half-delivered projects and bring them to production-ready standards.',
    deliverables: ['Readiness report', 'Quality gate plan', 'Handover pack'],
  },
]

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-28">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">ASDEV Productized Offers</p>
          <h1 className="text-3xl font-bold md:text-5xl">Services</h1>
          <p className="text-muted-foreground">
            Fixed-scope offers designed for operational stability, measurable delivery, and fast executive clarity.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer.title} className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold">{offer.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{offer.summary}</p>
              <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                {offer.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/services/infrastructure-localization" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Open Core Program
          </Link>
          <Link href="/qualification" className="rounded-md border px-4 py-2">
            Start Qualification
          </Link>
          <Link href="/case-studies" className="rounded-md border px-4 py-2">
            View Case Studies
          </Link>
        </div>
      </section>
    </main>
  )
}
