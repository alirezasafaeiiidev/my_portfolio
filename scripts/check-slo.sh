#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-}"
MAX_ERROR_RATE="${SLO_MAX_ERROR_RATE:-0.02}"
MIN_SAMPLE_SIZE="${SLO_MIN_SAMPLE_SIZE:-50}"

if [[ -z "$SITE_URL" ]]; then
  echo "SITE_URL is required (example: https://your-domain.com)"
  exit 1
fi

metrics="$(curl -fsSL "${SITE_URL%/}/api/metrics")"
total="$(printf '%s\n' "$metrics" | awk '/^portfolio_api_requests_total / {print $2}')"
errors="$(printf '%s\n' "$metrics" | awk '/^portfolio_api_errors_total / {print $2}')"

if [[ -z "$total" || -z "$errors" ]]; then
  echo "failed_to_parse_metrics=true"
  exit 1
fi

if (( total < MIN_SAMPLE_SIZE )); then
  echo "sample_size_too_low=true total=${total} threshold=${MIN_SAMPLE_SIZE}"
  exit 0
fi

error_rate="$(awk -v e="$errors" -v t="$total" 'BEGIN { if (t == 0) print 0; else printf "%.6f", e / t }')"
echo "total_requests=${total}"
echo "error_requests=${errors}"
echo "error_rate=${error_rate}"

awk -v rate="$error_rate" -v max="$MAX_ERROR_RATE" 'BEGIN { exit (rate > max) ? 1 : 0 }'
