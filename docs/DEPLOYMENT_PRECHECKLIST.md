# Deployment Prechecklist

## Before Deploy
- [ ] `pnpm -s verify` passed on the release commit.
- [ ] `pnpm -s test:e2e:smoke` passed on the release commit.
- [ ] Production `.env` exists at `/var/www/my-portfolio/shared/env/production.env`.
- [ ] No placeholder secrets remain (`replace-with-*`).
- [ ] Server has required binaries: `bun`, `pm2`, `rsync`, `curl`.
- [ ] Target directories writable by deploy user.
- [ ] TLS termination path confirmed (edge or nginx) and certificate is valid.

## Deploy
- [ ] Run `ops/deploy/deploy.sh --env production --source-dir <release-dir>`.
- [ ] Health check `GET /api` returns `status: ok`.
- [ ] Home and admin-login pages load via production domain.

## After Deploy
- [ ] Check PM2 logs for runtime errors.
- [ ] Confirm Nginx upstream points to expected production process/port.
- [ ] Confirm cache/security headers on public and API routes.

## Rollback (if needed)
- [ ] Run `ops/deploy/rollback.sh --env production`.
- [ ] Re-run health and smoke checks.
- [ ] Capture rollback reason and corrective action in release notes.

## بررسی‌های VPS
- اجرای `bash scripts/vps-preflight.sh`
- وجود فایل محیطی: `/var/www/my-portfolio/shared/env/production.env`
- دسترسی سرویس systemd و nginx
