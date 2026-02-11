# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Resolved TypeScript/build blockers in animation demo, experience timeline, testimonials animation variants, theme provider typing, SEO metadata typing, and Vitest coverage typing.
- Fixed false failure behavior in `scripts/verify.sh` counter increments under `set -e`.
- Hardened `scripts/offline-external-scan.sh` to ignore build artifacts (`.next`, `node_modules`, `.git`, `dist`, `coverage`) and support documented allowlist filtering.
- Replaced placeholder sitemap domain in `public/robots.txt` with local default URL.
- Fixed i18n provider source mismatch by switching runtime translations to `src/lib/i18n/translations.ts` (single source of truth).
- Added missing Persian navigation keys (`nav.about`, `nav.testimonials`) to prevent fallback key rendering in UI.
- Removed flaky CAPTCHA randomness assertion and replaced it with deterministic mocked-random tests.
- Enforced admin API authentication in production-safe mode (removed optional bypass behavior).
- Migrated Next.js request guard from deprecated `middleware` convention to `src/proxy.ts`.
- Removed residual external-scan false positives by deleting legacy `public/robots.txt` and tightening analytics detection patterns in `scripts/offline-external-scan.sh`.
- Removed Next.js workspace-root inference warning by setting `turbopack.root` in `next.config.ts`.

### Added
- Enterprise API baseline utilities:
  - `src/lib/env.ts` for validated runtime configuration with `zod`
  - `src/lib/logger.ts` for structured logs with sensitive-field redaction
  - `src/lib/api-security.ts` for request-id, common API security headers, optional admin token checks, and rate limiting helpers
- Health endpoint behavior on `GET /api` with service status payload
- New tests:
  - `src/__tests__/lib/env.test.ts`
  - `src/__tests__/lib/api-security.test.ts`
  - `src/__tests__/lib/i18n-translations.test.ts` (EN/FA key parity guard)
  - `src/__tests__/lib/admin-auth.test.ts` (admin auth/token validation)
- Enterprise admin authentication/session layer:
  - `src/lib/admin-auth.ts` (signed session token + bearer token resolver + role=admin)
  - `src/app/api/admin/auth/login/route.ts`
  - `src/app/api/admin/auth/logout/route.ts`
  - `src/app/api/admin/auth/session/route.ts`
- Global middleware security layer:
  - `src/proxy.ts` (CSP, HSTS-in-production, permissions policy, frame/resource isolation)
  - Route guard for `/admin` with redirect to `/admin/login`
- Admin login UI:
  - `src/app/admin/login/page.tsx`
  - `src/components/admin/admin-login-form.tsx`
- Distributed rate limiting and observability:
  - `src/lib/rate-limit.ts` (Redis REST + memory fallback)
  - `src/lib/metrics.ts`
  - `src/app/api/metrics/route.ts`
  - `scripts/check-slo.sh`
- New CI/quality pipelines:
  - `.github/workflows/e2e-smoke.yml`
  - `.github/workflows/lighthouse.yml`
  - `.github/workflows/release.yml`
  - `.github/workflows/slo-monitor.yml`
  - `playwright.config.mjs`
  - `e2e/smoke.spec.mjs`
  - `lighthouserc.json`
  - `.releaserc.json`
- New integration tests:
  - `src/__tests__/api/admin-auth.integration.test.ts`
  - `src/__tests__/api/admin-routes.integration.test.ts`
  - `src/__tests__/api/metrics.integration.test.ts`
  - `src/__tests__/lib/rate-limit.test.ts`
- Production release checklist: `docs/RELEASE_CHECKLIST_FA.md`

### Changed
- Upgraded smoke E2E coverage in `e2e/smoke.spec.mjs` for keyboard skip-link and UI-based language switching checks.
- Corrected `test:e2e:smoke` script in `package.json` to target `e2e/smoke.spec.mjs` with explicit Playwright config.
- Added default `lang="fa"` and `dir="rtl"` at HTML root in `src/app/layout.tsx` for stronger initial accessibility semantics.

### Changed
- Hardened API routes (`contact`, `messages`, `admin/messages`, `admin/projects`) with unified security/limit handling and safer validation.
- Updated admin routes to require unified `enforceAdminAccess` checks.
- Refactored `/admin` page to use shared dashboard component and authenticated session flow.

