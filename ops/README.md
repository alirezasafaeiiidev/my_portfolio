# راهنمای عملیات (ops)

## پوشه‌ها
- `ops/deploy`: اسکریپت‌های deploy و rollback
- `ops/systemd`: سرویس‌های systemd برای staging/production
- `ops/nginx`: تنظیمات nginx
  - `ops/nginx/my-portfolio.conf`: کانفیگ تکی portfolio
  - `ops/nginx/asdev-cohosting.conf`: کانفیگ یکپارچه portfolio + persiantoolbox

## استقرار
- اسکریپت اصلی: `ops/deploy/deploy.sh`
- Rollback: `ops/deploy/rollback.sh`

## سرویس‌ها
- `my-portfolio-production.service`
- `my-portfolio-staging.service`

## پیش‌نیازها
- node
- pnpm
- pm2
- rsync
- nginx

## مستندات مرتبط
- `docs/VPS_DEPLOYMENT.md`
- `docs/DEPLOYMENT_PRECHECKLIST.md`
- `scripts/deploy/check-hosting-sync.sh`
- `scripts/deploy/validate-cohosting-config.sh`
- `scripts/deploy/backup-onsite.sh` (onsite backup with retention)
- `scripts/deploy/restore-drill-onsite.sh` (backup restore drill)
- `scripts/deploy/install-backup-cron.sh` (install cron schedule for automated backups)
- `scripts/deploy/run-governance-evidence.sh` (run backup+restore drill and write evidence logs)
