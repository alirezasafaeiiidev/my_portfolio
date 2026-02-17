# Automatic Roadmap Follow-up v2

## Baseline Inputs
- Latest strict reproducibility run: `artifacts/repro_v3_20260217T223752Z_commands.tsv`
- Latest OSV verified run: `artifacts/repro_v3_20260217T223752Z_10_osv_scan_local.log`
- Latest Trivy secret/misconfig run: `artifacts/repro_v3_20260217T223752Z_14_trivy_fs_secret_misconfig.log`
- Current blocker evidence:
  - Docker absent: `artifacts/repro_v3_20260217T223752Z_12_docker_build.log`
  - Trivy vuln DB blocked: `artifacts/repro_v3_20260217T223752Z_15_trivy_fs_vuln_attempt.log`

## P0 (Immediate, 0-1 day)
1. Keep strict website checks with proxy bypass in reproducibility pipelines:
   - `curl -I --noproxy '*' --max-time 20 https://alirezasafeidev.ir/`
   - `curl -I --noproxy '*' --max-time 20 https://alirezasafeidev.ir/robots.txt`
   - `curl -I --noproxy '*' --max-time 20 https://alirezasafeidev.ir/sitemap.xml`
2. Keep OSV scanner as local binary path in all automated runs:
   - `NO_PROXY='*' HTTPS_PROXY='' HTTP_PROXY='' artifacts/bin/osv-scanner scan -r .`

## P1 (Infra unblock, 1-3 days)
1. Install container runtime (choose one):
   - `sudo apt-get update && sudo apt-get install -y docker.io`
   - or `sudo apt-get install -y podman`
2. Validate runtime availability:
   - `docker --version` and `docker info`
3. Re-run image build gate:
   - `docker build -t asdev-portfolio:audit-next .`

## P1 (Trivy vulnerability DB unblock, 1-3 days)
1. Allow egress to at least one Trivy DB source:
   - `mirror.gcr.io`
   - `ghcr.io`
2. Re-run vuln scan once egress is available:
   - `NO_PROXY='*' HTTPS_PROXY='' HTTP_PROXY='' artifacts/bin/trivy fs --scanners vuln,secret,misconfig --timeout 10m .`
3. If mirror.gcr is blocked, test explicit GHCR repo:
   - `NO_PROXY='*' HTTPS_PROXY='' HTTP_PROXY='' artifacts/bin/trivy fs --db-repository ghcr.io/aquasecurity/trivy-db --scanners vuln,secret,misconfig --timeout 10m .`

## P2 (Governance hardening, 3-7 days)
1. Promote these commands into one canonical reproducibility script.
2. Add CI artifact retention for every run:
   - strict command log
   - OSV result
   - Trivy result(s)
   - web surface checks
3. Add release waiver policy when Docker/Trivy vuln DB is blocked, with expiry and owner.

## Acceptance Gates
- Gate A: strict reproducibility run completes with all non-blocked steps archived.
- Gate B: OSV run executes and reports are attached in artifacts.
- Gate C: Trivy vuln scan executes (not only secret/misconfig).
- Gate D: container build + image scan execute OR approved waiver ID recorded.
