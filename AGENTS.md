# Agent rules for Mark’s Desk

Mark’s iPhone/iPad home-screen icon opens this address and must keep working:

https://whimsy-violet-dhgk.here.now/

## Never let the icon go stale

- Update that slug in place. Do not create a new here.now site for the Desk.
- Do not ask Mark to delete the icon or Add to Home Screen again.
- Do not send a new Desk URL.
- After every Desk change, publish the **entire** `desk/` folder:
  `scripts/publish-desk.sh`
  or
  `publish.sh desk --slug whimsy-violet-dhgk --client cursor`
- Never publish a subfolder (`desk/poshshop`, `desk/cary`, `/tmp/desk-live` with missing pages). here.now replaces the whole site. A partial publish deletes programs from the icon.
- Keep share links on `https://whimsy-violet-dhgk.here.now/...`

## Other standing work

- Brittany’s pink shop is a copy of her public closet `@thecareycurated`. Refresh it with `python3 scripts/pull-poshshop.py` then `scripts/publish-desk.sh`.
- Luke’s shop name is **Carey Mechanical** (C-A-R-E-Y).
