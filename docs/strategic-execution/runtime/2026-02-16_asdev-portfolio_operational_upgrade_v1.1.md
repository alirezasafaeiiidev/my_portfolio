# ASDEV Portfolio — سند عملیاتی ارتقا برای تبدیل سایت به ماشین جذب کارفرما
نسخه 1.1 (Operational) — بدون زمان‌بندی، مرحله‌ای

---

## 1) هدف (Goals)
این سند هدف دارد پورتفولیو ASDEV را به یک سیستم جذب کارفرما تبدیل کند که:
- پیام و ارزش پیشنهادی را در چند ثانیه منتقل کند
- با نمونه‌کار و کیفیت مهندسی اعتماد بسازد
- مسیر تبدیل Visitor -> Lead -> Client را کامل و قابل اندازه‌گیری کند
- روی VPS پایدار و بدون وابستگی خارجی (سازگار با محدودیت اینترنت ایران) لانچ شود

### معیار پذیرش کلان (Definition of Done)
- کاربر بتواند در 60 ثانیه:
  - خدمات را بفهمد
  - 1 نمونه‌کار را بررسی کند
  - به فرم سفارش برسد
- فرم سفارش:
  - ذخیره در DB
  - ارسال نوتیفیکیشن (ایمیل/پنل)
  - صفحه Thank You
  - ضد اسپم (rate-limit + honeypot)
- SEO پایه:
  - metadata یکتا
  - OG image 1200x630
  - sitemap/robots صحیح
  - schema معتبر (Person/Organization/Website/Article)

---

## 2) مخاطب هدف (Audience)
### گروه‌های اصلی
- استارتاپ‌ها و SME ها
- تیم‌های فنی که نیاز به توسعه‌دهنده Next.js/TS دارند
- کارفرمایانی که "Production-Ready" بودن برایشان مهم است

### نیاز/دغدغه
- اعتماد، کیفیت تحویل، نگهداری، استقرار، امنیت، پرفورمنس

---

## 3) مشکل فعلی (Problem)
مسیر فعلی:
> وارد سایت می‌شود -> نگاه می‌کند -> می‌رود

مسیر مطلوب:
> وارد سایت -> پیام روشن + اعتماد -> نمونه‌کار -> CTA -> فرم سفارش -> پیگیری

---

## 4) ساختار اطلاعات و صفحات (IA)
### صفحات/سکشن‌های ضروری (MVP)
1. Home (Hero + Services + Featured Case Studies + About summary + CTA)
2. Services (جزئیات خدمات + خروجی‌ها + FAQ)
3. Case Studies (لیست) + Case Study page (جزئیات پروژه)
4. Contact / Request a Project (فرم)
5. Thank You

### معیار پذیرش
- هر صفحه فقط یک CTA اصلی داشته باشد.
- از Home بتوان با 2 کلیک به فرم سفارش رسید.

---

## 5) محتوا و Copy (Operational)
### 5.1 Hero
**هدف:** انتقال سریع "چه می‌سازم + برای چه کسی + چرا من"
- 1 جمله ارزش پیشنهادی
- 1 جمله Proof (production-ready / deployment / tests)
- 2 CTA: (Request a Project) و (View Work)

**معیار پذیرش:** کاربر در 5 ثانیه بفهمد شما چه می‌کنید.

### 5.2 Services
**هدف:** خدمات را "قابل خرید" کنید (نه فقط لیست مهارت)
برای هر سرویس:
- خروجی قابل تحویل (Deliverable)
- مثال مرتبط (لینک به کیس استادی)

**معیار پذیرش:** حداقل 6 سرویس + برای هرکدام 1 خروجی.

### 5.3 Featured Case Studies / Case Studies
برای هر پروژه:
- Summary (1 خط)
- Problem / Solution / Result
- Role (نقش شما)
- Tech Stack
- Proof (اسکرین/لینک/Repo)
- Lessons/Tradeoffs (یک پاراگراف کوتاه)

**معیار پذیرش:** حداقل 3 کیس استادی کامل.

### 5.4 About
**هدف:** اعتماد انسانی + سبک کاری
- اصول کاری (quality, tests, deployment, maintainability)
- سبک همکاری (communication, scope, iteration)

### 5.5 Request a Project (Order Form)
**فیلدها**
- نام، ایمیل/شماره
- نوع پروژه
- توضیح
- بودجه حدودی (اختیاری)
- فایل پیوست (اختیاری)

**رفتار فنی**
- validation سمت کلاینت و سرور
- rate limit + honeypot
- ذخیره در DB
- notification
- redirect به Thank You

**معیار پذیرش:** ارسال فرم در اینترنت ضعیف هم قابل انجام باشد و state حفظ شود.

---

## 6) SEO / Sharing (10/10)
- OG image fallback استاتیک 1200x630
- metadata یکتا
- sitemap lastModified واقعی
- schema:
  - Person / Organization / WebSite (site-wide)
  - Breadcrumb (pages)
  - Article/BlogPosting (case studies/blog)
  - FAQPage (services/contact FAQ)

---

## 7) MVP لانچ (مرحله‌ای)
### فاز 1: پیام + ساختار + 3 کیس استادی + فرم سفارش
### فاز 2: SEO polish + performance budget + accessibility
### فاز 3: analytics/self-hosted (اختیاری) + بهینه‌سازی conversion

---

## 8) چک‌لیست لانچ روی VPS
- build production
- systemd service + restart policy
- reverse proxy (Caddy) + TLS + headers + logs
- health endpoint
- backup DB
- smoke test: home, services, case study, form submit, thank you
