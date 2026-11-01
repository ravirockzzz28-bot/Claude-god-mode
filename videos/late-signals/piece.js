/* Late Signals · 15 s teaser, 1080×1920, 30 fps.
   Concept: a faint orange signal in the dark finds the viewer at night, gets stronger line by line and locks into the
   show's name. The recurring element is one orange trace (an oscilloscope line): it searches, kicks, carries a
   waveform under the words, surges, and collapses into the underline of the title, where it pulses on the beat.
   Words decode out of orange signal noise into off-white ink. Everything is a function of t and the plan's hits. */
(() => {
  'use strict';
  const M = window.MotionMath, S = window.Stage;
  const BG = '#0b0908', INK = '#ece4d8', ACC = '#ff6a1a';
  const SANS = S.FONTS.SANS, SERIF = S.FONTS.SERIF;
  const NOISE = 'ABCDEFGHKMNPRSTUVWXYZabcdeghknpqrsuvwxyz0123456789#%&/\\|<>=+*';
  const EXPO_OUT = M.easing('expo.out'), CUBIC_IN = M.easing('cubic.in'), QUAD_IN = M.easing('quad.in');
  const SPAN = .38, SETTLE = .14;                     // decode: left-to-right lock spread, noise time per glyph
  const prog = (v, a, b) => M.clamp((v - a) / (b - a));
  const gauss = (x, w) => Math.exp(-(x * x) / (2 * w * w));

  let T = {}, L = {}, PULSES = [], WORD_HITS = [], SEARCH = [];

  /* ---------- layout helpers ---------- */
  function line(ctx, text, {font, stretch = 'normal', x, y, align = 'center'}) {
    ctx.font = font; ctx.fontStretch = stretch;
    const measure = s => ctx.measureText(s).width;
    const width = measure(text);
    return {text, font, stretch, y, width, x0: align === 'center' ? x - width / 2 : x, glyphs: M.layoutGlyphs(text, measure)};
  }
  function sizeToFit(ctx, texts, {weight, stretch = 'normal', family = SANS, style = '', width, max}) {
    ctx.font = S.font({style, weight, size: 100, family}); ctx.fontStretch = stretch;
    const widest = Math.max(...texts.map(s => ctx.measureText(s).width));
    return Math.min(max, Math.floor(100 * width / widest));
  }
  function words(l) {                                  // words with their measured x (keeps kerning)
    const out = []; let cur = null;
    l.glyphs.forEach(g => {
      if (g.ch === ' ') { if (cur) out.push(cur); cur = null; }
      else { if (!cur) cur = {text: '', x: g.x}; cur.text += g.ch; }
    });
    if (cur) out.push(cur);
    return out;
  }

  /* ---------- drawing helpers ---------- */
  /* A line that decodes out of signal noise: glyph i shows orange noise from appear to lock, then its real letter. */
  function drawDecode(ctx, l, t, land, {alpha = 1, dx = 0, dy = 0, accent = null, color = INK} = {}) {
    if (alpha <= 0) return;
    const n = l.glyphs.length, k = Math.floor(t * 15);   // noise changes on twos
    ctx.save(); ctx.font = l.font; ctx.fontStretch = l.stretch;
    const settle = t - (land - SPAN);                     // a little horizontal interference while it tunes in
    const jx = settle < .7 ? 9 * Math.exp(-Math.max(0, settle) * 6) * Math.sin(t * 87) : 0;
    l.glyphs.forEach((g, i) => {
      if (g.ch === ' ') return;
      const lock = land - (n > 1 ? (n - 1 - i) / (n - 1) : 0) * SPAN, appear = lock - SETTLE;
      if (t < appear) return;
      let ch = g.ch, fill = accent && i >= accent[0] && i < accent[1] ? ACC : color, a = alpha;
      if (t < lock) { ch = NOISE[Math.floor(M.hash(k * 131 + i, 17) * NOISE.length)]; fill = ACC; a *= .8; }
      ctx.globalAlpha = a; ctx.fillStyle = fill;
      ctx.fillText(ch, l.x0 + g.x + dx + (t < lock ? jx * 2 : jx), l.y + dy);
    });
    ctx.restore();
  }
  /* A line whose words rise into place one after another, the last one landing at `land`. */
  function drawRise(ctx, l, t, land, {alpha = 1, dy = 0, each = .09, dur = .42, rise = 28} = {}) {
    if (alpha <= 0) return;
    const ws = l.words || (l.words = words(l));
    ctx.save(); ctx.font = l.font; ctx.fontStretch = l.stretch; ctx.fillStyle = INK;
    ws.forEach((w, i) => {
      const start = land - dur * .55 - (ws.length - 1 - i) * each, p = EXPO_OUT(prog(t, start, start + dur));
      if (p <= 0) return;
      ctx.globalAlpha = alpha * Math.min(1, p * 1.6);
      ctx.fillText(w.text, l.x0 + w.x, l.y + dy + rise * (1 - p));
    });
    ctx.restore();
  }

  /* ---------- the trace ---------- */
  function trace(t, env) {
    const {W} = env;
    const c = EXPO_OUT(prog(t, T.title, T.title + .35));                 // collapse into the underline
    const xa = M.mix(-30, L.ul.x0, c), xb = M.mix(W + 30, L.ul.x1, c), y = M.mix(L.traceY, L.ul.y, c);
    const voice = .55 + .45 * Math.abs(M.valueNoise(t * 5.5, 3));
    let A = 4 + 2 * M.valueNoise(t * 3, 5);
    if (t >= T.s1) A += M.mix(14, 80, M.smoothstep(prog(t, T.s1, T.title - .6))) * voice;
    A += 230 * QUAD_IN(prog(t, T.title - .6, T.title));
    WORD_HITS.forEach(h => { if (t >= h.time) A += 34 * h.amplitude * Math.exp(-(t - h.time) * 6); });
    const signal = A * (1 - EXPO_OUT(prog(t, T.title - .02, T.title + .28)));
    const jitter = 1.1 + 1.6 * (1 - c), f = Math.floor(t * 30);
    const kickT = t - T.good, kick = kickT >= 0 ? 170 * Math.exp(-kickT * 7) * Math.cos(kickT * 38) : 0;
    const pts = [], span = xb - xa;
    for (let x = xa; x <= xb + .01; x += 4) {
      const env01 = M.smoothstep(prog(x, xa, xa + .18 * span)) * M.smoothstep(prog(x, xb, xb - .18 * span));
      const w = .55 * Math.sin(x * .047 - t * 8.3) + .35 * Math.sin(x * .0195 + t * 3.7 + 1.3) + .6 * M.valueNoise(x * .021 + t * 6.5, 9);
      let yy = y + signal * env01 * w / 1.5 + jitter * M.valueNoise(x * .35 + f * 7.1, 4);
      if (kick) yy -= kick * gauss(x - W / 2, 46);
      SEARCH.forEach((b, i) => {                                         // bar 1: the signal catches for an instant
        const d = t - b; if (d < 0 || d > .5) return;
        yy -= 44 * Math.exp(-d * 9) * Math.sin(d * 60) * gauss(x - W * (.18 + .64 * M.hash(i, 23)), 24);
      });
      PULSES.forEach(p => {                                               // after the title: a blip runs along the line
        const d = t - p.time; if (d < 0 || d > .55) return;
        const xu = M.mix(xa, xb, d / .55), e = (1 - d / .55) * Math.min(1, p.amplitude * 1.4);
        yy -= 34 * e * gauss(x - xu, 16) - 12 * e * gauss(x - xu - 30, 14);
      });
      pts.push([x, yy]);
    }
    const energy = Math.min(1, signal / 120 + (kick > 0 ? kick / 200 : 0));
    let pulse = 0; PULSES.forEach(p => { if (t >= p.time) pulse += p.amplitude * Math.exp(-(t - p.time) * 5); });
    return {pts, y, width: M.mix(3, 6, c), energy, pulse, cx: (xa + xb) / 2};
  }
  function strokePath(ctx, pts) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }

  /* ---------- camera ---------- */
  function camera(t, env) {
    const {DURATION, HITS} = env;
    let s;
    if (t < T.title) s = 1 + .035 * t / T.title + .06 * QUAD_IN(prog(t, T.title - .5, T.title));   // slow push, then into the cut
    else s = 1 + .10 * (1 - EXPO_OUT(prog(t, T.title, T.title + .6))) + .03 * (t - T.title) / (DURATION - T.title);
    const d = M.wiggle(t, {freq: .35, amp: 4, octaves: 2, dims: 2, seed: 11});              // handheld drift
    const sh = M.shake(t, HITS, {px: 9, minAmplitude: .95});
    return {s, dx: d[0] + sh[0], dy: d[1] + sh[1]};
  }

  S.run({
    fonts: [S.font({weight: 900, size: 200}), S.font({weight: 700, size: 200}), S.font({style: 'italic', weight: 400, size: 100, family: SERIF})],
    background: BG,
    layers: ['light'],
    shutter: 220,
    lightGain: 2.4,
    maxSamples: 24,
    finish: {bloomMode: 'halo', strength: .55, halation: 1.0, toneMap: 'shoulder', vignette: .42, grain: .11},

    setup(env) {
      const {W, H, HITS, hit, base: ctx} = env;
      T = {q: hit('question lands', .42), good: hit('good slams', 2.5), ans: hit('answer lands', 3.75),
        s1: hit('stanza starts', 5), s2: hit('second line lands', 7.5), mid: hit('midnight lands', 8.75),
        title: hit('title lands', 10), tag: hit('tagline lands', 12.5)};
      const norm = M.normalizeHits(HITS);
      PULSES = norm.filter(h => h.role === 'pulse' || h.role === 'tagline lands');
      WORD_HITS = norm.filter(h => ['question lands', 'answer lands', 'stanza starts', 'second line lands', 'midnight lands'].includes(h.role));
      SEARCH = [.625, 1.25, 1.875];

      const qSize = sizeToFit(ctx, ['Still awake?'], {weight: 780, width: 820, max: 150});
      L.q = line(ctx, 'Still awake?', {font: S.font({weight: 780, size: qSize}), x: W / 2, y: .455 * H});
      const gSize = sizeToFit(ctx, ['Good.'], {weight: 900, width: 640, max: 250});
      L.good = line(ctx, 'Good.', {font: S.font({weight: 900, size: gSize}), x: W / 2, y: .43 * H});
      L.ans = line(ctx, 'So are we.', {font: S.font({style: 'italic', weight: 400, size: 104, family: SERIF}), x: W / 2, y: .43 * H + 150});

      const stanza = ['Some conversations', 'only come through', 'after midnight.'];
      const sSize = sizeToFit(ctx, stanza, {weight: 720, stretch: 'semi-condensed', width: 850, max: 130});
      ctx.font = S.font({weight: 720, size: sSize}); ctx.fontStretch = 'semi-condensed';
      const blockW = Math.max(...stanza.map(s => ctx.measureText(s).width)), sx = (W - blockW) / 2;
      L.stanza = stanza.map((s, i) => line(ctx, s, {font: S.font({weight: 720, size: sSize}), stretch: 'semi-condensed', x: sx, y: .37 * H + i * 1.14 * sSize, align: 'left'}));
      L.midnight = [6, 14];                                               // "midnight" inside "after midnight."

      const tSize = sizeToFit(ctx, ['LATE', 'SIGNALS'], {weight: 900, stretch: 'semi-expanded', width: 860, max: 260});
      const block = 1.94 * tSize + 115, top = .46 * H - block / 2, yL = top + .72 * tSize, yS = yL + .98 * tSize;
      const tFont = S.font({weight: 900, size: tSize});
      L.late = line(ctx, 'LATE', {font: tFont, stretch: 'semi-expanded', x: W / 2, y: yL});
      L.signals = line(ctx, 'SIGNALS', {font: tFont, stretch: 'semi-expanded', x: W / 2, y: yS});
      L.titleCenter = [W / 2, (yL - .72 * tSize + yS) / 2];
      L.ul = {x0: L.signals.x0, x1: L.signals.x0 + L.signals.width, y: yS + .24 * tSize};
      L.tag = line(ctx, 'A podcast. Tune in.', {font: S.font({style: 'italic', weight: 400, size: 74, family: SERIF}), x: W / 2, y: L.ul.y + 115});
      L.traceY = .6 * H;
    },

    state(t, env) {
      const {W, H} = env;
      const cam = camera(t, env), cx = W / 2, cy = H / 2;
      const cp = (x, y) => [cx + cam.s * (x - cx) + cam.dx, cy + cam.s * (y - cy) + cam.dy];

      const qOut = CUBIC_IN(prog(t, T.good - .3, T.good - .1));     // out before Good. comes in
      const gIn = EXPO_OUT(prog(t, T.good - .06, T.good + .14)), gOut = CUBIC_IN(prog(t, T.s1 - .62, T.s1 - .4));
      const gScale = M.mix(1.45, 1, gIn);
      const sOut = L.stanza.map((_, i) => CUBIC_IN(prog(t, T.title - .36 + .05 * (2 - i), T.title - .12 + .05 * (2 - i))));
      const surge = QUAD_IN(prog(t, T.title - .6, T.title));
      const tl = t - T.title, tScale = tl >= 0 ? 1 + .16 * (1 - M.spring(tl, {freq: 2.6, damping: .42})) : 1.16;
      const tAlpha = prog(t, T.title - .03, T.title + .04);
      const tr = trace(t, env);

      const track = [cp(0, 0), cp(W, H),
        cp(L.q.x0, L.q.y - 60 * qOut), cp(L.q.x0 + L.q.width, L.q.y - 60 * qOut),
        cp(cx - L.good.width / 2 * gScale, L.good.y - 50 * gOut), cp(cx + L.good.width / 2 * gScale, L.good.y - 50 * gOut),
        ...L.stanza.map((l, i) => cp(l.x0, l.y + 90 * sOut[i])),
        cp(cx - L.signals.width / 2 * tScale, L.titleCenter[1] - 200 * tScale), cp(cx + L.signals.width / 2 * tScale, L.titleCenter[1] + 200 * tScale)];
      return {time: t, cam, qOut, gIn, gOut, gScale, sOut, surge, tl, tScale, tAlpha, tr, track};
    },

    draw(s, {base: b, light: l}, env) {
      const {cam, tr, time} = s;
      const {W, H} = env, cx = W / 2, cy = H / 2;
      const view = ctx => ctx.setTransform(cam.s, 0, 0, cam.s, cx - cam.s * cx + cam.dx, cy - cam.s * cy + cam.dy);
      view(b); view(l);

      // The trace lights the room a little: the only light source in the frame.
      const glow = l.createRadialGradient(tr.cx, tr.y, 0, tr.cx, tr.y, .85 * W);
      glow.addColorStop(0, `rgba(255,106,26,${.05 + .12 * tr.energy + .05 * tr.pulse})`); glow.addColorStop(1, 'rgba(255,106,26,0)');
      l.fillStyle = glow; l.fillRect(-W, -H, 3 * W, 3 * H);
      b.lineJoin = l.lineJoin = 'round'; b.lineCap = l.lineCap = 'round';
      l.strokeStyle = ACC; l.globalAlpha = Math.min(1, .3 + .35 * tr.energy + .3 * tr.pulse); l.lineWidth = tr.width * 4.5; strokePath(l, tr.pts);
      l.globalAlpha = .6; l.lineWidth = tr.width; strokePath(l, tr.pts); l.globalAlpha = 1;
      b.strokeStyle = ACC; b.lineWidth = tr.width; strokePath(b, tr.pts);

      // Bar 1: the question.
      if (time < T.good) drawDecode(b, L.q, time, T.q, {alpha: 1 - s.qOut, dy: -60 * s.qOut});
      // Bar 2: the answer.
      if (time >= T.good - .06 && time < T.s1) {
        const a = Math.min(1, prog(time, T.good - .06, T.good)) * (1 - s.gOut);
        b.save(); b.translate(cx, L.good.y - 50 * s.gOut); b.scale(s.gScale, s.gScale);
        b.font = L.good.font; b.textAlign = 'center'; b.fillStyle = INK; b.globalAlpha = a; b.fillText('Good.', 0, 0); b.restore();
        drawRise(b, L.ans, time, T.ans, {alpha: 1 - s.gOut, dy: -50 * s.gOut});
      }
      // Bars 3–4: the stanza decodes line by line; midnight lands in orange and lights up a little.
      if (time >= T.s1 - SPAN - SETTLE && time < T.title) {
        const lands = [T.s1, T.s2, T.mid];
        L.stanza.forEach((ln, i) => {
          const jitter = 7 * s.surge * M.valueNoise(time * 40 + i * 9, 31);
          drawDecode(b, ln, time, lands[i], {alpha: 1 - s.sOut[i], dy: 90 * s.sOut[i], dx: jitter, accent: i === 2 ? L.midnight : null});
        });
        if (time >= T.mid) {
          const ln = L.stanza[2], g = ln.glyphs, x = ln.x0 + g[L.midnight[0]].x;
          l.save(); l.font = ln.font; l.fontStretch = ln.stretch; l.fillStyle = ACC;
          l.globalAlpha = (.15 + .5 * Math.exp(-(time - T.mid) * 4)) * (1 - s.sOut[2]);
          l.fillText('midnight', x, ln.y + 90 * s.sOut[2]); l.restore();
        }
      }
      // Bars 5–6: the title locks in on the push-through; a decaying orange echo is the signal settling.
      if (time >= T.title - .03) {
        const [tx, ty] = L.titleCenter;
        for (const ctx of [b, l]) {
          ctx.save(); ctx.translate(tx, ty); ctx.scale(s.tScale, s.tScale); ctx.translate(-tx, -ty);
          ctx.font = L.late.font; ctx.fontStretch = 'semi-expanded'; ctx.textAlign = 'center';
          if (ctx === b) { ctx.fillStyle = INK; ctx.globalAlpha = s.tAlpha; }
          else { ctx.fillStyle = ACC; ctx.globalAlpha = .42 * Math.exp(-Math.max(0, s.tl) * 6); }
          const off = ctx === l ? 18 * Math.exp(-Math.max(0, s.tl) * 9) : 0;
          if (ctx.globalAlpha > .004) { ctx.fillText('LATE', tx + off, L.late.y); ctx.fillText('SIGNALS', tx + off, L.signals.y); }
          ctx.restore();
        }
        drawRise(b, L.tag, time, T.tag);
      }

      // Film matter in screen space: dust on twos and a faint exposure flicker.
      b.setTransform(1, 0, 0, 1, 0, 0);
      const k = Math.floor(time * 15);
      b.fillStyle = INK;
      for (let j = 0; j < 14; j++) {
        const r = .6 + 1.6 * M.hash(k * 53 + j, 3);
        b.globalAlpha = .12 + .22 * M.hash(k * 53 + j, 4);
        b.beginPath(); b.arc(M.hash(k * 97 + j, 1) * W, M.hash(k * 89 + j, 2) * H, r, 0, M.TAU); b.fill();
      }
      if (M.hash(k, 41) > .82) {                                          // a hair of a scratch, now and then
        b.globalAlpha = .07; b.fillRect(M.hash(k, 42) * W, 0, 1.5, H);
      }
      b.globalAlpha = .05 * (.5 + .5 * M.valueNoise(time * 12, 21)); b.fillStyle = '#000'; b.fillRect(0, 0, W, H);
      b.globalAlpha = 1;
    },
  });
})();
