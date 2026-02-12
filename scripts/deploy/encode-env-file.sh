#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $(basename "$0") <path-to-env-file>" >&2
  exit 1
fi

if [[ ! -f "$1" ]]; then
  echo "File not found: $1" >&2
  exit 1
fi

base64 -w 0 "$1"
echo
