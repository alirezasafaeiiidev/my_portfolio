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
1. **تایید کامل دامنه هم‌میزبان (`persiantoolbox.ir`)**
   - مالک: DevOps
   - کار اجرایی: TLS/header/health snapshot نهایی روی `persiantoolbox.ir` و `staging.persiantoolbox.ir`
   - وضعیت فعلی: در این اجرا تمرکز روی cutover دامنه portfolio بود.

2. **Production secret rotation (سخت‌گیری امنیتی)**
   - مالک: Platform owner
   - کار اجرایی: چرخش توکن‌های حساس production و ثبت owner/date
   - وضعیت فعلی: env عملیاتی فعال است ولی rotation رسمی هنوز ثبت نشده است.

## باقیمانده‌های P1
3. **Rollback Drill رسمی با Incident Note**
   - مالک: DevOps
   - کار اجرایی: rollback واقعی روی VPS با release-id مبدا/مقصد + زمان‌بندی + post-check
   - خروجی: گزارش incident-style قابل ممیزی.

4. **Evidence Bundle نهایی Go/No-Go**
   - مالک: Platform owner
   - کار اجرایی: تجمیع واحد evidence شامل TLS/cert/headers/health/smoke/lighthouse/rollback
   - خروجی: سند single-source برای تصمیم release.

## باقیمانده‌های P2 (Hardening)
5. **Auto-heal برای release خراب**
   - owner: DevOps
   - کار اجرایی: اسکریپت fallback خودکار به last-known-good release در صورت نبود `.next/standalone/server.js`.

6. **Monitoring + Alert ownership**
   - owner: DevOps
   - کار اجرایی: تعریف on-call و escalation برای process down / high restart count.

## Definition of Done (نهایی)
- P0ها بسته شوند (به‌خصوص co-hosted domain verification + secret rotation).
- rollback drill رسمی با گزارش incident-style ثبت شود.
- evidence bundle نهایی منتشر شود.

## شواهد مرجع
- `docs/DOMAIN_CUTOVER_ALIREZASAFAEISYSTEMS_IR.md`
- `ops/nginx/my-portfolio.conf`
- `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`
