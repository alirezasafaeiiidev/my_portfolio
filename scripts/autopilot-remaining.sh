#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

STAMP_UTC="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
REPORT_PATH="docs/REMAINING_AUTOPILOT_${STAMP_UTC}.md"

EXPECTED_IP="${EXPECTED_IP:-185.3.124.93}"
DOMAINS=(
  "alirezasafeidev.ir"
  "persiantoolbox.ir"
)

PASS_COUNT=0
FAIL_COUNT=0

run_cmd() {
  local name="$1"
  local cmd="$2"
  local tmp
  tmp="$(mktemp)"

  if bash -lc "$cmd" >"$tmp" 2>&1; then
    PASS_COUNT=$((PASS_COUNT + 1))
    {
      echo "### ${name}"
      echo "- Status: PASS"
      echo "- Command: \`${cmd}\`"
      echo ""
      echo '```text'
      sed -n '1,120p' "$tmp"
      echo '```'
      echo ""
    } >>"$REPORT_PATH"
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    {
      echo "### ${name}"
      echo "- Status: FAIL"
      echo "- Command: \`${cmd}\`"
      echo ""
      echo '```text'
      sed -n '1,120p' "$tmp"
      echo '```'
      echo ""
    } >>"$REPORT_PATH"
  fi

  rm -f "$tmp"
}

run_e2e_smoke_isolated() {
  local name="E2E Smoke (isolated dev server)"
  local tmp
  local server_log
  local server_pid
  local ready=0

  tmp="$(mktemp)"
  server_log="$(mktemp)"

  pnpm exec next dev --hostname 127.0.0.1 --port 3200 >"$server_log" 2>&1 &
  server_pid=$!

  for _ in {1..90}; do
    if curl -fsS "http://127.0.0.1:3200" >/dev/null 2>&1; then
      ready=1
      break
    fi
    sleep 1
  done

  if [[ "$ready" -eq 1 ]] && PW_NO_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3200 pnpm exec playwright test e2e/smoke.spec.mjs --config=playwright.config.mjs >"$tmp" 2>&1; then
    PASS_COUNT=$((PASS_COUNT + 1))
    {
      echo "### ${name}"
      echo "- Status: PASS"
      echo "- Command: \`PW_NO_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3200 pnpm exec playwright test e2e/smoke.spec.mjs --config=playwright.config.mjs\`"
      echo ""
      echo '```text'
      sed -n '1,120p' "$tmp"
      echo '```'
      echo ""
    } >>"$REPORT_PATH"
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    {
      echo "### ${name}"
      echo "- Status: FAIL"
      echo "- Command: \`PW_NO_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3200 pnpm exec playwright test e2e/smoke.spec.mjs --config=playwright.config.mjs\`"
      echo ""
      echo '```text'
      if [[ "$ready" -ne 1 ]]; then
        echo "dev server did not become ready on port 3200"
      fi
      sed -n '1,120p' "$tmp"
      echo ""
      echo "--- server log ---"
      sed -n '1,120p' "$server_log"
      echo '```'
      echo ""
    } >>"$REPORT_PATH"
  fi

  if [[ -n "${server_pid:-}" ]] && kill -0 "$server_pid" >/dev/null 2>&1; then
    kill "$server_pid" >/dev/null 2>&1 || true
    wait "$server_pid" 2>/dev/null || true
  fi

  rm -f "$tmp" "$server_log"
}

cat >"$REPORT_PATH" <<EOF
# Remaining Tasks Autopilot Report

- Generated (UTC): ${STAMP_UTC}
- Repository: asdev-portfolio

## Automated Execution

EOF

run_cmd "Deploy Gate" "node scripts/deploy-gate.mjs"
run_cmd "Validate Co-hosting Config" "bash scripts/deploy/validate-cohosting-config.sh"
run_cmd "Hosting Sync Strict" "bash scripts/deploy/check-hosting-sync.sh --strict"
run_cmd "VPS Preflight" "bash scripts/vps-preflight.sh"
run_cmd "Prepare Lint Paths" "mkdir -p test-results playwright-report"
run_cmd "Lint" "pnpm run lint"
run_cmd "Type Check" "pnpm run type-check"
run_cmd "Unit/Integration Tests" "pnpm run test"
run_e2e_smoke_isolated

for domain in "${DOMAINS[@]}"; do
  run_cmd "Public Edge Check (${domain})" "bash scripts/deploy/verify-public-edge.sh ${domain} ${EXPECTED_IP}"
done

{
  echo "## Summary"
  echo ""
  echo "- Passed: ${PASS_COUNT}"
  echo "- Failed: ${FAIL_COUNT}"
} >>"$REPORT_PATH"

echo "$REPORT_PATH"
[[ "$FAIL_COUNT" -eq 0 ]]
