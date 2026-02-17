import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'آفلاین شدی؟',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">اتصال اینترنت قطع شده است</h1>
      <p className="text-muted-foreground mb-6">
        اگر دوباره آنلاین شدی، روی «تلاش مجدد» بزن تا محتوای تازه بارگذاری شود.
      </p>
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </button>
        <button
          type="button"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium"
          onClick={() => window.history.back()}
        >
          بازگشت
        </button>
      </div>
    </main>
  )
}
