# Deployment Status - 2026-02-17

## Summary
- نسخه جدید `asdev-portfolio` روی VPS دیپلوی شد.
- سرویس `my-portfolio-production` در PM2 آنلاین است.
- اپلیکیشن روی `127.0.0.1:3002` با وضعیت سالم پاسخ می‌دهد.
- چک‌های عمومی edge برای `alirezasafeidev.ir` و `persiantoolbox.ir` پاس هستند (redirect + HTTPS + HSTS).
- `certbot renew --dry-run` روی VPS با موفقیت اجرا شد.

## Applied Server Changes
- همگام‌سازی سورس و اجرای `ops/deploy/deploy.sh` در محیط production.
- اصلاح `nginx` برای دامنه صحیح:
  - `alirezasafeidev.ir`
  - `www.alirezasafeidev.ir`
- ری‌لود موفق `nginx` و تایید `nginx -t`.

## Current External Blocker
- بلوکر فعال باقی نمانده است. DNS/TLS عمومی برای دامنه‌های production در snapshot نهایی 2026-02-17 سبز است.

## Next Verification Window
- نگه‌داری دوره‌ای:
  1. اجرای دوره‌ای `certbot renew --dry-run`
  2. اجرای دوره‌ای `bash scripts/deploy/verify-public-edge.sh <domain>`
  3. اجرای preflight سخت‌گیر قبل از هر انتشار: `VPS_PREFLIGHT_STRICT=1 bash scripts/vps-preflight.sh`
