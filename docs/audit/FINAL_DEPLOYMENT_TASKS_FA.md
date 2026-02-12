# چک‌لیست اجرایی کارهای باقیمانده دیپلوی نهایی (`my_portfolio`)

## مقدمه

این سند نسخه اجرایی و قابل‌تیک از تسک‌های باقی‌مانده است تا تیم بتواند بسته‌شدن هر آیتم را با شواهد قابل‌راستی‌آزمایی ثبت کند.

تسک‌بندی عملیاتی این مراحل در فایل `docs/audit/REMAINING_EXECUTION_TASKS_FA.md` نگهداری می‌شود.

## نحوه استفاده

- هر آیتم بعد از انجام، از `[ ]` به `[x]` تغییر کند.
- در بخش «شواهد اجرا» خروجی دستور، لینک PR، یا مسیر فایل ثبت شود.
- در پایان هر فاز، معیار پذیرش فاز باید کامل تیک بخورد.

## فاز A: رفع مسائل بحرانی (Blocker)

### A1: پاک‌سازی فونت و بهبود اسکن خارجی

- [x] اسکن runtime روی خروجی build (`.next`) فعال و پایدار شده است.
- [x] allowlist برای منابع مجاز (فونت/نماد/لینک‌های غیر-runtime) تعریف شده است.
- [x] اسکن false positive تولید نمی‌کند.

هدف: سرو کامل دارایی‌ها به‌صورت محلی و عبور اسکن بدون هشدار غیرواقعی.

شاخص پذیرش:
- [x] `bash scripts/offline-external-scan.sh` روی خروجی build بدون خطا/هشدار اجرا می‌شود.
- [x] گزارش اسکن لینک runtime خارجی غیرمجاز ندارد.

شواهد اجرا:
- [x] مسیر تغییرات: `scripts/offline-external-scan.sh`
- [x] مسیر allowlist (در صورت وجود): `scripts/external-scan-allowlist.txt`
- [x] خروجی دستور: `bash scripts/offline-external-scan.sh`

### A2: حذف دامنه جایگزین و استفاده از پیکربندی

- [x] همه hard-coded domainها از مسیرهای هدف حذف شده‌اند:
- [x] `src/app/layout.tsx`
- [x] `src/app/robots.ts`
- [x] `src/app/sitemap.ts`
- [x] `src/app/api/rss/route.ts`
- [x] `src/lib/seo.ts`
- [x] دامنه فقط از پیکربندی محیطی (مانند `NEXT_PUBLIC_SITE_URL` یا معادل پروژه) خوانده می‌شود.

هدف: حذف کامل hard-code دامنه و استفاده از تنظیمات محیط اجرا.

شاخص پذیرش:
- [x] `rg -n "portfolio\\.example\\.com" src` هیچ نتیجه‌ای ندهد.
- [x] تست‌های SEO و sitemap بدون خطا اجرا شوند.

شواهد اجرا:
- [x] خروجی دستور: `rg -n "portfolio\\.example\\.com" src`
- [x] خروجی دستور: `bun run test`
- [x] خروجی دستور: `bun run build`

## فاز B: افزایش کیفیت کد (Strict Code Quality)

### B1: رفع هشدارهای TypeScript و ESLint

- [x] هشدارهای `no-unused-vars` رفع شده‌اند.
- [x] هشدارهای `no-explicit-any` رفع شده‌اند.
- [x] هشدارهای `no-console` رفع شده‌اند.
- [x] هشدارهای `@typescript-eslint/no-non-null-assertion` رفع شده‌اند.
- [x] هشدارهای `next/no-img-element` رفع شده‌اند.
- [x] هشدارهای TypeScript مرتبط با type inference/unknown رفع شده‌اند.

هدف: اجرای strict بدون warning/error.

شاخص پذیرش:
- [x] `bun run lint` بدون warning/error.
- [x] `bun run type-check` بدون warning/error.
- [x] `bun run build` بدون warning/error.
- [x] پوشش تست کاهش پیدا نکرده است.

### B2: رفع خطاهای TS و SEO در کامپوننت‌ها

