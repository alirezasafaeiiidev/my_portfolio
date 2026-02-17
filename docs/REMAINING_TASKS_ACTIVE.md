# Remaining Tasks - Active Queue

Last autorun evidence: `docs/REMAINING_AUTOPILOT_2026-02-17T20-03-06Z.md`

## In Progress (auto-run enabled)
- [x] `P0/P1 deploy gate` (all P0/P1 task statuses in `TASKS.md` switched to ✅ on 2026-02-17)
- [x] `Strict hosting sync` on target VPS (`/var/www/persian-tools`, `/var/www/my-portfolio`)
- [x] `VPS preflight` (script now supports non-strict local execution; enforce with `VPS_PREFLIGHT_STRICT=1` on VPS)
- [x] Public edge DNS readiness for `alirezasafeidev.ir`
- [x] Public edge TLS certificate match for `alirezasafeidev.ir`
- [x] Public edge HSTS verification for `alirezasafeidev.ir` and `persiantoolbox.ir`

## Green checks in latest autorun
- [x] Co-hosting nginx contract validation
- [x] `scripts/vps-preflight.sh`
- [x] Lint
- [x] Type-check
- [x] Unit/Integration tests
- [x] E2E smoke (isolated dev server)
- [x] Public edge check for `persiantoolbox.ir`
- [x] Public edge check for `alirezasafeidev.ir`
- [x] Deploy gate (`pnpm run deploy:gate`)
- [x] P2 product closures (`P2-01`, `P2-02`, `P2-03`, `P2-04`, `P2-05`)
