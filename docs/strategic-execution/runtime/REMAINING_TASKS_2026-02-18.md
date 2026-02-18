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
- offsite restore drill از Arvan Object Storage اجرا شد (sha256 + extract + readiness 200).
- cadence چرخش secrets در فرم governance نهایی شد (هر 90 روز).

## Backlog باقیمانده (اجرایی)

1. **SSH Access Recovery to Non-root Operator Path (P0)**
   - مالک: Platform owner
   - اقدام:
     - اضافه کردن کلید عمومی اپراتور به `~deploy/.ssh/authorized_keys` از طریق Mobinhost console
     - تست ورود `ssh deploy@185.3.124.93`
   - خروجی مورد انتظار:
     - بازیابی دسترسی عملیاتی key-based بدون root/password

2. **Firewall/Fail2Ban Verification Closure (P1)**
   - مالک: DevOps on-call
   - اقدام:
     - ثبت خروجی واقعی `ufw status verbose`
     - ثبت خروجی واقعی `fail2ban-client status` و `fail2ban-client status sshd`
     - به‌روزرسانی چک‌باکس‌های فرم governance
   - خروجی مورد انتظار:
     - حذف TODOهای hardening باقی‌مانده در فرم

## Definition of Done
- دسترسی deploy key-based از ورک‌استیشن اپراتور تایید شود.
- وضعیت firewall/fail2ban با evidence واقعی ثبت و TODOهای hardening بسته شوند.
- evidence pack و فرم governance در حالت کامل و audit-ready باقی بمانند.

## اسناد مرجع
- `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_MASTER_FORM_2026-02-18.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_EVIDENCE_PACK_2026-02-18.md`
