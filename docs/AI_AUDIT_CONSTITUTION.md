# AI Audit Constitution
## قانون اساسی بازرسی هوش مصنوعی

---

## English

### Purpose
This document explains how AI audits are conducted on this project, ensuring consistent quality, local-first behavior, and proper documentation.

### Audit Rules
1. **Local-First Priority**: All changes must work offline or have documented fallbacks
2. **Evidence-Based**: Every claim requires file path + snippet or command output
3. **Documentation-First**: Update docs before, during, and after changes
4. **Verification Required**: Run `scripts/verify.sh` before any push

### Audit Process
1. Read project constitution (`.windsurf/rules/00-project-constitution.md`)
2. Establish baseline (`bun install && scripts/verify.sh`)
3. Scan for external dependencies
4. Review UI/UX, accessibility, SEO
5. Implement fixes with tests
6. Update all documentation
7. Final verification
8. Commit and push

### Required Documentation
- `docs/audit/REPORT_FA.md` - Living audit report in Persian
- `CHANGELOG.md` - User-facing changes
- `worklog.md` - Milestones and progress

---

## فارسی (Persian)

### هدف
این سند نحوه انجام بازرسی‌های هوش مصنوعی را در این پروژه توضیح می‌دهد تا کیفیت یکسان، رفتار آفلاین‌محور و مستندسازی مناسب تضمین شود.

### قوانین بازرسی
۱. **اولویت آفلاین**: تمام تغییرات باید آفلاین کار کنند یا دارای بازگشتی مستند باشند
۲. **مبتنی بر شواهد**: هر ادعا نیاز به مسیر فایل + قطعه کد یا خروجی دستور دارد
۳. **اولویت مستندسازی**: به‌روزرسانی مستندات قبل، حین و بعد از تغییرات
۴. **نیاز به تأیید**: اجرای `scripts/verify.sh` قبل از هر push

### فرآیند بازرسی
۱. خواندن قانون اساسی پروژه
۲. برقراری خط پایه
۳. اسکن وابستگی‌های خارجی
۴. بررسی UI/UX، دسترسی‌پذیری، SEO
۵. پیاده‌سازی اصلاحات با تست
۶. به‌روزرسانی تمام مستندات
۷. تأییدیه نهایی
۸. commit و push

### مستندات مورد نیاز
- `docs/audit/REPORT_FA.md` - گزارش زنده بازرسی به فارسی
- `CHANGELOG.md` - تغییرات قابل مشاهده کاربر
- `worklog.md` - نقاط عطف و پیشرفت

---

**Last Updated**: 2025-02-07
