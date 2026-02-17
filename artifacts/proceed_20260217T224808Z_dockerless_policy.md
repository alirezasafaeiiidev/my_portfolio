# Docker-less Policy Decision

- Date (UTC): 2026-02-17
- Source: user directive in session: "نمیخ.ام از داکر استفاده کنم" + "بله ادامه بده"
- Decision: Docker runtime and container image scanning are out of scope by policy for this audit stream.
- Impact:
  - `docker build` and `trivy image` are classified as **Not Applicable (Docker-less policy)**.
  - Required security gates remain:
    1. `pnpm audit --json`
    2. `pnpm run audit:high`
    3. `pnpm run scan:secrets`
    4. `osv-scanner scan -r .`
    5. `trivy fs --scanners secret,misconfig --skip-db-update .`
