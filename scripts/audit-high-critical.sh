#!/usr/bin/env bash
set -euo pipefail

tmp_audit_file="$(mktemp)"
trap 'rm -f "$tmp_audit_file"' EXIT

set +e
bun audit --json >"$tmp_audit_file"
audit_status=$?
set -e

if [[ $audit_status -eq 0 ]]; then
  echo "bun audit: no vulnerabilities detected"
  exit 0
fi

node - "$tmp_audit_file" <<'NODE'
const fs = require('node:fs');

const filePath = process.argv[2];
const payload = fs.readFileSync(filePath, 'utf8').trim();
if (!payload) {
  console.error('audit-high-critical: empty bun audit payload');
  process.exit(1);
}

const report = JSON.parse(payload);
const counts = {
  critical: 0,
  high: 0,
  moderate: 0,
  low: 0,
  unknown: 0,
};

for (const advisories of Object.values(report)) {
  for (const advisory of advisories) {
    const severity = String(advisory?.severity ?? '').toLowerCase();
    if (severity in counts) {
      counts[severity] += 1;
      continue;
    }
    counts.unknown += 1;
  }
}

console.log(
  `bun audit summary => critical=${counts.critical} high=${counts.high} moderate=${counts.moderate} low=${counts.low} unknown=${counts.unknown}`,
);

if (counts.critical > 0 || counts.high > 0) {
  console.error('Blocking due to high/critical vulnerabilities.');
  process.exit(1);
}
NODE
