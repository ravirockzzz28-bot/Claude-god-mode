# The skill challenge · 31 s voice-over reel

A 9:16 reply video (1080×1920, 30 fps, 31 s) from **Late Signals** to the creator Miftahul. It shows that a similar
motion video (our 15 s teaser in `../late-signals`) was made with Claude and the free, open-source **motionsmith**
skill, without the paid subscription, and challenges him to a friendly same-brief comparison.

**The video:** [`final/skill-challenge.mp4`](final/skill-challenge.mp4)

## Script (voice: ElevenLabs "James Adelaide – Grounded & Confident", eleven_v4, take A at 1.1×)

> Hey Miftahul. You said the secret isn't the prompt. It's your skill file.
> So we ran a test. No subscription. No paywall. No secret file.
> Just Claude, and a free, open-source skill anyone can install.
> This is what it made. A fifteen-second podcast teaser. Grain, glow, sound. All code.
> Your videos are great. But the skill isn't magic. It's taste, written down.
> So here's the challenge. Same brief. Your skill, versus the free one.
> Let the comments decide.

The two-column script (voice | screen) is in `brief.md`.

## How it was made

| Step | Tool |
|---|---|
| Voice (2 takes, take A chosen) | ElevenLabs text-to-speech, eleven_v4 (about 928 credits for both takes) |
| Word timings | ElevenLabs speech-to-text (scribe_v1) on take A, scaled by 1/1.1 after the 1.1× speed-up (`assets/voice-words.json`) |
| Scenes, accents, captions, voice mix | motionsmith: `voice_plan.py`, `build_soundtrack.py` (voice on top, everything ducked under it) |
| Picture | `piece.js`: 16 scenes read from the word timings; the orange trace follows the narrator's level |
| Proof footage | The real Late Signals teaser (`extract_teaser.sh` pulls its frames and audio) |
| Render | motionsmith `render_parallel.mjs`, then a social-size H.264 encode |

## Rebuild

```bash
S=../../.claude/skills/motionsmith
./extract_teaser.sh
python3 -I $S/scripts/build_soundtrack.py --plan plan.json --cues cues.json --out assets/soundtrack.wav --replace
node $S/scripts/render_parallel.mjs --root . --out preview/master.mp4 --workers 3 --audio assets/soundtrack.wav --crf 18
```

In a cloud session set `MOTION_NODE_MODULES=/opt/node-tools/node_modules` first. To change the words, generate a new
voice, transcribe it, and edit `SCENES` / `EMPH` in `piece.js` (word index ranges into `voice.json`).
