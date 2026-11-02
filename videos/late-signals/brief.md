# Vertical reel with a hook (kinetic type, 9:16)

A short-form piece for Reels, TikTok or Shorts: one phrase or idea, the first frame already moving, a payoff that
earns a rewatch. Fill it with `python -I <skill>/scripts/brief.py new <piece>/brief.md --template reel-hook --set
name=value`, then `brief.py check`. Every placeholder with a default is a decision; change the defaults that do not fit.

<inputs>
Before building, ask in one message (at most three groups) only for what is missing:
- The exact on-screen copy, word for word: Still awake? / Good. So are we. / Some conversations / only come through after *midnight*. / LATE SIGNALS / A podcast. Tune in.
- Brand palette and type: none given; decided from the request (dark, grainy, orange accents).
- Sound: sound design only (decided: radio hiss bed, a tick per word, a riser into the title, one low hit on the title). No voice or music file was given.
Keep earlier answers; never ask twice.
</inputs>

<direction>
kind: reel
format: reel 1080x1920, 30 fps, safe area from new_piece.py
concept: a faint orange signal in the dark finds the viewer at night, gets stronger line by line, and locks into the show's name: the late hours are where the good talk is
recurring element: one orange signal line (an oscilloscope trace) that is flat, pulses, carries every transition and finally becomes the underline of the title
audience: night-time scrollers in bed or on a late commute who like long, honest conversations
Type: Archivo from the font kit (weight and width animated) for the voice of the show, JetBrains Mono for the clock and small labels, Fraunces italic for the second voice.
Palette: warm black #0b0908, off-white ink #ece4d8, one orange accent #ff6a1a for the signal line, the key word and the title.
Motion: entrances ease out, exits ease in and shorter, the hero on a spring with a small overshoot; real motion blur
on fast moves, sharp on every reading frame.
Camera: one family for the whole piece (slow push-ins with a small handheld drift, one push-through on the title), always motivated.
Matter: grain and print texture over the type; nothing reads as flat vector.
banned:
- holds over 0.5 s where nothing changes -> a reading hold keeps the text still and moves what surrounds it
- crossfades -> every scene grows out of the previous one through the recurring element
- glows with no source -> light only where something on screen emits it
- particle bursts -> motion starts from or ends in an element already on screen
- bouncy easing on everything -> overshoot only on the hero landing
- corner labels and HUD text -> text only when it says something
- anything that looks like a template -> if a default appears, replace it with a decision
ending: LATE SIGNALS held sharp with the signal line underlining it in orange, then 'A podcast. Tune in.'
</direction>

<structure>
duration: 15 s
tempo: 96 BPM
meter: 4/4
loop: no
- Bar 1 is the hook: the first frame already moves and the key word lands on beat 1.
- Each following bar does one thing that flows from the last; something changes on every beat (an accent inside the
  reading holds: a weight jump, an echo, an inversion, a sweep).
- The payoff lands on the downbeat of the last full bar and is the strongest moment.
- The tail holds the payoff long enough to read it twice.
storyboard (one line per bar, 96 BPM, bar = 2.5 s):
- Bar 1 (0.0): grain and a flat orange trace already drifting; "Still awake?" cascades in and lands on beat 1.
- Bar 2 (2.5): the trace kicks once; the question leaves upward; "Good." slams in; "So are we." (italic) answers on beat 3.
- Bar 3 (5.0): the trace starts to carry a waveform; "Some conversations" lands.
- Bar 4 (7.5): "only come through" on beat 1, "after midnight." on beat 3 with midnight in orange; the waveform grows.
- Bar 5 (10.0): the waveform surges and the stanza drops away; LATE SIGNALS lands on the downbeat with a small overshoot; the trace collapses into its underline.
- Bar 6 (12.5): "A podcast. Tune in." lands under it; the underline pulses on each beat; a slow push-in keeps the last frame moving.
</structure>

<build>
- `new_piece.py <piece> --format reel --duration 15` (or `--recipe kinetic-quote`), then `brief.py plan`
  to copy these decisions and the bar hits into plan.json; rename each hit's role to what it does on screen.
- piece.js writes `setup`, `state(t)` and `draw`; everything is a function of t, seeded, no clocks or Math.random.
- Text fits the safe area with `Stage.fitLines`; reading budgets from `MotionMath.readingTime`.
- Sound from the same hits (`build_soundtrack.py`); every visual event has its sound.
- Review before the full render: one frame per beat (`sample_frames.mjs --beats`), a walk every 0.5 s for stillness,
  dense windows on every cut, then the three critics. Fix what is off-grid, cramped or hard to read.
- Render with `render_stream.mjs`, verify with `verify_export.py --require-cfr --require-bt709` and `audio_check.py`.
</build>

<gotchas>
- Text scaled by the camera blurs if it is drawn small and enlarged: draw it at its largest size and scale down.
- Two lines swapping in one place overlap: give the outgoing line its exit before the next one enters.
- The interface covers the right column and the bottom: keep everything that must be read inside the safe area.
- If loop is yes, the last frame leads into the first in pose and speed (`loop_check.py`).
</gotchas>

<start>
Name the concept in one line, show the beat grid (`brief.py grid`) and the storyboard as states, one line per bar.
Then build without further questions, run the review and deliver the MP4, the sources and what only the person can
judge on their phone.
</start>
