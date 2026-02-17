# Automatic Roadmap Follow-up v3

## Baseline
- Strict run: `artifacts/repro_v3_20260217T223752Z_commands.tsv`
- OSV verified: `artifacts/repro_v3_20260217T223752Z_10_osv_scan_local.log`
- Trivy secret/misconfig verified: `artifacts/repro_v3_20260217T223752Z_14_trivy_fs_secret_misconfig.log`
- Remaining blockers:
  - Docker engine missing: `artifacts/repro_v3_20260217T223752Z_12_docker_build.log`
  - Trivy vuln DB blocked: `artifacts/repro_v3_20260217T223752Z_15_trivy_fs_vuln_attempt.log`

## Execution Plan
| Priority | Action | Owner | ETA | Evidence |
|---|---|---|---|---|
| P0 | Keep website checks with `--noproxy '*'` in all reproducibility runs | SRE | 1 day | `artifacts/repro_v3_20260217T223752Z_16_web_surface_root.log` |
| P0 | Keep OSV local-binary command as mandatory gate | Security | 1 day | `artifacts/repro_v3_20260217T223752Z_10_osv_scan_local.log` |
| P1 | Install Docker/Podman on runner | DevOps | 1-3 days | new `docker --version` artifact |
| P1 | Re-enable image build + image scan path | DevOps/Security | 1-3 days | new `repro_*_12/13` logs with real execution |
| P1 | Unblock Trivy DB egress (`mirror.gcr.io` or `ghcr.io`) | NetOps/Security | 1-3 days | new `trivy fs --scanners vuln,secret,misconfig` pass log |
| P2 | Add waiver policy for blocked security gates (expiry+owner) | PM/Security | 3-7 days | policy doc artifact |
| P2 | Package all strict commands in one script + CI retention | Platform | 3-7 days | canonical script + CI artifact bundle |

## Exact Next Commands
1. `sudo apt-get update && sudo apt-get install -y docker.io`
2. `docker --version && docker info`
3. `docker build -t asdev-portfolio:audit-next .`
4. `NO_PROXY='*' HTTPS_PROXY='' HTTP_PROXY='' artifacts/bin/trivy fs --scanners vuln,secret,misconfig --timeout 10m .`
5. `NO_PROXY='*' HTTPS_PROXY='' HTTP_PROXY='' artifacts/bin/osv-scanner scan -r .`

## Acceptance Criteria
- A1: `repro_*_commands.tsv` shows all mandatory steps executed in strict order.
- A2: OSV and Trivy vuln scans are both executed with archived logs.
- A3: Docker build and image scan are executed or a waiver ID is recorded in report.
