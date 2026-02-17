# نقشه راه اجرایی باقیمانده (فازبندی بدون زمان‌بندی)

## فاز 1: پایداری دامنه و لایه Edge
1. یکپارچه‌سازی کامل vhostهای نهایی روی VPS (portfolio + persiantoolbox).
2. بستن قطعی TLS برای تمام ساب‌دامین‌های فعال (`apex/www/staging`) و حذف هر cert/reference قدیمی.
3. ثبت evidence نهایی از `HTTP->HTTPS`, `HSTS`, `CSP`, `X-Frame-Options`, `Referrer-Policy`.

## فاز 2: گیت‌های عملیاتی سرور
1. اجرای `scripts/deploy/check-hosting-sync.sh --strict` روی VPS واقعی و پاس کامل.
2. اجرای `scripts/vps-preflight.sh` روی VPS واقعی و پاس کامل.
3. ثبت rollback drill واقعی (اجرای rollback + health checks + گزارش نتیجه).

## فاز 3: بستن گیت انتشار محصول
1. تکمیل آیتم‌های باز P0/P1 در `TASKS.md` تا `deploy-gate` سبز شود.
2. یکپارچه‌سازی معیار پذیرش هر تسک با تست/شاهد قابل اجرا.
3. اجرای `node scripts/deploy-gate.mjs` و ثبت خروجی سبز به‌عنوان پیش‌نیاز release.

## فاز 4: تکمیل قابلیت‌های محصول (Backlog)
1. P0های باز: `P0-04`, `P0-07`, `P0-08`, `P0-09`, `P0-10`.
2. P1های باز: `P1-01` تا `P1-10`.
3. برای هر آیتم: پیاده‌سازی + تست واحد/یکپارچه + تست e2e مسیر بحرانی + سند evidence.

## فاز 5: سخت‌سازی نهایی کیفیت و امنیت
1. اجرای کامل `pnpm run verify`, `pnpm run test:e2e:smoke`, `scripts/deploy/verify-public-edge.sh`.
2. رفع نهایی flakyها و حذف هر وابستگی به وضعیت محیط محلی.
3. تثبیت checklists در `docs/DEPLOYMENT_PRECHECKLIST.md` و `docs/RUNBOOK.md`.

## فاز 6: آماده‌سازی لانچ پایدار
1. اجرای release آزمایشی staging با مسیر rollback تاییدشده.
2. اجرای release production با smoke و health کامل.
3. ثبت بسته نهایی شواهد عملیاتی در docs و بستن برد `docs/REMAINING_TASKS_ACTIVE.md`.
