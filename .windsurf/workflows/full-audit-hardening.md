---
description: Complete audit and hardening workflow for the portfolio project
---

# Full Audit & Hardening Workflow

Runnable as: `/full-audit-hardening`

## Steps

### 1. Install Dependencies
```bash
bun install
```
// turbo

### 2. Baseline Verification
```bash
bun run lint
bun run test
bun run build
```

### 3. External Requests Scan
```bash
./scripts/offline-external-scan.sh
```

### 4. UI/UX + Accessibility Checks
- Review mobile-first flow
- Check RTL/LTR behavior
- Verify WCAG AA compliance
- Test keyboard navigation

### 5. SEO/Performance Checks
- Review meta tags, OpenGraph
- Check hreflang implementation
- Verify sitemap.xml, robots.txt
- Run Lighthouse (if available)

### 6. Implement Fixes
- Self-host external assets
- Fix TypeScript strict issues
- Add missing tests
- Improve accessibility

### 7. Update Documentation
- Update `docs/audit/REPORT_FA.md`
- Update `CHANGELOG.md`
- Update `worklog.md`

### 8. Final Verification
```bash
./scripts/verify.sh
./scripts/offline-external-scan.sh
```

### 9. Commit & Push
```bash
git checkout -b ai/audit-hardening
git add .
git commit -m "chore(ai): full audit and hardening"
git push origin ai/audit-hardening
```
