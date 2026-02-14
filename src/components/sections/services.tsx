'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ShieldCheck, Workflow, FileText } from 'lucide-react'

const programWeeks = [
  {
    title: 'Week 1 — Risk & Dependency Audit',
    detail: 'External dependency mapping, SPOF detection, deployment risk review.',
    icon: ShieldCheck,
  },
  {
    title: 'Week 2 — Localization Architecture Design',
    detail: 'Sanction-resilient blueprint, failover strategy, environment separation.',
    icon: Workflow,
  },
  {
    title: 'Week 3 — Governance & Automation',
    detail: 'Release/deploy standards, manual-risk reduction, ownership framework.',
    icon: Workflow,
  },
  {
    title: 'Week 4 — Executive Documentation',
    detail: 'Executive risk report, architecture diagrams, implementation roadmap.',
    icon: FileText,
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/60 to-muted/20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Infrastructure Localization & Operational Resilience Program
          </h2>
          <p className="text-muted-foreground">
            برنامه ۴ هفته‌ای برای کاهش ریسک عملیاتی، سخت‌سازی production، و ایجاد سیستم governable.
          </p>
          <div className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-semibold">
            Investment Range: 60–120M IRR
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {programWeeks.map((week) => (
            <Card key={week.title} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <week.icon className="h-5 w-5 text-primary" />
                  {week.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{week.detail}</CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/services/infrastructure-localization">
              View Full Program
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/services/infrastructure-localization#assessment">
              Request Infrastructure Risk Assessment
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
