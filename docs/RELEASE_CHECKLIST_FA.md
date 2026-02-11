# چک‌لیست انتشار (Production Release Checklist)

> آخرین به‌روزرسانی: 2026-02-11  
> هدف: انتشار قابل‌ردیابی، قابل‌بازگشت و بدون ریسک عملیاتی

## 1) پیش‌نیازهای کیفیت

- [ ] `bash scripts/verify.sh` پاس شود
- [ ] `bash scripts/offline-external-scan.sh` پاس شود
- [ ] `bun run test:e2e:smoke` پاس شود
- [ ] `bun run lighthouse:ci` پاس شود

## 2) پیش‌نیازهای امنیت و پایداری

- [ ] مسیرهای `/api/admin/*` فقط با session معتبر پاسخ 2xx بدهند
- [ ] `X-Request-ID` و `X-Correlation-ID` در پاسخ API وجود داشته باشد
- [ ] endpoint متریک (`/api/metrics`) در محیط production فقط برای role مجاز باز باشد (در صورت نیاز شبکه‌ای)
- [ ] policy هدرها (CSP/HSTS/Permissions-Policy) در `src/proxy.ts` بدون رگرسیون باشد

## 3) پیش‌نیازهای Runtime و UX

- [ ] صفحه `/` در حالت FA با `dir=rtl` و EN با `dir=ltr` کار کند
- [ ] skip-link با کیبورد قابل دسترسی باشد و به `#main-content` برود
- [ ] ریدایرکت `/admin` برای کاربر بدون لاگین به `/admin/login` برقرار باشد

## 4) خروجی انتشار

- [ ] changelog در `CHANGELOG.md` به‌روز باشد
- [ ] گزارش اجرایی در `docs/audit/REPORT_FA.md` به‌روز باشد
- [ ] وضعیت تسک‌ها در `docs/audit/REMAINING_TASKS_FA.md` sync باشد
- [ ] نسخه release با Semantic Release از branch `main` ایجاد شود

## 5) Post-release

- [ ] health check مسیر `/api` پاسخ healthy بدهد
- [ ] روند خطا/latency با SLO monitor بررسی شود
- [ ] smoke test بعد از deploy دوباره اجرا شود
