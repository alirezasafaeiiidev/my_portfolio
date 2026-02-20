# Deployment Prechecklist — Execution Record (2026-02-20, hotfix5)

## Release Snapshot
- Production release: `20260220T141000Z-hotfix5`
- Production domain: `https://alirezasafaeisystems.ir`
- Staging domain: `https://staging.alirezasafaeisystems.ir`
- PR merged: `#71` (`d01f949236970509bfba4660fd8b67da630a202d`)

## Before Deploy
- [x] Co-hosting dependency order confirmed for this release window.
- [x] `pnpm run verify` passed on the release commit.
- [x] `pnpm run test:e2e:smoke` passed on the release commit/CI.
- [x] Production `.env` exists at `/var/www/my-portfolio/shared/env/production.env`.
- [x] No placeholder secrets remain (`replace-with-*`).
- [x] Server has required binaries: `node`, `pnpm`, `pm2`, `rsync`, `curl`.
- [x] Target directories writable by deploy user.
- [x] TLS termination path confirmed and certificate validity checked.
- [ ] Co-hosting topology strict check re-run for this exact hotfix record:
  - `bash scripts/deploy/check-hosting-sync.sh --strict`
- [x] Unified nginx contract validated: `bash scripts/deploy/validate-cohosting-config.sh`.

## Deploy
- [x] Ran `ops/deploy/deploy.sh --env production --source-dir <release-dir>`.
- [x] Health check `GET /api/ready` returns `status: ready`.
- [x] Home and admin-login pages load via production domain.

## After Deploy
- [x] Checked PM2 logs for runtime errors and stabilized locale/proxy behavior.
- [x] Confirmed Nginx upstream points to expected production process/port.
- [x] Confirmed cache/security headers on public and API routes.
- [x] Confirmed both domains are healthy after portfolio deploy:
- [x] `https://persiantoolbox.ir` (no regression)
- [x] `https://alirezasafaeisystems.ir` (portfolio healthy)

## Rollback (if needed)
- [ ] Run `ops/deploy/rollback.sh --env production`.
- [ ] Re-run health and smoke checks.
- [ ] Capture rollback reason and corrective action in release notes.
- [ ] Run formal rollback drill and store incident note:
  - `bash scripts/deploy/run-rollback-drill.sh --env production --site-url https://alirezasafaeisystems.ir`

Notes:
- Rollback was not required in this release window.
- Existing rollback/governance evidence remains available under `docs/runtime/Incidents/` and `docs/runtime/GoNoGo_Evidence/`.
- Co-hosting strict script should be re-run from VPS context for an explicit pass line in this record.

## Release Governance
- [x] Go/no-go evidence bundle exists (latest before this hotfix):
  - `docs/runtime/GoNoGo_Evidence/go-no-go-20260220T125551Z.md`
- [x] Ownership matrix is filled:
  - `docs/ONCALL_ESCALATION.md`
- [x] Ownership placeholders validation is passing:
  - `bash scripts/release/validate-ownership.sh`

## Quick Evidence (this window)
- `https://alirezasafaeisystems.ir/` -> `200`
- `https://alirezasafaeisystems.ir/fa` -> `307` (canonical redirect)
- `https://alirezasafaeisystems.ir/api/ready` -> `200`
- `https://persiantoolbox.ir` -> `200`
