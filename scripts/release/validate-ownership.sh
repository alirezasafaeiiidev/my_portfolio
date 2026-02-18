#!/usr/bin/env bash
set -euo pipefail

DOC_PATH="${1:-docs/ONCALL_ESCALATION.md}"

if [[ ! -f "$DOC_PATH" ]]; then
  echo "ownership_doc_missing=true path=${DOC_PATH}" >&2
  exit 1
fi

if rg -n "TODO_NAME|TODO_CHANNEL|TODO_OWNER" "$DOC_PATH" >/dev/null 2>&1; then
  echo "ownership_incomplete=true path=${DOC_PATH}" >&2
  rg -n "TODO_NAME|TODO_CHANNEL|TODO_OWNER" "$DOC_PATH" >&2
  exit 1
fi

echo "ownership_incomplete=false path=${DOC_PATH}"
