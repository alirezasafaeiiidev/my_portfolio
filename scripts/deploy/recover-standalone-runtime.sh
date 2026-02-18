#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/var/www/my-portfolio/releases/production"
PROD_ENV_FILE="/var/www/my-portfolio/shared/env/production.env"
STG_ENV_FILE="/var/www/my-portfolio/shared/env/staging.env"
PROD_NAME="my-portfolio-production"
STG_NAME="my-portfolio-staging"
PROD_PORT="3002"
STG_PORT="3003"

usage() {
  cat <<USAGE
Usage: $(basename "$0") [options]

Options:
  --root-dir <path>         Releases root (default: ${ROOT_DIR})
  --prod-env <path>         Production env file (default: ${PROD_ENV_FILE})
  --staging-env <path>      Staging env file (default: ${STG_ENV_FILE})
  --prod-name <name>        PM2 process name (default: ${PROD_NAME})
  --staging-name <name>     PM2 process name (default: ${STG_NAME})
  --prod-port <port>        Production port (default: ${PROD_PORT})
  --staging-port <port>     Staging port (default: ${STG_PORT})
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --root-dir) ROOT_DIR="${2:-}"; shift 2 ;;
    --prod-env) PROD_ENV_FILE="${2:-}"; shift 2 ;;
    --staging-env) STG_ENV_FILE="${2:-}"; shift 2 ;;
    --prod-name) PROD_NAME="${2:-}"; shift 2 ;;
    --staging-name) STG_NAME="${2:-}"; shift 2 ;;
    --prod-port) PROD_PORT="${2:-}"; shift 2 ;;
    --staging-port) STG_PORT="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[recover] unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ "$EUID" -ne 0 ]]; then
  echo "[recover] run as root (sudo)" >&2
  exit 1
fi

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "[recover] releases root not found: $ROOT_DIR" >&2
  exit 1
fi

find_latest_good_release() {
  local root="$1"
  local candidate=""
  local r
  while IFS= read -r r; do
    if [[ -f "$r/.next/standalone/server.js" ]]; then
      candidate="$r"
      break
    fi
  done < <(find "$root" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -nr | awk '{print $2}')
  [[ -n "$candidate" ]] || return 1
  echo "$candidate"
}

GOOD_RELEASE="$(find_latest_good_release "$ROOT_DIR")" || {
  echo "[recover] no release with .next/standalone/server.js found under $ROOT_DIR" >&2
  exit 1
}

echo "[recover] selected release: $GOOD_RELEASE"

start_with_env() {
  local env_file="$1"
  local port="$2"
  local name="$3"
  local cwd="$4"
  local script="$5"

  # shellcheck disable=SC1090
  set -a
  source "$env_file"
  set +a
  export PORT="$port" HOSTNAME="127.0.0.1" NODE_ENV="production"

  pm2 delete "$name" >/dev/null 2>&1 || true
  pm2 start "$script" --name "$name" --cwd "$cwd" --interpreter node --time --update-env
}

start_with_env "$PROD_ENV_FILE" "$PROD_PORT" "$PROD_NAME" "$GOOD_RELEASE" "$GOOD_RELEASE/.next/standalone/server.js"
start_with_env "$STG_ENV_FILE" "$STG_PORT" "$STG_NAME" "$GOOD_RELEASE" "$GOOD_RELEASE/.next/standalone/server.js"

pm2 save

echo "[recover] done"
pm2 ls --no-color
