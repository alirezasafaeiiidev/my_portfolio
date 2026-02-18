#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="/var/backups/my-portfolio"
FREQUENCY="daily"
ENV_NAME="production"
OFFSITE_REMOTE="${OFFSITE_REMOTE:-}"
LOG_FILE="/var/log/my-portfolio-offsite-sync.log"
DRY_RUN=0

usage() {
  cat <<'USAGE'
Usage:
  push-offsite-backup.sh [options]

Required:
  OFFSITE_REMOTE env var (rclone remote path), e.g.:
    export OFFSITE_REMOTE="myremote:my-portfolio-backups"

Options:
  --frequency <daily|weekly|monthly>   Backup bucket (default: daily)
  --env <production|staging>           Environment name (default: production)
  --backup-root <path>                 Backup root (default: /var/backups/my-portfolio)
  --log-file <path>                    Log file path (default: /var/log/my-portfolio-offsite-sync.log)
  --dry-run                            Use rclone --dry-run
  -h, --help                           Show help

Notes:
  - Requires `rclone` and configured remote credentials on VPS.
  - Syncs tar.gz + sha256 + manifest files for selected frequency/env.
USAGE
}

log() {
  printf '[offsite-sync] %s\n' "$*" | tee -a "$LOG_FILE" >&2
}

die() {
  printf '[offsite-sync][error] %s\n' "$*" | tee -a "$LOG_FILE" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --frequency) FREQUENCY="${2:-}"; shift 2 ;;
    --env) ENV_NAME="${2:-}"; shift 2 ;;
    --backup-root) BACKUP_ROOT="${2:-}"; shift 2 ;;
    --log-file) LOG_FILE="${2:-}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1" ;;
  esac
done

case "$FREQUENCY" in
  daily|weekly|monthly) ;;
  *) die "--frequency must be one of: daily, weekly, monthly" ;;
esac

command -v rclone >/dev/null 2>&1 || die "rclone is not installed"
[[ -n "$OFFSITE_REMOTE" ]] || die "OFFSITE_REMOTE is required"

source_dir="${BACKUP_ROOT}/${FREQUENCY}"
[[ -d "$source_dir" ]] || die "Missing source dir: $source_dir"

ts="$(date -u +%Y%m%dT%H%M%SZ)"
include_prefix="my-portfolio-${ENV_NAME}-${FREQUENCY}-"
dest="${OFFSITE_REMOTE}/${FREQUENCY}/${ENV_NAME}"

log "timestamp=$ts frequency=$FREQUENCY env=$ENV_NAME"
log "source=$source_dir"
log "dest=$dest"

rclone_args=(
  "copy"
  "$source_dir"
  "$dest"
  "--include"
  "${include_prefix}*.tar.gz"
  "--include"
  "${include_prefix}*.tar.gz.sha256"
  "--include"
  "${include_prefix}*.tar.gz.manifest.txt"
  "--checkers"
  "4"
  "--transfers"
  "2"
  "--create-empty-src-dirs"
)

if [[ "$DRY_RUN" == "1" ]]; then
  rclone_args+=("--dry-run")
fi

{
  echo "==== offsite sync start: $ts ===="
  rclone "${rclone_args[@]}"
  echo "==== offsite sync done:  $(date -u +%Y%m%dT%H%M%SZ) ===="
} >> "$LOG_FILE" 2>&1

log "completed successfully"
