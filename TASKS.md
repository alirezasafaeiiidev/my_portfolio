# Task Backlog (Persian Local‑First Toolbox Platform)

This repository currently ships a **portfolio + admin/API** app under `src/`.

It also includes a **reference implementation** of a Persian local-first toolbox under `_ops/external/asdev-persiantoolbox/` (excluded from builds/tests via `eslint.config.mjs`, `tsconfig.json`, `vitest.config.ts`).

## Scope
- This backlog tracks the work needed to bring the toolbox experience into this codebase (without adding third-party runtime services).
- Until the toolbox is integrated into `src/`, the external reference remains the primary source of patterns and contracts.

The tasks below convert the audit gaps into executable work items, prioritized for launching a **conversion-focused Persian (fa-IR), RTL-correct, local-first toolbox** without adding third-party runtime services.

## Index

### P0 (Launch blockers — Phase 0)
- `tasks/P0-01.md` — Security middleware wiring (CSP/nonce/headers) — ✅
- `tasks/P0-02.md` — PWA offline: register SW + offline fallback + update flow — ✅
- `tasks/P0-03.md` — Toolbox routes + tools registry scaffold in `src/` — ✅
- `tasks/P0-06.md` — SEO system for tools (metadata, sitemap, internal linking) — ✅
- `tasks/P0-04.md` — Local-first persistence (IndexedDB) + usage history model — ✅
- `tasks/P0-05.md` — Worker runtime + resource limits for file tools — ✅
- `tasks/P0-07.md` — Performance budget pass (Lighthouse CI gates) — ✅
- `tasks/P0-08.md` — MVP Tool: PDF Merge (local, worker-based) — ✅
- `tasks/P0-09.md` — MVP Tool: Image Compress/Resize (local, worker-based) — ✅
- `tasks/P0-10.md` — Monetization scaffolding (plans, flags, gating; no external services) — ✅

### P1 (Quality + growth)
- `tasks/P1-01.md` — Topics taxonomy pages for tools + “Related tools” blocks — ✅
- `tasks/P1-02.md` — Tool search (client index, fast RTL UX) — ✅
- `tasks/P1-03.md` — Replace mock blog/RSS with MDX content pipeline — ✅
- `tasks/P1-04.md` — i18n cleanup: remove unused deps or adopt locale routing + hreflang — ✅
- `tasks/P1-05.md` — Offline-friendly help/docs for each tool — ✅
- `tasks/P1-06.md` — Server storage hygiene: attachment retention/quotas/cleanup — ✅
- `tasks/P1-07.md` — Local analytics/telemetry (privacy-preserving, no external) — ✅
- `tasks/P1-08.md` — Testing expansion for tools/workers (unit + e2e) — ✅
- `tasks/P1-09.md` — Download hardening (safe filenames, blob URL lifecycle, CSP) — ✅
- `tasks/P1-10.md` — Admin UX for toolbox settings/monetization (behind admin auth) — ✅

### P2 (Nice-to-have)
- `tasks/P2-01.md` — Export/import history & settings (local-first) — ✅
- `tasks/P2-02.md` — Batch processing queue (multi-file jobs, resumable UX) — ✅
- `tasks/P2-03.md` — Command palette + keyboard shortcuts (RTL-aware) — ✅
- `tasks/P2-04.md` — PWA update UX polish (prompt, changelog, cache controls) — ✅
- `tasks/P2-05.md` — Persian date accuracy + numeral formatting unification — ✅
