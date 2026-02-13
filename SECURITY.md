# Security Policy

## Supported Versions

Security fixes are applied to the latest `main` branch and the latest release tag.

## Reporting a Vulnerability

Please report vulnerabilities privately and do not open public issues for exploitable details.

1. Send details to the repository owner via GitHub private security advisory.
2. Include:
   - affected endpoint/feature
   - reproduction steps
   - impact assessment
   - suggested mitigation (if available)
3. You will receive an acknowledgment within 72 hours.

## Security Baseline

- Strict transport and security headers are enforced in request proxying.
- API responses use `Cache-Control: no-store` for sensitive/dynamic surfaces.
- Secrets must never be committed and must be loaded via runtime environment.
- Production changes to authentication/authorization require explicit review.

## Disclosure Process

- Triage and validation
- Fix preparation and test verification
- Coordinated disclosure after patch release
