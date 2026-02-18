# Prioritized Roadmap Tasks - asdev-portfolio

- Generated: 2026-02-15
- Source: docs/DEPLOYMENT_ROADMAP.md + docs/DEPLOYMENT_PRECHECKLIST.md + _ops/roadmap/roadmap_master.md + docs/strategic-execution/runtime/2026-02-16_asdev-portfolio_operational_upgrade_v1.1.md
- Rule: P0 (production blockers), P1 (stability rollout), P2 (hardening)

| Priority | Stage | Task | Owner | DoD | Evidence | Acceptance |
|---|---|---|---|---|---|---|
| P0 | Deploy | Enforce HTTPS/HSTS on production edge | DevOps | HSTS active on production domain | docs/DEPLOYMENT_ROADMAP.md | TLS + header check pass |
| P0 | Deploy | Confirm certificate automation ownership | DevOps | Renewal owner/method documented and tested | docs/DEPLOYMENT_ROADMAP.md | Renewal drill evidence exists |
| P0 | Deploy | Replace production placeholder secrets | Platform owner | Real secrets loaded on VPS env file | docs/DEPLOYMENT_ROADMAP.md, docs/DEPLOYMENT_PRECHECKLIST.md | App restart + health check pass |
| P1 | Deploy | Run production preflight on real VPS | DevOps | `check-hosting-sync --strict` and `vps-preflight.sh` pass on VPS | docs/DEPLOYMENT_PRECHECKLIST.md | No missing dirs/tools; deploy-ready |
| P1 | Deploy | Run and document rollback drill result | DevOps | One dated rollback test recorded | docs/DEPLOYMENT_ROADMAP.md | Rollback and post-checks verified |

## Top 5 Now
1. Run VPS preflight and hosting sync on target server (not local workspace).
2. Finalize TLS/HSTS and cert renewal ownership evidence.
3. Replace placeholder secrets in production env and restart safely.
4. Execute production deploy checklist end-to-end.
5. Perform one rollback drill and attach dated evidence.

## UI/UX + SEO Top 5 (2026-02-15)
1. Reduce LCP on public pages (`/`, `/services`, `/case-studies`, `/about-brand`) to under 4s.
2. Bring `categories.performance` to at least `0.70` for all public lighthouse targets.
3. Keep admin routes out of public SEO scoring and maintain explicit `noindex,nofollow`.
4. Preserve newly fixed accessibility controls (icon buttons/links must keep accessible names).
5. Re-run `pnpm run lighthouse:ci` after each performance iteration and publish updated evidence.

## Conversion Machine Top 5 (2026-02-16)
1. Add dedicated `thank-you` page and redirect successful lead submission to it.
2. Add honeypot field to lead/contact forms and server validation for bot trap.
3. Add notification path for lead submissions (email/panel webhook) with retry-safe logging.
4. Ensure each key page has exactly one primary CTA and 2-click path from Home to request form.
5. Complete 3 fully structured case studies (Problem/Solution/Result/Role/Tradeoffs/Proof).

## Execution Update (2026-02-18)
- Completed: production domain cutover to `alirezasafaeisystems.ir` (DNS + nginx + cert + env + PM2).
- Completed: SSL issuance for `alirezasafaeisystems.ir`, `www.alirezasafaeisystems.ir`, `staging.alirezasafaeisystems.ir`.
- Completed: HSTS verification on live edge responses.
- Completed: GitHub sync through PR `#38` (merged to `main`).

## Next Executable Tasks (Auto-first)
1. Run external verification bundle for `persiantoolbox.ir` (TLS/HSTS/health snapshots).
2. Rotate production secrets and record owner/date in runtime evidence.
3. Execute one VPS rollback drill and archive incident-style report.
4. Add recovery automation for missing `.next/standalone/server.js` in deploy scripts.
5. Publish single go/no-go evidence bundle for release governance.
