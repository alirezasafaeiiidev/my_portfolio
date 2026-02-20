# نقشه اجرایی فوری و عملیاتی ارتقا ASDEV

تاریخ: 2026-02-20
مالک برنامه: `platform-owner`
دامنه: `asdev-portfolio`

## 1) جمع‌بندی تحلیل (Gap Analysis)

بر اساس مستندات ورودی:
- `/tmp/asdev_docs/gov/*`
- `/tmp/asdev_docs/ux/*`
- `/tmp/asdev_docs/strategy/*`
- `/home/dev/Downloads/deep-research-report.md`

و وضعیت فعلی پروژه:
- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `src/components/layout/header.tsx`
- `src/components/sections/hero.tsx`
- `src/components/sections/contact.tsx`
- `src/lib/seo.ts`
- `lighthouserc.json`

شکاف‌های کلیدی:
1. `sitemap` فعلی برای همه URLها `lastModified=now` می‌گذارد و سیگنال SEO ضعیف می‌سازد.
2. ناوبری اصلی hash-based است (`#home`, `#services`) و برای SEO/shareability/landing مناسب نیست.
3. Hero شامل آمار عمومی غیرمستند (`5+`, `50+`...) است و با پیام سازمانی موردنیاز هم‌راستا نیست.
4. Location در تماس هنوز `Remote / Global` است و با موقعیت ایران-اول و برند (`Tehran, IR`) هم‌خوانی کامل ندارد.
5. متادیتا در `layout` هنوز canonical ریشه‌ای (`/`) و مدل locale-based مسیر (`/fa`) ندارد.
6. در Schema، `BlogPosting.inLanguage` ثابت روی `en-US` است.
7. حالت CDN فونت اختیاری وجود دارد؛ با سیاست «کاملا مستقل داخلی» باید در Production قفل شود.
8. ساختار IA صفحه اصلی هنوز کامل مطابق چارچوب سازمانی (Problem Recognition/Trust Signals/Final CTA) نشده است.

## 2) اصول اجرایی غیرقابل مذاکره

1. بدون وابستگی runtime خارجی (فونت/اسکریپت/CDN عمومی).
2. حفظ WCAG AA (کنتراست، فوکوس، کیبورد، semantic structure).
3. تک H1 در هر صفحه و URLهای canonical پایدار.
4. هر تغییر UI فقط token-driven و قابل ردگیری در Design Tokens.
5. هر PR باید شواهد CI داشته باشد: `verify` + `test:e2e:smoke` + `lighthouse:ci`.

## 3) برنامه فوری 72 ساعته (P0)

## P0-1 | پایداری دسترسی خارجی (Ops + Edge)
- هدف: حذف timeoutهای خارجی و تثبیت مسیر Edge→Origin.
- اقدام:
  - بازبینی Whitelist آی‌پی‌های Edge در فایروال Origin.
  - بازبینی WAF/Rate-limit برای false positive.
  - اجرای چک‌های `curl -Iv` و `/api/ready` از چند نقطه.
- خروجی قابل تحویل:
  - گزارش جدید در `docs/runtime/VPS_ACCESS_CHECK_2026-02-20.md`.
- معیار پذیرش:
  - `https://alirezasafaeisystems.ir/` و `/api/ready` پایدار `200`.

## P0-2 | اصلاح IA ناوبری به URL واقعی
- هدف: مهاجرت از hash-first به route-first.
- فایل‌ها:
  - `src/components/layout/header.tsx`
- اقدام:
  - لینک‌های اصلی به مسیرهای واقعی: `/`, `/services`, `/case-studies`, `/qualification`.
  - حفظ اسکرول داخلی فقط به‌عنوان fallback.
- معیار پذیرش:
  - هر آیتم منو URL یکتا داشته باشد و با refresh پایدار بماند.

## P0-3 | بازنویسی Hero برای اعتبار سازمانی
- هدف: جایگزینی آمار عمومی با پیام outcome-driven.
- فایل‌ها:
  - `src/components/sections/hero.tsx`
  - `src/lib/i18n/translations.ts`
- اقدام:
  - حذف stat-grid غیرمستند.
  - افزودن proof chips (بومی‌سازی دیتاسنتر داخلی، سخت‌سازی CI/CD، DR).
  - CTA اصلی: «درخواست ارزیابی ریسک زیرساخت».
- معیار پذیرش:
  - Hero در 3 ثانیه اول پیام «authority + stability + local infrastructure» را منتقل کند.

## P0-4 | اصلاح سیگنال محلی در Contact
- هدف: هم‌راستایی پیام تماس با بازار هدف ایران.
- فایل‌ها:
  - `src/components/sections/contact.tsx`
- اقدام:
  - جایگزینی Location به `تهران / ریموت (سراسر ایران)`.
  - افزودن microcopy اعتماد: NDA، SLA پاسخ اولیه.
- معیار پذیرش:
  - هیچ اشاره `Remote / Global` در صفحه اصلی باقی نماند.

## P0-5 | اصلاح فوری Sitemap
- هدف: رفع `lastModified=now` ثابت.
- فایل‌ها:
  - `src/app/sitemap.ts`
- اقدام:
  - جایگزینی `now` با تاریخ واقعی آخرین تغییر هر مسیر (initial: ثابت دستی دقیق، سپس اتوماسیون در P1).
- معیار پذیرش:
  - تست sitemap سبز بماند و `lastModified` واقعی باشد.

## 4) برنامه هفته اول (P1)

