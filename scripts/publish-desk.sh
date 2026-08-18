#!/usr/bin/env bash
# Always publish the WHOLE Desk to the original icon URL.
# Never publish a subfolder. Never create a new slug.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DESK="$ROOT/desk"

SKILL_PUBLISH=""
for candidate in \
  /home/ubuntu/.cursor/plugins/cache/cursor-public/50420288/8ec223e927bb2247636aa0653536f63385f05298/skills/here-now/scripts/publish.sh \
  "$ROOT/scripts/here-now-publish.sh"
do
  if [[ -x "$candidate" ]]; then
    SKILL_PUBLISH="$candidate"
    break
  fi
done

if [[ -z "$SKILL_PUBLISH" ]]; then
  echo "here.now publish.sh not found" >&2
  exit 1
fi

# Keep a full local snapshot in sync, but publish from the repo desk.
rm -rf /tmp/desk-live
cp -a "$DESK" /tmp/desk-live

"$SKILL_PUBLISH" "$DESK" --slug whimsy-violet-dhgk --client cursor \
  --title "Mark's Desk" --description "iPad home page. Permanent. Always the full Desk."
