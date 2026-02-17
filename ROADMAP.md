# Roadmap to 10/10 Portfolio Readiness (fa-IR)

## Phase 0 — Baseline, Navigation, CTAs (current)
- Ship reliable RTL/fa-IR shell: hero, services entry points, case-study list, footer trust signals.
- Wire security/perf guardrails: CSP middleware, deploy gate, Lighthouse budget, PWA offline fallback.
- Definition of done: P0-01 → P0-08 closed, deploy gate green, lint/test/build passing on main.

## Phase 1 — Portfolio Funnel End-to-End
- Service detail → qualification → start → thank-you flows localized (fa-IR), tracked events locally.
- Case study depth (قضیه‌های موفقیت) with internal links and related services.
- Definition of done: P0 tasks done + P1-01, P1-02, P1-05, P1-08 closed; `/thank-you` dynamic copy + CTA back to services.

## Phase 2 — Lead System (UI → API → Storage)
- Form validation, spam controls, server storage hygiene, notification hooks (no external SaaS).
- Offline-friendly drafts and retry for lead capture.
- Definition of done: P1-06 done; lead write path covered by unit + e2e; quotas/retention documented.

## Phase 3 — Admin + Inbox (noindex)
- Authenticated admin surface for toolbox settings, monetization flags, lead inbox with filters.
- Definition of done: P1-10 closed; admin routes noindex + gated; audit trail minimal logging.

## Phase 4 — SEO Completeness
- Sitemap/robots/schema for services, case studies, tools; hreflang/fa-IR correctness; MDX blog pipeline.
- Definition of done: P0-06 + P1-03 + P1-04 closed; Lighthouse SEO score ≥ 95 on key pages.

## Phase 5 — Performance & Security Polish
- Performance budgets enforced (LCP <2.5s on 4G), worker resource caps, download hardening.
- Definition of done: P0-07 + P0-05 + P1-09 closed; Lighthouse performance ≥ 90; SLO checks green.
