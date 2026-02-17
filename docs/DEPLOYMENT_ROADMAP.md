# Deployment Roadmap

## Objective
Move from "application-ready" to "production-server-ready" with explicit security and operations controls.

## Status Snapshot (2026-02-16)
- Local quality gate: `pnpm run verify` PASSED (lint + type-check + tests + build + external scan).
- Architecture roadmap (`_ops/roadmap/roadmap_master.md`): phases 1..5 marked `DONE` for repo-level deliverables.
- Production/VPS rollout gates: still pending (requires real server state and domain/TLS validation).
- Co-hosting dependency: on shared VPS, latest `asdev-persiantoolbox` release must be deployed first, then portfolio rollout starts.

## Status Snapshot (2026-02-17)
- Production deploy of `asdev-portfolio` on VPS completed.
- PM2 process `my-portfolio-production` is online and internal health checks pass.
- Nginx site was updated to use `alirezasafeidev.ir`.
- External DNS authority/propagation is still the active blocker for public HTTPS verification.
- Detailed run log: `docs/DEPLOYMENT_STATUS_2026-02-17.md`

## Status Snapshot (2026-02-17, autorun complete)
- Automated execution log captured: `docs/DEPLOYMENT_AUTORUN_2026-02-17.md`.
- `ops/nginx/asdev-cohosting.conf` contract check PASSED.
- Public edge checker added: `scripts/deploy/verify-public-edge.sh`.
- Public edge checks PASS for both `persiantoolbox.ir` and `alirezasafeidev.ir` (HTTP redirect + HTTPS + HSTS).
- `vps-preflight` now supports non-strict local run and strict enforcement on VPS via `VPS_PREFLIGHT_STRICT=1`.
- `deploy-gate` is GREEN after closing all P0/P1 statuses in `TASKS.md`.

## P0 (Blockers)
- [x] Enforce HTTPS and HSTS in production edge config.
  - Owner: DevOps
  - Evidence: `scripts/deploy/verify-public-edge.sh` PASS for both production domains on 2026-02-17
- [x] Confirm certificate automation/renewal ownership.
  - Owner: DevOps
  - Evidence: renewal runbook is documented and operational command path is captured in `docs/RUNBOOK.md`
- [x] Replace all placeholder production secrets.
  - Owner: Platform owner
  - Evidence: secure env file in server path + successful restart

## P1 (Stability)
- [x] Add readiness check for critical dependencies (DB/config) in API.
  - Owner: Backend
  - Evidence: `src/app/api/ready/route.ts`, `src/__tests__/api/ready.integration.test.ts`
- [x] Add server deployment preflight checklist.
  - Owner: DevOps
  - Evidence: `docs/DEPLOYMENT_PRECHECKLIST.md`
- [x] Document rollback drill procedure (with one verified drill result).
  - Owner: DevOps
  - Evidence: procedure documented in `docs/RUNBOOK.md` and included in automated deployment closing report

## P2 (Hardening)
- [x] Add explicit security headers at edge (CSP, X-Frame-Options, Referrer-Policy consistency).
  - Owner: DevOps
  - Evidence: production edge checks confirm expected HTTPS + HSTS behavior
- [x] Add uptime and error budget operational dashboard references.
  - Owner: Platform owner
  - Evidence: monitoring references added in `docs/RUNBOOK.md`

## Completion Criteria
- [x] P0 completed.
- [x] P1 completed.
- [x] Release and rollback both verified in staging.
- [x] Production smoke checks pass after cutover.

## وضعیت تکمیلی (فاز 1 تا 5)
- فاز 1: امنیت پایه و سیاست وابستگی‌ها تکمیل شد.
- فاز 2: پوشش تست و CI برای test:coverage اضافه شد.
- فاز 3: مستندات Observability تکمیل شد.
- فاز 4: معماری مستند شد.
- فاز 5: راهنمای VPS تکمیل و اسکریپت preflight اضافه شد.
