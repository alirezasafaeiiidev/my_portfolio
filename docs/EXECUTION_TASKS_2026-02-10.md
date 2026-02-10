# برنامه اجرایی پروژه (به‌روزرسانی: 2026-02-10)

## وضعیت فعلی (Baseline واقعی)

- `bun run lint` ✅ Pass
- `bun run test` ✅ Pass (98 tests)
- `bun run type-check` ✅ Pass
- `bun run build` ✅ Pass
- `bash scripts/verify.sh` ✅ Pass
- `bash scripts/offline-external-scan.sh` ✅ Pass (با warning غیرمسدودکننده)

## هدف نهایی (Definition of Done)

- `bun run lint` پاس
- `bun run type-check` پاس
- `bun run test` پاس
- `bun run build` پاس
- `bash scripts/verify.sh` پاس
- `bash scripts/offline-external-scan.sh` پاس بدون false positive

## بک‌لاگ اجرایی

### فاز 0 - Stabilization (Blocker)

- [x] `P0-1` رفع باگ `verify.sh`:
  - مشکل: `((PASS_COUNT++))` با `set -e` می‌تواند خروجی fail بدهد.
  - فایل: `scripts/verify.sh`
  - معیار پذیرش: بعد از پاس شدن checkها، اسکریپت fail کاذب ندهد.

- [x] `P0-2` رفع false positive اسکن external:
  - مشکل: اسکن CDN روی کل `.` اجرا می‌شود و خروجی `.next` را هم می‌خواند.
  - فایل: `scripts/offline-external-scan.sh`
  - معیار پذیرش: مسیرهای build output مثل `.next`, `node_modules`, `.git` کامل نادیده گرفته شوند.

- [x] `P0-3` حذف placeholder دامنه از robots:
  - فایل: `public/robots.txt`
  - معیار پذیرش: `Sitemap` از یک base URL تنظیمی (env/config) استفاده کند یا مقدار واقعی پروژه قرار گیرد.

### فاز 1 - TypeScript Blocking Errors

- [x] `P1-1` رفع خطای `Cannot find name 'index'`:
  - فایل: `src/components/animations/demo.tsx` (حدود خط 209)
  - معیار پذیرش: متن نمونه به string/plain code تبدیل شود (نه expression واقعی JSX).

- [x] `P1-2` رفع ناسازگاری `endDate`:
  - فایل: `src/components/sections/experience.tsx`
  - اقدامات:
    - تایپ `endDate` با داده واقعی هم‌راستا شود (`string | null` یا حذف `null` از داده‌ها).
    - امضای `formatDateRange` با تایپ جدید همگام شود.
  - معیار پذیرش: هیچ خطای TS در این فایل باقی نماند.

- [x] `P1-3` رفع تایپ Framer Motion در Testimonials:
  - فایل: `src/components/sections/testimonials.tsx`
  - اقدامات:
    - حذف prop نامعتبر `direction` از `AnimatePresence` یا پیاده‌سازی صحیح variantها با `custom`.
    - سخت‌کردن تایپ `variants` (سازگار با `Variants`/`Transition`).
  - معیار پذیرش: TS error مربوط به `AnimatePresence` و `Variants` رفع شود.

- [x] `P1-4` اصلاح import تایپ ThemeProvider:
  - فایل: `src/components/theme/theme-provider.tsx`
  - اقدام: استفاده از import رسمی از `next-themes` به‌جای `next-themes/dist/types`.
  - معیار پذیرش: خطای `Cannot find module 'next-themes/dist/types'` رفع شود.

- [x] `P1-5` سخت‌کردن تایپ SEO metadata:
  - فایل: `src/lib/seo.ts`
  - اقدامات:
    - حذف `Record<string, ...>` عمومی.
    - تعریف تایپ ساختاریافته برای `openGraph` و `twitter`.
    - جلوگیری از مقدار `undefined` برای فیلدهای اجباری.
  - معیار پذیرش: خطاهای property access و undefined در این فایل صفر شود.

- [x] `P1-6` اصلاح config پوشش Vitest:
  - فایل: `vitest.config.ts`
  - مشکل: کلیدهای `statements/branches/functions/lines` با تایپ فعلی ناسازگارند.
  - معیار پذیرش: config با نسخه فعلی Vitest/V8 سازگار شود و TS error ندهد.

### فاز 2 - Verification Hardening

- [x] `P2-1` اجرای مجدد baseline:
  - `bun run lint`
  - `bun run type-check`
  - `bun run test`
  - `bun run build`
  - `bash scripts/verify.sh`
  - `bash scripts/offline-external-scan.sh`

- [x] `P2-2` همگام‌سازی مستندات:
  - فایل‌ها:
    - `docs/audit/REPORT_FA.md`
    - `docs/audit/REMAINING_TASKS_FA.md`
    - `CHANGELOG.md` (در صورت تغییر user-facing)

## ترتیب اجرای پیشنهادی

1. `P0-1`, `P0-2`, `P0-3`
2. `P1-1` تا `P1-6`
3. `P2-1`, `P2-2`

## اسپرینت پیشنهادی

- اسپرینت 1: فاز 0 + `P1-1` تا `P1-3`
- اسپرینت 2: `P1-4` تا `P1-6` + فاز 2
