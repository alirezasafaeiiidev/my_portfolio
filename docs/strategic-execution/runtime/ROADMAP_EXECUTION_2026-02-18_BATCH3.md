# Roadmap Execution Batch 3 — 2026-02-18

## Scope
اجرای مراحل باقیمانده به‌صورت عملیاتی (تا جای ممکن) شامل pre-deploy، deploy، rollback، health، و شواهد TLS/cert.

## Tasked + Executed

| Priority | Task | Executable Step | Result |
|---|---|---|---|
| P0 Ops | Prerequisites | install `rsync/iproute2/nginx/pm2` + Playwright deps | ✅ PASS |
| P1 Stability | Quality gate | `pnpm run verify` | ✅ PASS |
| P1 Stability | Smoke gate | `pnpm run test:e2e:smoke` | ✅ PASS (6/6) |
| P1 Deploy | Co-hosting preflight | `check-hosting-sync --strict` | ✅ PASS |
| P1 Deploy | VPS preflight | `scripts/vps-preflight.sh` | ✅ PASS |
| P1 Deploy | Nginx contract | `validate-cohosting-config.sh` | ✅ PASS |
| P0 Deploy | Placeholder secrets check | scan `/var/www/my-portfolio/shared/env` for `replace-with|change-me|your-code` | ✅ PASS |
| P1 Deploy | Staging deploy drill | `ops/deploy/deploy.sh --env staging` | ✅ PASS |
| P1 Deploy | Production deploy drill | `ops/deploy/deploy.sh --env production` (multi-release) | ✅ PASS |
| P1 Deploy | Rollback drill | `ops/deploy/rollback.sh --env production` | ✅ PASS |
| P1 Deploy | Health checks | `GET /api/ready` on 3002/3003 | ✅ PASS |
| P0 Deploy | TLS/HSTS evidence on live domains | `curl -I https://...` | ⚠️ PARTIAL (portfolio reachable with 503 upstream; toolbox timeout) |
| P0 Deploy | Cert renewal ownership evidence | local cert tool check (`certbot`) | ⚠️ BLOCKED (`certbot` not installed) |
| P1 Performance | Lighthouse policy gate | `pnpm run lighthouse:ci` | ✅ PASS |

## Remaining External Blockers
- گواهی renewal ownership هنوز نیازمند شواهد محیط edge/VPS واقعی است (tooling محلی `certbot` ندارد).
- برای دامنه `persiantoolbox.ir` در زمان اجرا timeout دریافت شد و نیاز به بررسی شبکه/edge واقعی دارد.

## Evidence
- `artifacts/roadmap3-prereqs-20260218T090801Z.log`
- `artifacts/roadmap3-verify-20260218T090801Z.log`
- `artifacts/roadmap3-smoke-20260218T090801Z.log`
- `artifacts/roadmap3-hosting-sync-20260218T090801Z.log`
- `artifacts/roadmap3-vps-preflight-20260218T090801Z.log`
- `artifacts/roadmap3-validate-nginx-20260218T090801Z.log`
- `artifacts/roadmap3-placeholder-secrets-20260218T090801Z.log`
- `artifacts/roadmap3-deploy-staging-20260218T090801Z.log`
- `artifacts/roadmap3-deploy-production-final-20260218T090801Z.log`
- `artifacts/roadmap3-rollback-production-20260218T090801Z.log`
- `artifacts/roadmap3-health-production-20260218T090801Z.log`
- `artifacts/roadmap3-health-staging-20260218T090801Z.log`
- `artifacts/roadmap3-lighthouse-20260218T090801Z.log`
- `artifacts/roadmap3-tls-check-portfolio-20260218T090801Z.log`
- `artifacts/roadmap3-tls-check-toolbox-20260218T090801Z.log`
- `artifacts/roadmap3-cert-renewal-evidence-20260218T090801Z.log`
