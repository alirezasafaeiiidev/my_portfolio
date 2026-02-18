# Audit Report (Validated)

## Blocker
- Original `./AUDIT_REPORT.md` was missing in the repository; a fresh validated report was generated from rerun evidence.

## Evidence Verification

| Evidence ID | Command | Expected Path | Status | Notes |
|---|---|---|---|---|
| EVID-001 | `pnpm install --frozen-lockfile` | `artifacts/install-20260218T054013Z.log` | VERIFIED | Install completed, lockfile up to date. |
| EVID-002 | `pnpm run lint` | `artifacts/lint-20260218T054013Z.log` | VERIFIED | Lint completed with exit code 0. |
| EVID-003 | `pnpm run type-check` | `artifacts/typecheck-20260218T054013Z.log` | VERIFIED | Typecheck completed with exit code 0. |
| EVID-004 | `pnpm run test` | `artifacts/unit-tests-20260218T054013Z.log` | VERIFIED | 20 files / 156 tests passed. |
| EVID-005 | `timeout 300 pnpm run test:e2e:smoke` | `artifacts/e2e-smoke-20260218T054013Z.log` | VERIFIED | Command executed; failed because Playwright webServer exited early. |
| EVID-006 | `timeout 300 pnpm run test:e2e` | `artifacts/e2e-full-20260218T054013Z.log` | VERIFIED | Command executed; failed because Playwright webServer exited early. |
| EVID-007 | `timeout 300 pnpm run lighthouse:ci` | `artifacts/lighthouse-20260218T054013Z.log` | VERIFIED | Command executed; failed due missing Chrome installation. |
| EVID-008 | `pnpm audit --audit-level=high` | `artifacts/dependency-audit-20260218T054013Z.log` | VERIFIED | Completed; reported 4 vulns (2 low, 2 moderate). |
| EVID-009 | `osv-scanner --lockfile=pnpm-lock.yaml --format json` | `artifacts/osv-20260218T054013Z.log` | VERIFIED | Tool unavailable (`osv-scanner not installed`). |
| EVID-010 | `pnpm run scan:secrets` | `artifacts/secrets-scan-20260218T054013Z.log` | VERIFIED | Secret scan passed. |
| EVID-011 | `docker build -t asdev-portfolio:audit-20260218T054013Z .` | `artifacts/docker-build-20260218T054013Z.log` | VERIFIED | Tool unavailable (`docker not installed`). |
| EVID-012 | `trivy image --severity HIGH,CRITICAL asdev-portfolio:audit-20260218T054013Z` | `artifacts/trivy-20260218T054013Z.log` | VERIFIED | Tool unavailable (`trivy not installed`). |
| EVID-013 | `pnpm run scan:external` | `artifacts/website-surface-20260218T054013Z.log` | VERIFIED | Completed; no external runtime dependencies found. |
| EVID-014 | Full ordered run ledger | `artifacts/audit-status-20260218T054013Z.txt` | VERIFIED | Contains strict ordered pipeline execution + exit codes. |

## Reproducibility
Exact ordered pipeline executed:

1. `pnpm install --frozen-lockfile` → `artifacts/install-20260218T054013Z.log`
2. `pnpm run lint` → `artifacts/lint-20260218T054013Z.log`
3. `pnpm run type-check` → `artifacts/typecheck-20260218T054013Z.log`
4. `pnpm run test` → `artifacts/unit-tests-20260218T054013Z.log`
5. `timeout 300 pnpm run test:e2e:smoke` → `artifacts/e2e-smoke-20260218T054013Z.log`
6. `timeout 300 pnpm run test:e2e` → `artifacts/e2e-full-20260218T054013Z.log`
7. `timeout 300 pnpm run lighthouse:ci` → `artifacts/lighthouse-20260218T054013Z.log`
8. `pnpm audit --audit-level=high` → `artifacts/dependency-audit-20260218T054013Z.log`
9. `osv-scanner --lockfile=pnpm-lock.yaml --format json` → `artifacts/osv-20260218T054013Z.log`
10. `pnpm run scan:secrets` → `artifacts/secrets-scan-20260218T054013Z.log`
11. `docker build -t asdev-portfolio:audit-20260218T054013Z .` → `artifacts/docker-build-20260218T054013Z.log`
12. `trivy image --severity HIGH,CRITICAL asdev-portfolio:audit-20260218T054013Z` → `artifacts/trivy-20260218T054013Z.log`
13. `pnpm run scan:external` → `artifacts/website-surface-20260218T054013Z.log`

Ordered status ledger: `artifacts/audit-status-20260218T054013Z.txt`
