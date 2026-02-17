#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-alirezasafeidev.ir}"
EXPECTED_IP="${2:-}"
USE_RESOLVE="${USE_RESOLVE:-1}"

fail=0

echo "[edge] domain: ${DOMAIN}"

resolved_ip="$(getent hosts "$DOMAIN" 2>/dev/null | awk '{print $1}' | head -n1 || true)"
if [[ -z "$resolved_ip" ]]; then
  echo "[edge] FAIL dns: could not resolve ${DOMAIN}" >&2
  exit 1
fi

echo "[edge] dns: ${resolved_ip}"
if [[ -n "$EXPECTED_IP" && "$resolved_ip" != "$EXPECTED_IP" ]]; then
  echo "[edge] FAIL dns mismatch: expected ${EXPECTED_IP}, got ${resolved_ip}" >&2
  fail=1
fi

curl_http=(curl --noproxy '*' -sS -I --max-time 20)
curl_https=(curl --noproxy '*' -sS -I --max-time 20)
if [[ "$USE_RESOLVE" == "1" && -n "$EXPECTED_IP" ]]; then
  curl_http+=(--resolve "${DOMAIN}:80:${EXPECTED_IP}")
  curl_https+=(--resolve "${DOMAIN}:443:${EXPECTED_IP}")
fi

http_headers="$("${curl_http[@]}" "http://${DOMAIN}" 2>&1 || true)"
https_headers="$("${curl_https[@]}" "https://${DOMAIN}" 2>&1 || true)"

http_status="$(printf '%s\n' "$http_headers" | awk '/^HTTP/{status=$2} END{print status}')"
https_status="$(printf '%s\n' "$https_headers" | awk '/^HTTP/{status=$2} END{print status}')"

if [[ "$http_status" != "301" && "$http_status" != "308" ]]; then
  echo "[edge] FAIL http redirect: expected 301/308, got ${http_status:-none}" >&2
  fail=1
else
  echo "[edge] http redirect: ${http_status}"
fi

if [[ -z "$https_status" || ! "$https_status" =~ ^[0-9]+$ || "$https_status" -ge 500 ]]; then
  if printf '%s\n' "$https_headers" | grep -qi 'SSL: no alternative certificate subject name matches'; then
    echo "[edge] FAIL https tls certificate mismatch for ${DOMAIN}" >&2
  elif printf '%s\n' "$https_headers" | grep -qi 'Operation timed out'; then
    echo "[edge] FAIL https timeout for ${DOMAIN}" >&2
  else
    echo "[edge] FAIL https status: ${https_status:-none}" >&2
  fi
  fail=1
else
  echo "[edge] https status: ${https_status}"
fi

if ! printf '%s\n' "$https_headers" | grep -iq '^strict-transport-security:'; then
  echo "[edge] FAIL hsts header missing" >&2
  fail=1
else
  echo "[edge] hsts: present"
fi

echo "[edge] done"
exit "$fail"
