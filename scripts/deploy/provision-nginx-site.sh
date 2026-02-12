#!/usr/bin/env bash
set -euo pipefail

APP_SLUG=""
PROD_DOMAIN=""
STAGING_DOMAIN=""
PROD_PORT=""
STAGING_PORT=""
ENABLE_SITE=true
ACME_SNIPPET="/etc/nginx/snippets/letsencrypt-acme.conf"

usage() {
  cat <<USAGE
Usage: $(basename "$0") --app-slug <name> --prod-domain <domain> --staging-domain <domain> --prod-port <port> --staging-port <port> [options]
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-slug) APP_SLUG="${2:-}"; shift 2 ;;
    --prod-domain) PROD_DOMAIN="${2:-}"; shift 2 ;;
    --staging-domain) STAGING_DOMAIN="${2:-}"; shift 2 ;;
    --prod-port) PROD_PORT="${2:-}"; shift 2 ;;
    --staging-port) STAGING_PORT="${2:-}"; shift 2 ;;
    --enable-site) ENABLE_SITE="${2:-}"; shift 2 ;;
    --acme-snippet) ACME_SNIPPET="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[nginx] unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ -z "$APP_SLUG" || -z "$PROD_DOMAIN" || -z "$STAGING_DOMAIN" || -z "$PROD_PORT" || -z "$STAGING_PORT" ]]; then
  usage
  exit 1
fi
if [[ "$EUID" -ne 0 ]]; then
  echo "[nginx] run as root (sudo)" >&2
  exit 1
fi

AVAILABLE_FILE="/etc/nginx/sites-available/${APP_SLUG}.conf"
ENABLED_FILE="/etc/nginx/sites-enabled/${APP_SLUG}.conf"
ACME_INCLUDE=""

if [[ -n "$ACME_SNIPPET" && -f "$ACME_SNIPPET" ]]; then
  ACME_INCLUDE="include ${ACME_SNIPPET};"
fi

cat > "$AVAILABLE_FILE" <<CONF
upstream ${APP_SLUG}_production {
  server 127.0.0.1:${PROD_PORT};
  keepalive 32;
}

upstream ${APP_SLUG}_staging {
  server 127.0.0.1:${STAGING_PORT};
  keepalive 16;
}

server {
  listen 80;
  listen [::]:80;
  server_name ${PROD_DOMAIN} www.${PROD_DOMAIN};

  ${ACME_INCLUDE}

  location / {
    proxy_pass http://${APP_SLUG}_production;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 60s;
  }
}

server {
  listen 80;
  listen [::]:80;
  server_name ${STAGING_DOMAIN};

  ${ACME_INCLUDE}

  location / {
    proxy_pass http://${APP_SLUG}_staging;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 60s;
  }
}
CONF

echo "[nginx] wrote $AVAILABLE_FILE"

if [[ "$ENABLE_SITE" == "true" ]]; then
  ln -sfn "$AVAILABLE_FILE" "$ENABLED_FILE"
  nginx -t
  systemctl reload nginx
  echo "[nginx] enabled + reloaded: $ENABLED_FILE"
fi
