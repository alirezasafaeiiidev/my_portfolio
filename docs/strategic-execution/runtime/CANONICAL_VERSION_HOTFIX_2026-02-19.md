# Canonical Version Hotfix — 2026-02-19

Objective:
- Force production root traffic to a single canonical URL:
  - `https://alirezasafaeisystems.ir/?v=12345`
- Prevent stale homepage cache from showing old UI version.

Executed changes (VPS):
- Active nginx site file: `/etc/nginx/sites-available/my-portfolio.conf`
- Production root rule enforced:
  - `https://alirezasafaeisystems.ir/` -> `302` to canonical URL
  - `https://www.alirezasafaeisystems.ir/` -> `302` to canonical URL
- No-cache headers enforced on versioned production homepage route.
- Old production releases removed; only current release kept:
  - `/var/www/my-portfolio/releases/production/20260218T225147Z`

Stability remediation:
- After old release cleanup, staging process referenced a removed release and returned `500`.
- Staging was redeployed and recovered:
  - new staging release: `/var/www/my-portfolio/releases/staging/20260219T042813Z`
  - `https://staging.alirezasafaeisystems.ir/` -> `200`
  - `https://staging.alirezasafaeisystems.ir/api/ready` -> `200`

Rollback drill evidence:
- Incident note generated:
  - `docs/strategic-execution/runtime/Incidents/20260219T042807Z_rollback-drill-staging.md`
- Drill status in that run: failed (`at least two releases are required` at that moment).
- Follow-up completed: staging release inventory was rebuilt and service restored on latest release.

Validation snapshot:
- Production:
  - `/` -> `302` (`Location: https://alirezasafaeisystems.ir/?v=12345`)
  - `/?v=12345` -> `200`
- Runtime:
  - PM2 `my-portfolio-production` -> `online`, restarts `0`
  - PM2 `my-portfolio-staging` -> `online`, restarts `0`

Cache warmup (post-canonical):
- Warmup log:
  - `/var/www/my-portfolio/shared/logs/deploy/cache-warmup-20260219T044610Z.log`
- Results:
  - canonical production endpoints returned expected `302`/`200`
  - content check confirms `new_brand=yes`, `legacy_text=no`
