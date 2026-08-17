#!/usr/bin/env python3
"""Pull Brittany's public Poshmark closet into desk/poshshop/stock.json."""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

UA = (
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)
CLOSET = "thecareycurated"
BASE = f"https://poshmark.com/closet/{CLOSET}"
ROOT = Path(__file__).resolve().parents[1]
STOCK = ROOT / "desk" / "poshshop" / "stock.json"
META = ROOT / "desk" / "poshshop" / "updated.json"
MAX_PAGES = 80
PAUSE = 0.5


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml"},
    )
    with urllib.request.urlopen(req, timeout=40) as res:
        return res.read().decode("utf-8", "ignore")


def parse(html: str) -> tuple[list, dict]:
    marker = "window.__INITIAL_STATE__="
    i = html.find(marker)
    if i < 0:
        raise RuntimeError("Poshmark page did not include closet data")
    obj, _ = json.JSONDecoder().raw_decode(html[i + len(marker) :])
    lp = obj["$_closet"]["listingsPostData"]
    return lp.get("data") or [], lp.get("more") or {}


def money(value) -> int:
    if isinstance(value, dict):
        value = value.get("val") or value.get("amount") or value.get("cents") or 0
        if isinstance(value, (int, float)) and value > 1000 and value % 100 == 0:
            return int(value // 100)
    try:
        return int(float(value or 0))
    except (TypeError, ValueError):
        return 0


def slim(it: dict) -> dict:
    cover = it.get("cover_shot") or {}
    colors = [c.get("name") for c in (it.get("colors") or []) if c.get("name")]
    size = it.get("size") or ""
    inv = ((it.get("inventory") or {}).get("size_quantities") or [{}])[0]
    if not size:
        size = ((inv.get("size_obj") or {}).get("display")) or ""
    title = (it.get("title") or "").replace("\u2005", " ").replace("\u00a0", " ").strip()
    slug = re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-")
    pid = it.get("id")
    return {
        "id": pid,
        "title": title,
        "maker": it.get("brand") or "",
        "style": it.get("category") or "",
        "color": ", ".join(colors),
        "size": size,
        "price": money(it.get("price")),
        "blurb": (it.get("description") or "").strip(),
        "photo": cover.get("url_large") or cover.get("url") or it.get("picture_url") or "",
        "thumb": cover.get("url_small") or cover.get("url") or "",
        "posh": f"https://poshmark.com/listing/{slug}-{pid}" if pid else "",
        "stage": "For sale",
        "source": "poshmark",
    }


def pull() -> list[dict]:
    seen: set[str] = set()
    items: list[dict] = []
    url = BASE
    expected = None
    for page in range(1, MAX_PAGES + 1):
        html = fetch(url)
        data, more = parse(html)
        if expected is None:
            expected = more.get("total")
        for it in data:
            pid = it.get("id")
            if not pid or pid in seen:
                continue
            seen.add(pid)
            items.append(slim(it))
        print(f"page {page} got {len(data)} total {len(items)} avail {expected}", flush=True)
        nxt = more.get("next_max_id") if more.get("is_next_max_id_present") else None
        if not nxt:
            break
        url = f"{BASE}?max_id={nxt}"
        time.sleep(PAUSE)
    if expected and len(items) < int(expected) * 0.85:
        raise RuntimeError(f"only pulled {len(items)} of about {expected} listings")
    if len(items) < 50:
        raise RuntimeError(f"closet pull looked empty ({len(items)} items)")
    return items


def main() -> int:
    try:
        items = pull()
    except (urllib.error.URLError, TimeoutError, RuntimeError, KeyError, json.JSONDecodeError) as exc:
        print(f"pull failed, leaving the old rack: {exc}", file=sys.stderr)
        return 1
    STOCK.parent.mkdir(parents=True, exist_ok=True)
    STOCK.write_text(json.dumps(items, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    meta = {
        "closet": CLOSET,
        "count": len(items),
        "pulledAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    META.write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(items)} items to {STOCK}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
