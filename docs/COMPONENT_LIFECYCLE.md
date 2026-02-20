# Component Lifecycle Management

Last updated: 2026-02-20
Owner: `platform-owner`

## Scope
Critical components with enterprise lifecycle controls:
- Navigation Header
- Hero
- Service Card
- Case Study Card
- Contact Form
- Qualification Form
- Footer

## Required Metadata Per Component Change
1. Version tag (SemVer-like: `major.minor.patch` in PR notes)
2. Change summary (behavioral + visual)
3. Token impact (which tokens changed)
4. Accessibility impact (focus, semantic, keyboard)

## Release States
1. `Draft`: design/behavior proposal prepared.
2. `Validated`: local QA passed (`lint`, `type-check`, tests).
3. `Release-Ready`: Lighthouse + smoke tests green.
4. `Deployed`: runtime evidence recorded under `docs/runtime/`.

## Mandatory Gates
1. Functional tests green (`pnpm run verify`).
2. Smoke tests green (`pnpm run test:e2e:smoke`).
3. Accessibility gate green (Playwright + axe for critical pages).
4. No external runtime dependencies introduced.

## Rollback Requirement
Each high-impact component change must keep a rollback-safe PR scope:
- no mixed unrelated refactors
- reversible within one deploy cycle
