# Runbook (fa-IR)

## نصب و اجرا
- نصب: `pnpm install`
- توسعه: `pnpm dev`
- بیلد: `pnpm build`
- اجرا (prod): `pnpm start`
- وریفای: `pnpm run verify`

## درگاه دیپلوی (Deploy Gate)
- اسکریپت: `scripts/deploy-gate.mjs` (اجرای مستقیم با `node`).
- منطق: شکست اگر هر تسک P0 یا P1 در `TASKS.md` وضعیت غیر ✅ دارد.
- خروجی باید non-zero باشد و پیام فارسی/انگلیسی کوتاه چاپ کند.
- در CI: جاب `deploy-gate` پیش از هر دیپلوی اجرا می‌شود.

## PWA / آفلاین
- Service Worker در محیط production روی `/sw.js` ثبت می‌شود (از طریق `ServiceWorkerProvider` در `src/app/layout.tsx`).
- صفحه fallback آفلاین: `/offline`.
- بنر بروزرسانی با پیام `SKIP_WAITING` فعال می‌شود و پس از فعال‌سازی SW صفحه ریلود می‌گردد.

## تست‌ها و چک‌ها
- هر نوبت کار: `pnpm run lint && pnpm run test && pnpm run build`.
- e2e: فقط زمانی که مسیر/فرم/SEO حساس تغییر کرد یا هر ۵ تسک.
- Lighthouse CI: در پایان هر فاز یا تغییر مهم عملکرد/SEO.

## عملیات TLS و مالکیت تمدید گواهی
- مالک: DevOps
- روش استاندارد: `certbot` با `systemd timer`
- بررسی وضعیت:
  - `sudo systemctl status certbot.timer`
  - `sudo systemctl list-timers | grep certbot`
- تست دوره‌ای تمدید (بدون تغییر واقعی):
  - `sudo certbot renew --dry-run`
- پس از هر تغییر DNS یا Nginx:
  - `sudo nginx -t && sudo systemctl reload nginx`
  - بررسی هدر HSTS و وضعیت HTTPS با `curl -I https://<domain>`
  - یا اجرای یکجا: `bash scripts/deploy/verify-public-edge.sh <domain> <expected-ip>`

## VPS Preflight
- اجرای محلی (غیر سخت‌گیر): `bash scripts/vps-preflight.sh`
  - اگر `pm2` یا `nginx` در محیط فعلی نصب نباشد، اسکریپت با warning عبور می‌کند.
- اجرای سخت‌گیر روی VPS (الزامی قبل از deploy):
  - `VPS_PREFLIGHT_STRICT=1 bash scripts/vps-preflight.sh`
  - در این حالت نبود هر وابستگی لازم باعث شکست می‌شود.

## Rollback Drill
- مسیر اجرا: `bash ops/deploy/rollback.sh --env production`
- معیار قبولی:
  - سرویس روی release قبلی بالا بیاید.
  - `GET /api/ready` پاسخ سالم بدهد.
  - خطاهای PM2/Nginx مشاهده نشود.
- لاگ اجرای خودکار فعلی: `docs/DEPLOYMENT_AUTORUN_2026-02-17.md`
- برای بستن کامل Drill باید یک اجرای واقعی روی VPS با تاریخ ثبت شود.

## ارجاع پایش (Uptime / Error Budget)
- health داخلی: `http://127.0.0.1:3002/api/ready`
- metrics داخلی: `http://127.0.0.1:3002/api/metrics`
- لاگ‌ها: `/var/www/my-portfolio/shared/logs/`
- داشبورد پیشنهادی:
  - Uptime probe روی `https://alirezasafeidev.ir`
  - نرخ خطا و latency از endpoint متریک‌ها
  - SLO چک دوره‌ای با `scripts/check-slo.sh`

## مشکل رایج
- نبود `middleware.ts` باعث غیرفعال بودن CSP و nonce است؛ پس از افزودن، هدرها باید با `next.config.ts` سازگار باشند.
- اگر `deploy-gate` قرمز شد، ابتدا وضعیت P0/P1 در `TASKS.md` را بررسی کنید.
