import Link from 'next/link'
import { brand } from '@/lib/brand'

export default function EngineeringPage() {
  return (
    <main className="container mx-auto px-4 py-20 max-w-4xl space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Engineering Services</h1>
        <p className="text-muted-foreground leading-7">
          Production-grade web systems engineering for teams that need reliable delivery, governance, and release safety.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6 space-y-3">
          <h2 className="text-xl font-semibold">Audit & Readiness</h2>
          <p className="text-sm text-muted-foreground">
            Targeted technical audit focused on deployment risk, reliability gaps, and execution roadmap.
          </p>
        </div>
        <div className="rounded-xl border p-6 space-y-3">
          <h2 className="text-xl font-semibold">Limited Fractional CTO</h2>
          <p className="text-sm text-muted-foreground">
            Hands-on technical leadership for architecture, delivery discipline, and high-risk release windows.
          </p>
        </div>
      </section>

      <section className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Start a request</h3>
        <p className="text-sm text-muted-foreground">
          Submit project context and goals. If it is a fit, we will schedule a short alignment call.
        </p>
        <Link href="/engineering/request" className="inline-flex rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">
          Submit Request
        </Link>
      </section>

      <section className="text-xs text-muted-foreground">
        Canonical: <a href={brand.urls.engineeringHub} target="_blank" rel="noopener noreferrer" className="underline">{brand.urls.engineeringHub}</a>
      </section>
    </main>
  )
}