- [x] `src/components/animations/demo.tsx` اصلاح شد.
- [x] `src/components/sections/experience.tsx` اصلاح شد.
- [x] `src/components/sections/testimonials.tsx` اصلاح شد.
- [x] `src/components/theme/theme-provider.tsx` اصلاح شد.
- [x] `src/lib/seo.ts` اصلاح شد.
- [x] `vitest.config.ts` اصلاح شد.
- [x] استفاده از `any` در مسیرهای هدف حذف شد.
- [x] null assertion غیرضروری حذف شد.
- [x] بهبودهای SEO اعمال شد.

هدف: type-safety کامل UI + رعایت استاندارد SEO.

شاخص پذیرش:
- [x] `bun run type-check` بدون خطا.
- [x] `bun run test` بدون خطا.

### B3: اصلاح اسکریپت verify

- [x] منطق جمع‌بندی موفق/ناموفق مراحل در `scripts/verify.sh` اصلاح شد.
- [x] false failure حذف شد.
- [x] کد خروجی در موفقیت کامل برابر `0` است.

هدف: اتکاپذیری verify برای lint/test/build.

شاخص پذیرش:
- [x] `bash scripts/verify.sh` بدون خطا اجرا می‌شود.
- [x] خروجی اسکریپت موفقیت همه مراحل را نشان می‌دهد.

## فاز C: تقویت اصل Local-First

### C1: تعریف allowlist برای اسکن منابع خارجی

- [x] allowlist برای URLهای non-runtime قابل توسعه اضافه شده است.
- [x] allowlist از طریق فایل یا پیکربندی قابل تغییر است.

هدف: کاهش false positive بدون تضعیف Local-First.

شاخص پذیرش:
- [x] لینک‌های allowlist شده گزارش خطای مسدودکننده نمی‌گیرند.
- [x] لینک‌های غیرمجاز همچنان گزارش می‌شوند.

### C2: اختیاری کردن Telemetry/Analytics

- [x] پرچم پیکربندی برای analytics تعریف شده است (مثال: `NEXT_PUBLIC_ENABLE_ANALYTICS`).
- [x] پیش‌فرض telemetry غیرفعال است.
- [x] در حالت `false` هیچ درخواست شبکه‌ای telemetry ارسال نمی‌شود.

هدف: فعال‌سازی telemetry فقط با رضایت صریح.

شاخص پذیرش:
- [x] تست عملکردی رفتار `disabled` را تایید کند.
- [x] بررسی دستی network request در حالت پیش‌فرض، telemetry را نشان ندهد.

## فاز D: تضمین صحت، مستندسازی و رهاسازی

### D1: اجرای verify و offline scan در CI

- [x] اجرای `scripts/verify.sh` در CI اجباری شده است.
- [x] اجرای `scripts/offline-external-scan.sh` در CI اجباری شده است.
- [x] شکست هرکدام از گیت‌ها، pipeline را متوقف می‌کند.

هدف: تضمین deployability پیوسته.

شاخص پذیرش:
- [x] یک pipeline نمونه برای commit جدید با موفقیت کامل عبور کند.

### D2: به‌روزرسانی مستندات و CHANGELOG

- [x] `docs/audit/REPORT_FA.md` همگام شده است.
- [x] `CHANGELOG.md` همگام شده است.
- [x] اثر تغییرات سیستمی/کاربری مستند شده است.

هدف: شفافیت تاریخچه و قابلیت بازبینی.

شاخص پذیرش:
- [x] تغییرات هر فاز در commit مرتبط ثبت و قابل ردیابی است.

### D3: ایجاد و تکمیل فایل AGENT.md

- [x] فایل `AGENT.md` در ریشه مخزن `my_portfolio` ایجاد/تکمیل شده است.
- [x] بخش‌های الزامی: ماموریت، فرمان‌های setup/lint/test/build/run، چرخه کاری، تعریف Done، Human Gates، چک‌لیست کیفیت.
- [x] ارجاع تکمیلی به `AGENTS.md` در صورت نیاز.

هدف: مرجع واحد عملیاتی برای توسعه‌دهندگان و عامل‌های AI.

شاخص پذیرش:
- [x] بازبینی و تایید مالک محصول ثبت شده باشد.

## معیار تکمیل کل برنامه

- [x] همه آیتم‌های فاز A تا D تیک خورده‌اند.
- [x] خروجی `bash scripts/verify.sh` موفق است.
- [x] خروجی `bash scripts/offline-external-scan.sh` موفق است.
- [x] مستندات و changelog نهایی همگام هستند.
