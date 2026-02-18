# VPS Domain Health Snapshot — 2026-02-18

Environment: `root@185.3.124.93`

## Portfolio Domains
- `https://alirezasafaeisystems.ir` -> `200`
- `https://www.alirezasafaeisystems.ir` -> `200`
- `https://staging.alirezasafaeisystems.ir` -> `200`
- `http://alirezasafaeisystems.ir` -> `301` to HTTPS
- TLS:
  - CN=`alirezasafaeisystems.ir`
  - SAN includes `alirezasafaeisystems.ir`, `www.alirezasafaeisystems.ir`
  - Staging cert CN=`staging.alirezasafaeisystems.ir`

## Co-hosted Toolbox Domains
- `https://persiantoolbox.ir` -> `200`
- `https://staging.persiantoolbox.ir` -> `200`
- TLS:
  - CN=`persiantoolbox.ir`
  - SAN includes `persiantoolbox.ir`, `www.persiantoolbox.ir`, `staging.persiantoolbox.ir`

## PM2 Runtime
- `my-portfolio-production` online on `127.0.0.1:3002`
- `my-portfolio-staging` online on `127.0.0.1:3003`

## Notes
- `NEXT_PUBLIC_SITE_URL` on production env updated to `https://alirezasafaeisystems.ir`
- Secret rotation executed for admin credentials/token/session secret; secure copy stored on VPS:
  - `/root/.secrets/my-portfolio-rotated-20260218T135437Z.txt`
