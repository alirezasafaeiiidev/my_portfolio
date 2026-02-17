# Automatic Roadmap Follow-up

## Current Execution Snapshot
- Baseline strict run: `artifacts/repro_v2_20260217T222420Z_commands.tsv`
- OSV verified via local binary: `artifacts/proceed_20260217T223158Z_osv_scan_noproxy.log`
- Trivy secret/misconfig verified: `artifacts/proceed_20260217T223451Z_trivy_secret_misconfig.log`
- Remaining blockers: Docker engine unavailable; Trivy vulnerability DB fetch blocked (403/TLS timeout).

## Pass-3 Roadmap (Automatic)
### P0 (Immediate)
1. Standardize website checks with `--noproxy '*'` in all runbooks/pipeline commands.
2. Use local `artifacts/bin/osv-scanner` in strict pipeline and remove OSV NOT VERIFIED status.
3. Keep Trivy secret/misconfig gate active as interim control.

### P1 (Next Infra Pass)
1. Provide container runtime (`docker`/`podman`/`buildah`) and rerun image build step.
2. Allow Trivy DB egress (`mirror.gcr.io` or `ghcr.io`) or provide an internal DB mirror/cache.
3. Re-run `artifacts/bin/trivy fs --scanners vuln,secret,misconfig .` and archive full results.

### P2 (Hardening)
1. Add signed, repeatable tool bootstrap script for OSV/Trivy binaries with checksum verification.
2. Add dedicated CI job for reproducibility artifacts upload and retention policy.

## Acceptance Gates
- Gate A: `osv-scanner scan -r .` executes in pipeline with archived output.
- Gate B: `trivy fs --scanners vuln,secret,misconfig .` executes with vuln DB available.
- Gate C: container build + image scan run end-to-end or are explicitly waived with approved exception ID.
