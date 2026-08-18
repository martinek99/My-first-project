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

## Grok Bot App Store watch (ticket T-E86465)

Mark’s Grok Bot iPhone/iPad app is frozen on **Setting up**. Cursor support (Liang Hong, 18 Aug 2026) said this is a known bug in **1.1 and 1.2**. The fix is **~1.3.0**, submitted to Apple for review. Do not tell him to install 1.2. Do not tell him to delete the app or replace any home-screen icon.

Check the live store on every turn until 1.3 is out:

`https://itunes.apple.com/lookup?id=6794501026&country=us`

or the listing: https://apps.apple.com/us/app/grok-bot/id6794501026

- If `version` is still `1.1` or `1.2`, tell Mark **1.3 is not out yet**. He waits. He can keep using Safari / this conversation.
- If `version` is `1.3.0` or higher, tell him right away: open the App Store, find **Grok Bot**, tap **Update** on both iPhone and iPad, then swipe the app away and reopen it. If Setting up is still there after that, write Liang at hi@cursor.com on T-E86465.

Last store check (18 Aug 2026): Grok Bot **1.2**, released 17 Aug 2026. 1.3 not live.
