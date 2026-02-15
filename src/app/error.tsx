'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app error', {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-2xl font-bold">خطای غیرمنتظره رخ داد</h1>
          <p className="text-sm opacity-80">
            درخواست شما با خطا مواجه شد. لطفا دوباره تلاش کنید یا با مدیر سامانه تماس بگیرید.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  )
}
