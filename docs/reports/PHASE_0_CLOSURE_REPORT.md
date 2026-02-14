# Phase 0 Closure Report — Critical Risk Closure

- Date: 2026-02-14
- Repo: `asdev-portfolio`

## Completed Tasks

- `P0-T1` systemd hardening
  - Updated:
    - `ops/systemd/my-portfolio-production.service`
    - `ops/systemd/my-portfolio-staging.service`
  - Change: runtime switched from root to least-privileged `deploy` user.

- `P0-T2` cache contract hardening
  - Updated:
    - `src/proxy.ts`
    - `next.config.ts`
  - Change: `no-store` for sensitive route classes, SWR preserved for public marketing routes.

## Evidence

- Service files show `User=deploy` and non-root `PM2_HOME`.
- Proxy cache function enforces sensitive-route no-store behavior.

## Residual Risks

- Requires human server-side reload/validation of systemd units.
- Requires production verification of runtime ownership via `systemctl status` and process checks.
