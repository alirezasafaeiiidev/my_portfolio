# برنامه Co-Hosting روی یک VPS (Portfolio + PersianToolbox)

## هدف
استقرار `asdev-portfolio` در کنار `persiantoolbox.ir` روی یک VPS ایرانی بدون تداخل پورت، با رعایت local-first و ملاحظات تحریم/فیلترینگ.

## توپولوژی نهایی
- PersianToolbox:
  - Production: `127.0.0.1:3000`
  - Staging: `127.0.0.1:3001`
- Portfolio:
  - Production: `127.0.0.1:3002`
  - Staging: `127.0.0.1:3003`

## شواهد منبع PersianToolbox
- `_ops/external/asdev-persiantoolbox/ops/nginx/persian-tools.conf:6`
- `_ops/external/asdev-persiantoolbox/ops/nginx/persian-tools.conf:11`
- `_ops/external/asdev-persiantoolbox/ops/nginx/persian-tools.conf:18`
- `_ops/external/asdev-persiantoolbox/ops/nginx/persian-tools.conf:36`
- `_ops/external/asdev-persiantoolbox/ops/deploy/deploy.sh:113`

## تغییرات اعمال‌شده در Portfolio
- اسکریپت همگام‌سازی میزبانی مشترک:
  - `scripts/deploy/check-hosting-sync.sh`
- راهنمای استقرار VPS با Co-Hosting:
  - `docs/VPS_DEPLOYMENT.md`

## چک‌لیست اجرا روی سرور
1. هم‌زمانی پورت/دامنه:
- `bash scripts/deploy/check-hosting-sync.sh --strict`

2. قبل از deploy:
- `bun run lint`
- `bun run type-check`
- `bun run test`
- `bun run build`

3. بعد از deploy portfolio:
- `curl -fsS http://127.0.0.1:3002/api`
- `curl -fsS http://127.0.0.1:3002/api/ready`

4. تایید edge:
- TLS معتبر روی هر دو دامنه
- HSTS در لایه edge/nginx
- عدم اختلال سرویس `persiantoolbox.ir`

## نکته ایران/تحریم
- مسیر اصلی deploy باید local-first باشد و وابستگی runtime خارجی نداشته باشد.
- pull وابستگی‌های خارجی در لحظه بحران/انتشار به حداقل برسد.

## Artifactهای جدید برای اجرای فوری
- کانفیگ یکپارچه Nginx:
  - `ops/nginx/asdev-cohosting.conf`
- اسکریپت اعتبارسنجی contract کانفیگ:
  - `scripts/deploy/validate-cohosting-config.sh`

## نتیجه اعتبارسنجی
- `bash scripts/deploy/validate-cohosting-config.sh` -> PASS
