# Post-Deploy Validation — 2026-02-19

Environment:
- VPS: `185.3.124.93`
- Active release: `/var/www/my-portfolio/releases/production/20260218T225147Z`
- Deploy log: `/var/www/my-portfolio/shared/logs/deploy/deploy-production-20260218T225147Z.log`

## Runtime Checks
- PM2 process `my-portfolio-production`: `online` (restart count stable)
- Local readiness: `http://127.0.0.1:3002/api/ready` -> `200`
- Edge readiness: `https://alirezasafaeisystems.ir/api/ready` -> `200`

## Smoke Checks (executed from VPS)
- `https://alirezasafaeisystems.ir/` -> `200`
- `https://alirezasafaeisystems.ir/services` -> `200`
- `https://alirezasafaeisystems.ir/case-studies` -> `200`
- `https://alirezasafaeisystems.ir/admin/login` -> `200`
- `https://alirezasafaeisystems.ir/api/ready` -> `200`
- `https://www.alirezasafaeisystems.ir/api/ready` -> `200`
- `https://staging.alirezasafaeisystems.ir/api/ready` -> `200`

## Edge/TLS Checks
- nginx service: `active`
- nginx config test: `syntax is ok`, `test is successful`
- certificate issuer: `Let's Encrypt R12`
- certificate validity:
  - `notBefore=Feb 18 11:27:11 2026 GMT`
  - `notAfter=May 19 11:27:10 2026 GMT`

## Notes
- External HTTP checks from this local workstation had intermittent timeout during one run.
- VPS-executed smoke checks succeeded and are used as final deployment evidence.
