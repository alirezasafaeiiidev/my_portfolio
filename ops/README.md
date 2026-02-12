# VPS Operations Pack (My Portfolio)

This folder provides deployment assets for Ubuntu 22.04 with Bun + PM2 + Nginx.

## Files

- `ops/deploy/deploy.sh`: release deploy script (staging/production)
- `ops/deploy/rollback.sh`: rollback script to previous or target release
- `ops/nginx/my-portfolio.conf`: sample Nginx vhost for staging + production
- `ops/systemd/my-portfolio-production.service`: PM2 runtime service for production
- `ops/systemd/my-portfolio-staging.service`: PM2 runtime service for staging
- `scripts/deploy/provision-nginx-site.sh`: create/enable multi-site Nginx vhost
- `scripts/deploy/encode-env-file.sh`: encode env files for GitHub secrets
- `scripts/deploy/check-hosting-sync.sh`: audit shared ports + storage/cache layout

## Server Layout

- `/var/www/my-portfolio/releases/<env>/<release_id>`
- `/var/www/my-portfolio/current/<env>`
- `/var/www/my-portfolio/shared/env/<env>.env`
- `/var/www/my-portfolio/shared/logs/`

## Port Plan

- Production: `3002`
- Staging: `3003`
- Keep `3000/3001` for `persian-tools`
- Keep `3004/3005` reserved for the third site
