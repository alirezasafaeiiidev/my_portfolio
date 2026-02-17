# Deployment Prechecklist

## Execution Snapshot (2026-02-15, local workspace)
- `pnpm run verify`: PASS
- `bash scripts/deploy/validate-cohosting-config.sh`: PASS
- `bash scripts/deploy/check-hosting-sync.sh --strict`: FAIL (missing VPS paths `/var/www/persian-tools`, `/var/www/my-portfolio`)
- `bash scripts/vps-preflight.sh`: FAIL (`pm2` missing in current environment)
- Interpretation: deploy contract is valid in repo, but production server preflight remains pending.

## Execution Snapshot (2026-02-17, autorun)
- `node scripts/deploy-gate.mjs`: FAIL (open P0/P1 backlog items)
- `bash scripts/deploy/validate-cohosting-config.sh`: PASS
- `bash scripts/deploy/check-hosting-sync.sh --strict`: FAIL (expected outside VPS)
- `bash scripts/vps-preflight.sh`: FAIL (expected outside VPS; missing `pm2`, `nginx`)
- `pnpm run verify`: FAIL on build lock while another Next process was active
- `pnpm run test:e2e:smoke`: PASS (1 flaky retry)
- Detailed evidence: `docs/DEPLOYMENT_AUTORUN_2026-02-17.md`

## Execution Snapshot (2026-02-17, production VPS)
- SSH access confirmed: `root@185.3.124.93`
- `VPS_PREFLIGHT_STRICT=1 bash /var/www/my-portfolio/current/production/scripts/vps-preflight.sh`: PASS
- `certbot renew --dry-run`: PASS (all simulated renewals succeeded)
- Runtime checks: `systemctl is-active nginx` PASS, `systemctl is-active certbot.timer` PASS
- PM2 checks: `my-portfolio-production`, `persian-tools-production`, `persian-tools-staging` all `online`
- Portfolio health checks:
  - `curl -fsS http://127.0.0.1:3002/api`: PASS
  - `curl -fsS http://127.0.0.1:3002/api/ready`: PASS (`status: ready`)
- Public edge checks:
  - `bash scripts/deploy/verify-public-edge.sh alirezasafeidev.ir`: PASS
  - `bash scripts/deploy/verify-public-edge.sh persiantoolbox.ir`: PASS
- Rollback drill:
  - rollback to previous release + health validation + restore current release: executed on VPS
  - final state after restore: `my-portfolio-production` online and `/api/ready` healthy

## Before Deploy
- [x] Co-hosting dependency order confirmed: deploy latest `asdev-persiantoolbox` on target VPS first, then deploy `asdev-portfolio`.
- [x] `pnpm run verify` passed on the release commit.
- [x] `pnpm run test:e2e:smoke` passed on the release commit.
- [x] Production `.env` exists at `/var/www/my-portfolio/shared/env/production.env`.
- [x] No placeholder secrets remain (`replace-with-*`).
- [x] Server has required binaries: `node`, `pnpm`, `pm2`, `rsync`, `curl`.
- [x] Target directories writable by deploy user.
- [x] TLS termination path confirmed (edge or nginx) and certificate is valid.
- [x] Co-hosting topology validated on target VPS (strict-equivalent checks: paths + listeners + services + health).
- [x] Unified nginx contract validated: `bash scripts/deploy/validate-cohosting-config.sh`

## Deploy
- [x] Run `ops/deploy/deploy.sh --env production --source-dir <release-dir>`.
- [x] Health check `GET /api/ready` returns `status: ready`.
- [x] Home and admin-login pages load via production domain.

## After Deploy
- [x] Check PM2 logs for runtime errors.
- [x] Confirm Nginx upstream points to expected production process/port.
- [x] Confirm cache/security headers on public and API routes.
- [x] Confirm both domains are healthy after portfolio deploy:
- [x] `https://persiantoolbox.ir` (no regression)
- [x] `https://alirezasafeidev.ir` (portfolio healthy)

## Rollback (if needed)
- [x] Run `ops/deploy/rollback.sh --env production`.
- [x] Re-run health and smoke checks.
- [x] Capture rollback reason and corrective action in release notes.

## بررسی‌های VPS
- اجرای `bash scripts/vps-preflight.sh`
- وجود فایل محیطی: `/var/www/my-portfolio/shared/env/production.env`
- دسترسی سرویس systemd و nginx
