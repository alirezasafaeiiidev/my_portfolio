import type { Metadata } from 'next'
import Link from 'next/link'
import { brand } from '@/lib/brand'
import { getSiteUrl } from '@/lib/site-config'
import { Button } from '@/components/ui/button'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: `About ${brand.brandName}`,
  description: `${brand.brandName} brand profile, principles, and consulting execution model.`,
  alternates: {
    canonical: `${siteUrl}/about-brand`,
  },
}

export default function AboutBrandPage() {
  return (
    <main className="container mx-auto px-4 py-24 max-w-4xl space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Brand Profile</p>
        <h1 className="text-3xl md:text-4xl font-bold">
          {brand.ownerName} ({brand.brandName})
        </h1>
        <p className="text-muted-foreground">{brand.positioningEn}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Mission</h2>
        <p className="text-muted-foreground">
          Deliver production-grade web systems with measurable stability, explicit release governance,
          and CI/CD hardening that survives real operational pressure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Operating Principles</h2>
        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
          <li>Critical risks are closed before expansion work starts.</li>
          <li>Release status must come from one auditable source of truth.</li>
          <li>SEO, security, and operations are treated as production contracts.</li>
          <li>Every delivery ends with evidence-backed documentation.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Work With Me</h2>
        <p className="text-muted-foreground">
          For infrastructure localization, operational resilience, or architecture governance,
          start with the risk assessment flow.
        </p>
        <Button asChild>
          <Link href="/services/infrastructure-localization#assessment">
            Request Infrastructure Risk Assessment
          </Link>
        </Button>
      </section>
    </main>
  )
}
