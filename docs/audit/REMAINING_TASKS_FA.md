# تسک‌های اجرایی باقیمانده

> تاریخ: ۱۰ فوریه ۲۰۲۶
> منبع شواهد: اجرای `bash scripts/verify.sh` و `bash scripts/offline-external-scan.sh`
> وضعیت: Updated

## خلاصه وضعیت فعلی

- `verify.sh`: ✅ موفق (خروجی صفر)
- `offline-external-scan.sh`: ✅ موفق (خروجی صفر، با warning غیرمسدودکننده)
- نتیجه: blockerهای فنی و build رفع شدند؛ پروژه از حالت ناپایدار خارج شد

## پلن اجرا (Task Backlog)

## فاز A - Blockerها (اولویت بحرانی)

- [x] `A1` پاکسازی نویز اسکن وابستگی خارجی
  - شرح: فایل فعلی ظاهراً به‌جای باینری فونت، محتوای HTML/JS دارد و در اسکن وابستگی خارجی ده‌ها URL تولید کرده است.
  - معیار پذیرش:
    - اسکن دیگر خروجی build (`.next`) را به‌عنوان سورس runtime اسکن نکند.
  - شواهد: به‌روزرسانی `scripts/offline-external-scan.sh`

- [x] `A2` حذف/جایگزینی دامنه‌های placeholder در مسیرهای SEO
  - شرح: دامنه `https://yourportfolio.com` در چند مسیر کلیدی استفاده شده است.
  - فایل‌های هدف:
    - `src/app/layout.tsx`
    - `src/app/robots.ts`
    - `src/app/sitemap.ts`
    - `src/app/api/rss/route.ts`
    - `src/lib/seo.ts`
  - معیار پذیرش:
    - URL پایه فقط از یک منبع تنظیمی واحد (env/config) خوانده شود.
    - در اسکن external، placeholderهای دامنه حذف شده باشند.

## فاز B - Strict Code Quality

- [x] `B1` رفع blockerهای type/build
  - شرح: در baseline تعداد ۵۴ warning ثبت شده است.
  - دسته‌های اصلی:
    - `@typescript-eslint/no-unused-vars`
    - `@typescript-eslint/no-explicit-any`
    - `no-console`
    - `@typescript-eslint/no-non-null-assertion`
    - `@next/next/no-img-element`
  - معیار پذیرش:
    - `bun run lint`, `bun run type-check`, `bun run build` همگی pass.

- [x] `B2` رفع خطاهای TS در کامپوننت‌ها و SEO
  - فایل‌های هدف:
    - `src/components/animations/demo.tsx`
    - `src/components/sections/experience.tsx`
    - `src/components/sections/testimonials.tsx`
    - `src/components/theme/theme-provider.tsx`
    - `src/lib/seo.ts`
    - `vitest.config.ts`
  - معیار پذیرش:
    - `bun run type-check` بدون خطا.

- [x] `B3` رفع باگ اسکریپت verify
  - فایل هدف: `scripts/verify.sh`
  - معیار پذیرش:
    - دیگر fail کاذب نداشته باشد.

## فاز C - Local-First Hardening

- [x] `C1` تفکیک URLهای «مجاز محتوایی» از «وابستگی runtime» در اسکن
  - شرح: اسکریپت فعلی هر `https://` را بلاک می‌کند؛ لینک‌های محتوایی (مثلاً لینک شبکه اجتماعی در content) باید مستندسازی شوند.
  - فایل هدف: `scripts/offline-external-scan.sh`
  - معیار پذیرش:
    - allowlist مستند برای URLهای غیر-runtime تعریف شود.
    - URLهای runtime ناخواسته همچنان fail ایجاد کنند.

- [x] `C2` بررسی رفتار telemetry/analytics در کد
  - شرح: الگوهای analytics در اسکن دیده می‌شود (از جمله `src/components/analytics/web-vitals.tsx`).
  - معیار پذیرش:
    - OFF-by-default بودن کامل telemetry در runtime.
    - مستندسازی نقاط فعال‌سازی اختیاری.

## فاز D - Verification & Documentation

- [x] `D1` اجرای مجدد خط پایه پس از اصلاحات
  - دستورات:
    - `bash scripts/verify.sh`
    - `bash scripts/offline-external-scan.sh`
  - معیار پذیرش:
    - هر دو دستور با خروجی صفر تمام شوند.

- [x] `D2` همگام‌سازی مستندات
  - فایل‌های هدف:
    - `docs/audit/REPORT_FA.md`
    - `CHANGELOG.md` (در صورت تغییر user-facing)
  - معیار پذیرش:
    - ثبت تغییرات با شواهد مسیر فایل/خروجی دستور.

## تسک‌های باقی‌مانده واقعی (مسیر 100%)

1. افزودن E2E smoke tests برای مسیرهای اصلی (home، language switch، contact).
2. افزودن baseline امنیتی تکمیلی (CSP سخت‌گیرانه و تست خودکار headerها).
3. اجرای Lighthouse budget و ثبت score هدف‌مند در CI.

## به‌روزرسانی Enterprise (2026-02-11)

- انجام شد:
  - `env governance` با `zod` در `src/lib/env.ts`
  - `structured logging` با redaction در `src/lib/logger.ts`
  - `API security wrapper` در `src/lib/api-security.ts`
  - hardening روی routeهای:
    - `src/app/api/contact/route.ts`
    - `src/app/api/messages/route.ts`
    - `src/app/api/admin/messages/route.ts`
    - `src/app/api/admin/projects/route.ts`
    - `src/app/api/route.ts` (health endpoint)
  - تست‌های جدید:
    - `src/__tests__/lib/env.test.ts`
    - `src/__tests__/lib/api-security.test.ts`

- وضعیت verify:
  - `bun run lint` ✅
  - `bun run type-check` ✅
  - `bun run test` ✅ (104 tests)
  - `bun run build` ✅
  - `bash scripts/verify.sh` ✅

## تعریف Done

- lint/type-check/test/build/verify/scan = `pass`
- گزارش ممیزی با شواهد به‌روز
- چک‌لیست آمادگی انتشار تکمیل
