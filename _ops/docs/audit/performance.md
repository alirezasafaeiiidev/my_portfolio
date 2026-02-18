# کارایی

## وضعیت فعلی
- تنظیمات بهینه‌سازی تصویر، cache-control و compression در `next.config.ts` موجود است.
- build production محلی پاس شده است.
- Lighthouse workflow به‌صورت non-blocking تعریف شده است.

## بهبودهای اعمال‌شده
- کاهش نویز logging در production (Prisma).
- آماده‌سازی readiness endpoint برای orchestration بهتر rollout.

## نکات قابل بهبود بعدی
- تحلیل سایز باندل per-route و enforce budget سختگیرانه.
- ارسال واقعی web-vitals به backend/collector.
- افزودن cache strategy برای endpointهای read-only.

## شواهد
- `next.config.ts:21`
- `next.config.ts:62`
- `src/lib/db.ts:10`
- `src/app/api/ready/route.ts:13`
