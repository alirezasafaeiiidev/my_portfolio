# DevOps و استقرار

## وضعیت قبل از اجرا
- Dockerfile/compose موجود نبود.
- ابزارهای اسکریپتی deploy وجود داشتند اما artifact کانتینری نهایی آماده نبود.

## خروجی اجرا
- `Dockerfile` چندمرحله‌ای با:
  - builder و runner جدا
  - کاربر non-root
  - healthcheck
  - تولید Prisma client قبل build
- `docker-compose.yml` آفلاین/محلی با healthcheck
- `.nvmrc` برای همگرایی runtime محلی

## نتیجه عملیاتی
- `docker build -t asdev-portfolio:local .` موفق اجرا شد.
- خطاهای موقت شبکه/timeout در لاگ ثبت و مدیریت شدند.

## ملاحظات
- در تصمیم نهایی معماری، مسیر اصلی پروژه `local-first` است و Docker فقط artifact اختیاری برای portability است.
- بنابراین enforce سخت lockfile در Docker برای مسیر اصلی اجرا `SKIPPED` شد.

## شواهد
- `Dockerfile:1`
- `Dockerfile:9`
- `Dockerfile:31`
- `docker-compose.yml:1`
- `_ops/logs/actions.log:1`

## به‌روزرسانی Co-Hosting (Portfolio + PersianToolbox)
- بر اساس مخزن `asdev-persiantoolbox`، پورت‌های رزرو شده آن سرویس `3000/3001` هستند.
- برای portfolio پورت‌های `3002/3003` تثبیت شدند تا تداخل صفر باشد.
- اسکریپت `scripts/deploy/check-hosting-sync.sh` با دامنه‌ها/پورت‌های واقعی هر دو سرویس به‌روزرسانی شد.

### شواهد
- `_ops/external/asdev-persiantoolbox/ops/nginx/persian-tools.conf:6`
- `_ops/external/asdev-persiantoolbox/ops/nginx/persian-tools.conf:11`
- `scripts/deploy/check-hosting-sync.sh:38`
