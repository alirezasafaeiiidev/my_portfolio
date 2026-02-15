# خط‌مشی امنیت پایه (Portfolio)

## دامنه
این سند حداقل‌های امنیتی برای محیط‌های staging/production را مشخص می‌کند.

## مدیریت اسرار (Secrets)
- اسرار فقط در فایل محیطی سرور نگهداری شوند: `/var/www/my-portfolio/shared/env/<environment>.env`.
- از ذخیره secrets در کد، `docs/`, و logها خودداری شود.
- در صورت افشای احتمالی، بلافاصله rotate انجام شود.

## کنترل دسترسی مدیر
- مقادیر `ADMIN_*` باید طول مناسب داشته باشند.
- `ADMIN_API_TOKEN` حداقل 16 کاراکتر.
- `ADMIN_SESSION_SECRET` حداقل 32 کاراکتر.

## Rate Limiting
- مقادیر پیش‌فرض برای `API_RATE_LIMIT_*` در `.env.example` تنظیم شده است.
- برای محیط production مقادیر مناسب با ترافیک واقعی تنظیم شود.

## Dependency Policy (خلاصه)
- نسخه‌ها از طریق lockfile مدیریت می‌شوند.
- اسکن وابستگی‌ها حداقل برای سطح High/Critical اجرا شود.

## ثبت و پایش
- لاگ‌ها در مسیر `/var/www/my-portfolio/shared/logs/` قرار می‌گیرند.
- endpoint مانیتورینگ: `/api/metrics`

## منابع مرتبط
- `docs/DEPENDENCY_POLICY.md`
- `docs/VPS_DEPLOYMENT.md`
