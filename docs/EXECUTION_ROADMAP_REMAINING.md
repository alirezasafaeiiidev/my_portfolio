# نقشه راه اجرایی باقیمانده (فازبندی بدون زمان‌بندی)

## فاز 1: پایداری دامنه و لایه Edge
1. [x] یکپارچه‌سازی کامل vhostهای نهایی روی VPS (portfolio + persiantoolbox).
2. [x] بستن قطعی TLS برای تمام ساب‌دامین‌های فعال (`apex/www/staging`) و حذف هر cert/reference قدیمی.
3. [x] ثبت evidence نهایی از `HTTP->HTTPS`, `HSTS`, `CSP`, `X-Frame-Options`, `Referrer-Policy`.

## فاز 2: گیت‌های عملیاتی سرور
1. [x] اجرای `scripts/deploy/check-hosting-sync.sh --strict` روی VPS واقعی (strict-equivalent validated on production server).
2. [x] اجرای `scripts/vps-preflight.sh` روی VPS واقعی و پاس کامل.
3. [x] ثبت rollback drill واقعی (اجرای rollback + health checks + گزارش نتیجه).

## فاز 3: بستن گیت انتشار محصول
1. [x] تکمیل آیتم‌های باز P0/P1 در `TASKS.md` تا `deploy-gate` سبز شود.
2. [x] یکپارچه‌سازی معیار پذیرش هر تسک با تست/شاهد قابل اجرا.
3. [x] اجرای `node scripts/deploy-gate.mjs` و ثبت خروجی سبز به‌عنوان پیش‌نیاز release.

## فاز 4: تکمیل قابلیت‌های محصول (Backlog)
1. [x] P0های باز بسته شد.
2. [x] P1های باز بسته شد.
3. [x] برای آیتم‌ها: پیاده‌سازی + تست واحد/یکپارچه + تست e2e + سند evidence ثبت شد.

## فاز 5: سخت‌سازی نهایی کیفیت و امنیت
1. [x] اجرای کامل `pnpm run verify`, `pnpm run test:e2e:smoke`, `scripts/deploy/verify-public-edge.sh`.
2. [x] رفع flaky مسیر language switch در smoke.
3. [x] تثبیت checklists در `docs/DEPLOYMENT_PRECHECKLIST.md` و `docs/RUNBOOK.md`.

## فاز 6: آماده‌سازی لانچ پایدار
1. [x] اجرای release آزمایشی staging/production با مسیر rollback تاییدشده.
2. [x] اجرای release production با smoke و health کامل.
3. [x] ثبت بسته نهایی شواهد عملیاتی در docs و بستن برد `docs/REMAINING_TASKS_ACTIVE.md`.

## Remaining (Product Enhancements)
1. `P2-01` Export/import history & settings.
2. `P2-02` Batch processing queue.
3. `P2-05` Persian date/numeral unification (number/currency/date output in all UI surfaces).
