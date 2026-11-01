# Voice-over piece: the skill challenge (the voice is the clock)

A 30 s vertical reply video from the Late Signals podcast to the creator Miftahul: friendly, factual, a little cheeky.
The claim it answers: the secret behind his Claude-made videos is his skill file. The proof: our 15 s teaser, made with
Claude and the free, open-source motionsmith skill, no subscription.

<inputs>
- Script: written here (below), read by ElevenLabs voice "James Adelaide – Grounded & Confident" (eleven_v4), take A,
  sped to 1.1× to fit 30 s. Word timings: ElevenLabs speech-to-text on that take, scaled by 1/1.1.
- Visual world: the Late Signals look (warm black, grain, one orange accent), code-drawn cards, and the real teaser
  footage (videos/late-signals/final) as the proof.
- Sound: the voice on top; a low bed, soft taps on stressed words, the teaser's own audio under its footage, all ducked.
</inputs>

<direction>
kind: voiceover
format: reel 1080x1920, 30 fps (a voice-led piece does not need 60)
concept: a claim, a test and the result on screen: the viewer sees the free skill's video and is invited to judge
recurring element: the orange signal trace from the teaser, now driven by the narrator's voice, dividing picture and captions
audience: creators and Claude users who saw the original video and wondered whether they need the paid subscription
Picture: every phrase changes the picture (a card, a strike, a terminal, the teaser); the stressed word lands in orange
the moment it is said; captions follow the voice word by word.
Sound: the voice on top, dry; the bed and effects duck under it (10 dB or more under the voice); accents are soft taps.
Tone: respectful. Credit his work ("Your videos are great"), name the skill we used and its licence, never claim more than we did.
banned:
- a picture that illustrates the word literally on every line -> a picture that adds what the voice does not say
- text that arrives before it is said -> words land on their own onset
- impacts on stressed syllables -> a soft tap, or silence, so the word stays clear
- music over the voice -> the bed ducks under every phrase
- one picture held under a long phrase -> split the phrase at its comma, or move the camera
- mocking, his face, his characters or his footage -> our own picture, his name only in the voice and captions
- anything that looks like a template
ending: "Let the comments decide." with a comment bubble, then the Late Signals sign-off, held
</direction>

<structure>
duration: 31 s
tempo: voice
loop: no

| voice | screen |
|---|---|
| Hey *Miftahul*. | The trace wakes up with the voice; his name lands big |
| You said the secret isn't the *prompt*. | A chat prompt box; the word prompt is crossed out |
| It's your *skill* file. | A SKILL.md file card drops in with a padlock and a price tag |
| So we ran a *test*. | The locked card slides away; a TEST No.1 stamp lands |
| No *subscription*. No paywall. No secret file. | A three-row list; each row gets an orange strike as it is said |
| Just Claude, and a free, *open-source* skill anyone can install. | A terminal types the install command; MIT licence badge |
| This is what it *made*. | A phone-shaped card opens |
| A fifteen-second podcast *teaser*. | The real Late Signals teaser plays inside the card |
| Grain, glow, *sound*. | Three labels point at the footage |
| All *code*. | The footage gives way to the piece's own source code scrolling |
| Your videos are *great*. | A warm, clean frame: just the words |
| But the skill isn't *magic*. | magic flickers like a dying sparkler |
| It's *taste*, written down. | The SKILL.md card returns, unlocked, its lines writing themselves |
| So here's the *challenge*. | THE CHALLENGE slams in; the trace spikes |
| Same *brief*. | A brief card: 15 s podcast teaser |
| Your skill, versus the *free* one. | Split: YOUR SKILL (lock) vs FREE ONE (MIT), an orange VS |
| Let the *comments* decide. | A comment bubble; LATE SIGNALS sign-off |

About 2.5 words per second; read at 1.1× it runs 30.3 s.
</structure>

<build>
- `new_piece.py videos/skill-challenge --recipe voice-captions --format reel --fps 30`, then the picture rewritten in piece.js.
- `voice_plan.py --plan plan.json --voice assets/voice.wav --words assets/voice-words.json --script brief.md --brief brief.md --preset voice`.
- Teaser frames from videos/late-signals/final into assets/teaser/ (extract_teaser.sh); its audio as a ducked music cue.
- `build_soundtrack.py --plan plan.json --cues cues.json`; review with `sample_frames.mjs --cuts` and `--hits`.
- Render at 30 fps, CRF 20 for delivery, `verify_export.py`.
</build>

<gotchas>
- Word timings come from the exact take, scaled for the 1.1× speed-up; voice_plan checks them against the audio.
- Captions that follow a voice can read faster than subtitles, but not faster than 22 characters per second.
- Keep everything that must be read inside the safe area: the app covers the bottom and the right column.
</gotchas>

<start>
Run voice_plan, read its emphasis list against the marked words, build, review per phrase, render and deliver.
</start>
