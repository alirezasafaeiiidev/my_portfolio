# چک‌لیست Pre-Deploy سرور (Production)

این چک‌لیست برای آخرین گام قبل از دیپلوی روی سرور است.

## وضعیت فعلی کد (آماده)

- [x] `bun run lint`
- [x] `bun run type-check`
- [x] `bun run test`
- [x] `bun run build`
- [x] `bash scripts/offline-external-scan.sh`
- [x] `bash scripts/verify.sh`
- [x] Release منتشر شده: `v1.1.1`

## اقدامات الزامی روی سرور (قبل از بالا آوردن سرویس)

### 1) Runtime و دسترسی
- [ ] Node/Bun روی سرور نصب و نسخه پایدار تایید شود.
- [ ] مسیر اپلیکیشن و کاربر سرویس (non-root) مشخص شود.
- [ ] مسیر persistent برای دیتابیس SQLite تعیین شود.

### 2) تنظیم env production
- [ ] فایل env از `.env.example` ساخته شود.
- [ ] `NEXT_PUBLIC_SITE_URL` روی دامنه واقعی production تنظیم شود.
- [ ] `DATABASE_URL` به مسیر پایدار سرور اشاره کند.
- [ ] `ADMIN_SESSION_SECRET` و `ADMIN_API_TOKEN` با مقادیر قوی تنظیم شوند.
- [ ] telemetry پیش‌فرض خاموش بماند: `NEXT_PUBLIC_ENABLE_ANALYTICS=false`.

نمونه:
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-real-domain.example
NEXT_PUBLIC_ENABLE_ANALYTICS=false
DATABASE_URL=file:/var/lib/my_portfolio/custom.db
ADMIN_API_TOKEN=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

### 3) Build و start
- [ ] `bun install --frozen-lockfile`
- [ ] `bun run db:generate`
- [ ] `bun run build`
- [ ] سرویس با `bun run start` (یا unit سرویس systemd/pm2) بالا بیاید.

### 4) شبکه و امنیت
- [ ] reverse proxy (Nginx/Caddy) روی دامنه production تنظیم شود.
- [ ] SSL/TLS فعال و معتبر باشد.
- [ ] دسترسی مستقیم پورت اپ از بیرون محدود شود.
- [ ] health endpoint `/api` از بیرون پاسخ `healthy` بدهد.

### 5) smoke test پس از deploy
- [ ] `GET /` پاسخ 200
- [ ] `GET /api` پاسخ healthy
- [ ] `/admin` برای کاربر لاگ‌اوت به `/admin/login` ریدایرکت شود.
- [ ] هیچ خطای runtime در لاگ سرویس مشاهده نشود.

## معیار Go/No-Go

Go فقط وقتی مجاز است که تمام آیتم‌های بخش «اقدامات الزامی روی سرور» تیک خورده باشند.
