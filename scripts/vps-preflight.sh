#!/usr/bin/env bash
set -euo pipefail

REQUIRED=(node pnpm pm2 rsync nginx)
missing=0

STRICT="${VPS_PREFLIGHT_STRICT:-0}"
for c in "${REQUIRED[@]}"; do
  if ! command -v "$c" >/dev/null 2>&1; then
    echo "missing: $c"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  if [ "$STRICT" = "1" ]; then
    echo "preflight failed"
    exit 1
  fi
  echo "preflight warning (non-strict): missing VPS-only dependencies in current runtime"
  echo "set VPS_PREFLIGHT_STRICT=1 to enforce hard failure"
  exit 0
fi

echo "preflight ok"