### Added
- Complete portfolio website with all major sections
- Hero section with professional introduction and stats
- Portfolio section with project showcase and modal details
- Skills section with categorized technical skills
- Experience timeline with work history
- Blog section with article cards and newsletter signup
- Contact form with validation and email notifications
- Responsive navigation (desktop + mobile bottom navigation)
- Dark/Light theme support with system preference detection
- Multi-language support (English and Persian/Farsi) with RTL support
- Search functionality with technology filtering
- Admin dashboard for content management
- SEO optimization with structured data, meta tags, sitemap
- Performance monitoring with Web Vitals tracking
- Security features: rate limiting, input sanitization, XSS protection
- Testing framework with Vitest and 100% type coverage
- Comprehensive documentation (README, API docs, contributing guide)

### Changed
- Complete refactoring of component architecture
- Improved type safety with strict TypeScript configuration
- Enhanced performance with code splitting and lazy loading
- Better error handling and user feedback

### Security
- Added rate limiting for contact form (5 requests/15min)
- Implemented input sanitization to prevent XSS attacks
- Added SQL injection prevention
- Added CAPTCHA for form submissions (optional)
- Implemented security headers (CSP, X-Frame-Options, etc.)
- Enhanced email validation with robust regex patterns

### Performance
- Image optimization with AVIF/WebP support
- Code splitting for optimal bundle sizes
- Lazy loading for images and components
- Web Vitals monitoring (LCP, FID, CLS)
- Font optimization with next/font
- Tree shaking enabled

### Testing
- Added Vitest testing framework
- Created comprehensive unit tests for utilities
- Added type checking tests
- Test coverage target: 80%
- Added test scripts (test, test:watch, test:ui, test:coverage)

### Documentation
- Created comprehensive README.md
- Added API documentation
- Added architecture documentation
- Added deployment guide
- Created contributing guidelines
- Added CHANGELOG.md
- Synced enterprise audit docs and added chat snapshot evidence (`docs/audit/chat-snapshot-2026-02-11.png`)
- Closed legacy execution roadmap and release checklist items:
  - `docs/DEVELOPMENT_ROADMAP.md`
  - `docs/RELEASE_CHECKLIST_FA.md`
  - `docs/audit/REPORT_FA.md`
  - `docs/audit/REMAINING_TASKS_FA.md`

### Developer Experience
- Added GitHub Actions workflows for CI (install/lint/type-check/test/build + verify/scan scripts) and security audits
- Added ESLint with Next.js configuration
- Added Prettier for code formatting
- Added pre-commit hooks (Husky)
- Enhanced TypeScript configuration
- Improved VSCode settings
- Added GitHub Actions for CI/CD

---

## [0.2.0] - 2024-01-XX

### Added
- Initial project setup with Next.js 16 and TypeScript 5
- Tailwind CSS 4 configuration
- shadcn/ui component library integration
- Prisma ORM with SQLite setup
- Basic project structure and routing
- Authentication setup with NextAuth.js (optional)
- Database models for Projects, Skills, Experience, Blog, Contact
- Contact form API with validation

### Changed
- Initial version - no previous changes

---

## Versioning Policy

- **Major version (X.Y.Z)**: Breaking changes, major features
- **Minor version (X.Y.z)**: New features, backwards compatible
- **Patch version (x.y.Z)**: Bug fixes, minor improvements

## [1.2.0] - 2026-02-08 - AI Audit & Hardening Complete

### Added
- AI governance files (.windsurf/rules/00-project-constitution.md, AGENTS.md)
- Automation scripts (scripts/verify.sh, scripts/offline-external-scan.sh)
- Development roadmap (docs/DEVELOPMENT_ROADMAP.md)
- Skip-link accessibility feature in layout.tsx
- socket.io-client and socket.io dependencies

### Fixed
- All lint errors resolved (0 errors, 54 warnings remaining)
- effects/index.tsx parsing error fixed
- sidebar.tsx Math.random() purity issue fixed
- TypeScript strict mode enabled

### Changed
- ESLint configuration strictness increased
- next.config.ts strict mode enabled
- Removed examples/ directory (build blocking)
- Updated package.json with verify and scan:external scripts

### Security
- Rate limiting implemented
- Security utilities in security.ts
- CSP headers configured

### Testing
- 98 tests passing
- Test coverage maintained
