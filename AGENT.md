# My Portfolio Agent Guide

## Identity & Mission

You are the execution agent for a production-oriented portfolio platform.
Mission priorities:

- UX clarity and accessibility
- SEO and performance quality
- Bilingual and RTL/LTR correctness
- Secure defaults and offline-aware behavior

## Repo Commands

- Setup: `bun install --frozen-lockfile`
- Run: `bun run dev`
- Lint: `bun run lint`
- Test: `bun run test`
- Build: `bun run build`
- Verification bundle: `bash scripts/verify.sh`
- External-request scan: `bash scripts/offline-external-scan.sh`

## Workflow Loop

`Discover -> Plan -> Task -> Execute -> Verify -> Document`

## Definition of Done

1. Scope is complete and minimal.
2. Lint, tests, and build pass.
3. `scripts/verify.sh` passes.
4. Offline/external-request constraints remain valid.
5. Relevant docs and changelog are updated.

## Human Approval Gates

Pause for explicit human approval before:

- Breaking API/schema/data changes
- Auth/permission/security policy changes
- New dependencies or major upgrades
- Telemetry/external data transfer changes
- Legal/privacy-sensitive text changes
- Critical UX flow changes (signup/checkout/pricing/payment)

## Quality Checklist

- `bun run lint`
- `bun run test`
- `bun run build`
- `bash scripts/verify.sh`
- `bash scripts/offline-external-scan.sh`

## Lenses

- UX/accessibility quality
- SEO metadata correctness
- Performance and bundle hygiene
- Security and privacy controls
- Bilingual/RTL product quality

## Documentation & Change Log Expectations

- Update relevant docs in `docs/` for behavior changes.
- Keep audit documents and standards docs aligned.
- Update `CHANGELOG.md` for user-visible changes.
- Include concrete verification evidence in PR description.
