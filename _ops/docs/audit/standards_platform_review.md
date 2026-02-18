# بررسی مخزن مرجع استانداردها (asdev-standards-platform)

## مخزن مرجع
- `alirezasafaeisystems/asdev-standards-platform`
- نسخه بررسی‌شده: `main` (کلون شده در `_ops/external/asdev-standards-platform`)

## قوانین/استانداردهای کلیدی استخراج‌شده
1. Human gates اجباری برای:
- تغییرات auth/permission/security policy
- تغییرات breaking در API/schema/db
- جریان‌های UX بحرانی

2. Runtime rules:
- تغییر کوچک و قابل‌اعتبارسنجی
- الزام lint/test/build قبل merge
- حفظ branch protection و PR-based delivery

3. رویکرد local-first:
- ستون «Local-First Operations» به‌صورت صریح در شواهد اجرایی تعریف شده است.
- فقط برخی مخازن (مثل VPN) استثناء external-dependent دارند.

4. کیفیت و امنیت:
- baseline verify شامل lint/typecheck/test/build/security/coverage
- اسکن secret با allowlist تست
- گزارش‌پذیری DNS/TLS/HSTS و Go/No-Go در مدارک اجرایی

## انطباق با asdev-portfolio
- وضعیت: **همسو، با چند اقدام تکمیلی انجام‌شده**
- موارد همسو:
  - local-first در asset/runtime
  - گیت‌های lint/typecheck/test/build
  - اسکن secrets + audit high/critical
  - readiness و شواهد DNS/TLS/HSTS
- اقدامات تکمیلی این نوبت:
  - به‌روزرسانی `scripts/deploy/check-hosting-sync.sh` برای Co-Hosting واقعی با `persiantoolbox.ir`
  - به‌روزرسانی `docs/VPS_DEPLOYMENT.md` با توپولوژی پورت/دامنه و الزامات ایران

## شواهد مرجع
- `_ops/external/asdev-standards-platform/AGENTS.md:3`
- `_ops/external/asdev-standards-platform/platform/agent/HUMAN_GATES.md:3`
- `_ops/external/asdev-standards-platform/platform/agent/REPO_LENSES.md:3`
- `_ops/external/asdev-standards-platform/docs/strategic-execution/runtime/Brand_Evidence/pillars/2026-02-15_pillar_02_local_first_ops.md:1`
- `_ops/external/asdev-standards-platform/sync/targets.yaml:55`
- `_ops/external/asdev-standards-platform/Makefile:83`
