# VPS Access Check — 2026-02-19

Target:
- Host: `185.3.124.93`
- Login user: `deploy`

## Access
- SSH to `deploy@185.3.124.93`: `OK`
- SSH to `root@185.3.124.93`: `Permission denied` (expected)

## Readiness
- `http://127.0.0.1:3002/api/ready` -> `200`
- `http://127.0.0.1:3003/api/ready` -> `200`
- `https://alirezasafaeisystems.ir/api/ready` -> `200`
- `https://www.alirezasafaeisystems.ir/api/ready` -> `200`
- `https://staging.alirezasafaeisystems.ir/api/ready` -> `200`

## Smoke
- `https://alirezasafaeisystems.ir/` -> `302` (to `/?v=12345`)
- `https://alirezasafaeisystems.ir/services` -> `200`
- `https://alirezasafaeisystems.ir/case-studies` -> `200`
- `https://alirezasafaeisystems.ir/admin/login` -> `200`

## TLS / Header Snapshot
- Certificate issuer: `Let's Encrypt R12`
- Certificate validity:
  - `notBefore=Feb 18 11:27:11 2026 GMT`
  - `notAfter=May 19 11:27:10 2026 GMT`
- Staging edge includes:
  - `strict-transport-security`
  - `content-security-policy`
  - `x-frame-options`
  - `referrer-policy`

## Runtime Topology Observed
- Active listeners: `80`, `443`, `127.0.0.1:3000..3003`
- Active nginx sites include:
  - `my-portfolio.conf`
  - `persian-tools.conf`
- `asdev-cohosting.conf` exists but is not active symlink in `sites-enabled`.

## Note
- `pm2 ls` under `deploy` returned empty; app ports are still healthy and serving.
- `my-portfolio-production.service` / `my-portfolio-staging.service` not found under systemd names queried from docs.

