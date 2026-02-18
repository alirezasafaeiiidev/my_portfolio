# کیفیت کد

## وضعیت
- ESLint و TypeScript strict فعال است.
- الگوی پاسخ API تا حد زیادی استاندارد شده (`withCommonApiHeaders`).

## مشکلات مشاهده‌شده و اصلاح
- logger برای سطح info/debug از `console.warn` استفاده می‌کرد.
- اصلاح شد تا سطوح غیرخطا روی `console.log` ثبت شوند.

## استانداردسازی انجام‌شده
- همگرایی runtime/version با `packageManager`, `engines`, `.nvmrc`, CI Bun version.
- افزودن boundary خطا در سطح app برای UX بهتر هنگام exception.

## شواهد
- `eslint.config.mjs:1`
- `tsconfig.json:11`
- `src/lib/logger.ts:32`
- `package.json:5`
- `.nvmrc:1`
- `src/app/error.tsx:1`
