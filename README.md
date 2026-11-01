# Claude-god-mode
To unlock claude in god mode. Make and save new skills

## Skills Claude loads in this repo (`.claude/skills/`)

| Skill | What it does | Source |
|---|---|---|
| `motionsmith` | Motion design and kinetic type made by code, rendered to MP4 (reels, teasers, titles, explainers) | [manuvegax/motionsmith](https://github.com/manuvegax/motionsmith), MIT (free and open source, not the paid MotionSmith service) |
| `hyperframes` | HeyGen's HTML-to-video framework: compose, animate and render videos | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes), Apache-2.0 |
| `hyperframes-cli` | The HyperFrames command line: scaffold, preview, render | same as above |

Each folder keeps its upstream license and a `SOURCE.md` with the commit it was copied from.

To use them on your own computer too:

```bash
git clone https://github.com/manuvegax/motionsmith.git && cd motionsmith && python install.py --claude
```

```bash
npx skills add heygen-com/hyperframes
```

## Videos

- [`videos/late-signals/`](videos/late-signals/): 15 s 9:16 teaser for the podcast *Late Signals*, made with the motionsmith skill.
- [`videos/skill-challenge/`](videos/skill-challenge/): 31 s 9:16 voice-over reply (ElevenLabs voice) challenging the paid-skill claim, with the teaser as proof.

## My own skills (`skills/`)

- `skills/netflix-resume/`, `skills/ravi-series/`
