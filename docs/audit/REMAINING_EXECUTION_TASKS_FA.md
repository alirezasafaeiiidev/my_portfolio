# تسک‌های اجرایی مراحل باقیمانده (Final Deploy)

این سند، مراحل باقی‌مانده را به تسک‌های قابل اجرا با خروجی مشخص تبدیل می‌کند.

## ترتیب اجرای پیشنهادی

1. `T-B1-LINT-STRICT`
2. `T-B2-TS-SEO-COMPONENTS`
3. `T-B3-VERIFY-HARDEN`
4. `T-C2-ANALYTICS-TOGGLE`
5. `T-D1-CI-GATES`
6. `T-D3-AGENT-MD`
7. `T-D2-DOCS-SYNC` (پس از اتمام همه موارد بالا)

## تسک‌ها

### `T-B1-LINT-STRICT`
- فاز: `B1`
- اولویت: بالا
- وابستگی: ندارد
- شرح: پاک‌سازی کامل warning/errorهای ESLint و TypeScript در strict mode.
- اقدام‌ها:
  - رفع `no-unused-vars`
  - رفع `no-explicit-any`
  - رفع `no-console`
  - رفع `@typescript-eslint/no-non-null-assertion`
  - رفع `next/no-img-element`
- دستورهای پذیرش:
  - `bun run lint`
  - `bun run type-check`
  - `bun run build`
- خروجی مورد انتظار: هر سه دستور با خروجی موفق و بدون warning/error.

### `T-B2-TS-SEO-COMPONENTS`
- فاز: `B2`
- اولویت: بالا
- وابستگی: `T-B1-LINT-STRICT`
- شرح: اصلاح type-safety و SEO در فایل‌های هدف.
- مسیرهای هدف:
  - `src/components/animations/demo.tsx`
  - `src/components/sections/experience.tsx`
  - `src/components/sections/testimonials.tsx`
  - `src/components/theme/theme-provider.tsx`
  - `src/lib/seo.ts`
  - `vitest.config.ts`
- دستورهای پذیرش:
  - `bun run type-check`
  - `bun run test`
- خروجی مورد انتظار: type-check و tests بدون خطا.

### `T-B3-VERIFY-HARDEN`
- فاز: `B3`
- اولویت: متوسط
- وابستگی: `T-B1-LINT-STRICT`, `T-B2-TS-SEO-COMPONENTS`
- شرح: پایدارسازی نهایی `scripts/verify.sh` برای حذف false failure.
- اقدام‌ها:
  - بازبینی منطق `run_check`
  - اطمینان از کد خروجی ۰ در موفقیت کامل
  - اطمینان از fail صحیح در خطاهای واقعی
- دستور پذیرش:
  - `bash scripts/verify.sh`
- خروجی مورد انتظار: نمایش موفقیت همه مراحل و exit code صفر.

### `T-C1-ALLOWLIST-MAINTAIN`
- فاز: `C1`
- اولویت: متوسط
- وابستگی: انجام شده پایه اولیه
- شرح: نگهداشت allowlist و تنظیم قواعد اضافه‌شدن آیتم‌های جدید.
- اقدام‌ها:
  - بازبینی `scripts/external-scan-allowlist.txt`
  - ثبت الگوی مستندسازی آیتم‌های allowlist
- دستور پذیرش:
  - `bash scripts/offline-external-scan.sh`
- خروجی مورد انتظار: لینک‌های مجاز false-positive ندهند و لینک‌های غیرمجاز گزارش شوند.

### `T-C2-ANALYTICS-TOGGLE`
- فاز: `C2`
- اولویت: بالا
- وابستگی: ندارد
- شرح: خاموش‌بودن پیش‌فرض telemetry و فعال‌سازی صرفاً با flag محیطی.
- مسیر هدف:
  - `src/components/analytics/web-vitals.tsx`
- اقدام‌ها:
  - افزودن `NEXT_PUBLIC_ENABLE_ANALYTICS`
  - توقف ارسال telemetry در حالت `false`
  - افزودن تست رفتاری برای حالت disabled
- دستورهای پذیرش:
  - `bun run test`
  - بررسی دستی network tab در حالت پیش‌فرض
- خروجی مورد انتظار: در حالت پیش‌فرض هیچ request telemetry ارسال نشود.

### `T-D1-CI-GATES`
- فاز: `D1`
- اولویت: بالا
- وابستگی: `T-B3-VERIFY-HARDEN`, `T-C2-ANALYTICS-TOGGLE`
- شرح: اجباری‌سازی verify و scan در CI برای push/merge.
- مسیرهای هدف:
  - `.github/workflows/ci.yml` (یا workflow معادل)
- اقدام‌ها:
  - اجرای `bash scripts/verify.sh`
  - اجرای `bash scripts/offline-external-scan.sh`
  - fail pipeline در شکست هر کدام
- پذیرش:
  - یک اجرای موفق pipeline روی commit نمونه
- خروجی مورد انتظار: gateهای CI مانع merge ناسالم شوند.

### `T-D3-AGENT-MD`
- فاز: `D3`
- اولویت: متوسط
- وابستگی: ندارد
- شرح: ایجاد/تکمیل `AGENT.md` در ریشه `my_portfolio` مطابق استاندارد `asdev_platform`.
- بخش‌های الزامی:
  - هویت و ماموریت
  - دستورات `setup/lint/test/build/run`
  - چرخه کاری
  - تعریف Done
  - Human Gates
  - چک‌لیست کیفیت
- پذیرش:
  - وجود `AGENT.md` کامل + تایید مالک محصول

### `T-D2-DOCS-SYNC`
- فاز: `D2`
- اولویت: بالا
- وابستگی: همه تسک‌های قبلی
- شرح: همگام‌سازی نهایی مستندات و changelog.
- مسیرهای هدف:
  - `docs/audit/REPORT_FA.md`
  - `CHANGELOG.md`
  - `docs/audit/FINAL_DEPLOYMENT_TASKS_FA.md`
- اقدام‌ها:
  - ثبت شواهد اجرای دستورات
  - ثبت اثرات کاربری/سیستمی
  - ثبت وضعیت نهایی هر فاز
- پذیرش:
  - مستندات همگام، قابل ردیابی و بازبینی‌پذیر باشند.
