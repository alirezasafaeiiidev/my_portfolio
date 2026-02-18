import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ShieldCheck, Workflow, FileText } from 'lucide-react'
import { getRequestLanguage } from '@/lib/i18n/server'

function getProgramWeeks(lang: 'fa' | 'en') {
  if (lang === 'en') {
    return [
      {
        title: 'Week 1: Risk & Dependency Audit',
        detail: 'External dependency mapping, SPOF detection, and deployment risk review.',
        icon: ShieldCheck,
      },
      {
        title: 'Week 2: Localization Architecture Design',
        detail: 'Sanction-resilient blueprint, failover strategy, and environment separation.',
        icon: Workflow,
      },
      {
        title: 'Week 3: Governance & Automation',
        detail: 'Release standards, manual-risk reduction, and clear ownership boundaries.',
        icon: Workflow,
      },
      {
        title: 'Week 4: Executive Documentation',
        detail: 'Risk report, architecture diagrams, and implementation roadmap for execution.',
        icon: FileText,
      },
    ]
  }

  return [
    {
      title: 'هفته ۱: ممیزی ریسک و وابستگی‌ها',
      detail: 'نقشه وابستگی‌های بیرونی، کشف SPOF، و مرور ریسک‌های استقرار و انتشار.',
      icon: ShieldCheck,
    },
    {
      title: 'هفته ۲: طراحی معماری مقاوم به محدودیت',
      detail: 'بلوپرینت resilient، استراتژی failover، و جداسازی محیط‌ها و دسترسی‌ها.',
      icon: Workflow,
    },
    {
      title: 'هفته ۳: حاکمیت و اتوماسیون عملیاتی',
      detail: 'استانداردهای release/deploy، کاهش ریسک دستی، و چارچوب مالکیت (ownership).',
      icon: Workflow,
    },
    {
      title: 'هفته ۴: مستندسازی اجرایی و مدیریتی',
      detail: 'گزارش ریسک، دیاگرام‌های معماری، و نقشه راه پیاده‌سازی قابل اجرا.',
      icon: FileText,
    },
  ]
}

export async function Services() {
  const lang = await getRequestLanguage()
  const programWeeks = getProgramWeeks(lang)
  const title =
    lang === 'en'
      ? 'Infrastructure Localization & Operational Resilience Program'
      : 'برنامه بومی‌سازی زیرساخت و تاب‌آوری عملیاتی'
  const subtitle =
    lang === 'en'
      ? 'A 4-week program to reduce operational risk, harden production, and make delivery governable.'
      : 'برنامه ۴ هفته‌ای برای کاهش ریسک عملیاتی، سخت‌سازی تولید، و قابل‌حاکمیت کردن تحویل.'
  const investment = lang === 'en' ? 'Investment Range: 60–120M IRR' : 'بازه سرمایه‌گذاری: ۶۰ تا ۱۲۰ میلیون تومان'
  const ctaProgram = lang === 'en' ? 'View Full Program' : 'مشاهده برنامه کامل'
  const ctaAssessment = lang === 'en' ? 'Request Infrastructure Risk Assessment' : 'درخواست ارزیابی ریسک زیرساخت'

  return (
    <section id="services" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/60 to-muted/20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="section-surface p-6 md:p-8">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
            <div className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-semibold">
              {investment}
            </div>
          </div>

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
                {ctaProgram}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/services/infrastructure-localization#assessment">
                {ctaAssessment}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
