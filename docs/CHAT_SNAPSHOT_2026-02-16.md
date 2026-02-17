# Chat Snapshot (2026-02-16)

This is a local, version-controlled snapshot of the decisions and actions taken in this iteration.

## User Requirements Captured
- Goal: upgrade `asdev-portfolio` into a "10/10 global-standard" employer/client acquisition system.
- Constraints:
  - Local-first runtime (suitable for Iran internet constraints).
  - Full quality gate must pass before any deployment.
  - UI should align with `asdev-persiantoolbox` visual language.
  - Deployment order on shared server: deploy `asdev-persiantoolbox` first, then portfolio (not executed in this iteration).
- User brand data provided:
  - Name: علیرضا صفایی (Alireza Safaei)
  - Domain: alirezasafeidev.ir
  - Company: ASDEV
  - Social handle (Telegram/WhatsApp/Instagram/LinkedIn/GitHub): `alirezasafaeisystems`
  - Profile README: https://github.com/alirezasafaeisystems/alirezasafaeisystems
  - Portfolio proofs:
    - persiantoolbox.ir
    - alirezasafeidev.ir
    - in progress: asdev-automation-hub, asdev-creator-membership-ir

## Implemented Changes (High-Level)
- Server-synced i18n:
  - Language persistence via cookie (`lang`) so SSR `lang/dir` matches user selection.
- CRM-ready lead capture:
  - Prisma `Lead` model and `LeadStatus` enum.
  - `/api/leads` now stores to `Lead`.
  - Added admin leads API endpoint: `/api/admin/leads` (GET + PATCH status).
  - Admin dashboard updated to include Leads.
- UI/UX polish + accessibility:
  - Fixed Lighthouse accessibility issues (button accessible name, heading order, contrast tag).
- Lighthouse performance stabilization:
  - Addressed regression by reducing font payload on initial render.
  - Added Arabic-range subset WOFF2 font and preloaded it for faster LCP.
- Brand identity wiring:
  - Updated brand defaults + `.env.example` with correct domain/identity.
  - Added Telegram/Instagram/WhatsApp optional URLs and surfaced them in hero/contact/footer.
- Case studies:
  - Added case study for the portfolio itself.
  - Added external proof link for PersianToolbox case study.

## Files Added / Updated (Pointers)
- Brand/env:
  - `src/lib/brand.ts`
  - `src/lib/env.ts`
  - `.env.example`
  - `docs/BRAND_IDENTITY.md`
- i18n:
  - `src/lib/i18n/server.ts`
  - `src/lib/i18n-context.tsx`
  - `src/app/layout.tsx`
- Leads/admin:
  - `prisma/schema.prisma`
  - `src/app/api/leads/route.ts`
  - `src/app/api/admin/leads/route.ts`
  - `src/components/admin/admin-dashboard.tsx`
  - `src/__tests__/api/leads.integration.test.ts`
- Case studies:
  - `src/app/case-studies/alirezasafaeidev-portfolio/page.tsx`
  - `src/app/case-studies/asdev-persiantoolbox-platform/page.tsx`
  - `src/app/case-studies/page.tsx`
  - `src/components/sections/featured-case-studies.tsx`
  - `src/app/sitemap.ts`
- Perf fonts:
  - `public/fonts/IRANSansX-Regular-arabic.woff2`
  - `src/app/globals.css`

## Quality Gate Status
- `pnpm run test:full` was run and passed after the fixes in this iteration (lint/type/unit+integration/e2e-smoke/lighthouse/audit/secrets).

## Git Commits Created In This Iteration
- `88a70ca` feat: brand identity + i18n cookie + leads + perf font subset
- `317a72a` docs: record profile README repo

## Update (2026-02-16)
- Navigation/anchors were aligned with "Case Studies" (replacing the misleading "Portfolio" anchor naming), and mobile menu labels were localized.
- Legacy/template sections were removed from the repo to avoid placeholder content shipping.
- Commit: `34ba127` fix: align nav with case studies and remove legacy sections

## Notes / Limitations
- A literal image screenshot of the chat UI cannot be captured from this environment; this file is the archival snapshot.
