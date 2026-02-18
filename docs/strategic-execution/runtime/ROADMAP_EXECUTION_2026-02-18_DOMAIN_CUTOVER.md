# Roadmap Execution — Domain Cutover (2026-02-18)

## Scope
- Project: `asdev-portfolio`
- Domain migration: `alirezasafaeidev.ir` -> `alirezasafaeisystems.ir`
- Environments: local repo, GitHub, VPS edge/runtime

## Actions Executed
1. Updated codebase/domain references, nginx templates, deploy scripts, and tests.
2. Opened and merged PR `#38` into `main`.
3. Connected to VPS and validated DNS/runtime prerequisites.
4. Issued TLS certs via certbot for:
   - `alirezasafaeisystems.ir`
   - `www.alirezasafaeisystems.ir`
   - `staging.alirezasafaeisystems.ir`
5. Applied live nginx config switch to new domain and reloaded nginx.
6. Updated production env base URL:
   - `NEXT_PUBLIC_SITE_URL=https://alirezasafaeisystems.ir`
7. Recovered runtime after interrupted build path issue and stabilized PM2:
   - `my-portfolio-production` on `127.0.0.1:3002`
   - `my-portfolio-staging` on `127.0.0.1:3003`

## Verification Results
- DNS:
  - `NS`: `g.ns.arvancdn.ir`, `o.ns.arvancdn.ir`
  - `A`: apex, `www`, and `staging` resolved to `185.3.124.93`
- TLS:
  - apex/www cert CN/SAN valid for `alirezasafaeisystems.ir` and `www.alirezasafaeisystems.ir`
  - staging cert CN/SAN valid for `staging.alirezasafaeisystems.ir`
- HTTP behavior:
  - `http://alirezasafaeisystems.ir` -> `301` to HTTPS
  - `https://alirezasafaeisystems.ir` -> `200`
  - `https://www.alirezasafaeisystems.ir` -> `200`
  - `https://staging.alirezasafaeisystems.ir` -> `200`
- Security headers:
  - `Strict-Transport-Security` present on live responses
- PM2:
  - production/staging processes online and listening on expected ports

## Incident & Remediation
- Issue encountered:
  - interrupted build/restart sequence removed expected `.next/standalone/server.js` in active release and caused process crash loop.
- Remediation:
  - immediate rollback to last-known-good standalone release path
  - explicit PM2 re-provisioning with correct env and port bindings
  - post-fix monitoring confirmed stable uptime and no restarts in verification window

## Remaining Work (Next)
1. Validate co-hosted `persiantoolbox.ir` TLS/header/health evidence in the same rigor.
2. Execute formal rollback drill with incident-style report.
3. Rotate production secrets and record owner/date.
