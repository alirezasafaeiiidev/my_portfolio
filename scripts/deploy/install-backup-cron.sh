#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/var/www/my-portfolio/current/production"
ENV_NAME="production"
TZ_NAME="Asia/Tehran"
CRON_USER="${SUDO_USER:-$(whoami)}"
PRINT_ONLY=0

usage() {
  cat <<'USAGE'
Usage:
  install-backup-cron.sh [options]

Options:
  --repo-dir <path>          Repo path on VPS (default: /var/www/my-portfolio/current/production)
  --env <production|staging> Environment name (default: production)
  --tz <timezone>            Timezone for cron entries (default: Asia/Tehran)
  --user <linux-user>        User that owns cron entries (default: current/sudo user)
  --print-only               Print resulting cron block without installing
  -h, --help                 Show help

Schedule installed:
  - Daily backup   : 02:30
  - Weekly backup  : Friday 03:00
  - Monthly backup : Day 1 at 04:00
USAGE
}

log() { printf '[backup-cron] %s\n' "$*"; }
die() { printf '[backup-cron][error] %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-dir) REPO_DIR="${2:-}"; shift 2 ;;
    --env) ENV_NAME="${2:-}"; shift 2 ;;
    --tz) TZ_NAME="${2:-}"; shift 2 ;;
    --user) CRON_USER="${2:-}"; shift 2 ;;
    --print-only) PRINT_ONLY=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1" ;;
  esac
done

[[ -d "$REPO_DIR" ]] || die "Repo dir not found: $REPO_DIR"
[[ -x "$REPO_DIR/scripts/deploy/backup-onsite.sh" ]] || die "Missing executable: $REPO_DIR/scripts/deploy/backup-onsite.sh"

daily_cmd="cd $REPO_DIR && bash scripts/deploy/backup-onsite.sh --frequency daily --env $ENV_NAME >> /var/log/my-portfolio-backup.log 2>&1"
weekly_cmd="cd $REPO_DIR && bash scripts/deploy/backup-onsite.sh --frequency weekly --env $ENV_NAME >> /var/log/my-portfolio-backup.log 2>&1"
monthly_cmd="cd $REPO_DIR && bash scripts/deploy/backup-onsite.sh --frequency monthly --env $ENV_NAME >> /var/log/my-portfolio-backup.log 2>&1"

block_file="$(mktemp)"
trap 'rm -f "$block_file"' EXIT

cat >"$block_file" <<CRON
# BEGIN MY_PORTFOLIO_BACKUP_AUTOMATION
CRON_TZ=$TZ_NAME
30 2 * * * $daily_cmd
0 3 * * 5 $weekly_cmd
0 4 1 * * $monthly_cmd
# END MY_PORTFOLIO_BACKUP_AUTOMATION
CRON

if [[ "$PRINT_ONLY" == "1" ]]; then
  cat "$block_file"
  exit 0
fi

existing="$(mktemp)"
trap 'rm -f "$block_file" "$existing"' EXIT
crontab -u "$CRON_USER" -l 2>/dev/null >"$existing" || true

# Remove previous managed block if exists.
cleaned="$(mktemp)"
trap 'rm -f "$block_file" "$existing" "$cleaned"' EXIT
awk '
  /# BEGIN MY_PORTFOLIO_BACKUP_AUTOMATION/ {skip=1; next}
  /# END MY_PORTFOLIO_BACKUP_AUTOMATION/ {skip=0; next}
  !skip {print}
' "$existing" >"$cleaned"

{
  cat "$cleaned"
  echo
  cat "$block_file"
} | crontab -u "$CRON_USER" -

log "installed cron schedule for user: $CRON_USER"
log "timezone: $TZ_NAME"
log "log file: /var/log/my-portfolio-backup.log"
