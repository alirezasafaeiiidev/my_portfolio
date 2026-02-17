'use client'

import Link from 'next/link'

type UpdateBannerProps = {
  onUpdateNow: () => void
  onLater: () => void
}

export function UpdateBanner({ onUpdateNow, onLater }: UpdateBannerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(94vw,720px)] -translate-x-1/2 rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold">نسخه جدید آماده است</p>
      <p className="mt-1 text-xs text-muted-foreground">
        می‌توانید همین الان نسخه جدید را فعال کنید یا بعداً ادامه دهید.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
          onClick={onUpdateNow}
        >
          بروزرسانی الآن
        </button>
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
          onClick={onLater}
        >
          بعداً
        </button>
        <Link href="/changelog" className="text-xs font-semibold text-primary">
          مشاهده تغییرات
        </Link>
      </div>
    </div>
  )
}
