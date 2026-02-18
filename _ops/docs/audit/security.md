# امنیت

## خط مبنا
- هدرهای امنیتی و CSP در `proxy` اعمال می‌شود.
- rate-limit برای API با memory/redis fallback وجود دارد.
- auth ادمین: token/session با timing-safe compare.
- validation ورودی با zod + sanitize.

## شکاف‌های پیدا شده و اصلاح
1. **ریسک بحرانی**: مسیر `api/messages` بدون auth قابل خواندن/حذف بود.
- اصلاح: افزودن `enforceAdminAccess` در GET/DELETE.
- وضعیت: DONE

2. **ریسک متوسط**: نبود اسکن secrets در CI.
- اصلاح: افزودن `scripts/scan-secrets.sh` + job در `security-audit.yml`.
- وضعیت: DONE

3. **ریسک متوسط**: fallback تولید توکن با `Math.random`.
- اصلاح: استفاده از `crypto.getRandomValues` در تمام مسیرها.
- وضعیت: DONE

4. **ریسک متوسط**: لاگ query دیتابیس در production.
- اصلاح: محدودسازی logging Prisma به `warn/error` در prod.
- وضعیت: DONE

## نگاشت OWASP (خلاصه)
- A01 Broken Access Control: اصلاح دسترسی `api/messages`.
- A02 Cryptographic Failures: حذف fallback ناامن token generation.
- A05 Security Misconfiguration: secret scanning + CI gate.
- A09 Security Logging: logger ساختاریافته + redaction.

## شواهد
- `src/app/api/messages/route.ts:9`
- `scripts/scan-secrets.sh:1`
- `.github/workflows/security-audit.yml:49`
- `src/lib/security.ts:106`
- `src/lib/db.ts:10`
