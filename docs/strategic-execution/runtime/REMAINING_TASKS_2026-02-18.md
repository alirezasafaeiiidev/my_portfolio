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
- دیپلوی نهایی production روی release `20260218T225147Z` انجام شد و smoke/healthcheck پاس شد (`POST_DEPLOY_VALIDATION_2026-02-19.md`).

## Backlog باقیمانده (اجرایی)

- مورد بحرانی/عملیاتی باز وجود ندارد.

## Definition of Done
- وضعیت firewall/fail2ban با evidence واقعی ثبت و TODOهای hardening بسته شد.
- evidence pack و فرم governance در حالت کامل و audit-ready هستند.

## اسناد مرجع
- `docs/strategic-execution/ROADMAP_TASKS_PRIORITIZED.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_MASTER_FORM_2026-02-18.md`
- `docs/strategic-execution/runtime/PRODUCTION_GOVERNANCE_EVIDENCE_PACK_2026-02-18.md`
