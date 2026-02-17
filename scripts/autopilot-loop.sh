#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOOP_WAIT_SECONDS="${LOOP_WAIT_SECONDS:-300}"
MAX_CYCLES="${MAX_CYCLES:-0}" # 0 = infinite
CYCLE=1

while :; do
  echo "[autopilot-loop] cycle=${CYCLE} started at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

  bash scripts/autopilot-unattended.sh || true

  echo "[autopilot-loop] cycle=${CYCLE} finished at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

  if [[ "$MAX_CYCLES" != "0" ]] && (( CYCLE >= MAX_CYCLES )); then
    echo "[autopilot-loop] reached MAX_CYCLES=${MAX_CYCLES}; exiting"
    break
  fi

  CYCLE=$((CYCLE + 1))
  echo "[autopilot-loop] sleeping ${LOOP_WAIT_SECONDS}s before next cycle"
  sleep "$LOOP_WAIT_SECONDS"
done
