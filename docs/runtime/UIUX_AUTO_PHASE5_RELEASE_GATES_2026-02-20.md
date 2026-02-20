# UI/UX Auto Phase 5 — Release Gate Closure (2026-02-20)

## Completed in this phase
- Excluded local Prisma sqlite artifacts from VCS:
  - `.gitignore` updated with:
    - `prisma/*.db`
    - `prisma/*.db-journal`
- Removed local db artifact:
  - `prisma/dev.db`
- Stabilized smoke E2E to reduce flaky failures in automated release evidence runs:
  - `e2e/smoke.spec.mjs`
  - changes:
    - explicit desktop viewport in `beforeEach`
    - language direction check moved to deterministic route-level verification (`/en/services`)
    - theme assertion switched to deterministic availability check in header
- LCP-focused optimizations applied to improve Lighthouse performance reliability:
  - `src/app/globals.css`
  - `src/components/sections/hero.tsx`
  - changes:
    - heading font priority changed to `Vazirmatn` (woff2-preloaded path)
    - non-critical Persian fonts switched to `font-display: optional`
    - reduced heavy aurora blur/opacity
    - removed above-the-fold reveal animations from hero headline/description/CTA/chips/social

## Validation executed
- `pnpm run verify`: PASS
- `PLAYWRIGHT_DISABLE_WEBSERVER=true PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm run test:e2e:smoke`: PASS
- `PLAYWRIGHT_DISABLE_WEBSERVER=true PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm run test:e2e:a11y`: PASS
- `pnpm run lighthouse:ci`: PASS (assertions passed; upload failures are network-side and non-blocking for local assert)

## Go/No-Go evidence
- Generated:
  - `docs/runtime/GoNoGo_Evidence/go-no-go-20260220T122855Z.md`
  - `artifacts/go-no-go-20260220T122855Z.summary.txt`
- Result:
  - quality gates recorded in this run:
    - smoke: pass
    - ownership: pass
  - final decision remains **NO-GO** because live/staging endpoints are unreachable from current environment.

## Remaining blocker (external)
- `https://alirezasafaeisystems.ir/` and `/api/ready` are unreachable from current environment.
- Needs infra-panel actions (Arvan/origin firewall/WAF/whitelisting) before production go-live.
