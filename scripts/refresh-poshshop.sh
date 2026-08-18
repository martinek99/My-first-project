#!/usr/bin/env bash
# Pull Brittany's public closet, then publish the WHOLE Desk in place.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 "$ROOT/scripts/pull-poshshop.py"

if [[ "${SKIP_PUBLISH:-}" == "1" ]]; then
  echo "skipping publish"
  exit 0
fi

"$ROOT/scripts/publish-desk.sh"
