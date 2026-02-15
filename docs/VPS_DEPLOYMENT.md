# استقرار روی VPS (راهنمای عملیاتی)

## پیش‌نیازها
- Ubuntu 22.04+
- نصب ابزارها: `bun`, `pm2`, `rsync`, `nginx`
- دامنه و DNS برای `alirezasafaeidev.ir`

## ساختار مسیرها
- `/var/www/my-portfolio/releases/<env>/<release>`
- `/var/www/my-portfolio/shared/env/<env>.env`
- `/var/www/my-portfolio/shared/logs/`
- `/var/www/my-portfolio/current/<env>`

## مراحل استقرار
1. فایل محیطی را بسازید:
   - `cp .env.example /var/www/my-portfolio/shared/env/production.env`
2. سورس کد را روی VPS قرار دهید (extract در یک مسیر موقت).
3. اجرای deploy:
   - `bash ops/deploy/deploy.sh --env production --source-dir /tmp/release`
4. راه‌اندازی سرویس systemd:
   - `sudo cp ops/systemd/my-portfolio-production.service /etc/systemd/system/`
   - `sudo systemctl daemon-reload`
   - `sudo systemctl enable --now my-portfolio-production`
5. پیکربندی nginx:
   - `sudo cp ops/nginx/my-portfolio.conf /etc/nginx/sites-available/`
   - لینک و reload

## سلامت
- بررسی سلامت: `curl -fsS http://127.0.0.1:3002/api`
- متریک‌ها: `http://127.0.0.1:3002/api/metrics`

## Rollback
- `bash ops/deploy/rollback.sh --env production`

## نکته پایگاه داده
- اگر نیاز به Postgres دارید، `DATABASE_URL` را به URL مربوطه تغییر دهید.
