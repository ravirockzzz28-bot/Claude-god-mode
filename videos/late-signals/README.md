# Late Signals · 15 s teaser

A 9:16 teaser (1080×1920, 30 fps, 15 s) for the podcast **Late Signals**. Dark, grainy, orange accents. It was
built with the **motionsmith** skill in `.claude/skills/motionsmith`. Everything on screen and every sound is made
by code, with no stock footage, images or music.

**The video:** [`final/late-signals-teaser.mp4`](final/late-signals-teaser.mp4)

## What happens

| Time | On screen | Sound |
|---|---|---|
| 0.0–2.5 s | "Still awake?" decodes out of orange signal noise above a faint orange trace that is searching | Radio static, ticks as letters lock |
| 2.5–5.0 s | The trace kicks; **Good.** slams in; *So are we.* answers | Hit, then a soft tap |
| 5.0–10.0 s | "Some conversations / only come through / after **midnight**." decodes line by line; the waveform grows | Ticks per line, glass ping on *midnight*, riser |
| 10.0–15.0 s | **LATE SIGNALS** lands on a push-through; the trace collapses into its underline and pulses on every beat; *A podcast. Tune in.* | Static clears, boom, a soft pulse on each beat |

## Change it

- **Words:** edit the strings in `piece.js` (`setup()`): `Still awake?`, `Good.`, `So are we.`, the three stanza
  lines, `LATE`/`SIGNALS` and the tagline. `L.midnight = [6, 14]` marks which letters of the last line are orange.
- **Timing:** the beats live in `plan.json` → `hits` (96 BPM, a bar is 2.5 s). Image and sound both read them.
- **Colours:** `BG`, `INK`, `ACC` at the top of `piece.js`. Grain strength: `finish.grain`.
- **Sound:** `cues.json` (sound design) and `make_static.py` (the radio static).

## Rebuild

`S` is the skill folder. In a cloud session, set `MOTION_NODE_MODULES` to the folder that holds Playwright
(here `/opt/node-tools/node_modules`).

```bash
S=../../.claude/skills/motionsmith
python3 -I make_static.py assets/static.wav
python3 -I $S/scripts/build_soundtrack.py --plan plan.json --cues cues.json --out assets/soundtrack.wav --replace
node $S/scripts/render_stream.mjs --root . --out final/late-signals-teaser.mp4 --audio assets/soundtrack.wav --crf 18
```

Preview frames: `node $S/scripts/sample_frames.mjs --root . --out preview/walk --every 0.5`.

## Files

| File | What it is |
|---|---|
| `brief.md` | The six-block motion brief: concept, banned list, tempo, storyboard |
| `plan.json` | Size, fps, scenes and the `hits` shared by picture and sound |
| `piece.js` | The animation (`setup`, `state(t)`, `draw`) |
| `cues.json`, `make_static.py` | Sound design and the radio static generator |
| `kit/`, `assets/fonts/` | The skill's render kit and the open-source font kit (SIL OFL), copied into the piece |
| `final/` | The rendered MP4 |

`assets/*.wav` and `preview/` are generated and not committed.
