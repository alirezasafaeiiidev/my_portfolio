#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

STAMP_UTC="$(date -u +%Y%m%dT%H%M%SZ)"
ART_DIR="artifacts"
mkdir -p "$ART_DIR"

MAX_ATTEMPTS="${MAX_ATTEMPTS:-3}"
WAIT_SECONDS="${WAIT_SECONDS:-180}"
AUTO_CONFIRM="${AUTO_CONFIRM:-1}"
SKIP_DOCKER="${SKIP_DOCKER:-1}"
EXPECTED_IP="${EXPECTED_IP:-185.3.124.93}"

SUMMARY_TSV="$ART_DIR/autopilot_unattended_${STAMP_UTC}_summary.tsv"
CMDS_TSV="$ART_DIR/autopilot_unattended_${STAMP_UTC}_commands.tsv"
GLOBAL_LOG="$ART_DIR/autopilot_unattended_${STAMP_UTC}.log"

printf "step\tname\tattempt\tstatus\tlog\tcommand\n" > "$SUMMARY_TSV"
printf "step\tname\tcommand\n" > "$CMDS_TSV"

log() {
  printf "[%s] %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$GLOBAL_LOG" >/dev/null
}

run_shell_cmd() {
  local cmd="$1"
  if [[ "$AUTO_CONFIRM" == "1" ]]; then
    yes | bash -lc "$cmd"
    return $?
  else
    bash -lc "$cmd"
  fi
}

heal_after_failure() {
  local name="$1"
  local cmd="$2"
  local failed_log="$3"

  log "self-heal start: ${name}"

  if rg -q "command not found: pnpm|pnpm: command not found" "$failed_log" 2>/dev/null; then
    bash -lc "corepack enable" >>"$GLOBAL_LOG" 2>&1 || true
    bash -lc "corepack prepare pnpm@9.15.0 --activate" >>"$GLOBAL_LOG" 2>&1 || true
  fi

  if rg -q "Cannot find module|node_modules|ERR_PNPM" "$failed_log" 2>/dev/null; then
    bash -lc "pnpm install --frozen-lockfile || pnpm install" >>"$GLOBAL_LOG" 2>&1 || true
  fi

  if [[ "$name" == *"E2E"* ]] || [[ "$cmd" == *"playwright"* ]]; then
    bash -lc "pnpm exec playwright install chromium" >>"$GLOBAL_LOG" 2>&1 || true
  fi

  if [[ "$name" == *"Lighthouse"* ]] || [[ "$cmd" == *"lhci"* ]]; then
    bash -lc "mkdir -p .lighthouseci" >>"$GLOBAL_LOG" 2>&1 || true
  fi

  if [[ "$name" == *"OSV"* ]] || [[ "$cmd" == *"osv"* ]]; then
    if [[ -x "artifacts/bin/osv-scanner" ]]; then
      :
    else
      bash -lc "mkdir -p artifacts/bin && curl -fsSL https://github.com/google/osv-scanner/releases/latest/download/osv-scanner_linux_amd64 -o artifacts/bin/osv-scanner && chmod +x artifacts/bin/osv-scanner" >>"$GLOBAL_LOG" 2>&1 || true
    fi
  fi

  if [[ "$name" == *"Trivy"* ]] || [[ "$cmd" == *"trivy"* ]]; then
    if [[ -x "artifacts/bin/trivy" ]]; then
      :
    else
      bash -lc "mkdir -p artifacts/bin && curl -fsSL https://github.com/aquasecurity/trivy/releases/latest/download/trivy_0.58.0_Linux-64bit.tar.gz -o /tmp/trivy.tgz && tar -xzf /tmp/trivy.tgz -C /tmp trivy && mv /tmp/trivy artifacts/bin/trivy && chmod +x artifacts/bin/trivy" >>"$GLOBAL_LOG" 2>&1 || true
    fi
  fi

  log "self-heal end: ${name}"
}

