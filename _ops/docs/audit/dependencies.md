# تحلیل وابستگی‌ها

## وضعیت فعلی
- lockfile موجود: `bun.lock`
- دامنه وابستگی‌ها گسترده است (UI + animation + data libs + Prisma).
- policy امنیت وابستگی با `audit:high` فعال است (`scripts/audit-high-critical.sh`).

## ریسک‌ها
- استفاده زیاد از نسخه‌های caret (`^`) باعث drift بالقوه بین محیط‌ها می‌شود.
- lockfile sync در محیط محلی با timeout شبکه چندبار fail شد (در لاگ errors ثبت شده).

## اقدامات انجام‌شده
- تعریف صریح package manager و engines در `package.json`.
- افزودن گیت اسکن secrets و همسان‌سازی نسخه Bun در CI.
- نگه‌داشتن `audit:high` به‌عنوان gate آسیب‌پذیری high/critical.

## برنامه اصلاح تکمیلی
- تبدیل بخشی از وابستگی‌های بحرانی به pin کامل در چرخه بعدی.
- اجرای lock refresh کنترل‌شده در شبکه پایدار و commit lockfile.

## شواهد
- `package.json:5`
- `package.json:30`
- `scripts/audit-high-critical.sh:51`
- `_ops/logs/errors.log:1`
