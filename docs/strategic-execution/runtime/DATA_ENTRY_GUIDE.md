# راهنمای ورود دیتای جدید (Runtime)

این راهنما برای ورود دیتای جدید در پوشه `runtime/` است تا سوابق قابل پیگیری و قابل audit بمانند.

## اصل نام‌گذاری
- فایل‌های evidence را با تاریخ شروع کنید: `YYYY-MM-DD_<topic>.md`
- تاریخ را به UTC ثبت کنید.
- برای هر ورودی، owner و وضعیت را مشخص کنید.

## محل ورود داده
- Go-Live evidence:
  - `docs/strategic-execution/runtime/GoLive_Evidence/`
- Brand evidence:
  - `docs/strategic-execution/runtime/Brand_Evidence/`
- Sales evidence:
  - `docs/strategic-execution/runtime/Sales_Evidence/`
- Weekly review:
  - `docs/strategic-execution/runtime/Weekly_Reviews/`
- لاگ‌های عملیاتی CSV:
  - `docs/strategic-execution/runtime/Task_Log.csv`
  - `docs/strategic-execution/runtime/Lead_Log.csv`
  - `docs/strategic-execution/runtime/Outreach_Log.csv`
  - `docs/strategic-execution/runtime/Project_Log.csv`

## قالب پیشنهادی برای فایل‌های evidence
```md
# <Title>

- Date (UTC): 2026-02-16
- Owner: <name/role>
- Status: draft|in-review|approved
- Scope: <what was validated>

## Evidence
- Command:
  - `<command>`
- Output summary:
  - `<key result>`
- Artifact path:
  - `<path/to/file>`

## Decision
- Result: pass|fail|conditional
- Next action: <clear action>
```

## حداقل کیفیت داده
- فقط ادعایی ثبت شود که artifact یا خروجی فرمان داشته باشد.
- اگر آیتمی `Done` شد، حداقل یک `path` و یک نتیجه قابل راستی‌آزمایی ثبت شود.
- اگر داده از محیط بیرونی (VPS/Production) است، تاریخ/زمان و محیط دقیق ذکر شود.
