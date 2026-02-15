# راهنمای عملیات (ops)

## پوشه‌ها
- `ops/deploy`: اسکریپت‌های deploy و rollback
- `ops/systemd`: سرویس‌های systemd برای staging/production
- `ops/nginx`: تنظیمات nginx

## استقرار
- اسکریپت اصلی: `ops/deploy/deploy.sh`
- Rollback: `ops/deploy/rollback.sh`

## سرویس‌ها
- `my-portfolio-production.service`
- `my-portfolio-staging.service`

## پیش‌نیازها
- bun
- pm2
- rsync
- nginx

## مستندات مرتبط
- `docs/VPS_DEPLOYMENT.md`
- `docs/DEPLOYMENT_PRECHECKLIST.md`
