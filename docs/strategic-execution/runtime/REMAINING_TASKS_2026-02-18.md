# Remaining Tasks — 2026-02-18 (Post Domain Cutover)

## هدف
لیست به‌روز کارهای باقی‌مانده بعد از اجرای واقعی cutover دامنه روی VPS و sync کامل با GitHub.

## کارهای انجام‌شده در این اجرا
- دامنه production به `alirezasafaeisystems.ir` منتقل شد (DNS/NGINX/ENV).
- گواهی SSL واقعی صادر شد:
  - `alirezasafaeisystems.ir`
  - `www.alirezasafaeisystems.ir`
  - `staging.alirezasafaeisystems.ir`
- HSTS روی edge فعال و با `curl -I` تایید شد.
- `my-portfolio-production` و `my-portfolio-staging` روی PM2 با پورت‌های `3002/3003` پایدار شدند.
- تغییرات کد/ops/documentation با PR #38 روی `main` merge شد.

## باقیمانده‌های P0 (Blocker)
- مورد باز P0 وجود ندارد.

## باقیمانده‌های P1
1. **Rollback Drill رسمی با Incident Note**
   - مالک: DevOps
   - کار اجرایی: rollback واقعی روی VPS با release-id مبدا/مقصد + زمان‌بندی + post-check
   - خروجی: گزارش incident-style قابل ممیزی.

2. **Evidence Bundle نهایی Go/No-Go**
   - مالک: Platform owner
   - کار اجرایی: تجمیع واحد evidence شامل TLS/cert/headers/health/smoke/lighthouse/rollback
   - خروجی: سند single-source برای تصمیم release.

## باقیمانده‌های P2 (Hardening)
3. **Monitoring + Alert ownership**
   - owner: DevOps
   - کار اجرایی: تعریف on-call و escalation برای process down / high restart count.

## Definition of Done (نهایی)
- P0 باز نماند.
- rollback drill رسمی با گزارش incident-style ثبت شود.
- evidence bundle نهایی منتشر شود.

## شواهد مرجع
- `docs/DOMAIN_CUTOVER_ALIREZASAFAEISYSTEMS_IR.md`
- `docs/strategic-execution/runtime/DOMAIN_HEALTH_2026-02-18_VPS.md`
- `scripts/deploy/recover-standalone-runtime.sh`
- `ops/nginx/my-portfolio.conf`
- `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`

## Update 2026-02-18
- readiness contract روی edge بسته شد:
  - `https://alirezasafaeisystems.ir/api/ready` -> `200`
  - `https://www.alirezasafaeisystems.ir/api/ready` -> `200`
  - `https://staging.alirezasafaeisystems.ir/api/ready` -> `200`
- پیاده‌سازی از طریق `nginx` (`location = /api/ready`) انجام شد تا preflight/deploy contract پایدار بماند.
