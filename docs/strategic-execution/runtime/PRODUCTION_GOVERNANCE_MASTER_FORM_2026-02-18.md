---
author: ASDEV
title: Production Governance Master Form (Senior-Level)
---
> Prefilled from repository/runtime evidence as of 2026-02-18.
> Fields requiring external/business confirmation are kept as `TODO`.

# PRODUCTION GOVERNANCE MASTER FORM

## Senior / Production-Grade Template

Version: 1.0  
Status: In Progress

------------------------------------------------------------------------

# 1️⃣ SERVICE IDENTIFICATION

## Service Name:

asdev-portfolio

## Repository URL:

https://github.com/alirezasafaeisystems/asdev-portfolio

## Production URL:

https://alirezasafaeisystems.ir

## Service Type:

- [ ] Static Website
- [x] Fullstack Web Application
- [ ] Backend API
- [ ] Microservice
- [ ] Other:

## Business Criticality:

- [ ] Personal
- [x] Business Support
- [ ] Revenue Impacting
- [ ] Mission Critical

> TODO (Owner): اگر این سرویس مستقیم revenue ایجاد می‌کند، گزینه `Revenue Impacting` را فعال کنید.

------------------------------------------------------------------------

# 2️⃣ INFRASTRUCTURE PROFILE

## Cloud / VPS Provider:

Mobinhost

## Deployment Model:

- [ ] Docker
- [ ] Docker Compose
- [ ] Kubernetes
- [x] Bare-metal Node
- [ ] Serverless

## Operating System:

Ubuntu 22.04+

## Database (if applicable):

- Type: SQLite (default via Prisma), configurable to Postgres through `DATABASE_URL`
- Hosting Location: VPS (server-side env/deploy)
- HA Enabled? (Yes/No): No (current state)

## DNS Provider:

ArvanCloud

## SSL Provider:

Let's Encrypt via certbot on VPS nginx (cutover evidence exists)

## Secrets Storage Method:

- [ ] GitHub Actions Secrets
- [x] Environment Variables (Server)
- [ ] Vault
- [ ] Other:

Notes:
- Runtime env path: `/var/www/my-portfolio/shared/env/<env>.env`
- Server app base path: `/var/www/my-portfolio`
- Active nginx site file: `/etc/nginx/sites-available/asdev-cohosting.conf`
- SQLite paths (runtime): `file:/var/www/my-portfolio/shared/env/production.db` and `file:/var/www/my-portfolio/shared/env/staging.db`
- Secret rotation evidence exists in runtime docs.

------------------------------------------------------------------------

# 3️⃣ OWNERSHIP & GOVERNANCE

## Technical Owner:

Alireza Safaei (@alirezasafaeisystems)

## DevOps On-Call (Primary):

- Name: platform-owner
- Contact: telegram:@asdev_ops_alerts
- Timezone: Asia/Tehran

## DevOps On-Call (Secondary):

- Name: devops-backup
- Contact: email:ops-backup@alirezasafaeisystems.ir
- Escalation Delay (minutes): 15

## Release Approver:

- Name: platform-owner

Self-Approval Allowed?
- [x] Yes
- [ ] No

## Incident Commander Default:

incident-commander

------------------------------------------------------------------------

# 4️⃣ ACCESS CONTROL (Least Privilege Declaration)

## GitHub Controls

- Admin Users: TODO
- Write Users: TODO

Branch Protection Enabled?
- [x] Yes
- [ ] No

Required PR?
- [x] Yes
- [ ] No

Required Approvals Count:
- 1

CODEOWNERS Enforced?
- [x] Yes
- [ ] No

Status Checks Required?
- [x] Yes
- [ ] No

Notes:
- Protected branch message confirms PR-only and expected required checks.
- CODEOWNERS owner handle: `@alirezasafaeisystems` (canonical, verified).
- Dismiss stale approvals:
  - [x] Enabled
  - [ ] Disabled
  - Current value: `true`.

## 2FA Enforcement

GitHub:
- [ ] Enabled
- [ ] Disabled
- TODO

Cloud Provider:
- [x] Enabled
- [ ] Disabled
- Confirmed by operator update on 2026-02-18.

DNS Provider:
- [x] Enabled
- [ ] Disabled
- Confirmed by operator update on 2026-02-18.

## Server Hardening

Root SSH Login Disabled?
- [x] Yes
- [ ] No
- Status updated from latest operator confirmation (2026-02-18). Keep command evidence in ops runbook.

Password Authentication Disabled?
- [ ] Yes
- [ ] No
- TODO

Firewall Enabled?
- [ ] Yes
- [ ] No
- TODO

Fail2Ban / Rate Limiting?
- [ ] Yes
- [ ] No
- TODO

