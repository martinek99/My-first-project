# Agent rules for Mark’s Desk

Mark’s iPhone/iPad home-screen icon opens this address and must keep working:

https://whimsy-violet-dhgk.here.now/

- Update that slug in place. Do not create a new here.now site for the Desk.
- Do not ask Mark to delete the icon or Add to Home Screen again.
- Do not send a new Desk URL.
- Publish with the saved API key: `publish.sh desk --slug whimsy-violet-dhgk --client cursor`
- Keep share links on `https://whimsy-violet-dhgk.here.now/...`
- Brittany’s pink shop is a copy of her public closet `@thecareycurated`. Refresh it with `python3 scripts/pull-poshshop.py` then publish the same Desk slug. A GitHub Action already does this twice a day.
