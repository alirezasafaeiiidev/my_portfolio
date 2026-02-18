# Observability

## اهداف
- ردیابی وضعیت سرویس در محیط production
- قابل پایش بودن خطاها و latency

## متریک‌ها
- endpoint متریک‌ها: `/api/metrics`
- پیشنهاد: اتصال به Prometheus/Grafana در VPS

## لاگ‌ها
- لاگ‌ها در مسیر `/var/www/my-portfolio/shared/logs/` توسط PM2 ذخیره می‌شوند.
- خطاها و خروجی‌ها در فایل‌های `*.err.log` و `*.out.log` قرار می‌گیرند.

## سلامت سرویس
- health check در اسکریپت deploy به مسیر `/api` وابسته است.
- در صورت تغییر مسیر، فایل `ops/deploy/deploy.sh` باید به‌روزرسانی شود.
