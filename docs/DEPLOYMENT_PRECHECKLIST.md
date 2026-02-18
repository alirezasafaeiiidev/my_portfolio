# Deployment Prechecklist

## Execution Snapshot (2026-02-15, local workspace)
- `pnpm run verify`: PASS
- `bash scripts/deploy/validate-cohosting-config.sh`: PASS
- `bash scripts/deploy/check-hosting-sync.sh --strict`: FAIL (missing VPS paths `/var/www/persian-tools`, `/var/www/my-portfolio`)
- `bash scripts/vps-preflight.sh`: FAIL (`pm2` missing in current environment)
- Interpretation: deploy contract is valid in repo, but production server preflight remains pending.

## Before Deploy
- [ ] Co-hosting dependency order confirmed: deploy latest `asdev-persiantoolbox` on target VPS first, then deploy `asdev-portfolio`.
- [ ] `pnpm run verify` passed on the release commit.
- [ ] `pnpm run test:e2e:smoke` passed on the release commit.
- [ ] Production `.env` exists at `/var/www/my-portfolio/shared/env/production.env`.
- [ ] No placeholder secrets remain (`replace-with-*`).
- [ ] Server has required binaries: `node`, `pnpm`, `pm2`, `rsync`, `curl`.
- [ ] Target directories writable by deploy user.
- [ ] TLS termination path confirmed (edge or nginx) and certificate is valid.
- [ ] Co-hosting topology validated: `bash scripts/deploy/check-hosting-sync.sh --strict`
- [ ] Unified nginx contract validated: `bash scripts/deploy/validate-cohosting-config.sh`

## Deploy
- [ ] Run `ops/deploy/deploy.sh --env production --source-dir <release-dir>`.
- [ ] Health check `GET /api/ready` returns `status: ready`.
- [ ] Home and admin-login pages load via production domain.

## After Deploy
- [ ] Check PM2 logs for runtime errors.
- [ ] Confirm Nginx upstream points to expected production process/port.
- [ ] Confirm cache/security headers on public and API routes.
- [ ] Confirm both domains are healthy after portfolio deploy:
- [ ] `https://persiantoolbox.ir` (no regression)
- [ ] `https://alirezasafaeisystems.ir` (portfolio healthy)

## Rollback (if needed)
- [ ] Run `ops/deploy/rollback.sh --env production`.
- [ ] Re-run health and smoke checks.
- [ ] Capture rollback reason and corrective action in release notes.

## بررسی‌های VPS
- اجرای `bash scripts/vps-preflight.sh`
- وجود فایل محیطی: `/var/www/my-portfolio/shared/env/production.env`
- دسترسی سرویس systemd و nginx