------------------------------------------------------------------------

# 5️⃣ SRE TARGETS (SLA / SLO)

## Availability Target (SLO):

99.99%

## MTTR Target:

<= 24 hours

## Monitoring Tool:

- GitHub Actions `SLO Monitor` workflow
- `/api/metrics` endpoint
- PM2 logs + process status

## Monitoring Interval:

Every 6 hours (scheduled workflow cron)

## Alert Trigger Condition:

SLO monitor fails when:
- `portfolio_api_errors_total / portfolio_api_requests_total > 0.02`
- and sample size >= 50

Severity Levels Defined?
- [x] Yes
- [ ] No

Notes: P2/P1/P0 escalation levels defined in `docs/ONCALL_ESCALATION.md`.
SLO/MTTR consistency note: 99.99% implies ~4.4 minutes monthly downtime budget; current MTTR target (24h) is significantly looser and should be revised or justified.

------------------------------------------------------------------------

# 6️⃣ RELEASE MANAGEMENT

## Release Window:

Business days, 10:00-18:00 (Asia/Tehran) for regular releases.  
Emergency hotfixes: any time with incident commander approval.

## Deployment Strategy:

- [x] Direct Deploy
- [ ] Tagged Release
- [ ] Blue/Green
- [ ] Rolling Update

## Hotfix Policy:

- Use dedicated branch + PR to `main`
- Required checks must pass
- If production impact exists, run rollback drill or immediate rollback using `ops/deploy/rollback.sh`
- Capture incident note in `docs/strategic-execution/runtime/Incidents/`

------------------------------------------------------------------------

# 7️⃣ ROLLBACK STRATEGY

Rollback Method:
- [x] Redeploy Previous Release (release directory rollback)
- [ ] Git Revert
- [ ] Snapshot Restore

RTO Target:
- TODO

RPO Target:
- TODO

Rollback Tested?
- [x] Yes
- [ ] No

Last Test Date:
- 2026-02-18 (batch3 drill evidence)

Operational Commands:
- `bash ops/deploy/rollback.sh --env production`
- `bash scripts/deploy/run-rollback-drill.sh --env production --site-url https://alirezasafaeisystems.ir`

------------------------------------------------------------------------

# 8️⃣ BACKUP POLICY

Backup Scope:
- [x] Database
- [x] Server Configurations
- [x] Assets

Backup Frequency:
- Daily: every day at 02:30 Asia/Tehran
- Weekly: every Friday 03:00 Asia/Tehran
- Monthly: day 1 of each month, 04:00 Asia/Tehran

Retention Policy:
- Daily: 7 copies
- Weekly: 4 copies
- Monthly: 6 copies

Backup Location:
- Onsite (current): same VPS
- Offsite: Arvan Object Storage (`asdev-portfolio-buckets`, region `ir-thr-at1`) via `rclone` sync

Restore Tested?
- [x] Yes
- [ ] No
- Evidence captured via `scripts/deploy/run-governance-evidence.sh` on VPS.

Last Test Date:
- 2026-02-18 (backup + restore drill evidence run; readiness check `200`)

------------------------------------------------------------------------

# 9️⃣ ALERTING & ESCALATION

Primary Alert Channel:
- [x] Telegram
- [ ] Slack
- [x] Email
- [ ] Pager

Escalation Chain:
- Level 1: platform-owner
- Level 2: devops-backup
- Level 3: incident-commander / release-approver

Maximum Escalation Time:
- 15 minutes for P1 escalation to backup

Alert Test Performed?
- [ ] Yes
- [ ] No
- TODO (needs documented drill result)

------------------------------------------------------------------------

# 🔟 SECURITY CONTROLS

Secrets Rotation Interval:
- TODO (e.g. every 90 days)

Dependency Scanning Enabled?
- [x] Yes
- [ ] No

Dependabot Enabled?
- [x] Yes
- [ ] No

Security Audit Performed?
- [x] Yes
- [ ] No

Date:
- 2026-02-18 (latest security workflow/runtime evidence)

------------------------------------------------------------------------

# 1️⃣1️⃣ RISK DECLARATION & EXCEPTIONS

1. Latest formal rollback incident note for current hardening cycle is still missing (`Latest rollback incident note: not-found` in evidence).
2. SLO/MTTR mismatch remains unresolved (99.99% vs MTTR 24h).

------------------------------------------------------------------------

# FINAL SIGN-OFF

Reviewed By: TODO  
Role: TODO  
Date: 2026-02-18

Digital Signature: TODO

------------------------------------------------------------------------

# Operational Notes

- This document must be reviewed every 6 months.
- Any infra/security/ownership change requires immediate update.
- Keep this file on the main branch after approval.
