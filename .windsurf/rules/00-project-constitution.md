# Project Constitution (قانون اساسی پروژه)

> **Source of Truth for AI Agents** | **منبع اصلی قوانین برای عامل‌های هوش مصنوعی**

---

## <communication>

- **In-chat explanations**: Persian (Farsi) only
- **Code, commit messages**: English or bilingual (FA/EN)
- **Documentation**: Bilingual where possible, Persian for user-facing
- **Every claim must have evidence**: file path + snippet/line range, or command output
- **Cannot verify?** Mark as "Unknown" with verification steps
- **Every change must be documented** with rationale

---

## <non_negotiables>

### Local-First & Offline-Friendly (اولویت بالا)
- ZERO runtime dependency on external services
- All fonts/assets self-hosted
- External services must be: optional, OFF by default, with local fallback
- No unexpected outbound requests on page load

### Code Quality Standards
- TypeScript strict mode, zero `any`
- Zod validation for all inputs
- Proper error boundaries
- Clear module boundaries, low coupling
- Consistent naming and patterns

### Bilingual Support (FA/EN)
- True RTL/LTR behavior
- Correct `lang` and `dir` attributes
- Persian numerals where appropriate
- Per-locale SEO (hreflang, canonical)

### UI/UX & Accessibility
- Mobile-first design
- WCAG AA compliance minimum
- Keyboard navigation, focus states
- Semantic HTML, ARIA labels
- Color contrast compliance

### Testing
- Unit/Integration tests for critical paths
- E2E tests (Playwright preferred)
- Accessibility tests (axe)
- RTL/LTR visual assertions
- Offline/no-external-requests tests

### Security & Privacy
- CSP headers configured
- No external tracking by default
- Input validation everywhere
- Dependency audits

---

## <workflow>

### Audit Process Flow
1. **Install deps** → verify lockfile
2. **Baseline** → lint, test, build (must pass)
3. **External scan** → detect all outbound requests
4. **UI/UX + a11y** → review and fix
5. **SEO/perf** → Lighthouse where feasible
6. **Implement fixes** → documented, tested
7. **Update docs** → changelog, audit report
8. **Final verification** → all checks pass
9. **Commit & push** → conventional commits

### Documentation Requirements
- Update `docs/audit/REPORT_FA.md` for every change
- Update `CHANGELOG.md` for user-facing changes
- Update `worklog.md` with milestones
- Evidence: file paths, snippets, commands

### Verification Before Push
- Run `scripts/verify.sh` (format, lint, test, build)
- Run `scripts/offline-external-scan.sh`
- Ensure no new external runtime requests

---

## <deliverables>

### Required Artifacts
- `docs/audit/REPORT_FA.md` - Living audit report (Persian)
- `docs/AI_AUDIT_CONSTITUTION.md` - How audits work (bilingual)
- `CHANGELOG.md` - User-facing changes
- Test coverage reports

### Priority Scoring Formula
```
priority = (technical_debt * 0.5) + (ux_seo_impact * 0.3) + (docs_alignment * 0.2)

Levels:
- Critical: > 0.8
- High: 0.6–0.8
- Medium: < 0.6
```

### Commit Standards
- Conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Logical, small commits
- Push to feature branches, NOT main

---

## <enforcement>

This constitution is binding for all AI agents working on this project.
Violations must be fixed before any PR is merged.

**Last Updated**: 2025-02-07
**Version**: 1.0.0
