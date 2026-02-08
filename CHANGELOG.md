# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Developer Experience
- Migrated CI/security workflows and verification commands from Bun to pnpm (including lockfile and docs updates)
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

