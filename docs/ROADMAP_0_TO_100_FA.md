# نقشه راه 0 تا 100 پروژه `my_portfolio`

> تاریخ به‌روزرسانی: 2026-02-10
> وضعیت فعلی: فازهای پایدارسازی تکمیل شد

## Phase 0 - Baseline & Discovery
- [x] تحلیل ساختار کد (`src`, `docs`, `scripts`)
- [x] تحلیل Git history (12 commit اخیر)
- [x] اجرای baseline:
  - [x] `bun run lint`
  - [x] `bun run test`
  - [x] `bun run type-check` (شکست اولیه)
  - [x] `bun run build` (شکست اولیه)
  - [x] `bash scripts/verify.sh` (شکست کاذب اولیه)
  - [x] `bash scripts/offline-external-scan.sh` (نویز/شکست اولیه)

## Phase 1 - Build/Type Stabilization
- [x] رفع خطای JSX در `src/components/animations/demo.tsx`
- [x] همگام‌سازی تایپ `endDate` در `src/components/sections/experience.tsx`
- [x] رفع تایپ Framer Motion در `src/components/sections/testimonials.tsx`
- [x] اصلاح import تایپ theme provider در `src/components/theme/theme-provider.tsx`
- [x] سخت‌کردن تایپ متادیتا در `src/lib/seo.ts`
- [x] اصلاح تایپ coverage در `vitest.config.ts`

## Phase 2 - Verification/Local-First Hardening
- [x] رفع باگ شمارنده در `scripts/verify.sh`
- [x] حذف placeholder دامنه از `public/robots.txt`
- [x] حذف false-positive اسکن CDN با نادیده‌گیری مسیرهای build (`.next`, `node_modules`, `.git`, ...)
- [x] افزودن مکانیزم allowlist برای externalهای مستند در `scripts/offline-external-scan.sh`

## Phase 3 - Re-Verification Gate
- [x] `bun run lint`
- [x] `bun run type-check`
- [x] `bun run test`
- [x] `bun run build`
- [x] `bash scripts/verify.sh`
- [x] `bash scripts/offline-external-scan.sh`

## Phase 4 - Documentation Sync
- [x] همگام‌سازی `docs/audit/REPORT_FA.md`
- [x] به‌روزرسانی `docs/audit/REMAINING_TASKS_FA.md`
- [x] به‌روزرسانی `CHANGELOG.md` (در صورت اثر کاربری)

## Phase 5 - Production Readiness (Remaining)
- [x] افزودن E2E-like API hardening baseline (request-id, rate-limit, structured logging)
- [ ] افزودن E2E smoke tests (home, i18n switch, contact path)
- [ ] بررسی WCAG AA (focus states, keyboard flow, contrast)
- [ ] CSP policy و hardening هدرها
- [ ] Lighthouse budget gates (Perf/SEO/A11y)
- [ ] Release checklist و tag

## معیار Done نهایی (100%)
- همه baseline checks سبز
- اسکن external بدون dependency runtime ناخواسته
- اسناد audit و changelog هماهنگ
- Build قابل انتشار

## وضعیت نهایی اجرای این چرخه
- چک‌های حیاتی تحویل (`lint`, `type-check`, `test`, `build`, `verify`, `scan:external`) همگی پاس شدند.
- Phase 5 (Production readiness کامل) همچنان باز است و برای رسیدن به 100% محصولی باید اجرا شود.
