# Deployment Autorun Report - 2026-02-17

Generated at: 2026-02-17 19:34:29 UTC

## Executed Commands
- `node scripts/deploy-gate.mjs` -> FAIL
- `bash scripts/deploy/validate-cohosting-config.sh` -> PASS
- `bash scripts/deploy/check-hosting-sync.sh --strict` -> FAIL (expected outside VPS)
- `bash scripts/vps-preflight.sh` -> FAIL (expected outside VPS)
- `pnpm run verify` -> FAIL (Next build lock while another Next process was active)
- `pnpm run test:e2e:smoke` -> PASS with 1 flaky test (passed on retry)
- `scripts/deploy/verify-public-edge.sh alirezasafeidev.ir 185.3.124.93` -> FAIL (DNS unresolved)
- `scripts/deploy/verify-public-edge.sh persiantoolbox.ir 185.3.124.93` -> FAIL (HSTS header missing in response snapshot)
- External DNS/HTTP checks for `alirezasafeidev.ir` -> FAIL in this environment (DNS resolution unavailable)

## Key Outputs

### Deploy Gate
Incomplete blockers reported:
- `P0-04`, `P0-07`, `P0-08`, `P0-09`, `P0-10`
- `P1-01`, `P1-02`, `P1-03`, `P1-04`, `P1-05`, `P1-06`, `P1-07`, `P1-08`, `P1-09`, `P1-10`

### Co-hosting Config Validation
- Contract validation passed for `ops/nginx/asdev-cohosting.conf`.

### Hosting Sync / VPS Preflight
- Missing VPS paths:
  - `/var/www/persian-tools`
  - `/var/www/my-portfolio`
- Missing binaries in current environment:
  - `pm2`
  - `nginx`

### Verify / Tests
- Lint: PASS
- Type-check: PASS
- Unit/Integration tests (Vitest): PASS (`22` files, `162` tests)
- Build: FAIL (lock conflict in `.next`)
- Smoke E2E: PASS overall, with one flaky retry in language-switch menu selection

### DNS/Public Edge
- Domain resolution for `alirezasafeidev.ir` was not available from this runtime at execution time.
- Public TLS/header verification could not be completed here.

## Conclusion
- Repo-level operational scripts are executable and partially green.
- Remaining executable steps now require running from the target VPS and/or after DNS authority propagation is fixed.
