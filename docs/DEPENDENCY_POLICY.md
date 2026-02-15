# سیاست مدیریت وابستگی‌ها

## اصول
- هر commit باید lockfile معتبر داشته باشد.
- تغییرات نسخه وابستگی باید همراه با دلیل و تاثیر آن ثبت شود.

## اسکن امنیتی
- حداقل هفته‌ای یکبار audit با سطح High/Critical انجام شود.
- برای CI: اجرای `bun audit` یا `pnpm audit` بر اساس lockfile.

## مدیریت ارتقا
- ابتدا patch، سپس minor و در نهایت major ارتقا داده شود.
- در صورت ارتقا major، تست‌های کامل (lint/typecheck/test/build) باید پاس شوند.

## مستندات مرتبط
- `docs/security/SECURITY_BASELINE.md`
