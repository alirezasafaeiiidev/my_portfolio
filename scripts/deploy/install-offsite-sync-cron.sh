#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/var/www/my-portfolio/current/production"
ENV_NAME="production"
TZ_NAME="Asia/Tehran"
CRON_USER="${SUDO_USER:-$(whoami)}"
OFFSITE_REMOTE=""
PRINT_ONLY=0

usage() {
  cat <<'USAGE'
Usage:
  install-offsite-sync-cron.sh [options]

Required:
  --offsite-remote <rclone-remote-path>
    Example: myremote:my-portfolio-backups

Options:
  --repo-dir <path>          Repo path on VPS (default: /var/www/my-portfolio/current/production)
  --env <production|staging> Environment name (default: production)
  --tz <timezone>            Timezone for cron entries (default: Asia/Tehran)
  --user <linux-user>        User that owns cron entries (default: current/sudo user)
  --print-only               Print resulting cron block without installing
  -h, --help                 Show help

Schedule installed:
  - Daily offsite sync   : 03:10
  - Weekly offsite sync  : Friday 03:20
  - Monthly offsite sync : Day 1 at 04:20
USAGE
}

log() { printf '[offsite-cron] %s\n' "$*"; }
die() { printf '[offsite-cron][error] %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-dir) REPO_DIR="${2:-}"; shift 2 ;;
    --env) ENV_NAME="${2:-}"; shift 2 ;;
    --tz) TZ_NAME="${2:-}"; shift 2 ;;
    --user) CRON_USER="${2:-}"; shift 2 ;;
    --offsite-remote) OFFSITE_REMOTE="${2:-}"; shift 2 ;;
    --print-only) PRINT_ONLY=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1" ;;
  esac
done

[[ -n "$OFFSITE_REMOTE" ]] || die "--offsite-remote is required"
[[ -d "$REPO_DIR" ]] || die "Repo dir not found: $REPO_DIR"
[[ -x "$REPO_DIR/scripts/deploy/push-offsite-backup.sh" ]] || die "Missing executable: $REPO_DIR/scripts/deploy/push-offsite-backup.sh"

daily_cmd="cd $REPO_DIR && OFFSITE_REMOTE='$OFFSITE_REMOTE' bash scripts/deploy/push-offsite-backup.sh --frequency daily --env $ENV_NAME"
weekly_cmd="cd $REPO_DIR && OFFSITE_REMOTE='$OFFSITE_REMOTE' bash scripts/deploy/push-offsite-backup.sh --frequency weekly --env $ENV_NAME"
monthly_cmd="cd $REPO_DIR && OFFSITE_REMOTE='$OFFSITE_REMOTE' bash scripts/deploy/push-offsite-backup.sh --frequency monthly --env $ENV_NAME"

block_file="$(mktemp)"
trap 'rm -f "$block_file"' EXIT

cat >"$block_file" <<CRON
# BEGIN MY_PORTFOLIO_OFFSITE_SYNC
CRON_TZ=$TZ_NAME
10 3 * * * $daily_cmd
20 3 * * 5 $weekly_cmd
20 4 1 * * $monthly_cmd
# END MY_PORTFOLIO_OFFSITE_SYNC
CRON

if [[ "$PRINT_ONLY" == "1" ]]; then
  cat "$block_file"
  exit 0
fi

existing="$(mktemp)"
cleaned="$(mktemp)"
trap 'rm -f "$block_file" "$existing" "$cleaned"' EXIT
crontab -u "$CRON_USER" -l 2>/dev/null >"$existing" || true

awk '
  /# BEGIN MY_PORTFOLIO_OFFSITE_SYNC/ {skip=1; next}
  /# END MY_PORTFOLIO_OFFSITE_SYNC/ {skip=0; next}
  !skip {print}
' "$existing" >"$cleaned"

{
  cat "$cleaned"
  echo
  cat "$block_file"
} | crontab -u "$CRON_USER" -

log "installed offsite sync cron for user: $CRON_USER"
log "timezone: $TZ_NAME"
