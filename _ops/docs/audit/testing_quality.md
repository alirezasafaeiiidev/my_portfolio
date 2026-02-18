# تست و کیفیت

## baseline
- unit/integration: `vitest`
- e2e smoke: `playwright`
- coverage threshold: 80% در `vitest.config.ts`
- CI jobs: lint, type-check, test, coverage, build, e2e smoke

## بهبودهای اعمال‌شده
- تست یکپارچه جدید برای سخت‌سازی `api/messages`
- تست readiness endpoint (200/503)

## اجرای انجام‌شده
- `bun run lint`: PASS
- `bun run type-check`: PASS
- `bun run test`: PASS
- `bun run build`: PASS

## شواهد
- `vitest.config.ts:21`
- `src/__tests__/api/messages.integration.test.ts:1`
- `src/__tests__/api/ready.integration.test.ts:1`
- `.github/workflows/ci.yml:75`
- `.github/workflows/e2e-smoke.yml:1`
