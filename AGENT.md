# AGENT.md

## Project identity and mission
This repository (`my_portfolio`) contains the source code for a personal portfolio web application built with Next.js, React, TypeScript, Tailwind CSS, and Bun. The goal is to provide a performant, accessible, and privacy‑respecting showcase of the author's skills and work samples.

## Commands

### Setup
Install dependencies and prepare environment variables:

```bash
bun install
cp .env.example .env # edit .env with your actual secrets
```

### Linting
Run ESLint to ensure code quality:

```bash
bun run lint
```

### Type checking
Check TypeScript types:

```bash
bun run type-check
```

### Testing
Run unit and integration tests with Vitest:

```bash
bun run test
```

### Build
Create an optimized production build:

```bash
bun run build
```

### Development server
Start the local development server:

```bash
bun run dev
```

### Verification
Run the integrated verification script that combines lint, type‑check, test, and build:

```bash
bash scripts/verify.sh
```

### Offline scan
Scan the built output for external resources:

```bash
bash scripts/offline-external-scan.sh
```

## Workflow and definition of done

1. Pull the latest changes from the `main` branch and create a feature branch for your work.
2. Make your changes and commit locally.
3. Ensure all acceptance criteria are satisfied before opening a pull request:
   - `bun run lint` produces no warnings or errors.
   - `bun run type-check` completes successfully.
   - `bun run test` passes all tests.
   - `bun run build` succeeds.
   - `bash scripts/offline-external-scan.sh` reports no disallowed external links; update `scripts/offline-external-allowlist.txt` if a legitimate link needs to be allowlisted.
   - Documentation is synchronized: update `docs/audit/REPORT_FA.md`, `docs/audit/REMAINING_TASKS_FA.md` and `CHANGELOG.md` when user‑facing changes are made.
4. Open a pull request and request human review. Do not bypass code review.
5. Once all checks and reviews pass, merge into `main`. The CI pipeline will run `verify.sh` and `offline-external-scan.sh` to ensure the code is in a deployable state.

## Human review gates

The following changes always require human review before merge:
- UI/UX adjustments, layout changes or visual alterations.
- Content updates and copywriting changes (ensure correct grammar and localization).
- Dependency upgrades or changes to package versions.
- SEO configuration changes (files such as `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/api/rss/route.ts`, `src/app/robots.ts`).
- Changes to privacy‑sensitive features such as analytics/telemetry.

## Quality checklist

- [ ] All commands (`lint`, `type-check`, `test`, `build`, `verify`) succeed without warnings or errors.
- [ ] No `any` types or `!` non‑null assertions remain without clear justification.
- [ ] No unused variables, `console.log` statements or commented‑out code remain.
- [ ] External resources are self‑hosted or explicitly allowlisted; no references to `yourportfolio.com`.
- [ ] Domain and configuration values are read from environment variables such as `NEXT_PUBLIC_BASE_URL` and not hard‑coded.
- [ ] Telemetry and analytics are opt‑in via `NEXT_PUBLIC_ENABLE_ANALYTICS=false` by default.
- [ ] Documentation (`REPORT_FA.md`, `REMAINING_TASKS_FA.md`) and `CHANGELOG.md` are updated to reflect the change.
- [ ] Pull request includes at least one approving review.

## Further reading

For a high‑level overview of audit findings and remaining tasks, see the audit reports under `docs/audit`. Additional guidance for AI agents and development conventions lives in `AGENTS.md`.
