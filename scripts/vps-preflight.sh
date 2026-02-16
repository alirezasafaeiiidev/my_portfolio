#!/usr/bin/env bash
set -euo pipefail

REQUIRED=(node pnpm pm2 rsync nginx)
missing=0
for c in "${REQUIRED[@]}"; do
  if ! command -v "$c" >/dev/null 2>&1; then
    echo "missing: $c"
    missing=1
  fi
  done

if [ "$missing" -ne 0 ]; then
  echo "preflight failed"
  exit 1
fi

echo "preflight ok"
