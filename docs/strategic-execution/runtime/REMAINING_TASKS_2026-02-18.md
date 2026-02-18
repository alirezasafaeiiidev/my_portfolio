# Remaining Tasks — 2026-02-18

## هدف
لیست شفاف کارهای باقیمانده پس از Batch 1 تا Batch 3 برای بستن roadmap و آماده‌سازی Go-Live واقعی.

## وضعیت کلی
- گیت‌های محلی (verify/smoke/lighthouse) در Batch 3 پاس شدند.
- deploy/rollback drill روی محیط لوکال شبیه‌سازی VPS انجام شد.
- موارد باقیمانده عمدتاً external و وابسته به edge/VPS واقعی هستند.

## باقیمانده‌های P0 (Blocker)
1. **TLS/HSTS واقعی روی دامنه production را verify کن**
   - مالک: DevOps
   - کار اجرایی: اجرای `curl -I https://alirezasafaeidev.ir` و بررسی `Strict-Transport-Security` روی edge نهایی
   - شواهد فعلی: در اجرای اخیر پاسخ upstream ناپایدار/503 دیده شده است.

2. **مالکیت و رویه تمدید گواهی (cert renewal ownership) را نهایی کن**
   - مالک: DevOps
   - کار اجرایی: مشخص‌کردن ابزار renewal (certbot/acme/caddy) + زمان‌بندی + owner + runbook
   - شواهد فعلی: `certbot` در محیط فعلی نصب نیست و مدرک ownership کامل نشده است.

3. **تأیید dependency دامنه هم‌میزبان (`persiantoolbox.ir`)**
   - مالک: DevOps
   - کار اجرایی: رفع timeout شبکه/edge و ثبت snapshot هدرها + health
   - شواهد فعلی: TLS check روی این دامنه timeout شده است.

## باقیمانده‌های P1
4. **Rollback Drill رسمی با Incident Note**
   - مالک: DevOps
   - کار اجرایی: یک rollback drill واقعی روی VPS production با ثبت دلیل، زمان، release-id مبدا/مقصد، و post-check
   - وضعیت فعلی: drill محلی انجام شده ولی مستند رسمی incident-style هنوز لازم است.

5. **Production Readiness Evidence Bundle**
   - مالک: Platform owner
   - کار اجرایی: بسته نهایی شامل health, smoke, lighthouse, headers, cert ownership و env sign-off
   - خروجی: یک سند single-source برای go/no-go.

## باقیمانده‌های P2 (Hardening)
6. **Security header snapshot روی edge واقعی**
   - CSP, X-Frame-Options, Referrer-Policy
   - با `curl -I` روی دامنه نهایی ثبت و در runbook لینک شود.

7. **Monitoring/Error Budget لینک‌گذاری در runbook**
   - لینک uptime، error budget، alert ownership
   - تعریف on-call owner و escalation path.

## Definition of Done (نهایی)
- همه P0 بسته شوند.
- rollback drill واقعی + گزارش incident-style ثبت شود.
- security header و monitoring evidence روی دامنه واقعی لینک شود.
- production smoke و `/api/ready` روی دامنه نهایی پایدار پاس شود.

## شواهد مرجع از اجراهای اخیر
- `docs/strategic-execution/runtime/ROADMAP_EXECUTION_2026-02-18_BATCH3.md`
- `artifacts/roadmap3-lighthouse-20260218T090801Z.log`
- `artifacts/roadmap3-tls-check-portfolio-20260218T090801Z.log`
- `artifacts/roadmap3-tls-check-toolbox-20260218T090801Z.log`
- `artifacts/roadmap3-cert-renewal-evidence-20260218T090801Z.log`
