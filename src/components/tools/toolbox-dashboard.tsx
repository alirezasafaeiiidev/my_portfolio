'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  clearAllToolboxData,
  clearHistory,
  getToolboxData,
  importToolboxPayload,
  makeExportPayload,
  updateToolboxSettings,
  type ImportMode,
} from '@/lib/local-store/toolbox-data'
import { safeDownloadBlob } from '@/lib/workers/download'
import { formatLocalizedDateTime, formatLocalizedNumber } from '@/lib/persian-utils'

type ImportTarget = ImportMode

export function ToolboxDashboardClient() {
  const [data, setData] = useState(() => getToolboxData())
  const [importTarget, setImportTarget] = useState<ImportTarget>('all')
  const [importError, setImportError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = () => setData(getToolboxData())

  const onExport = () => {
    const payload = makeExportPayload()
    const blob = new Blob([payload], { type: 'application/json' })
    safeDownloadBlob(blob, `toolbox-export-${new Date().toISOString().slice(0, 10)}.json`)
  }

  const onImportSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      importToolboxPayload(text, importTarget)
      setImportError(null)
      refresh()
    } catch {
      setImportError('فایل واردشده معتبر نیست یا ساختار پشتیبانی‌شده ندارد.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard محلی ابزارها</h1>
        <p className="text-sm text-muted-foreground">
          تنظیمات و تاریخچه اجرای ابزارها فقط روی مرورگر شما ذخیره می‌شود.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-lg font-semibold">تنظیمات</h2>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.settings.saveHistory}
            onChange={(event) => {
              updateToolboxSettings({ saveHistory: event.target.checked })
              refresh()
            }}
          />
          ذخیره تاریخچه اجرا
        </label>

        <label className="block text-sm">
          کیفیت پیش‌فرض فشرده‌سازی تصویر
          <input
            type="range"
            min={1}
            max={100}
            value={data.settings.defaultImageQuality}
            onChange={(event) => {
              updateToolboxSettings({ defaultImageQuality: Number(event.target.value) })
              refresh()
            }}
            className="mt-2 block w-full"
          />
          <span className="text-xs text-muted-foreground">
            {formatLocalizedNumber(data.settings.defaultImageQuality, data.settings.numeralLocale)}
          </span>
        </label>

        <label className="block text-sm">
          قالب اعداد
          <select
            value={data.settings.numeralLocale}
            onChange={(event) => {
              updateToolboxSettings({ numeralLocale: event.target.value as 'fa-IR' | 'en-US' })
              refresh()
            }}
            className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2"
          >
            <option value="fa-IR">فارسی</option>
            <option value="en-US">English</option>
          </select>
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-lg font-semibold">Export / Import</h2>
        <p className="text-xs text-muted-foreground">
          خروجی JSON شامل تنظیمات و متادیتای تاریخچه است. فایل‌ها یا محتوای حساس ذخیره نمی‌شوند.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={onExport}>Export Data</Button>

          <select
            value={importTarget}
            onChange={(event) => setImportTarget(event.target.value as ImportTarget)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">Import: همه</option>
            <option value="settings-only">Import: فقط تنظیمات</option>
            <option value="history-only">Import: فقط تاریخچه</option>
          </select>

          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            Import Data
          </Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImportSelected} />
        </div>

        {importError && <p className="text-sm text-destructive">{importError}</p>}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">تاریخچه اجرا</h2>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => { clearHistory(); refresh() }}>پاکسازی تاریخچه</Button>
            <Button type="button" variant="destructive" onClick={() => { clearAllToolboxData(); refresh() }}>حذف کامل داده محلی</Button>
          </div>
        </div>

        {data.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">هنوز اجرای ثبت‌شده‌ای وجود ندارد.</p>
        ) : (
          <ul className="space-y-2">
            {data.history.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{entry.toolTitle}</p>
                  <span className="text-xs text-muted-foreground">{entry.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatLocalizedDateTime(entry.finishedAt, data.settings.numeralLocale)}
                  {' • '}
                  {formatLocalizedNumber(entry.durationMs, data.settings.numeralLocale)} ms
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
