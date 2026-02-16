# سیاست مدیریت وابستگی‌ها

## اصول
- هر commit باید lockfile معتبر داشته باشد.
- تغییرات نسخه وابستگی باید همراه با دلیل و تاثیر آن ثبت شود.

## اسکن امنیتی
- حداقل هفته‌ای یکبار audit با سطح High/Critical انجام شود.
- برای CI: اجرای `pnpm audit` بر اساس `pnpm-lock.yaml`.

## مدیریت ارتقا
- ابتدا patch، سپس minor و در نهایت major ارتقا داده شود.
- در صورت ارتقا major، تست‌های کامل (lint/typecheck/test/build) باید پاس شوند.

## مستندات مرتبط
- `docs/security/SECURITY_BASELINE.md`
