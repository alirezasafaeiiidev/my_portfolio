# Observability

## اهداف
- ردیابی وضعیت سرویس در محیط production
- قابل پایش بودن خطاها و latency
- تعریف ownership مشخص برای on-call و escalation

## متریک‌ها
- endpoint متریک‌ها: `/api/metrics`
- پیشنهاد: اتصال به Prometheus/Grafana در VPS

## لاگ‌ها
- لاگ‌ها در مسیر `/var/www/my-portfolio/shared/logs/` توسط PM2 ذخیره می‌شوند.
- خطاها و خروجی‌ها در فایل‌های `*.err.log` و `*.out.log` قرار می‌گیرند.

## سلامت سرویس
- health check در deploy/rollback به مسیر `/api/ready` وابسته است.
- برای مانیتورینگ دوره‌ای از workflow زیر استفاده می‌شود:
  - `.github/workflows/slo-monitor.yml`
  - در صورت breach، issue با labelهای `incident` و `slo` به‌صورت خودکار ایجاد می‌شود.
- مالکیت پاسخ‌گویی و escalation:
  - `docs/ONCALL_ESCALATION.md`
