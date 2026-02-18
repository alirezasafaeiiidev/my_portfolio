# Production Governance Evidence Pack (2026-02-18)

Status: In progress
Scope: asdev-portfolio production hardening and audit evidence capture

## Canonical Runtime Paths

- App base path: `/var/www/my-portfolio`
- Nginx site file: `/etc/nginx/sites-available/asdev-cohosting.conf`
- Env files: `/var/www/my-portfolio/shared/env/production.env` and `/var/www/my-portfolio/shared/env/staging.env`
- SQLite DB paths:
  - `file:/var/www/my-portfolio/shared/env/production.db`
  - `file:/var/www/my-portfolio/shared/env/staging.db`

## 1) SSH Hardening Evidence

- [ ] Root login disabled (`PermitRootLogin no`)
- [ ] Password auth disabled (`PasswordAuthentication no`)
- [ ] SSH config test and daemon reload successful
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
- Location: onsite VPS (offsite pending)

Automation:
- `bash scripts/deploy/backup-onsite.sh --frequency daily --env production`
- `bash scripts/deploy/backup-onsite.sh --frequency weekly --env production`
- `bash scripts/deploy/backup-onsite.sh --frequency monthly --env production`
- `bash scripts/deploy/restore-drill-onsite.sh --frequency daily --env production`

Mandatory scope:
- `/etc/nginx/`
- `/etc/systemd/system/`
- `/var/www/my-portfolio/shared/env/`
- runtime assets/log metadata as required

Restore drill evidence:
- [ ] restore executed on test path
- [ ] app boots with restored env/db
- [ ] results recorded with timestamp

## 5) Alert Test Evidence

- [ ] simulated failure executed
- [ ] Telegram alert received
- [ ] Email alert received
- [ ] ack actor + response time recorded

Attach:
- alert screenshots
- incident note path

## 6) Open Gaps

1. Offsite backup not implemented yet.
2. Restore drill evidence still pending.
3. SLO/MTTR mismatch needs policy decision (99.99% vs MTTR 24h).
