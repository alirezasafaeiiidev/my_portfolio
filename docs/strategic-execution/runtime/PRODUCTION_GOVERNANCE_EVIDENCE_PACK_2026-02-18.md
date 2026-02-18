# Production Governance Evidence Pack (2026-02-18)

Status: Completed (Signed-off)
Scope: asdev-portfolio production hardening and audit evidence capture

## Canonical Runtime Paths

- App base path: `/var/www/my-portfolio`
- Nginx site file: `/etc/nginx/sites-available/asdev-cohosting.conf`
- Env files: `/var/www/my-portfolio/shared/env/production.env` and `/var/www/my-portfolio/shared/env/staging.env`
- SQLite DB paths:
  - `file:/var/www/my-portfolio/shared/env/production.db`
  - `file:/var/www/my-portfolio/shared/env/staging.db`

## 1) SSH Hardening Evidence

- [x] Root login disabled (`PermitRootLogin no`)
- [x] Password auth disabled (`PasswordAuthentication no`)
- [x] SSH config test and daemon reload successful
- [ ] Non-root deploy login verified

Commands:

```bash
sudo grep -E '^(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)' /etc/ssh/sshd_config
sudo sshd -t
sudo systemctl restart ssh
ssh deploy@SERVER_IP
```

Attach:
- command output snippets
- timestamp

Latest execution (VPS):
- Timestamp (UTC): `2026-02-18T20:08:59Z`
- Effective sshd_config lines observed:
  - `PermitRootLogin no`
  - `PubkeyAuthentication yes`
  - `PasswordAuthentication no`
- Evidence log:
  - `/var/www/my-portfolio/shared/logs/governance/security-hardening-production-20260218T200859Z.log`
- Note:
  - SSH access from this workstation became key-only after enforcement; non-root key login verification is pending until deploy user key is available on this client.

## 2) 2FA Evidence

- [x] ArvanCloud 2FA enabled
- [x] Mobinhost 2FA enabled (or documented fallback via secured owner email)
- [ ] Recovery codes stored securely

Operator update:
- 2026-02-18: 2FA activation confirmed for ArvanCloud and Mobinhost.

Attach:
- panel screenshots
- timestamp

## 3) GitHub Branch Protection Evidence

Expected on `main`:
- required approvals = `1`
- require CODEOWNERS = `true`
- dismiss stale approvals = `true`

Verification command:

```bash
gh api repos/alirezasafaeisystems/asdev-portfolio/branches/main/protection \
  --jq '.required_pull_request_reviews | {required_approving_review_count,require_code_owner_reviews,dismiss_stale_reviews}'
```

## 4) Backup Policy and Restore Drill

Policy (current target):
- Daily retention: 7
- Weekly retention: 4
- Monthly retention: 6
- Location: onsite VPS + offsite Arvan Object Storage

Automation:
- `bash scripts/deploy/backup-onsite.sh --frequency daily --env production`
- `bash scripts/deploy/backup-onsite.sh --frequency weekly --env production`
- `bash scripts/deploy/backup-onsite.sh --frequency monthly --env production`
- `bash scripts/deploy/restore-drill-onsite.sh --frequency daily --env production`
- `bash scripts/deploy/install-backup-cron.sh --repo-dir /var/www/my-portfolio/current/production --env production`
- `bash scripts/deploy/run-governance-evidence.sh --repo-dir /var/www/my-portfolio/current/production --env production --frequency daily`

Mandatory scope:
- `/etc/nginx/`
- `/etc/systemd/system/`
- `/var/www/my-portfolio/shared/env/`
- runtime assets/log metadata as required

Restore drill evidence:
- [x] restore executed on test path
- [x] app boots with restored env/db
- [x] results recorded with timestamp

Latest execution (VPS):
- Timestamp (UTC): `2026-02-18T18:55:53Z`
- Cron schedule installed (Asia/Tehran) under root crontab:
  - daily: `02:30`
  - weekly: `Friday 03:00`
  - monthly: `day 1 at 04:00`
- Backup artifact:
  - `/var/backups/my-portfolio/daily/my-portfolio-production-daily-20260218T185554Z.tar.gz`
  - `/var/backups/my-portfolio/daily/my-portfolio-production-daily-20260218T185554Z.tar.gz.sha256`
- Evidence logs:
  - `/var/www/my-portfolio/shared/logs/governance/backup-production-20260218T185553Z.log`
  - `/var/www/my-portfolio/shared/logs/governance/restore-drill-production-20260218T185553Z.log`
  - `/var/www/my-portfolio/shared/logs/governance/governance-summary-production-20260218T185553Z.md`
- Restore drill result file:
  - `/tmp/my-portfolio-restore-drill/production-daily-20260218T185558Z/RESTORE_DRILL_RESULT.txt`
- Post-drill readiness check:
  - `https://alirezasafaeisystems.ir/api/ready` => `200` with `{"status":"ready","service":"my-portfolio-production"}`

## 5) Alert Test Evidence

- [x] simulated failure executed
- [x] Telegram alert received
- [x] Email alert received
- [x] ack actor + response time recorded

Validation summary (operator provided):
- Cron execution: `16:00`
- Failure detection: `16:00:05`
- Alert delivery (Email): `16:00:20`
- ACK (manual reply): `16:02:10`
- ACK time: `~2m`
- End-to-end chain: `Cron -> Sync -> Object listing -> Alert -> ACK` validated

Attach:
- alert screenshots
- incident note path

## 6) Open Gaps

1. Non-root deploy login verification is pending from this workstation (server is now key-only; root SSH password path disabled).
2. Firewall/Fail2Ban final status needs direct post-hardening verification after access recovery.

## 7) Offsite Backup Enablement Plan

Execution commands:
- `bash scripts/deploy/push-offsite-backup.sh --frequency daily --env production`
- `bash scripts/deploy/install-offsite-sync-cron.sh --repo-dir /var/www/my-portfolio/current/production --env production --offsite-remote <remote:path>`

Prerequisites:
- `rclone` installed on VPS
- rclone remote configured with object-storage credentials
- `OFFSITE_REMOTE` path decided and documented

Current VPS status (2026-02-18):
- `rclone` installed
- `restic` installed
- `arvan-s3` remote configured (`s3.ir-thr-at1.arvanstorage.ir`)
- first offsite sync executed successfully for daily production backup
- offsite cron schedule installed under root crontab

Execution evidence (VPS):
- Offsite log:
  - `/var/log/my-portfolio-offsite-sync.log`
- Offsite restore drill log:
  - `/var/www/my-portfolio/shared/logs/governance/offsite-restore-production-20260218T200859Z.log`
- Offsite cron block installed:
  - `# BEGIN MY_PORTFOLIO_OFFSITE_SYNC ... # END MY_PORTFOLIO_OFFSITE_SYNC`
- Remote object listing sample:
  - `my-portfolio-production-daily-20260218T185554Z.tar.gz`
  - `my-portfolio-production-daily-20260218T185554Z.tar.gz.manifest.txt`
  - `my-portfolio-production-daily-20260218T185554Z.tar.gz.sha256`
- Offsite restore drill result:
  - `/tmp/my-portfolio-offsite-restore-drill/production-daily-20260218T200859Z/OFFSITE_RESTORE_DRILL_RESULT.txt`
- Validation points:
  - `sha256sum -c` result: `OK`
  - Readiness check: `https://alirezasafaeisystems.ir/api/ready` returned `200`

Evidence to capture:
- screenshot/snippet of successful non-root SSH login (`deploy@SERVER_IP`) from operator workstation
- post-recovery snapshot for `ufw status verbose` and `fail2ban-client status sshd`
