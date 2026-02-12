# راهنمای میزبانی چندسایته روی یک VPS

## هدف

هماهنگ‌سازی استقرار `persian_tools` و `my_portfolio` روی یک سرور بدون تداخل و آماده‌سازی برای سایت سوم.

## طرح پورت مشترک

- `persian-tools`:
  - production: `3000`
  - staging: `3001`
- `my-portfolio`:
  - production: `3002`
  - staging: `3003`
- رزرو برای سایت سوم:
  - production: `3004`
  - staging: `3005`

## ساختار مسیرها

- `/var/www/persian-tools/...`
- `/var/www/my-portfolio/...`
- برای سایت سوم: `/var/www/<app-slug>/...`

## استقرار استاندارد

1. build و release artifact روی سرور
2. deploy با `ops/deploy/deploy.sh`
3. provision nginx با `scripts/deploy/provision-nginx-site.sh`
4. health-check داخلی روی `127.0.0.1:<port>/api`

## پیش‌نیاز سایت سوم

- پورت‌های `3004/3005` را نگه دارید.
- کانفیگ Nginx و PM2 را با الگوی همین دو پروژه ایجاد کنید.
- قبل از فعال‌سازی TLS، DNS را کامل verify کنید.

## کنترل Cache و Storage

- حجم `releases` و `shared/logs` هر دو پروژه باید دوره‌ای بررسی شود.
- دایرکتوری‌های `.next/cache` فقط داخل release نگه‌داری شوند و با حذف releaseهای قدیمی پاک می‌شوند.
- قبل از هر deploy روی سرور اجرا کنید:

```bash
sudo /var/www/<app>/current/<env>/scripts/deploy/check-hosting-sync.sh --strict
```
