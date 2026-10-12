---
name: ravi-series
description: Build or update "Ravi: The Series", Ravi Shankar Das's streaming-style portfolio (single offline HTML file with intro, "Who's watching?" profiles, seasons, Originals hover-preview cards, moments, skills, credentials and resume). Use when asked to rebuild, edit, extend or publish Ravi's portfolio, add a project/season/credential, or make a public-safe version.
---

# Ravi: The Series

A streaming-style portfolio built from one Python script plus one HTML template. All content lives in the `DATA` dictionary in `build_portfolio.py`; the design lives in `portfolio_template.html`. Output is a single file, `ravi_series.html`, with the photo embedded.

## Files (this folder)
- `build_portfolio.py` - holds `DATA`, validates it, fills the template, writes `ravi_series.html`
- `portfolio_template.html` - layout, animation, JavaScript (placeholders `__PORTFOLIO_DATA__`, `__EMAIL__`, `__PHOTO__`)
- `reference_page_text.md` - text export of the finished page, for checking wording
- `ravi_photo.jpg` - not stored here; copy it from `ravi-series/` next to the script (under 200 KB is best)

## Steps
1. Copy `build_portfolio.py`, `portfolio_template.html` and `ravi_photo.jpg` into one folder.
2. Edit only `DATA` in `build_portfolio.py`:
   - `originals` (projects), `seasons` (career), `moments`, `certs`, `skills`, `picks` (top 5 ids)
   - `sections`, `profiles`, `order` control row names and the order each profile sees
   - Keys: `t` title, `log` one-liner, `syn` synopsis, `bul` bullets, `nums` [value, label], `tags`, `link` [text, url], `c1/c2` poster colour tokens, `g` glyph, `status` live|soon, `see` id of a related item
3. Run `python3 build_portfolio.py` (add `--open` to launch the browser). It stops and lists any broken id references.
4. Check in a browser at desktop and 400px width: intro, profile picker, hover an Originals card, open a sheet, Journey tabs, Skill chips. Add `#recruiter` to the URL to skip the profile picker.
5. Publish: commit the built `ravi_series.html`, then enable GitHub Pages (Settings -> Pages -> main, root).

## Rules
- Use only facts Ravi has given. Never invent employers, dates, numbers or credentials.
- `PUBLIC = True` strips internal company figures (the Rs 20 Cr benefit). Keep it on for anything online and ask before showing other internal numbers (productivity rates, trip counts).
- Not affiliated with any streaming service; no Netflix name, logo or exact red.
- New cards must reuse `posterHTML()` and the `data-open` attribute so the detail sheet keeps working.
