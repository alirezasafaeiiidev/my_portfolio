# Enterprise 10/10 Execution Plan — 2026-02-19

## Objective
Ship a production release only after all technical, operational, and product gates are truly closed and evidenced.

## Current Reality Check
Scoring baseline (realistic):
- Engineering Quality: `9.5/10` (verify/test/build passing)
- Operations & Reliability: `8.5/10` (runtime healthy, but deployment/runtime ownership still needs standardization)
- Security & Governance: `8.5/10` (one governance input still open: GitHub org 2FA enforcement confirmation)
- Documentation & Maintainability: `9.5/10` (strong runtime docs, needs final enterprise runbook lock)
- Product & Conversion: `6.5/10` (owner decisions pending on CTA, offers, pricing, retention, lead routing)

Estimated overall: `8.6/10` (not yet 10/10 enterprise-release ready).

## Hard Release Gates (Must Pass)
1. Quality gate green:
- `pnpm run verify`
- smoke test for target env

2. Runtime gate green:
- `/api/ready` on target env returns `200`
- HTTPS/TLS certificate valid and HSTS present
- canonical URL policy enforced (`https://alirezasafaeisystems.ir/` without `?v`)

3. Governance gate green:
- GitHub org 2FA enforcement state confirmed and documented
- branch protection and CODEOWNERS evidence up to date

4. Product gate green:
- primary CTA finalized
- service catalog finalized
- pricing policy finalized
- lead destination finalized
- retention policy finalized

## Remaining Work Before Final Enterprise Release
1. Operations standardization:
- finalize one runtime manager policy (PM2/systemd) and document ownership model.
- remove legacy runtime ambiguity (root-managed app process risk).

2. Governance closure:
- complete `admin:org` check and record org-level 2FA evidence.

3. Product conversion closure:
- finalize owner inputs in `docs/runtime/OWNER_INPUT_QUEUE.md`.
- update website copy and contact funnel accordingly.

4. Deployment automation closure:
- use `.github/workflows/deploy-vps.yml` for controlled deployment.
- enforce environment approvals in GitHub:
  - `production` must require reviewer approval.
  - `staging` can auto-approve.

## Deploy Protocol (New Standard)
1. Push changes to GitHub.
2. Run CI and ensure all checks are green.
3. Trigger `Deploy VPS` workflow manually.
4. Type `DEPLOY`, choose `environment`, and deploy selected `ref`.
5. Workflow executes verify -> deploy -> smoke checks.
6. Record release evidence under `docs/runtime/`.

## Definition of Done for 10/10
Release can be called `10/10` only when:
- no open items remain in `docs/10_10_CHECKLIST.md`.
- no open owner/governance blockers remain in `docs/runtime/OWNER_INPUT_QUEUE.md`.
- production deploy passes all hard gates and evidence is recorded for the same date.