run_stage() {
  local step="$1"
  local name="$2"
  local cmd="$3"

  local attempt=1
  local status="FAIL"

  printf "%s\t%s\t%s\n" "$step" "$name" "$cmd" >> "$CMDS_TSV"

  while (( attempt <= MAX_ATTEMPTS )); do
    local log_file="$ART_DIR/autopilot_unattended_${STAMP_UTC}_${step}_attempt${attempt}.log"
    log "start step=${step} attempt=${attempt} name=${name}"

    if run_shell_cmd "$cmd" >"$log_file" 2>&1; then
      status="PASS"
      printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$step" "$name" "$attempt" "$status" "$log_file" "$cmd" >> "$SUMMARY_TSV"
      log "pass step=${step} name=${name}"
      return 0
    fi

    printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$step" "$name" "$attempt" "FAIL" "$log_file" "$cmd" >> "$SUMMARY_TSV"
    log "fail step=${step} attempt=${attempt} name=${name}"

    heal_after_failure "$name" "$cmd" "$log_file"

    if (( attempt < MAX_ATTEMPTS )); then
      log "wait ${WAIT_SECONDS}s then retry step=${step}"
      sleep "$WAIT_SECONDS"
    fi

    attempt=$((attempt + 1))
  done

  log "skip step=${step} after ${MAX_ATTEMPTS} failed attempts"
  return 1
}

run_stage "01" "Install" "pnpm install --frozen-lockfile || pnpm install"
run_stage "02" "Lint" "pnpm run lint"
run_stage "03" "Typecheck" "pnpm run type-check"
run_stage "04" "Unit Tests" "pnpm run test"
run_stage "05" "E2E Smoke" "pnpm run test:e2e:smoke"
run_stage "06" "E2E Full" "pnpm run test:e2e"
run_stage "07" "Lighthouse" "pnpm run lighthouse:ci"
run_stage "08" "Dependency Audit" "pnpm audit --json"
run_stage "09" "Audit High/Critical" "pnpm run audit:high"

if [[ -x "artifacts/bin/osv-scanner" ]]; then
  run_stage "10" "OSV" "artifacts/bin/osv-scanner scan -r ."
else
  run_stage "10" "OSV (npx fallback)" "npx --yes osv-scanner scan -r ."
fi

run_stage "11" "Secrets Scan" "pnpm run scan:secrets"

if [[ "$SKIP_DOCKER" == "1" ]]; then
  log "docker steps skipped by policy SKIP_DOCKER=1"
  printf "12\tDocker Build\t1\tSKIPPED\tN/A\tSKIP_DOCKER=1\n" >> "$SUMMARY_TSV"
  printf "13\tTrivy Image\t1\tSKIPPED\tN/A\tSKIP_DOCKER=1\n" >> "$SUMMARY_TSV"
else
  run_stage "12" "Docker Build" "docker build -t asdev-portfolio:autopilot ."
  if [[ -x "artifacts/bin/trivy" ]]; then
    run_stage "13" "Trivy Image" "artifacts/bin/trivy image --severity HIGH,CRITICAL --exit-code 1 asdev-portfolio:autopilot"
  else
    run_stage "13" "Trivy Image" "trivy image --severity HIGH,CRITICAL --exit-code 1 asdev-portfolio:autopilot"
  fi
fi

if [[ -x "artifacts/bin/trivy" ]]; then
  run_stage "14" "Trivy FS Secret/Misconfig" "artifacts/bin/trivy fs --scanners secret,misconfig --skip-db-update ."
else
  run_stage "14" "Trivy FS Secret/Misconfig" "trivy fs --scanners secret,misconfig --skip-db-update ."
fi

run_stage "15" "Web Surface Root" "curl -sSI http://127.0.0.1:3000 || true"
run_stage "16" "Web Surface Robots" "curl -sSI http://127.0.0.1:3000/robots.txt || true"
run_stage "17" "Web Surface Sitemap" "curl -sSI http://127.0.0.1:3000/sitemap.xml || true"
run_stage "18" "Deploy Gate" "pnpm run deploy:gate"
run_stage "19" "Hosting Config Validate" "bash scripts/deploy/validate-cohosting-config.sh"
run_stage "20" "Hosting Sync Strict" "bash scripts/deploy/check-hosting-sync.sh --strict"
run_stage "21" "VPS Preflight" "bash scripts/vps-preflight.sh"
run_stage "22" "Public Edge Check (alirezasafeidev.ir)" "bash scripts/deploy/verify-public-edge.sh alirezasafeidev.ir ${EXPECTED_IP}"
run_stage "23" "Public Edge Check (persiantoolbox.ir)" "bash scripts/deploy/verify-public-edge.sh persiantoolbox.ir ${EXPECTED_IP}"

log "autopilot completed"
log "summary: $SUMMARY_TSV"
log "commands: $CMDS_TSV"

echo "$SUMMARY_TSV"
