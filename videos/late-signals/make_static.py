"""Radio static for the Late Signals teaser: band-limited hiss with fading, sparse crackle, and an envelope that
swells into the title and clears when the signal locks (10.0 s). Deterministic: same seed, same file.
    python3 make_static.py assets/static.wav"""
import sys, wave
import numpy as np

SR, DUR, SEED = 48000, 15.0, 7
rng = np.random.default_rng(SEED)
n = int(SR * DUR)
t = np.arange(n) / SR

def band(x, lo, hi):
    f = np.fft.rfft(x); freqs = np.fft.rfftfreq(len(x), 1 / SR)
    f[(freqs < lo) | (freqs > hi)] = 0
    return np.fft.irfft(f, len(x))

out = []
for ch in range(2):
    hiss = band(rng.standard_normal(n), 350, 6500)
    hiss /= np.abs(hiss).max()
    fade = .65 + .35 * np.sin(2 * np.pi * (.21 + .05 * ch) * t + ch) * np.sin(2 * np.pi * .067 * t)   # slow radio fading
    crackle = np.zeros(n)
    idx = rng.choice(n, 260, replace=False)
    crackle[idx] = rng.uniform(-1, 1, len(idx))
    crackle = band(crackle, 1500, 12000); crackle /= np.abs(crackle).max()
    out.append(hiss * fade * .7 + crackle * .5)
x = np.stack(out, 1)
# Envelope: present under the words, swells with the riser, clears to a whisper when the title locks.
env = np.interp(t, [0, .3, 5, 9.3, 9.82, 9.93, 10.0, 10.08, 12.5, 15], [0, .55, .45, .55, 1.0, .03, .03, .12, .08, 0])
x *= env[:, None]
x /= np.abs(x).max() * 1.05
pcm = (x * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', sys.argv[1], f'{DUR}s')
