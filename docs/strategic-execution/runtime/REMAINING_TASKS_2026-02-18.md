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

1. **Offsite Restore Drill from Object Storage (P1)**
   - مالک: DevOps on-call
   - اقدام:
     - بازیابی مستقیم از Arvan Object Storage به مسیر تست
     - اجرای `sha256` validation و readiness check بعد از restore
   - خروجی مورد انتظار:
     - DR evidence کامل با لاگ و timestamp

2. **SSH Hardening Closure Evidence (P1)**
   - مالک: Platform owner
   - اقدام:
     - ثبت خروجی واقعی `sshd_config` برای `PasswordAuthentication no`
     - ثبت وضعیت firewall/fail2ban در فرم governance
   - خروجی مورد انتظار:
     - حذف TODOهای hardening در فرم

3. **Security Ops Cadence Finalization (P2)**
   - مالک: Technical owner
   - اقدام:
     - تعیین دوره چرخش secrets (مثلا هر 90 روز) و ثبت در فرم
   - خروجی مورد انتظار:
     - بخش امنیت بدون TODO عملیاتی

## Definition of Done
- offsite restore drill از object storage با موفقیت ثبت شود.
- TODOهای امنیتی بحرانی فرم (SSH auth/firewall/fail2ban/secrets rotation) بسته شوند.
- evidence pack و فرم governance در حالت کامل و audit-ready باقی بمانند.

## اسناد مرجع
- `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_MASTER_FORM_2026-02-18.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_EVIDENCE_PACK_2026-02-18.md`
