# فونت‌های فارسی برای پروژه

این فولدر برای فونت‌های لوکال فارسی است.

## فونت مورد نیاز

### IRANSansX
فونت اصلی پروژه است که باید در این فولدر قرار گیرد.

### فایل‌های مورد نیاز

برای بهترین پشتیبانی از مرورگرهای مدرن، فرمت‌های زیر پیشنهاد می‌شود:

1. **IRANSansX.woff2** - فرمت WOFF2 برای مرورگرهای مدرن (توصیه می‌شود)
2. **IRANSansX.woff** - فرمت WOFF برای پشتیبانی مرورگرهای قدیمی
3. **IRANSansX-Regular.woff2** - وزن رگولار
4. **IRANSansX-Bold.woff2** - وزن بولد
5. **IRANSansX-Medium.woff2** - وزن مدیوم

### نحوه نصب

فایل‌های فونت را از منابع رسمی IRANSansX دانلود کنید و در این فولدر قرار دهید.

سپس فایل `src/app/globals.css` را به‌روزرسانی کنید تا فونت‌ها را بارگذاری کند:

```css
@font-face {
  font-family: 'IRANSansX';
  src: url('/fonts/IRANSansX.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'IRANSansX';
  src: url('/fonts/IRANSansX-Bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
```

### منابع

فونت IRANSansX از وب‌سایت رسمی یا ریپازیتوری‌های مجاز قابل دانلود است.

### نکات مهم

- ⚠️ **هشدار**: هرگز از Google Fonts یا CDN برای فونت‌های فارسی استفاده نکنید (مغایر با قوانین لوکال‌بودن)
- ✅ استفاده از فونت‌های لوکال الزامی است
- ✅ فونت باید مجوز استفاده تجاری داشته باشد
- ✅ تمامی وزن‌های مورد نیاز پروژه (Regular, Bold, Medium) باید فراهم باشند

### وضعیت فعلی

- [ ] IRANSansX-Regular.woff2
- [ ] IRANSansX-Bold.woff2
- [ ] IRANSansX-Medium.woff2

بعد از اضافه کردن فایل‌ها، این لیست را آپدیت کنید.