## P1-1 | آغاز مسیر Locale استاندارد (`/fa` محور)
- فایل‌ها:
  - `src/middleware.ts` (جدید)
  - `src/app/[lang]/*` (فازبندی)
- اقدام:
  - مسیر پیش‌فرض به `/fa`.
  - آماده‌سازی مسیر `/en` برای rollout بعدی.
- معیار پذیرش:
  - canonical/hreflang قابل تولید بر مبنای locale route.

## P1-2 | بازطراحی Metadata بر اساس locale
- فایل‌ها:
  - `src/app/layout.tsx`
  - `src/app/[lang]/layout.tsx` (در صورت اعمال P1-1)
- اقدام:
  - `generateMetadata` پویا.
  - canonical/self-reference برای هر locale.
  - alternates languages (`fa-IR`, `en-US`).

## P1-3 | اصلاح Schema زبان محتوا
- فایل‌ها:
  - `src/lib/seo.ts`
- اقدام:
  - پارامتریک کردن `inLanguage` در `generateBlogPostSchema`.
- معیار پذیرش:
  - محتوای فارسی با `fa-IR` منتشر شود.

## P1-4 | هم‌راستاسازی LHCI با مسیرهای اصلی جدید
- فایل‌ها:
  - `lighthouserc.json`
- اقدام:
  - افزودن URLهای مسیر نهایی (در صورت فعال شدن `/fa`: مسیرهای locale).

## 5) برنامه هفته دوم تا چهارم (P2)

## P2-1 | حاکمیت Design Tokens (Enterprise)
- فایل‌ها:
  - `src/app/globals.css`
  - `docs/` (سند Token Registry)
- اقدام:
  - ایجاد نگاشت رسمی توکن‌های رنگ/spacing/type به استاندارد سازمانی.
  - ممنوعیت hard-coded color خارج از token.

## P2-2 | چرخه عمر کامپوننت‌ها
- فایل‌ها:
  - `docs/COMPONENT_LIFECYCLE.md` (جدید)
- اقدام:
  - تعریف version/changelog/accessibility check برای Button/Card/Form/Nav.
  - الزام Visual Regression برای تغییرات UI حساس.

## P2-3 | A11y Gate خودکار در E2E
- فایل‌ها:
  - `e2e/a11y.spec.ts` (جدید)
  - `package.json`
- اقدام:
  - افزودن `@axe-core/playwright` و تست golden path.
- معیار پذیرش:
  - عدم violation بحرانی در صفحه اصلی و Qualification.

## P2-4 | فرم Qualification دو مرحله‌ای
- فایل‌ها:
  - `src/components/sections/infrastructure-lead-form.tsx`
- اقدام:
  - Step 1 اطلاعات پایه، Step 2 جزئیات فنی.
  - حفظ draft در localStorage.
- معیار پذیرش:
  - افزایش completion rate نسبت به baseline.

## 6) بک‌لاگ اجرایی با اولویت

| اولویت | کار | مالک | برآورد | وابستگی |
|---|---|---|---|---|
| P0 | پایداری Edge/Origin و رفع timeout | DevOps | 0.5 روز | دسترسی پنل/فایروال |
| P0 | مهاجرت منو به Route واقعی | FE | 0.5 روز | - |
| P0 | بازنویسی Hero سازمانی | FE + Product | 1 روز | تایید پیام نهایی |
| P0 | اصلاح Contact و trust microcopy | FE | 0.25 روز | - |
| P0 | اصلاح فوری sitemap lastModified | FE | 0.5 روز | - |
| P1 | middleware + locale routes | FE | 1.5 روز | بازنگری مسیرها |
| P1 | metadata locale-aware | FE + SEO | 1 روز | P1-1 |
| P1 | schema inLanguage | FE | 0.25 روز | - |
| P1 | update LHCI routes | FE | 0.25 روز | P1-1 |
| P2 | token governance docs + enforce | FE Lead | 1 روز | - |
| P2 | a11y gate (axe) | QA/FE | 0.5 روز | - |
| P2 | فرم 2-step qualification | FE + Product | 1.5 روز | baseline metrics |

## 7) Definition of Done برای هر آیتم

1. PR کوچک و اتمیک (یک هدف مشخص).
2. CI سبز: `pnpm run verify`.
3. در تغییرات مسیر/UX: `pnpm run lighthouse:ci`.
4. در تغییرات UX حساس: evidence تصویری قبل/بعد در `docs/runtime/`.
5. به‌روزرسانی مستندات مرتبط در همان PR.

## 8) توالی اجرای پیشنهادی (فردا صبح قابل شروع)

1. اجرای `P0-1` (Ops) و ثبت evidence.
2. اجرای `P0-2` و `P0-4` در یک PR UX سریع.
3. اجرای `P0-3` در PR مستقل برای کپی و ساختار Hero.
4. اجرای `P0-5` در PR SEO کوچک.
5. سپس ورود به `P1-1` و `P1-2` به‌عنوان محور معماری مسیرها.

## 9) فرمان‌های کنترلی استاندارد پس از هر PR

```bash
pnpm run lint
pnpm run type-check
pnpm run test
pnpm run test:e2e:smoke
pnpm run lighthouse:ci
```

برای PRهای ops/release:

```bash
pnpm run verify
SITE_URL=https://alirezasafaeisystems.ir STAGING_URL=https://staging.alirezasafaeisystems.ir bash scripts/release/generate-go-no-go-evidence.sh
```
