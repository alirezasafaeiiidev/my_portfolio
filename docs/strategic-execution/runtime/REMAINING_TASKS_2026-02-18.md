# Remaining Tasks — 2026-02-18 (Governance Refresh)

## هدف
لیست اجراییِ کارهای باقیمانده پس از:
- merge شدن به‌روزرسانی‌های dependency/security
- merge شدن اصلاح CODEOWNERS
- merge شدن automation بکاپ/restore و اسناد governance

## کارهای انجام‌شده تا این لحظه
- دامنه production/staging، TLS و readiness روی VPS پایدار است.
- governance فنی در GitHub به‌روز است (approvals=1, CODEOWNERS required, dismiss stale approvals=true).
- فرم governance نسخه‌دار داخل ریپو ثبت شده:
  - `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_MASTER_FORM_2026-02-18.md`
- evidence pack اضافه شده:
  - `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_EVIDENCE_PACK_2026-02-18.md`
- automation بکاپ/restore اضافه شده:
  - `scripts/deploy/backup-onsite.sh`
  - `scripts/deploy/restore-drill-onsite.sh`
- تایید اپراتوری ثبت شده:
  - Root SSH disabled
  - ArvanCloud 2FA enabled
  - Mobinhost 2FA enabled
- زمان‌بندی بکاپ production روی VPS نصب شد (cron, Asia/Tehran).
- اجرای واقعی backup + restore drill انجام و evidence ثبت شد.
- offsite backup روی Arvan Object Storage فعال شد (remote + first sync + offsite cron).

## Backlog باقیمانده (اجرایی)

1. **SLO/MTTR Policy Decision (P1)**
   - مالک: Product/Platform owner
   - اقدام:
     - تعیین نهایی یکی از دو مسیر:
       - `99.99%` + MTTR بسیار پایین + مانیتورینگ کوتاه‌بازه
       - یا SLO واقع‌گرایانه‌تر با MTTR متناسب
   - خروجی مورد انتظار:
      - فرم governance بدون mismatch

2. **Alert Test Evidence Closure (P2)**
   - مالک: DevOps on-call
   - اقدام:
     - اجرای test سناریوی alert (Telegram + Email)
     - ثبت زمان رسیدن alert و ack
   - خروجی مورد انتظار:
      - Alert Test Performed = Yes
      - ضمیمه evidence در runtime docs

3. **Final Sign-off (P2)**
   - مالک: Release approver
   - اقدام:
     - تکمیل `Reviewed By / Role / Digital Signature` در فرم governance
   - خروجی مورد انتظار:
     - فرم نهایی audit-ready و بدون TODO بحرانی

## Definition of Done
- offsite backup برنامه‌ریزی/پیاده‌سازی شود (یا exception رسمی تاییدشده داشته باشد).
- تصمیم SLO/MTTR رسمی ثبت شود.
- Alert test evidence و sign-off نهایی تکمیل شود.

## اسناد مرجع
- `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_MASTER_FORM_2026-02-18.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_EVIDENCE_PACK_2026-02-18.md`
