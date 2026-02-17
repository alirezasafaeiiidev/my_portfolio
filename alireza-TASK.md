# alireza-TASK

این فایل فقط کارهایی را پوشش می‌دهد که خارج از محیط ریپو/کدنویسی هستند و باید توسط شما یا تیم زیرساخت انجام شوند.

## وضعیت فعلی
- [x] Deploy gate, verify, smoke, TLS/HTTPS, HSTS
- [x] سرویس‌های اصلی روی VPS آنلاین
- [x] certbot dry-run موفق
- [ ] بستن کامل آیتم‌های محصولی P2-01, P2-02, P2-05 (داخل ریپو؛ جداگانه قابل اجرا)

## چک‌لیست مرحله‌ای عملیات بیرون از ریپو

### فاز 1: دسترسی‌ها و مالکیت
- [ ] مالک DNS/Registrar مشخص و ثبت شود (نام شخص + راه ارتباطی + سطح دسترسی).
- [ ] مالک VPS/Cloud مشخص و ثبت شود (نام شخص + راه ارتباطی).
- [ ] اکانت اضطراری 2FA برای DNS provider فعال شود.
- [ ] کلید SSH اضطراری آفلاین (encrypted backup) نگه‌داری شود.

### فاز 2: DNS و دامنه
- [ ] در DNS provider رکوردهای `A` برای `@`, `www`, `staging` هر دو دامنه بررسی و مستندسازی شود.
- [ ] TTL رکوردهای production روی مقدار پایدار (مثلا 300 یا 600) استاندارد شود.
- [ ] nameserverهای authoritative با policy سازمان یکسان‌سازی شوند.
- [ ] خروجی `dig +trace` برای هر دامنه ذخیره شود (evidence ماهانه).

### فاز 3: TLS/Certificate Operations
- [ ] تایید شود ایمیل هشدار certbot/expiry به mailbox واقعی تیم می‌رسد.
- [ ] اجرای دوره‌ای `certbot renew --dry-run` در تقویم عملیات ثبت شود (هفتگی یا ماهانه).
- [ ] هشدار انقضای گواهی (کمتر از 20 روز) در کانال تیمی تعریف شود.
- [ ] ماتریس cert ownership ثبت شود: چه کسی renew failure را رفع می‌کند.

### فاز 4: Observability و Incident Response
- [ ] Uptime monitor خارجی برای `https://alirezasafeidev.ir` و `https://persiantoolbox.ir` فعال شود.
- [ ] Alert destination مشخص شود (Telegram/Email/Slack + escalation path).
- [ ] runbook incident severity (SEV1/SEV2) نهایی شود.
- [ ] SLO review دوره‌ای با خروجی `scripts/check-slo.sh` زمان‌بندی شود.

### فاز 5: Backup و بازیابی
- [ ] سیاست backup برای `/var/www/*/shared/env` و داده‌های runtime تعریف شود.
- [ ] backup خارج از همان VPS (offsite) فعال شود.
- [ ] آزمون restore واقعی (حداقل ماهی 1 بار) انجام و نتیجه ثبت شود.
- [ ] retention policy و encryption backup مستند شود.

### فاز 6: امنیت سرور
- [ ] hardening سیستم‌عامل بررسی شود (UFW/Fail2ban/SSH hardening).
- [ ] patch window ماهانه OS + package updates زمان‌بندی شود.
- [ ] userهای غیرضروری روی سرور حذف/غیرفعال شوند.
- [ ] audit دسترسی sudo و root login policy ثبت شود.

### فاز 7: انتشار و کنترل تغییر
- [ ] policy رسمی release freeze/approval قبل deploy تعریف شود.
- [ ] change ticket برای هر deploy production اجباری شود.
- [ ] rollback owner در هر release مشخص شود.
- [ ] post-deploy review قالب ثابت داشته باشد (health, edge, logs, action items).

## داده‌هایی که از شما لازم است
- [ ] DNS provider دقیق: `....................`
- [ ] Registrar account owner: `....................`
- [ ] ایمیل هشدار cert expiry: `....................`
- [ ] کانال alert اصلی (و backup): `....................`
- [ ] زمان‌بندی maintenance window: `....................`
- [ ] محل نگه‌داری backup offsite: `....................`
- [ ] RTO/RPO هدف کسب‌وکار: `....................`

## سوال‌هایی که باید شما پاسخ بدهید
- [ ] در رخداد outage چه کسی تصمیم نهایی rollback را می‌گیرد؟
- [ ] اگر DNS provider دچار اختلال شود مسیر failover چیست؟
- [ ] policy رسمی برای rotate کردن SSH keys هر چند وقت یکبار است؟
- [ ] آیا نیاز قانونی/قراردادی خاص برای نگه‌داری لاگ‌ها دارید؟
- [ ] مسئول تایید نهایی release production چه کسی است؟

## شواهدی که باید شما بعد از انجام هر مرحله ثبت کنید
- [ ] اسکرین‌شات تنظیمات DNS و NS
- [ ] خروجی dry-run certbot با تاریخ
- [ ] خروجی monitor uptime/alert test
- [ ] گزارش restore test
- [ ] صورت‌جلسه post-deploy review

## قالب ثبت اجرا (هر بار)
- تاریخ/زمان:
- اجراکننده:
- محیط:
- کار انجام‌شده:
- خروجی:
- خطا/ریسک:
- اقدام بعدی:
