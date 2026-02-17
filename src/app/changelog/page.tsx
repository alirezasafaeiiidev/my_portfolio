import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تغییرات نسخه‌ها',
  description: 'مرور تغییرات مهم نسخه‌های اخیر پلتفرم.',
}

const entries = [
  {
    date: '2026-02-17',
    title: 'تثبیت deployment و عملیات VPS',
    items: [
      'پاس شدن کامل verify/smoke/deploy gate',
      'پاس شدن edge checks برای هر دو دامنه',
      'ثبت شواهد runbook، prechecklist و rollback drill',
    ],
  },
  {
    date: '2026-02-17',
    title: 'بهبود تجربه PWA',
    items: [
      'اضافه شدن بنر بروزرسانی با گزینه‌های «بروزرسانی الآن» و «بعداً»',
      'نمایش مسیر changelog داخل بنر آپدیت',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">تغییرات نسخه‌ها</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        خلاصه تغییرات مهم منتشرشده برای تیم عملیات و محصول.
      </p>

      <div className="mt-8 space-y-6">
        {entries.map((entry) => (
          <section key={`${entry.date}-${entry.title}`} className="rounded-xl border border-border bg-background p-5">
            <p className="text-xs font-semibold text-primary">{entry.date}</p>
            <h2 className="mt-1 text-lg font-semibold">{entry.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pr-5 text-sm text-muted-foreground">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
