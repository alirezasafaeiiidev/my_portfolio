# Deployment Status - 2026-02-17

## Summary
- نسخه جدید `asdev-portfolio` روی VPS دیپلوی شد.
- سرویس `my-portfolio-production` در PM2 آنلاین است.
- اپلیکیشن روی `127.0.0.1:3002` با وضعیت سالم پاسخ می‌دهد.

## Applied Server Changes
- همگام‌سازی سورس و اجرای `ops/deploy/deploy.sh` در محیط production.
- اصلاح `nginx` برای دامنه صحیح:
  - `alirezasafeidev.ir`
  - `www.alirezasafeidev.ir`
- ری‌لود موفق `nginx` و تایید `nginx -t`.

## Current External Blocker
- مشکل بیرونی DNS برای دامنه مشاهده شد (`SERVFAIL` / `NOTAUTH` روی برخی resolverها در زمان بررسی).
- تا زمان تثبیت کامل Zone در DNS provider، صدور SSL جدید برای همین دامنه ممکن است موقتاً fail شود.

## Next Verification Window
- پس از انتشار کامل DNS:
  1. بررسی `A` برای `@` و `www` روی `185.3.124.93`
  2. صدور/تمدید SSL با `certbot`
  3. تست نهایی `https://alirezasafeidev.ir`
