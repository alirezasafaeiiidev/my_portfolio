import Link from 'next/link'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { getRequestLanguage } from '@/lib/i18n/server'
import { Reveal } from '@/components/ui/reveal'

function getCaseStudies(lang: 'fa' | 'en') {
  if (lang === 'en') {
    return [
      {
        title: 'alirezasafaeisystems.ir Portfolio System',
        summary: 'Built this portfolio as a measurable visitor→lead system with strict QA gates and VPS-ready deployment.',
        href: '/case-studies/alirezasafaeidev-portfolio',
        metric: 'Portfolio as a production funnel',
      },
      {
        title: 'ASDEV PersianToolbox Platform',
        summary: 'Built and scaled a local-first Persian utility platform with strict UX simplicity and reliability standards.',
        href: '/case-studies/asdev-persiantoolbox-platform',
        metric: 'Live product with production governance',
      },
      {
        title: 'Infrastructure Localization Rescue',
        summary: 'Stabilized a fragile production stack under localization constraints and cut incident recovery time by 69%.',
        href: '/case-studies/infrastructure-localization-rescue',
        metric: 'MTTR: 180m → 55m',
      },
      {
        title: 'Legacy Next.js Replatform',
        summary: 'Migrated a risk-prone monolith to a governed Next.js architecture with cleaner release boundaries.',
        href: '/case-studies/legacy-nextjs-replatform',
        metric: 'Release failure rate: -58%',
      },
      {
        title: 'CI/CD Governance Hardening',
        summary: 'Introduced release gates, rollback drills, and evidence-based operations for executive reporting.',
        href: '/case-studies/ci-cd-governance-hardening',
        metric: 'Emergency rollback: 0 in 30 days',
      },
    ]
  }

  return [
    {
      title: 'سیستم پورتفولیو alirezasafaeisystems.ir',
      summary: 'ساخت این سایت به عنوان یک سیستم Visitor→Lead با گیت‌های کیفیت سخت‌گیرانه و آمادگی استقرار روی VPS.',
      href: '/case-studies/alirezasafaeidev-portfolio',
      metric: 'پورتفولیو به عنوان قیف تولیدی',
    },
    {
      title: 'پلتفرم PersianToolbox',
      summary: 'ساخت و رشد یک پلتفرم ابزارهای فارسی local-first با استاندارد سخت‌گیرانه سادگی تجربه و پایداری.',
      href: '/case-studies/asdev-persiantoolbox-platform',
      metric: 'محصول زنده با حاکمیت تولید',
    },
    {
      title: 'نجات بومی‌سازی زیرساخت',
      summary: 'پایدارسازی استک شکننده تحت محدودیت‌های بومی‌سازی و کاهش زمان بازیابی رخدادها.',
      href: '/case-studies/infrastructure-localization-rescue',
      metric: 'MTTR: ۱۸۰ → ۵۵ دقیقه',
    },
    {
      title: 'بازپلتفرم Next.js قدیمی',
      summary: 'مهاجرت یک مونولیت پرریسک به معماری governed در Next.js با مرزهای انتشار تمیزتر.',
      href: '/case-studies/legacy-nextjs-replatform',
      metric: 'کاهش نرخ شکست انتشار: ۵۸٪',
    },
    {
      title: 'سخت‌سازی حاکمیت CI/CD',
      summary: 'ایجاد گیت‌های انتشار، تمرین‌های rollback، و عملیات مبتنی بر شواهد برای گزارش مدیریتی.',
      href: '/case-studies/ci-cd-governance-hardening',
      metric: 'Rollback اضطراری: ۰ در ۳۰ روز',
    },
  ]
}

function withLocale(path: string, lang: 'fa' | 'en') {
  return `/${lang}${path}`
}

export async function FeaturedCaseStudies() {
  const lang = await getRequestLanguage()
  const caseStudies = getCaseStudies(lang)
  const eyebrow = lang === 'en' ? 'Execution Proof' : 'اثبات اجرا'
  const title = lang === 'en' ? 'Featured Case Studies' : 'مطالعات موردی منتخب'
  const desc =
    lang === 'en'
      ? 'Each case shows problem context, decision tradeoffs, delivery evidence, and measurable outcomes.'
      : 'هر مورد: زمینه مسئله، tradeoffها، شواهد تحویل، و خروجی قابل اندازه‌گیری.'
  const featuredTag = lang === 'en' ? 'Featured Product' : 'محصول نمونه‌کار'
  const openCta = lang === 'en' ? 'Open Case Study' : 'مشاهده کیس‌استادی'
  const allCta = lang === 'en' ? 'View All Case Studies' : 'مشاهده همه مطالعات موردی'

  return (
    <section id="case-studies" className="py-20 subtle-grid">
      <div className="container mx-auto px-4">
        <div className="section-surface aurora-shell p-6 md:p-8">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-10">
            <p className="text-sm font-semibold text-primary">{eyebrow}</p>
            <h2 className="headline-tight text-3xl md:text-4xl font-bold">{title}</h2>
            <p className="text-muted-foreground leading-8">{desc}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {caseStudies.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 75}>
                <article className="rounded-xl border bg-card p-6 h-full flex flex-col card-hover relative overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/70 via-primary/75 to-accent/70" />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-primary inline-flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {item.metric}
                    </p>
                    {index === 0 ? (
                      <span className="rounded-full border border-primary/40 bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                        {featuredTag}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1 leading-7">{item.summary}</p>
                  <Link href={withLocale(item.href, lang)} className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    {openCta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href={withLocale('/case-studies', lang)} className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted card-hover">
              {allCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
