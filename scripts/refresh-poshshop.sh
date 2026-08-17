#!/usr/bin/env bash
# Pull Brittany's public closet, then publish Mark's Desk in place.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 "$ROOT/scripts/pull-poshshop.py"

if [[ "${SKIP_PUBLISH:-}" == "1" ]]; then
  echo "skipping publish"
  exit 0
fi

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
  echo "no here.now publish script; stock.json is updated"
  exit 0
fi

# Always publish the same Desk URL. Never create a new site.
SRC="$ROOT/desk"
if [[ -d /tmp/desk-live ]]; then
  mkdir -p /tmp/desk-live/poshshop
  cp -f "$ROOT/desk/poshshop/index.html" /tmp/desk-live/poshshop/index.html
  cp -f "$ROOT/desk/poshshop/stock.json" /tmp/desk-live/poshshop/stock.json
  cp -f "$ROOT/desk/poshshop/updated.json" /tmp/desk-live/poshshop/updated.json
  SRC=/tmp/desk-live
fi

"$SKILL_PUBLISH" "$SRC" --slug whimsy-violet-dhgk --client cursor \
  --title "Mark's Desk" --description "iPad home page. Permanent."
