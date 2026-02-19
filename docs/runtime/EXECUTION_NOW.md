# Immediate Execution List

Updated: 2026-02-19

## Phase P0 (Done in Local)
- [x] Remove dead/legacy docs and stale operational artifacts.
- [x] Keep only active docs index and runtime evidence structure.
- [x] Remove unused libraries from `package.json`.
- [x] Align dependency audit workflow with pnpm.
- [x] Align release/runtime script paths to `docs/runtime/`.
- [x] Run local quality gate (`pnpm run verify`) and keep it green.
- [x] Ignore generated artifacts in git (`artifacts/`).

## Phase P1 (Operational, Partially Blocked)
- [x] Prepare edge-header verification evidence file:
  - `docs/runtime/EDGE_HEADER_VERIFICATION_2026-02-19.md`
- [x] Generate fresh go/no-go runtime evidence bundle:
  - `docs/runtime/GoNoGo_Evidence/go-no-go-20260219T110218Z.md`
- [x] Publish monthly incident/noise review:
  - `docs/runtime/Incidents/2026-02_monthly_incident_noise_review.md`
- [ ] Re-run edge-header verification from VPS/trusted network (local network timed out).
- [ ] Confirm GitHub org 2FA enforcement status in governance records.
  - Blocker: current GitHub token lacks `admin:org` scope.
- [ ] Confirm secure storage location/process for 2FA recovery codes.
  - Blocker: owner/security confirmation required (non-local input).

## Phase P2 (Owner Inputs, Required for 10/10)
- [ ] Final CTA decision (single primary CTA).
- [ ] Final service catalog (3-6 offers with measurable deliverables).
- [ ] Pricing policy (public or form-only).
- [ ] Final proof metrics for case studies.
- [ ] Lead notification destination finalization.
- [ ] Data retention policy for leads/messages.

## Next Run Commands (No Rework)
```bash
pnpm run verify
pnpm run release:validate-ownership
SITE_URL=https://alirezasafaeisystems.ir STAGING_URL=https://staging.alirezasafaeisystems.ir RUN_VERIFY=0 RUN_SMOKE=0 RUN_LIGHTHOUSE=0 pnpm run release:evidence
```
