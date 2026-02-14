import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Case Study: Infrastructure Localization Rescue',
  description:
    'How a high-risk deployment stack was stabilized with local-first architecture, controlled rollout gates, and evidence-based operations.',
  alternates: { canonical: `${siteUrl}/case-studies/infrastructure-localization-rescue` },
}

const outcomes = [
  'Mean incident recovery time reduced from 180m to 55m',
  'Zero emergency rollback in the final 21-day window',
  'Executive delivery report accepted without rework',
]

export default function InfrastructureLocalizationRescueCaseStudyPage() {
  return (
    <main className="container mx-auto px-4 py-28">
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Case Study</p>
          <h1 className="text-3xl font-bold md:text-5xl">Infrastructure Localization Rescue</h1>
          <p className="text-muted-foreground">Context: sanctions exposure, fragile delivery flow, and limited operational observability.</p>
        </header>

        <section className="space-y-3 rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Actions</h2>
          <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
            <li>Dependency risk map and blast-radius review</li>
            <li>Localization-first architecture with controlled fallback paths</li>
            <li>Release governance gates and handover checklist rollout</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Measured Outcomes</h2>
          <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
            {outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <footer className="text-sm text-muted-foreground">
          <Link href="/case-studies" className="underline">
            Back to case studies
          </Link>
        </footer>
      </article>
    </main>
  )
}
