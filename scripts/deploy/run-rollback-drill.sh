#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT=""
BASE_DIR="/var/www/my-portfolio"
APP_SLUG="my-portfolio"
SITE_URL=""
OUTPUT_DIR="artifacts"
TARGET_RELEASE=""

usage() {
  cat <<USAGE
Usage: $(basename "$0") --env <staging|production> --site-url <url> [options]

Required:
  --env <name>             Target environment (staging, production)
  --site-url <url>         Public base URL for post-rollback readiness check

Optional:
  --base-dir <path>        Base directory (default: /var/www/my-portfolio)
  --app-slug <name>        App slug (default: my-portfolio)
  --output-dir <path>      Artifact output dir (default: artifacts)
  --target-release <id>    Explicit rollback release id (default: latest previous)
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENVIRONMENT="${2:-}"
      shift 2
      ;;
    --site-url)
      SITE_URL="${2:-}"
      shift 2
      ;;
    --base-dir)
      BASE_DIR="${2:-}"
      shift 2
      ;;
    --app-slug)
      APP_SLUG="${2:-}"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="${2:-}"
      shift 2
      ;;
    --target-release)
      TARGET_RELEASE="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[rollback-drill] unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$ENVIRONMENT" || -z "$SITE_URL" ]]; then
  usage
  exit 1
fi

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo "[rollback-drill] unsupported environment: $ENVIRONMENT" >&2
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[rollback-drill] pm2 is required but not installed" >&2
  exit 1
fi

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUTPUT_DIR"
LOG_FILE="$OUTPUT_DIR/rollback-drill-${ENVIRONMENT}-${TIMESTAMP}.log"
INCIDENT_DIR="docs/strategic-execution/runtime/Incidents"
mkdir -p "$INCIDENT_DIR"
INCIDENT_FILE="$INCIDENT_DIR/${TIMESTAMP}_rollback-drill-${ENVIRONMENT}.md"

APP_NAME="$APP_SLUG-$ENVIRONMENT"
CURRENT_LINK="$BASE_DIR/current/$ENVIRONMENT"
PREVIOUS_RELEASE=""
POST_RELEASE="unknown"
ROLLBACK_EXIT=0
LOCAL_READY_EXIT=0
EDGE_READY_EXIT=0

{
  echo "[rollback-drill] timestamp=${TIMESTAMP}"
  echo "[rollback-drill] environment=${ENVIRONMENT}"
  echo "[rollback-drill] app_name=${APP_NAME}"
  echo "[rollback-drill] site_url=${SITE_URL}"

  if [[ -L "$CURRENT_LINK" ]]; then
    PREVIOUS_RELEASE="$(basename "$(readlink -f "$CURRENT_LINK")")"
  else
    PREVIOUS_RELEASE="unknown"
  fi
  echo "[rollback-drill] current_release_before=${PREVIOUS_RELEASE}"

  echo "[rollback-drill] pm2_status_before:"
  pm2 jlist | node -e '
    const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const app = process.argv[1];
    const selected = data
      .filter((item) => item.name === app)
      .map((item) => ({
        name: item.name,
        status: item.pm2_env?.status,
        restarts: item.pm2_env?.restart_time,
        pid: item.pid,
      }));
    console.log(JSON.stringify(selected, null, 2));
  ' "$APP_NAME"

  set +e
  if [[ -n "$TARGET_RELEASE" ]]; then
    bash ops/deploy/rollback.sh --env "$ENVIRONMENT" --base-dir "$BASE_DIR" --app-slug "$APP_SLUG" --target-release "$TARGET_RELEASE"
  else
    bash ops/deploy/rollback.sh --env "$ENVIRONMENT" --base-dir "$BASE_DIR" --app-slug "$APP_SLUG"
  fi
  ROLLBACK_EXIT=$?
  set -e
  echo "[rollback-drill] rollback_exit=${ROLLBACK_EXIT}"

  if [[ -L "$CURRENT_LINK" ]]; then
    POST_RELEASE="$(basename "$(readlink -f "$CURRENT_LINK")")"
  fi
  echo "[rollback-drill] current_release_after=${POST_RELEASE}"

  PORT="3003"
  if [[ "$ENVIRONMENT" == "production" ]]; then
    PORT="3002"
  fi

  set +e
  curl -fsS "http://127.0.0.1:${PORT}/api/ready" >/dev/null
  LOCAL_READY_EXIT=$?
  curl -fsS "${SITE_URL%/}/api/ready" >/dev/null
  EDGE_READY_EXIT=$?
  set -e
  echo "[rollback-drill] local_ready_exit=${LOCAL_READY_EXIT}"
  echo "[rollback-drill] edge_ready_exit=${EDGE_READY_EXIT}"

  echo "[rollback-drill] pm2_status_after:"
  pm2 jlist | node -e '
    const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const app = process.argv[1];
    const selected = data
      .filter((item) => item.name === app)
      .map((item) => ({
        name: item.name,
        status: item.pm2_env?.status,
        restarts: item.pm2_env?.restart_time,
        pid: item.pid,
      }));
    console.log(JSON.stringify(selected, null, 2));
  ' "$APP_NAME"

  FINAL_EXIT=0
  if [[ "$ROLLBACK_EXIT" -ne 0 || "$LOCAL_READY_EXIT" -ne 0 || "$EDGE_READY_EXIT" -ne 0 ]]; then
    FINAL_EXIT=1
  fi
  echo "[rollback-drill] final_exit=${FINAL_EXIT}"
} | tee "$LOG_FILE"

cat > "$INCIDENT_FILE" <<INCIDENT
# Rollback Drill Incident Note (${ENVIRONMENT})

- Timestamp (UTC): ${TIMESTAMP}
- Environment: ${ENVIRONMENT}
- Site URL: ${SITE_URL}
- App: ${APP_NAME}
- Release before rollback: ${PREVIOUS_RELEASE}
- Release after rollback: ${POST_RELEASE}
- Rollback command exit code: ${ROLLBACK_EXIT}
- Local readiness check exit code: ${LOCAL_READY_EXIT}
- Edge readiness check exit code: ${EDGE_READY_EXIT}
- Log artifact: \`${LOG_FILE}\`

## Summary
$(if [[ "$ROLLBACK_EXIT" -eq 0 && "$LOCAL_READY_EXIT" -eq 0 && "$EDGE_READY_EXIT" -eq 0 ]]; then
    echo "Rollback drill passed. Service recovered on both local upstream and edge readiness probes."
  else
    echo "Rollback drill failed or partially failed. Inspect artifact log and PM2 status before approving release."
  fi)

## Required Follow-up
1. Attach this incident note to release evidence bundle.
2. Record operator name and approval in release ticket.
3. If any check failed, create corrective action item before production sign-off.
INCIDENT

if [[ "$ROLLBACK_EXIT" -ne 0 || "$LOCAL_READY_EXIT" -ne 0 || "$EDGE_READY_EXIT" -ne 0 ]]; then
  exit 1
fi

echo "[rollback-drill] incident note created: ${INCIDENT_FILE}"
