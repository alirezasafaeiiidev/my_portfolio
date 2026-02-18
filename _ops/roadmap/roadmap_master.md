# نقشه‌راه اصلی (فازی، بدون تاریخ)

## اصول اجرا
- هر تسک فقط به یک فاز تخصیص دارد.
- ترتیب اجرا ثابت است و رعایت شده است: 1 -> 2 -> 3 -> 4 -> 5.
- اگر تسک blocked شود، دلیل ثبت می‌شود و اجرای فاز ادامه می‌یابد.

## Phase 1 — امنیت پایه (Baseline Security)
### Milestone: سخت‌سازی دسترسی و زنجیره تامین
1. تسک P1-T1 (DONE)
- هدف: بستن دسترسی غیرمجاز به endpoint پیام‌ها
- گام‌ها: افزودن `enforceAdminAccess` به GET/DELETE در `api/messages`
- معیار پذیرش: بدون credential معتبر، پاسخ 401/503؛ با token معتبر، 200
- نقش‌ها: Backend, Security, QA
- ریسک: High

2. تسک P1-T2 (DONE)
- هدف: افزودن policy اسکن secrets
- گام‌ها: ایجاد `scripts/scan-secrets.sh` و افزودن job CI
- معیار پذیرش: اجرای `bun run scan:secrets` در pipeline امنیت
- نقش‌ها: Security, DevOps/SRE
- ریسک: Medium

3. تسک P1-T3 (DONE)
- هدف: بهبود امنیت تولید توکن
- گام‌ها: حذف fallback ناامن در `generateSecureToken`
- معیار پذیرش: استفاده از CSPRNG در runtime
- نقش‌ها: Backend, Security
- ریسک: Medium

4. تسک P1-T4 (DONE)
- هدف: همگرایی نسخه runtime در CI
- گام‌ها: یکسان‌سازی Bun در workflowها
- معیار پذیرش: workflowها روی Bun 1.3.9 اجرا شوند
- نقش‌ها: DevOps/SRE
- ریسک: Low

## Phase 2 — تست (Testing)
### Milestone: پوشش baseline و gate عملیاتی
1. تسک P2-T1 (DONE)
- هدف: تثبیت strategy پوشش
- گام‌ها: تأیید thresholds موجود Vitest و حفظ gate coverage
- معیار پذیرش: threshold فعال و test:coverage در CI
- نقش‌ها: QA, Backend
- ریسک: Low

2. تسک P2-T2 (DONE)
- هدف: افزودن تست امنیت endpoint پیام‌ها
- گام‌ها: ساخت `messages.integration.test.ts`
- معیار پذیرش: تست عدم دسترسی بدون auth + دسترسی با bearer
- نقش‌ها: QA, Backend, Security
- ریسک: Medium

3. تسک P2-T3 (DONE)
- هدف: افزودن تست readiness
- گام‌ها: ساخت `ready.integration.test.ts`
- معیار پذیرش: سناریوی موفق/ناموفق DB تست شود
- نقش‌ها: QA, Backend
- ریسک: Low

4. تسک P2-T4 (DONE)
- هدف: پاس کامل lint/typecheck/test/build
- گام‌ها: اجرای محلی گیت‌ها و ثبت در actions.log
- معیار پذیرش: همه گیت‌ها PASS
- نقش‌ها: QA, DevOps/SRE
- ریسک: Low

## Phase 3 — کارایی / Observability (Performance & Observability)
### Milestone: خط مبنای پایش و مقاومت
1. تسک P3-T1 (DONE)
- هدف: readiness عملیاتی
- گام‌ها: افزودن `/api/ready` با DB check
- معیار پذیرش: status 200/503 بر اساس وضعیت DB
- نقش‌ها: Backend, DevOps/SRE
- ریسک: Medium

2. تسک P3-T2 (DONE)
- هدف: behavior بهتر در خطاهای runtime
- گام‌ها: افزودن `src/app/error.tsx`
- معیار پذیرش: خطاهای سراسری با UI fallback مدیریت شود
- نقش‌ها: Frontend, Backend
- ریسک: Low

3. تسک P3-T3 (DONE)
- هدف: کاهش نویز/ریسک logging در production
- گام‌ها: اصلاح logger و Prisma log policy
- معیار پذیرش: info/debug روی log عادی؛ query log در prod غیرفعال
- نقش‌ها: Backend, DevOps/SRE
- ریسک: Low

## Phase 4 — معماری / استانداردسازی (Architecture & Standardization)
### Milestone: یکپارچگی قراردادها
1. تسک P4-T1 (DONE)
- هدف: استانداردسازی قراردادهای runtime
- گام‌ها: تعریف `packageManager` و `engines` و `.nvmrc`
- معیار پذیرش: نسخه runtime در repository مشخص باشد
- نقش‌ها: Architect, DevOps/SRE
- ریسک: Low

2. تسک P4-T2 (DONE)
- هدف: هم‌راستاسازی اسناد معماری/امنیت/کیفیت
- گام‌ها: تکمیل اسناد audit با evidence
- معیار پذیرش: پوشش کامل حوزه‌های امنیت، تست، کارایی، DevOps
- نقش‌ها: Architect, Product/UX
- ریسک: Low

## Phase 5 — تحویل / انتشار (Delivery & Release)
### Milestone: artifact قابل استقرار
1. تسک P5-T1 (DONE)
- هدف: کانتینرسازی production-ready
- گام‌ها: Dockerfile multi-stage + non-root + healthcheck + prisma generate
- معیار پذیرش: `docker build` موفق
- نقش‌ها: DevOps/SRE, Backend
- ریسک: Medium

2. تسک P5-T2 (DONE)
- هدف: اجرای محلی با compose
- گام‌ها: افزودن `docker-compose.yml`
- معیار پذیرش: compose دارای port/env/healthcheck باشد
- نقش‌ها: DevOps/SRE
- ریسک: Low

3. تسک P5-T3 (SKIPPED)
- هدف: enforce کامل lockfile frozen در Docker
- گام‌ها: sync lockfile با `bun install --lockfile-only`
- معیار پذیرش: `bun install --frozen-lockfile` بدون تغییر lockfile پاس شود
- نقش‌ها: DevOps/SRE
- ریسک: Medium
- دلیل Skip: در تصمیم معماری `local-first`، Docker مسیر اختیاری است و gate سخت‌گیرانه lockfile برای مسیر اصلی اجرای محلی لازم نیست.
