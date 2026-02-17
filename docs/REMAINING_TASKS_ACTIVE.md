# Remaining Tasks - Active Queue

Last autorun evidence: `docs/REMAINING_AUTOPILOT_2026-02-17T20-03-06Z.md`

## In Progress (auto-run enabled)
- [ ] `P0/P1 deploy gate` (blocked by open product backlog in `TASKS.md`)
- [ ] `Strict hosting sync` on target VPS (`/var/www/persian-tools`, `/var/www/my-portfolio`)
- [ ] `VPS preflight` (`nginx` missing in this runtime)
- [x] Public edge DNS readiness for `alirezasafeidev.ir` (confirmed from registrar/CDN panel screenshots on 2026-02-17)
- [x] Public edge TLS certificate match for `alirezasafeidev.ir` (fixed on 2026-02-17; cert SAN includes apex + www)
- [x] Public edge HSTS verification for `persiantoolbox.ir`

## Green checks in latest autorun
- [x] Co-hosting nginx contract validation
- [x] Lint
- [x] Type-check
- [x] Unit/Integration tests
- [x] E2E smoke (isolated dev server)
- [x] Public edge check for `persiantoolbox.ir`
- [x] Public edge check for `alirezasafeidev.ir`
