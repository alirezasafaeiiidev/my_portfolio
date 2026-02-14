# Deployment Roadmap

## Objective
Move from "application-ready" to "production-server-ready" with explicit security and operations controls.

## P0 (Blockers)
- [ ] Enforce HTTPS and HSTS in production edge config.
  - Owner: DevOps
  - Evidence: updated nginx config + successful TLS test
- [ ] Confirm certificate automation/renewal ownership.
  - Owner: DevOps
  - Evidence: renewal method documented and tested
- [ ] Replace all placeholder production secrets.
  - Owner: Platform owner
  - Evidence: secure env file in server path + successful restart

## P1 (Stability)
- [ ] Add readiness check for critical dependencies (DB/config) in API.
  - Owner: Backend
  - Evidence: readiness endpoint + test coverage
- [ ] Add server deployment preflight checklist.
  - Owner: DevOps
  - Evidence: completed checklist before each release
- [ ] Document rollback drill procedure (with one verified drill result).
  - Owner: DevOps
  - Evidence: dated rollback test note

## P2 (Hardening)
- [ ] Add explicit security headers at edge (CSP, X-Frame-Options, Referrer-Policy consistency).
  - Owner: DevOps
  - Evidence: curl header snapshot in production
- [ ] Add uptime and error budget operational dashboard references.
  - Owner: Platform owner
  - Evidence: monitoring links in runbook

## Completion Criteria
- P0 completed.
- P1 completed.
- Release and rollback both verified in staging.
- Production smoke checks pass after cutover.
