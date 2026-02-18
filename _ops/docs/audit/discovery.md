# کشف پروژه (Discovery)

## نمای کلی
- پروژه یک اپلیکیشن `Next.js App Router` با `TypeScript` و `Bun` است.
- هسته کد در `src/` قرار دارد و شامل API Routeها، UI، و لایه امنیت/احراز هویت است.
- پایگاه داده با `Prisma + SQLite` پیاده‌سازی شده است.

## اقلام کشف‌شده
- فایل‌های پایه: `package.json`, `bun.lock`, `.env.example`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`
- CI/CD: چند workflow در `.github/workflows/*.yml`
- تست: `vitest`, `playwright`, پوشش و smoke
- اسکریپت‌های عملیاتی: `scripts/verify.sh`, `scripts/audit-high-critical.sh`, `scripts/offline-external-scan.sh`, `scripts/check-slo.sh`
- استقرار: پیش‌تر Dockerfile نداشت؛ در این اجرا `Dockerfile` و `docker-compose.yml` افزوده شد.

## آمار تقریبی کد
- تعداد فایل‌های ردیابی‌شده (بدون `node_modules`, `.next`, `coverage`, `_ops`): حدود `224`
- مجموع خطوط همان دامنه: حدود `35852`

## تغییرات کلیدی انجام‌شده در اجرای خودکار
- سخت‌سازی `api/messages` با الزام احراز هویت ادمین
- افزودن readiness endpoint
- افزودن global error boundary
- افزودن اسکن secrets و گیت CI مربوط
- آماده‌سازی Docker multi-stage و compose

## شواهد
- `package.json:5`
- `package.json:31`
- `src/app/api/messages/route.ts:2`
- `src/app/api/ready/route.ts:1`
- `src/app/error.tsx:1`
- `Dockerfile:1`
- `docker-compose.yml:1`
