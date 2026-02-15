# پشته فناوری و نسخه‌ها

## Runtime و ابزار ساخت
- Package manager: `bun@1.3.9` (`package.json:5`)
- Engine constraint:
  - Node: `>=20 <23` (`package.json:7`)
  - Bun: `1.3.9` (`package.json:8`)
- Next.js: `16.1.6` (`package.json:72`)
- React: `19.2.4` (`package.json:77`)
- TypeScript: `5.9.3` (`package.json:113`)

## فریم‌ورک/کتابخانه‌های مهم
- Prisma: `@prisma/client` و `prisma` نسخه `6.19.2`
- Validation: `zod`
- تست: `vitest`, `@playwright/test`
- UI stack: Radix + Tailwind + shadcn components

## CI parity
- در workflowها نسخه Bun روی `1.3.9` همسان‌سازی شد:
  - `./github/workflows/ci.yml:23`
  - `.github/workflows/security-audit.yml:43`
  - `.github/workflows/e2e-smoke.yml:23`
  - `.github/workflows/lighthouse.yml:20`

## شواهد
- `package.json:5`
- `package.json:6`
- `package.json:72`
- `.github/workflows/ci.yml:23`
