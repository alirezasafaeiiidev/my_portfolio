# Design Token Registry

Last updated: 2026-02-20
Owner: `platform-owner`

## Source of Truth
- Token definitions: `src/app/globals.css`
- Consumption: Tailwind token mappings (`@theme inline`)

## Core Color Tokens
- `--background`: main page background
- `--foreground`: main text color
- `--card`, `--card-foreground`: card surfaces
- `--primary`, `--primary-foreground`: primary CTA and emphasis
- `--accent`, `--accent-foreground`: secondary emphasis
- `--muted`, `--muted-foreground`: helper and neutral text
- `--border`, `--input`, `--ring`: control and focus surfaces
- `--destructive`, `--destructive-foreground`: destructive actions

## Spacing and Radius
- Base radius token: `--radius`
- Derived radii: `--radius-sm|md|lg|xl`
- Spacing scale follows 8px rhythm in component classes.

## Typography Tokens
- Primary stack bound to `--font-sans`.
- Local font first policy: `IRANSansX` first in stack.
- CDN font path is optional and must remain disabled in production by default.

## Governance Rules
1. New visual values must be introduced as tokens before component usage.
2. Hard-coded colors in components are disallowed unless mapped to a token in same PR.
3. Any token update requires:
- Accessibility verification (WCAG AA contrast)
- Lighthouse regression check
- Screenshot evidence before/after under `docs/runtime/`
4. Runtime must function without external font/CDN dependency.
