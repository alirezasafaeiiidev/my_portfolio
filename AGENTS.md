# Agent Instructions (دستورالعمل عامل‌ها)

> All AI agents working on this project MUST follow these instructions.

## Primary Source of Truth
**Always follow the constitution in:**
`.windsurf/rules/00-project-constitution.md`

## Default Principles
1. **Local-First** - Prioritize offline-friendly behavior
2. **Bilingual** - Persian/English with correct RTL/LTR
3. **UI/UX + SEO** - Professional look, accessibility, performance
4. **Strict Standards** - TypeScript strict, zero `any`
5. **Testing** - Real tests with coverage
6. **Documentation-First** - Every change documented

## Before Any Change
- Read the constitution
- Check `docs/audit/REPORT_FA.md` for current status
- Run `scripts/verify.sh` to establish baseline
- Document your plan

## After Any Change
- Update `docs/audit/REPORT_FA.md`
- Update `CHANGELOG.md` if user-facing
- Run `scripts/verify.sh`
- Run `scripts/offline-external-scan.sh`
- Commit with conventional commit format

## Communication Language
- Explanations to user: **Persian (Farsi)**
- Code and commits: English or bilingual

## Evidence Required
Every claim must include:
- File path
- Line range or snippet
- Or command output

If you cannot verify something, mark as "Unknown" with verification steps.
