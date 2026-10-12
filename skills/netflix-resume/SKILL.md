---
name: netflix-resume
description: Build a Netflix-style streaming resume website (single HTML file) with an animated intro, hero billboard, seasons (career timeline), cast (skills), clips (projects), awards, "directed by" credits, SVG animations and an animated GIF. Use when the user asks for a Netflix-style / card-style / streaming-style resume, portfolio or CV, or wants to turn their career details into one.
---

# Netflix-Style Resume

## Steps
1. **Gather facts.** Use saved memory/context about the user. For anything unknown, ask briefly or keep a clearly marked `[placeholder]`. Never invent employers, dates, numbers or awards.
2. **Copy `template.html`** (in this skill folder) to the user's project as `index.html`, and copy `assets/equalizer.gif` next to it as `assets/equalizer.gif`.
3. **Edit only the `DATA` object** at the top of the `<script>`. The page renders from it:
   - `name`, `tagline`, `year`, `rating`, `match`, `synopsis` -> hero billboard
   - `seasons[]` -> career/education timeline; each has `eps[]` (episodes = achievements)
   - `cast[]` -> `[skill, emoji glyph, % proficiency]` shown as animated rings
   - `clips[]` -> projects ("trailers & clips")
   - `awards[]`, `roll[]` (end credits), `directedBy/writtenBy/producedBy`, `genres`, `thisShowIs`, `languages`, `links`
4. **Map content to the metaphor:** each job/degree is a Season; key wins are Episodes; skills are Cast; projects are Clips; certifications/recognition are Awards; managers/mentors go in end credits.
5. **Preview:** open `index.html` in a browser (or `python3 -m http.server`). Check the intro, hover cards, click a season (modal), scroll to Cast (rings animate), and mobile width.
6. **Customise (optional):** accent color is `--red` in `:root`; add more seasons by adding objects to `seasons`; regenerate the GIF with Pillow if a different one is wanted.
7. **Deliver:** commit and push; optionally enable GitHub Pages (Settings -> Pages -> deploy from branch) for a live link.

## Quality bar
- Keep it a single static file (no build step); respect `prefers-reduced-motion`.
- Every claim must come from the user. Placeholders stay visibly bracketed until replaced.
- Do not use real Netflix logos or trademarked assets; the page is Netflix-*style* only.
