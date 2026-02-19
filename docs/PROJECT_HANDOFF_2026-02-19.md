# Project Handoff - 2026-02-19

## Scope Closed
- Production-grade CI/CD and VPS deployment workflow is in place.
- TLS/domain hardening and legacy domain retirement are completed at config level.
- SEO baselines are set (canonical strategy, sitemap, robots, structured data).
- Footer mobile/social UX issue addressed.
- Optional CDN font loading implemented with automatic local fallback.

## Recent Technical Deliverables
- PR #67 (merged): retire legacy domain host + TLS compatibility improvements.
- PR #68 (open/auto-merge):
  - Optional CDN font toggle with local-first fallback.
  - CSP updates to support optional CDN origin.
  - CSP fix for style attribute violations.
  - Footer social section responsive fix for small screens.

## Current Runtime/Operations Notes
- Primary domain: `https://alirezasafaeisystems.ir`
- Canonical should remain on clean URLs (without cache-busting query params).
- HTTPS is expected end-to-end.
- If client-side VPN/proxy users still see TLS/connection errors:
  - Verify CDN/WAF challenge policies for bot/proxy traffic.
  - Keep HTTP->HTTPS redirect enforced.
  - Keep TLS minimum version compatible with target clients.

## Google Search Console Checklist
- Add both properties:
  - Domain property: `alirezasafaeisystems.ir`
  - URL prefix property: `https://alirezasafaeisystems.ir/`
- Submit sitemap:
  - `https://alirezasafaeisystems.ir/sitemap.xml`
- Request indexing for key pages:
  - `/`, `/services`, `/case-studies`, `/about-brand`
- Monitor:
  - Pages indexing report
  - Crawl stats
  - Coverage anomalies over 48-72 hours

## Known Governance Gate
- Branch protection currently requires review before merge on protected branches.
- Auto-merge is enabled where configured, but review approval remains mandatory.

## Next Project Readiness
- Operational docs are present in `docs/` and `docs/runtime/`.
- Environment template is ready in `.env.example`.
- Sensitive real-world details are intentionally stored only in local `secret_alireza.md` (gitignored).

## Recommended Before Switching Context
- Confirm PR #68 merged and production deploy pipeline passed.
- Perform one post-deploy smoke from clean network + VPN/proxy network.
- Capture final green evidence in `docs/runtime/` if needed by your governance process.
