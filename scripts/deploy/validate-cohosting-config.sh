#!/usr/bin/env bash
set -euo pipefail

CONF_PATH="${1:-ops/nginx/asdev-cohosting.conf}"

if [[ ! -f "$CONF_PATH" ]]; then
  echo "[validate] config not found: $CONF_PATH" >&2
  exit 1
fi

required_patterns=(
  "server 127.0.0.1:3000;"
  "server 127.0.0.1:3001;"
  "server 127.0.0.1:3002;"
  "server 127.0.0.1:3003;"
  "server_name persiantoolbox.ir"
  "server_name staging.persiantoolbox.ir"
  "server_name alirezasafaeidev.ir"
  "server_name staging.alirezasafaeidev.ir"
  "Strict-Transport-Security"
  'return 301 https://$host$request_uri;'
)

for pattern in "${required_patterns[@]}"; do
  if ! grep -Fq "$pattern" "$CONF_PATH"; then
    echo "[validate] missing required pattern: $pattern" >&2
    exit 1
  fi
done

echo "[validate] co-hosting nginx config contract passed: $CONF_PATH"
