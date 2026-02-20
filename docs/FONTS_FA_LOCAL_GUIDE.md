# راهنمای فونت فارسی (لوکال)

این راهنما برای استفاده از فونت‌های فارسی با کیفیت بالا به صورت **کاملا لوکال** است.

## پیشنهاد فونت‌ها

## 1) Vazirmatn (پیشنهاد اول)
- مزایا: خوانایی عالی در UI، پشتیبانی خوب از وزن‌های مختلف، مناسب متن و تیتر.
- وضعیت: اوپن‌سورس، مناسب استفاده تجاری.

## 2) Estedad
- مزایا: ظاهر مدرن‌تر برای تیترها، شخصیت بصری قوی برای برند.
- وضعیت: بسته به نسخه/منبع، لایسنس را بررسی کنید.

## 3) IRANSansX
- مزایا: استاندارد سازمانی رایج، خوانایی خوب در متن‌های طولانی.
- وضعیت: لایسنس اختصاصی (نیازمند تهیه قانونی).

## 4) Shabnam
- مزایا: سبک نرم و مناسب متون عمومی.
- وضعیت: اوپن‌سورس.

## 5) Sahel
- مزایا: خوانایی خوب در سایزهای کوچک، مناسب داشبورد و فرم‌های پرتراکم.
- وضعیت: اوپن‌سورس.

## 6) Samim
- مزایا: ظاهر انسانی‌تر برای متن‌های محتوایی و صفحات طولانی.
- وضعیت: اوپن‌سورس.

## 7) Yekan Bakh FaNum
- مزایا: ظاهر سازمانی و مدرن برای تیتر/CTA.
- وضعیت: نسخه‌های مختلف با لایسنس متفاوت؛ قبل از استفاده بررسی شود.

## پیشنهاد چینش
- متن اصلی: `Vazirmatn` یا `IRANSansX`
- تیترها: `Estedad` یا وزن‌های بالاتر `Vazirmatn`
- fallback: `IRANSansX`, `Noto Sans Arabic`, `Tahoma`, `sans-serif`

## پیشنهاد عملی برای این پروژه
- Primary متن: `Vazirmatn Variable`
- Heading: `Estedad Variable`
- Secondary UI: `Shabnam` (برای کارت‌ها/ریزمتن‌های رابط)
- Fallback enterprise: `IRANSansX`

## نحوه افزودن به پروژه

1. فایل‌های فونت را در مسیر `public/fonts/` قرار دهید.

2. در `src/app/globals.css`، `@font-face` اضافه کنید. نمونه:

```css
@font-face {
  font-family: 'Vazirmatn';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/Vazirmatn[wght].woff2') format('woff2');
}

@font-face {
  font-family: 'Estedad';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/Estedad[wght].woff2') format('woff2');
}
```

3. `--font-sans` را در `src/app/globals.css` به ترتیب مورد نظر تنظیم کنید.

4. اگر خواستید تیترها فونت جداگانه داشته باشند، یک متغیر جدید مثلا `--font-heading` تعریف کنید و برای `h1/h2/h3` اعمال کنید.

## نکات کیفیت
- فقط `woff2` استفاده شود (بهینه‌تر).
- `font-display: swap` نگه داشته شود.
- بعد از تغییر فونت‌ها: `pnpm run lighthouse:ci` و `pnpm run test:e2e:a11y` اجرا شود.
