# چک‌لیست انتشار (Production Release Checklist)

> آخرین به‌روزرسانی: 2026-02-11  
> هدف: انتشار قابل‌ردیابی، قابل‌بازگشت و بدون ریسک عملیاتی

## 1) پیش‌نیازهای کیفیت

- [x] `bash scripts/verify.sh` پاس شد
- [x] `bash scripts/offline-external-scan.sh` پاس شد
- [x] `bun run test:e2e:smoke` پاس شد
- [x] Lighthouse budget gate در CI فعال و enforce شد

## 2) پیش‌نیازهای امنیت و پایداری

- [x] مسیرهای `/api/admin/*` فقط با session معتبر پاسخ 2xx می‌دهند
- [x] `X-Request-ID` و `X-Correlation-ID` در پاسخ API وجود دارد
- [x] endpoint متریک (`/api/metrics`) برای production با سیاست دسترسی مشخص شد
- [x] policy هدرها (CSP/HSTS/Permissions-Policy) در `src/proxy.ts` بدون رگرسیون است

## 3) پیش‌نیازهای Runtime و UX

- [x] صفحه `/` در حالت FA با `dir=rtl` و EN با `dir=ltr` کار می‌کند
- [x] skip-link با کیبورد قابل دسترسی است و به `#main-content` می‌رود
- [x] ریدایرکت `/admin` برای کاربر بدون لاگین به `/admin/login` برقرار است

## 4) خروجی انتشار

- [x] changelog در `CHANGELOG.md` به‌روز است
- [x] گزارش اجرایی در `docs/audit/REPORT_FA.md` به‌روز است
- [x] وضعیت تسک‌ها در `docs/audit/REMAINING_TASKS_FA.md` sync است
- [x] مسیر release با Semantic Release از branch `main` آماده اجراست

## 5) Post-release

- [x] health check مسیر `/api` پاسخ healthy می‌دهد
- [x] روند خطا/latency با SLO monitor پوشش داده شد
- [x] smoke test برای بعد از deploy در workflow فعال است
