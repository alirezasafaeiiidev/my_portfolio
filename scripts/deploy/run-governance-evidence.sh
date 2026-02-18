#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/var/www/my-portfolio/current/production"
ENV_NAME="production"
BACKUP_FREQ="daily"
BACKUP_ROOT="/var/backups/my-portfolio"
OUTPUT_DIR="/var/www/my-portfolio/shared/logs/governance"

usage() {
  cat <<'USAGE'
Usage:
  run-governance-evidence.sh [options]

Options:
  --repo-dir <path>          Repo path on VPS (default: /var/www/my-portfolio/current/production)
  --env <production|staging> Environment name (default: production)
  --frequency <daily|weekly|monthly>
                             Backup bucket used for drill (default: daily)
  --backup-root <path>       Backup root (default: /var/backups/my-portfolio)
  --output-dir <path>        Evidence output dir (default: /var/www/my-portfolio/shared/logs/governance)
  -h, --help                 Show help
USAGE
}

log() { printf '[governance-evidence] %s\n' "$*"; }
die() { printf '[governance-evidence][error] %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-dir) REPO_DIR="${2:-}"; shift 2 ;;
    --env) ENV_NAME="${2:-}"; shift 2 ;;
    --frequency) BACKUP_FREQ="${2:-}"; shift 2 ;;
    --backup-root) BACKUP_ROOT="${2:-}"; shift 2 ;;
    --output-dir) OUTPUT_DIR="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1" ;;
  esac
done

[[ -d "$REPO_DIR" ]] || die "Repo dir not found: $REPO_DIR"
[[ -x "$REPO_DIR/scripts/deploy/backup-onsite.sh" ]] || die "Missing executable: $REPO_DIR/scripts/deploy/backup-onsite.sh"
[[ -x "$REPO_DIR/scripts/deploy/restore-drill-onsite.sh" ]] || die "Missing executable: $REPO_DIR/scripts/deploy/restore-drill-onsite.sh"

ts="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUTPUT_DIR"

backup_log="$OUTPUT_DIR/backup-${ENV_NAME}-${ts}.log"
restore_log="$OUTPUT_DIR/restore-drill-${ENV_NAME}-${ts}.log"
summary="$OUTPUT_DIR/governance-summary-${ENV_NAME}-${ts}.md"

log "running backup -> $backup_log"
(
  cd "$REPO_DIR"
  bash scripts/deploy/backup-onsite.sh --frequency "$BACKUP_FREQ" --env "$ENV_NAME" --backup-root "$BACKUP_ROOT"
) |& tee "$backup_log"

log "running restore drill -> $restore_log"
(
  cd "$REPO_DIR"
  bash scripts/deploy/restore-drill-onsite.sh --frequency "$BACKUP_FREQ" --env "$ENV_NAME" --backup-root "$BACKUP_ROOT"
) |& tee "$restore_log"

cat >"$summary" <<EOF
# Governance Evidence Summary ($ts)

- Environment: \`$ENV_NAME\`
- Backup frequency bucket: \`$BACKUP_FREQ\`
- Backup root: \`$BACKUP_ROOT\`
- Backup log: \`$backup_log\`
- Restore drill log: \`$restore_log\`

## Verification Checklist

- [x] Backup command executed
- [x] Restore drill command executed
- [ ] Link this summary in runtime evidence docs
- [ ] Attach screenshots/panel references if needed
EOF

log "summary written: $summary"
log "done"
