/* Late Signals · "the skill challenge", a 31 s voice-over reel (1080×1920, 30 fps).
   The voice is the clock: every scene, caption word and accent is read from voice.json (ElevenLabs speech-to-text on
   the exact take). Layout: picture zone on top, the orange signal trace in the middle (driven by the narrator's level,
   the recurring element from the teaser), captions underneath. The proof scene plays the real Late Signals teaser.
   Everything is a function of t. */
(() => {
  'use strict';
  const M = window.MotionMath, S = window.Stage;
  const {SANS, SERIF, MONO} = S.FONTS;
  const BG = '#0b0908', INK = '#ece4d8', DIM = '#8d847a', ACC = '#ff6a1a', CARD = '#15110e', EDGE = '#3a3029';
  const EXPO = M.easing('expo.out'), CIN = M.easing('cubic.in'), COUT = M.easing('cubic.out'), BACK = M.easing('back.out');
  const prog = (v, a, b) => M.clamp((v - a) / (b - a));
  const LEAD = 2;                                     // the picture cuts 2 frames before the phrase's first word
  const PIC_Y = 680, TRACE_Y = 1112, CAP = {top: 1168, bottom: 1440, width: 860, max: 84};
  // Scenes: word ranges [first, end) of voice.json and the picture each one draws (brief.md, the screen column).
  const SCENES = [[0, 2, 'hello'], [2, 9, 'prompt'], [9, 13, 'skill'], [13, 18, 'test'], [18, 25, 'list'],
    [25, 35, 'terminal'], [35, 40, 'phone'], [40, 47, 'teaser'], [47, 49, 'code'], [49, 53, 'great'], [53, 58, 'magic'],
    [58, 62, 'taste'], [62, 66, 'challenge'], [66, 68, 'brief'], [68, 74, 'versus'], [74, 78, 'comments']];
  const EMPH = new Set([1, 8, 11, 17, 19, 21, 23, 30, 39, 43, 48, 52, 57, 59, 65, 67, 72, 76]);
  const PHONE = {w: 428, h: 760, r: 34};

  let WD = [], LEVELS = {fps: 30, values: [0]}, scenes = [], FOOT = null, CODE = [];
  const frames = new Map();
  const wt = i => WD[i].start;

  /* ---------- small drawing helpers ---------- */
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  function text(c, str, x, y, {font, color = INK, align = 'center', alpha = 1, stretch = 'normal'} = {}) {
    if (alpha <= 0) return;
    c.save(); c.font = font; c.fontStretch = stretch; c.textAlign = align; c.fillStyle = color; c.globalAlpha *= alpha;
    c.fillText(str, x, y); c.restore();
  }
  function padlock(c, cx, cy, s, open = 0, color = ACC, alpha = 1) {
    if (alpha <= 0) return;
    c.save(); c.globalAlpha *= alpha; c.strokeStyle = color; c.fillStyle = color; c.lineWidth = s * .13; c.lineCap = 'round';
    c.save(); c.translate(cx + s * .3, cy - s * .1 - s * .32 * open); c.rotate(-.5 * open);          // shackle lifts and swings
    c.beginPath(); c.arc(-s * .3, -s * .2, s * .3, Math.PI, 0); c.lineTo(0, 0); c.moveTo(-s * .6, -s * .2); c.lineTo(-s * .6, open > .02 ? -s * .05 : 0);
    c.stroke(); c.restore();
    rr(c, cx - s * .5, cy - s * .12, s, s * .78, s * .12); c.fill();
    c.fillStyle = BG; c.beginPath(); c.arc(cx, cy + s * .22, s * .1, 0, M.TAU); c.fill();
    c.restore();
  }
  function docCard(c, cx, cy, {w = 380, h = 480, written = 1, lock = 0, lockAlpha = 1, alpha = 1, glow = null} = {}) {
    if (alpha <= 0) return;
    const x = cx - w / 2, y = cy - h / 2, fold = 70;
    c.save(); c.globalAlpha *= alpha;
    c.beginPath(); c.moveTo(x + 24, y); c.lineTo(x + w - fold, y); c.lineTo(x + w, y + fold); c.lineTo(x + w, y + h - 24);
    c.arcTo(x + w, y + h, x + w - 24, y + h, 24); c.lineTo(x + 24, y + h); c.arcTo(x, y + h, x, y + h - 24, 24);
    c.lineTo(x, y + 24); c.arcTo(x, y, x + 24, y, 24); c.closePath();
    c.fillStyle = CARD; c.fill(); c.strokeStyle = EDGE; c.lineWidth = 4; c.stroke();
    c.beginPath(); c.moveTo(x + w - fold, y); c.lineTo(x + w - fold, y + fold); c.lineTo(x + w, y + fold); c.stroke();
    text(c, 'SKILL.md', x + 40, y + 78, {font: S.font({weight: 700, size: 36, family: MONO}), align: 'left'});
    const bars = [.82, .64, .9, .55, .76, .6];
    bars.forEach((b, i) => {
      const by = y + 130 + i * 44, full = (w - 80) * b;
      c.fillStyle = EDGE; c.fillRect(x + 40, by, full, 14);                                      // placeholder
      const p = M.clamp(written * bars.length - i);
      if (p > 0) { c.fillStyle = i % 3 === 1 ? ACC : INK; c.globalAlpha = alpha * .9; c.fillRect(x + 40, by, full * p, 14); c.globalAlpha = alpha; }
    });
    c.restore();
    padlock(c, cx, y + h - 92, 74, lock, ACC, alpha * lockAlpha);
    if (glow) padlock(glow, cx, y + h - 92, 74, lock, ACC, .45 * alpha * lockAlpha);
  }
  function star4(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rad = i % 2 ? r * .28 : r; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); }
    c.closePath(); c.fill();
  }
  const typed = (str, t, t0, cps = 30) => str.slice(0, Math.max(0, Math.floor((t - t0) * cps)));

  /* ---------- captions: balanced lines, never ending on a weak word (as the voice-captions recipe) ---------- */
  const WEAK = new Set('a an and or but of to in on at by for with from as my your the it is'.split(' '));
  function balance(texts, widths, space, maxWidth) {
    const n = texts.length, lw = (i, j) => widths.slice(i, j).reduce((a, b) => a + b, 0) + space * (j - i - 1);
    const total = lw(0, n), target = total / Math.max(1, Math.ceil(total / maxWidth)), best = [0], back = [0];
    for (let j = 1; j <= n; j++) {
      best[j] = Infinity;
      for (let i = j - 1; i >= 0; i--) {
        const w = lw(i, j);
        if (w > maxWidth && j - i > 1) break;
        let cost = ((w - target) / maxWidth) ** 2 * 100 + 40 + (w > maxWidth ? 1e4 : 0);
        if (j < n && WEAK.has(texts[j - 1].toLowerCase().replace(/[^a-z']/g, ''))) cost += 90;
        if (j - i === 1 && n > 1 && texts[i].length < 5) cost += 70;
        if (best[i] + cost < best[j]) { best[j] = best[i] + cost; back[j] = i; }
      }
    }
    const lines = [];
    for (let j = n; j > 0; j = back[j]) lines.unshift([back[j], j]);
    return lines;
  }

  /* ---------- the trace: the narrator's level, the teaser's signal ---------- */
  function level(t) {
    const v = LEVELS.values, x = t * LEVELS.fps, i = Math.floor(x);
    if (i < 0 || i >= v.length - 1) return 0;
    return M.mix(v[i], v[i + 1], x - i);
  }
  function trace(t, W) {
    const lv = .55 * level(t) + .3 * level(t - .05) + .15 * level(t - .1);
    const spike = t >= wt(65) ? 150 * Math.exp(-(t - wt(65)) * 7) * Math.cos((t - wt(65)) * 36) : 0;
    const A = 3 + 46 * lv, f = Math.floor(t * 30), pts = [];
    for (let x = -20; x <= W + 20; x += 6) {
      const e = M.smoothstep(prog(x, -20, 200)) * M.smoothstep(prog(x, W + 20, W - 200));
      const w = .55 * Math.sin(x * .05 - t * 9) + .35 * Math.sin(x * .021 + t * 4) + .6 * M.valueNoise(x * .023 + t * 7, 9);
      pts.push([x, TRACE_Y + A * e * w / 1.5 + 1.3 * M.valueNoise(x * .3 + f * 7.1, 4) - spike * Math.exp(-((x - W / 2) ** 2) / 4000)]);
    }
    return {pts, energy: Math.min(1, lv + Math.abs(spike) / 150)};
  }

  /* ---------- geometry shared by state (motion-blur track) and draw ---------- */
  const G = {
    skill: (t, sc) => ({y: M.mix(PIC_Y - 620, PIC_Y, BACK(prog(t, sc.from + .02, wt(11)))), x: 540}),
    test: (t, sc) => ({cardX: 540 - 760 * CIN(prog(t, sc.from, sc.from + .3)), stamp: 1 + .6 * (1 - EXPO(prog(t, wt(17) - .04, wt(17) + .14)))}),
    phone: (t, sc) => ({sy: EXPO(prog(t, sc.from, sc.from + .45)), sx: M.mix(.86, 1, EXPO(prog(t, sc.from, sc.from + .5)))}),
    great: (t, sc) => ({s: 1 - CIN(prog(t, sc.from, sc.from + .24))}),
    taste: (t, sc) => ({x: M.mix(-260, 540, EXPO(prog(t, sc.from, sc.from + .45)))}),
    challenge: (t) => ({s: t < wt(65) - .03 ? 0 : 1 + .3 * (1 - M.spring(t - wt(65) + .03, {freq: 2.8, damping: .42}))}),
    brief: (t, sc) => ({y: PIC_Y - 70 * (1 - EXPO(prog(t, sc.from, sc.from + .4)))}),
    versus: t => ({l: M.mix(-300, 340, EXPO(prog(t, wt(68) - .1, wt(68) + .35))), r: M.mix(1380, 740, EXPO(prog(t, wt(72) - .1, wt(72) + .35)))}),
  };
  function anchors(kind, t, sc) {
    const g = G[kind] && G[kind](t, sc);
    switch (kind) {
      case 'skill': return [[540, g.y - 240], [540, g.y + 240]];
      case 'test': return [[g.cardX, PIC_Y], [540 - 230 * g.stamp, PIC_Y - 90 * g.stamp], [540 + 230 * g.stamp, PIC_Y + 90 * g.stamp]];
      case 'phone': return [[540 - PHONE.w / 2 * g.sx, PIC_Y - PHONE.h / 2 * g.sy], [540 + PHONE.w / 2 * g.sx, PIC_Y + PHONE.h / 2 * g.sy]];
      case 'great': return [[540 - PHONE.w / 2 * g.s, PIC_Y - PHONE.h / 2 * g.s], [540 + PHONE.w / 2 * g.s, PIC_Y + PHONE.h / 2 * g.s]];
      case 'taste': return [[g.x - 190, PIC_Y], [g.x + 190, PIC_Y]];
      case 'challenge': return [[540 - 420 * g.s, PIC_Y - 100 * g.s], [540 + 420 * g.s, PIC_Y + 100 * g.s]];
      case 'brief': return [[540, g.y]];
      case 'versus': return [[g.l, PIC_Y], [g.r, PIC_Y]];
      default: return [[540, PIC_Y]];
    }
  }

  /* ---------- the pictures, one per scene ---------- */
  const PICS = {
    hello(b, l, t, sc) {
      const font = S.font({weight: 900, size: 70});
      b.save(); b.font = font; b.fontStretch = 'semi-expanded';
      const word = 'LATE SIGNALS', glyphs = M.layoutGlyphs(word, s => b.measureText(s).width), width = b.measureText(word).width;
      glyphs.forEach((g, i) => {
        const p = EXPO(prog(t, .05 + i * .03, .45 + i * .03));
        if (p > 0) text(b, g.ch, 540 - width / 2 + g.x, PIC_Y - 20 + 26 * (1 - p), {font, align: 'left', alpha: p, stretch: 'semi-expanded'});
      });
      b.restore();
      const u = EXPO(prog(t, .45, 1.0));
      for (const c of [b, l]) { c.fillStyle = ACC; c.globalAlpha = c === l ? .6 : 1; c.fillRect(540 - width / 2 * u, PIC_Y + 14, width * u, 7); c.globalAlpha = 1; }
      text(b, 'replies', 540, PIC_Y + 100, {font: S.font({style: 'italic', weight: 400, size: 56, family: SERIF}), color: DIM, alpha: prog(t, .55, .9)});
    },
    prompt(b, l, t, sc) {
      const a = EXPO(prog(t, sc.from, sc.from + .3)), s = M.mix(.94, 1, a);
      b.save(); b.translate(540, PIC_Y); b.scale(s, s); b.globalAlpha = a;
      text(b, 'everyone asks', 0, -120, {font: S.font({style: 'italic', weight: 400, size: 44, family: SERIF}), color: DIM});
      rr(b, -430, -75, 860, 150, 75); b.fillStyle = CARD; b.fill(); b.strokeStyle = EDGE; b.lineWidth = 4; b.stroke();
      const q = "what's the prompt?", font = S.font({weight: 500, size: 44, family: MONO});
      const shown = typed(q, t, sc.from + .15, 24), struck = prog(t, wt(8), wt(8) + .25);
      b.font = font; b.fontStretch = 'normal'; const full = b.measureText(q).width, x0 = -full / 2;
      text(b, shown, x0, 15, {font, align: 'left', color: struck > .5 ? DIM : INK});
      if (shown.length < q.length || Math.floor(t * 2) % 2 === 0) { b.fillStyle = ACC; b.fillRect(x0 + b.measureText(shown).width + 6, -22, 22, 46); }
      if (struck > 0) { b.fillStyle = ACC; b.fillRect(x0 - 12, -4, (full + 24) * COUT(struck), 8); }
      b.restore();
    },
    skill(b, l, t, sc) {
      const g = G.skill(t, sc);
      docCard(b, g.x, g.y, {written: .15, lock: 0, glow: l});
    },
    test(b, l, t, sc) {
      const g = G.test(t, sc);
      if (g.cardX > -300) docCard(b, g.cardX, PIC_Y, {written: .15});
      if (t < wt(17) - .04) return;
      for (const c of [b, l]) {
        c.save(); c.translate(540, PIC_Y); c.rotate(-.12); c.scale(g.stamp, g.stamp); c.globalAlpha = c === l ? .35 : 1;
        rr(c, -250, -105, 500, 210, 22); c.strokeStyle = ACC; c.lineWidth = 10; c.stroke();
        text(c, 'TEST #1', 0, 48, {font: S.font({weight: 900, size: 132}), color: ACC, stretch: 'condensed'});
        c.restore();
      }
    },
    list(b, l, t) {
      const rows = ['Subscription', 'Paywall', 'Secret file'], on = [18, 20, 22], strike = [19, 21, 23];
      const font = S.font({weight: 750, size: 84});
      b.save(); b.font = font; b.fontStretch = 'normal';
      rows.forEach((r, i) => {
        const p = EXPO(prog(t, wt(on[i]) - .06, wt(on[i]) + .3)), y = PIC_Y - 150 + i * 150, s = prog(t, wt(strike[i]), wt(strike[i]) + .22);
        if (p <= 0) return;
        const w = b.measureText(r).width, x = 540 - 300;
        text(b, r, x, y + 24 * (1 - p), {font, align: 'left', alpha: p, color: s > .5 ? DIM : INK});
        if (s > 0) for (const c of [b, l]) { c.fillStyle = ACC; c.globalAlpha = c === l ? .5 : 1; c.fillRect(x - 14, y - 30, (w + 28) * COUT(s), 10); c.globalAlpha = 1; }
      });
      b.restore();
    },
    terminal(b, l, t, sc) {
      const a = EXPO(prog(t, sc.from, sc.from + .35));
      b.save(); b.translate(0, 40 * (1 - a)); b.globalAlpha = a;
      rr(b, 90, PIC_Y - 230, 900, 460, 26); b.fillStyle = CARD; b.fill(); b.strokeStyle = EDGE; b.lineWidth = 4; b.stroke();
      [0, 1, 2].forEach(i => { b.fillStyle = i === 0 ? ACC : EDGE; b.beginPath(); b.arc(140 + i * 36, PIC_Y - 188, 11, 0, M.TAU); b.fill(); });
      text(b, 'terminal', 540, PIC_Y - 178, {font: S.font({weight: 400, size: 26, family: MONO}), color: DIM});
      const font = S.font({weight: 500, size: 30, family: MONO}), x = 130;
      const L1 = '$ git clone github.com/manuvegax/motionsmith', L2 = '$ python install.py --claude';
      const s1 = typed(L1, t, wt(25), 34), s2 = typed(L2, t, wt(30), 30);
      text(b, s1, x, PIC_Y - 90, {font, align: 'left'});
      if (s2) text(b, s2, x, PIC_Y - 20, {font, align: 'left'});
      const ok = prog(t, wt(34), wt(34) + .2);
      text(b, '✓ installed  ·  MIT licence  ·  $0', x, PIC_Y + 70, {font: S.font({weight: 700, size: 30, family: MONO}), align: 'left', color: ACC, alpha: ok});
      b.font = font; b.fontStretch = 'normal';
      const cur = !s2 ? [x + b.measureText(s1).width, PIC_Y - 90] : ok > 0 ? null : [x + b.measureText(s2).width, PIC_Y - 20];
      if (cur && Math.floor(t * 2.5) % 2 === 0) { b.fillStyle = INK; b.fillRect(cur[0] + 4, cur[1] - 26, 16, 34); }
      b.restore();
      if (ok > 0) text(l, '✓ installed  ·  MIT licence  ·  $0', x, PIC_Y + 70 + 40 * (1 - a), {font: S.font({weight: 700, size: 30, family: MONO}), align: 'left', color: ACC, alpha: .4 * ok});
    },
    phone(b, l, t, sc, env) { const g = G.phone(t, sc); phoneCard(b, l, t, g.sx, g.sy, 'footage'); },
    teaser(b, l, t, sc) {
      phoneCard(b, l, t, 1, 1, 'footage');
      const labels = [['grain', -1, PIC_Y - 230, 44], ['glow', 1, PIC_Y, 45], ['sound', -1, PIC_Y + 230, 46]];
      const font = S.font({style: 'italic', weight: 400, size: 60, family: SERIF});
      labels.forEach(([word, side, y, idx]) => {
        const p = EXPO(prog(t, wt(idx) - .04, wt(idx) + .3));
        if (p <= 0) return;
        const edge = 540 + side * PHONE.w / 2, end = edge + side * 70 * p;
        for (const c of [b, l]) {
          c.globalAlpha = c === l ? .5 : 1; c.strokeStyle = ACC; c.lineWidth = 3;
          c.beginPath(); c.moveTo(edge, y); c.lineTo(end, y); c.stroke();
          c.fillStyle = ACC; c.beginPath(); c.arc(edge, y, 8, 0, M.TAU); c.fill(); c.globalAlpha = 1;
        }
        text(b, word, end + side * 16, y + 20, {font, align: side < 0 ? 'right' : 'left', alpha: p});
      });
    },
    code(b, l, t, sc) { phoneCard(b, l, t, 1, 1, 'code', sc); },
    great(b, l, t, sc) {
      const g = G.great(t, sc);
      if (g.s > 0) phoneCard(b, l, t, g.s, g.s, 'code', scenes.find(x => x.kind === 'code'));
      const p = COUT(prog(t, sc.from + .12, sc.from + .7)), beat = 1 + .12 * M.impulse(t, [{time: wt(52), amplitude: 1}], 7);
      if (p <= 0) return;
      const pts = [];
      for (let i = 0; i <= 120 * p; i++) {
        const a = i / 120 * M.TAU;
        pts.push([16 * Math.sin(a) ** 3, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]);
      }
      for (const c of [b, l]) {
        c.save(); c.translate(540, PIC_Y - 10); c.scale(11 * beat, 11 * beat); c.strokeStyle = ACC; c.lineWidth = .6; c.lineJoin = 'round';
        c.globalAlpha = c === l ? .7 : 1; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
      }
    },
    magic(b, l, t, sc) {
      const said = wt(57), word = prog(t, said - .04, said + .2), grey = prog(t, said + .5, said + 1.1);
      for (let i = 0; i < 10; i++) {
        const ang = M.hash(i, 3) * M.TAU, rad = 200 + 150 * M.hash(i, 4), x = 540 + Math.cos(ang) * rad * 1.3, y = PIC_Y + Math.sin(ang) * rad * .8;
        const die = said + .35 + i * .07, life = 1 - prog(t, die, die + .25), tw = .6 + .4 * Math.sin(t * 9 + i * 2.1);
        const r = (14 + 16 * M.hash(i, 5)) * tw * life * EXPO(prog(t, sc.from + i * .03, sc.from + .3 + i * .03));
        if (r <= .5) continue;
        for (const c of [b, l]) { c.fillStyle = ACC; c.globalAlpha = c === l ? .8 : 1; star4(c, x, y, r); c.globalAlpha = 1; }
      }
      if (word > 0) {
        const col = grey > 0 ? (grey > .5 ? DIM : '#c7743f') : ACC;
        text(b, 'magic', 540, PIC_Y + 50 + 20 * (1 - word), {font: S.font({style: 'italic', weight: 600, size: 190, family: SERIF}), color: col, alpha: word * (1 - .35 * grey)});
      }
    },
    taste(b, l, t, sc) {
      const g = G.taste(t, sc), open = EXPO(prog(t, wt(59), wt(59) + .4));
      docCard(b, g.x, PIC_Y, {written: M.mix(.15, 1, prog(t, wt(59), wt(61) + .45)), lock: open, lockAlpha: 1 - prog(t, wt(59) + .25, wt(59) + .6), glow: l});
    },
    challenge(b, l, t) {
      const g = G.challenge(t);
      text(b, 'THE', 540, PIC_Y - 120, {font: S.font({weight: 800, size: 60}), color: DIM, alpha: prog(t, wt(64) - .04, wt(64) + .12)});
      if (g.s <= 0) return;
      for (const c of [b, l]) {
        c.save(); c.translate(540, PIC_Y + 40); c.scale(g.s, g.s);
        const off = c === l ? 16 * Math.exp(-Math.max(0, t - wt(65)) * 9) : 0;
        text(c, 'CHALLENGE', off, 0, {font: S.font({weight: 900, size: 172}), color: c === l ? ACC : INK, stretch: 'condensed', alpha: c === l ? .45 * Math.exp(-Math.max(0, t - wt(65)) * 5) : prog(t, wt(65) - .03, wt(65) + .03)});
        c.restore();
      }
    },
    brief(b, l, t, sc) {
      const g = G.brief(t, sc), a = prog(t, sc.from, sc.from + .2), flash = M.impulse(t, [{time: wt(67), amplitude: 1}], 5);
      b.save(); b.globalAlpha = a;
      rr(b, 160, g.y - 170, 760, 340, 26); b.fillStyle = CARD; b.fill(); b.strokeStyle = flash > .1 ? ACC : EDGE; b.lineWidth = 4; b.stroke();
      text(b, 'B R I E F', 210, g.y - 95, {font: S.font({weight: 700, size: 30, family: MONO}), color: ACC, align: 'left'});
      text(b, '15 s podcast teaser', 210, g.y + 5, {font: S.font({weight: 760, size: 64}), align: 'left'});
      text(b, 'dark · grainy · orange', 210, g.y + 85, {font: S.font({style: 'italic', weight: 400, size: 44, family: SERIF}), color: DIM, align: 'left'});
      b.restore();
      if (flash > .02) { rr(l, 160, g.y - 170, 760, 340, 26); l.strokeStyle = ACC; l.lineWidth = 8; l.globalAlpha = .6 * flash; l.stroke(); l.globalAlpha = 1; }
    },
    versus(b, l, t) {
      const g = G.versus(t), head = S.font({weight: 900, size: 44}), sub = S.font({style: 'italic', weight: 400, size: 40, family: SERIF});
      const card = (cx, title, kind, foot) => {
        rr(b, cx - 180, PIC_Y - 260, 360, 520, 26); b.fillStyle = CARD; b.fill(); b.strokeStyle = EDGE; b.lineWidth = 4; b.stroke();
        text(b, title, cx, PIC_Y - 180, {font: head});
        if (kind === 'lock') padlock(b, cx, PIC_Y + 10, 110);
        else { rr(b, cx - 95, PIC_Y - 50, 190, 110, 18); b.strokeStyle = ACC; b.lineWidth = 7; b.stroke(); text(b, 'MIT', cx, PIC_Y + 30, {font: S.font({weight: 900, size: 72}), color: ACC}); }
        text(b, foot, cx, PIC_Y + 190, {font: sub, color: DIM});
      };
      if (t >= wt(68) - .1) card(g.l, 'YOUR SKILL', 'lock', 'subscription');
      if (t >= wt(72) - .1) card(g.r, 'FREE ONE', 'mit', 'open source');
      const v = t < wt(70) - .03 ? 0 : 1 + .4 * (1 - M.spring(t - wt(70) + .03, {freq: 3, damping: .5}));
      if (v > 0) for (const c of [b, l]) {
        c.save(); c.translate(540, PIC_Y); c.scale(v, v); c.globalAlpha = c === l ? .5 : 1;
        c.fillStyle = BG; c.beginPath(); c.arc(0, 0, 66, 0, M.TAU); c.fill(); c.strokeStyle = ACC; c.lineWidth = 6; c.stroke();
        text(c, 'VS', 0, 20, {font: S.font({weight: 900, size: 58}), color: ACC}); c.restore();
      }
    },
    comments(b, l, t, sc, env) {
      const a = EXPO(prog(t, sc.from, sc.from + .4)), s = M.mix(.85, 1, a), hot = prog(t, wt(76), wt(76) + .2);
      for (const c of [b, l]) {
        if (c === l && hot <= 0) continue;
        c.save(); c.translate(540, PIC_Y - 60); c.scale(s, s); c.globalAlpha = (c === l ? .55 * hot : 1) * a;
        rr(c, -300, -150, 600, 300, 70);
        c.moveTo(-160, 146); c.lineTo(-220, 236); c.lineTo(-90, 146);
        if (c === b) { c.fillStyle = CARD; c.fill(); }
        c.strokeStyle = hot > .5 ? ACC : INK; c.lineWidth = 6; c.stroke();
        for (let i = 0; i < 3; i++) {
          const bob = Math.max(0, Math.sin(t * 7 - i * .9)) * 18;
          c.fillStyle = ACC; c.beginPath(); c.arc(-80 + i * 80, -bob, 20, 0, M.TAU); c.fill();
        }
        c.restore();
      }
      const end = WD[77].end + .05, sign = EXPO(prog(t, end, end + .5));
      if (sign > 0) {
        const font = S.font({weight: 900, size: 48});
        b.font = font; b.fontStretch = 'semi-expanded'; const w = b.measureText('LATE SIGNALS').width;
        text(b, 'LATE SIGNALS', 540, PIC_Y + 300 + 20 * (1 - sign), {font, alpha: sign, stretch: 'semi-expanded'});
        for (const c of [b, l]) { c.fillStyle = ACC; c.globalAlpha = (c === l ? .6 : 1) * sign; c.fillRect(540 - w / 2, PIC_Y + 322, w * sign, 5); c.globalAlpha = 1; }
      }
    },
  };

  /* The phone-shaped card: the real teaser footage, or the code behind it. */
  function phoneCard(b, l, t, sx, sy, content, sc) {
    if (sx <= 0 || sy <= 0) return;
    const w = PHONE.w * sx, h = PHONE.h * sy, x = 540 - w / 2, y = PIC_Y - h / 2;
    rr(l, x - 6, y - 6, w + 12, h + 12, PHONE.r); l.strokeStyle = ACC; l.lineWidth = 10; l.globalAlpha = .18; l.stroke(); l.globalAlpha = 1;   // the screen lights the room
    b.save(); rr(b, x, y, w, h, PHONE.r * Math.min(sx, sy)); b.fillStyle = '#000'; b.fill(); b.clip();
    const fi = FOOT ? M.clamp(Math.floor((t - FOOT.piece_start) * FOOT.fps), 0, FOOT.count - 1) : -1;
    const img = frames.get(fi);
    const showCode = content === 'code' ? (sc ? prog(t, sc.from, sc.from + .3) : 1) : 0;
    if (img && showCode < 1) b.drawImage(img, x, y, w, h);
    if (showCode > 0) {                                                  // a scanline wipe from footage to its source
      const wipeY = y + h * showCode;
      b.save(); b.beginPath(); b.rect(x, y, w, wipeY - y); b.clip();
      b.fillStyle = '#0d0a08'; b.fillRect(x, y, w, h);
      b.font = S.font({weight: 400, size: 15, family: MONO}); b.textAlign = 'left';
      const scroll = (t - (sc ? sc.from : 0)) * 140, lh = 21, first = Math.floor(scroll / lh);
      for (let i = 0; i < h / lh + 2; i++) {
        const line = CODE[(first + i) % CODE.length] || '';
        b.fillStyle = /ACC|trace|signal|grain/.test(line) ? ACC : DIM;
        b.fillText(line.slice(0, 44), x + 16, y + 30 + i * lh - (scroll % lh));
      }
      b.restore();
      if (showCode < 1) { b.fillStyle = ACC; b.fillRect(x, wipeY - 2, w, 4); }
    }
    b.restore();
    rr(b, x, y, w, h, PHONE.r * Math.min(sx, sy)); b.strokeStyle = EDGE; b.lineWidth = 5; b.stroke();
  }

  S.run({
    fonts: [S.font({weight: 900, size: 100}), S.font({weight: 300, size: 100}), S.font({style: 'italic', weight: 400, size: 100, family: SERIF}),
      S.font({weight: 500, size: 40, family: MONO})],
    background: BG,
    layers: ['light'],
    shutter: 220,
    lightGain: 2.2,
    maxSamples: 16,
    finish: {bloomMode: 'halo', strength: .5, halation: .9, toneMap: 'shoulder', vignette: .38, grain: .09},

    async setup(env) {
      const {W, FPS, DURATION, base} = env;
      const voice = await (await fetch('voice.json', {cache: 'no-store'})).json();
      WD = voice.words; LEVELS = voice.levels;
      FOOT = await (await fetch('assets/teaser-meta.json', {cache: 'no-store'})).json();
      FOOT.count = Math.round(FOOT.duration * FOOT.fps) - 1;
      CODE = (await (await fetch('assets/code.txt', {cache: 'no-store'})).text()).split('\n').filter(s => s.trim()).map(s => s.replace(/\s+/g, ' ').trim());
      const measure = (s, size, weight = 800) => { base.font = S.font({weight, size}); return base.measureText(s).width; };
      scenes = SCENES.map(([a, z, kind], k) => {
        const ws = WD.slice(a, z), texts = ws.map(w => w.text), widths = texts.map(s => measure(s, 100) / 100), space = measure(' ', 100) / 100;
        let size = CAP.max, lines;
        for (; size > 44; size--) {
          lines = balance(texts, widths, space, CAP.width / size);
          const wide = Math.max(...lines.map(([i, j]) => widths.slice(i, j).reduce((p, q) => p + q, 0) + space * (j - i - 1))) * size;
          if (wide <= CAP.width && lines.length <= 3 && lines.length * size * 1.16 <= CAP.bottom - CAP.top) break;
        }
        const lh = size * 1.16, blockH = lines.length * lh, top = CAP.top + (CAP.bottom - CAP.top - blockH) / 2;
        const placed = [];
        lines.forEach(([i, j], li) => {
          const lw = (widths.slice(i, j).reduce((p, q) => p + q, 0) + space * (j - i - 1)) * size;
          let x = W / 2 - lw / 2;
          for (let n = i; n < j; n++) { placed.push({...ws[n], idx: a + n, x, width: widths[n] * size, y: top + li * lh + size * .82}); x += (widths[n] + space) * size; }
        });
        return {k, kind, a, z, size, words: placed, from: k === 0 ? 0 : WD[a].start - LEAD / FPS};
      });
      scenes.forEach((s, k) => { s.to = k + 1 < scenes.length ? scenes[k + 1].from : DURATION + 1; });
    },

    async prepare(t, env) {
      if (!FOOT || t < FOOT.piece_start - .1 || t > FOOT.piece_start + FOOT.duration) return;
      const fi = M.clamp(Math.floor((t - FOOT.piece_start) * FOOT.fps), 0, FOOT.count - 1);
      for (const i of [fi, Math.min(fi + 1, FOOT.count - 1)]) {
        if (!frames.has(i)) frames.set(i, await env.loadImage(`assets/teaser/f${String(i + 1).padStart(4, '0')}.jpg`));
      }
      for (const key of frames.keys()) if (key < fi - 2) frames.delete(key);
    },

    state(t, env) {
      const {W, H, FPS, DURATION} = env;
      const tf = (Math.floor(t * FPS + 1e-6) + .5) / FPS;                 // the scene comes from the frame: no ghosts across a cut
      let k = 0;
      while (k + 1 < scenes.length && tf >= scenes[k + 1].from) k++;
      const sc = scenes[k], since = t - sc.from;
      const push = 1 + .03 * t / DURATION + (k > 0 ? .028 * (1 - EXPO(prog(since, 0, .35))) : 0);
      const d = M.wiggle(t, {freq: .3, amp: 3.5, octaves: 2, dims: 2, seed: 5});
      const cam = {s: push, dx: d[0], dy: d[1]};
      const cp = ([x, y]) => [W / 2 + push * (x - W / 2) + d[0], H / 2 + push * (y - H / 2) + d[1]];
      const words = sc.words.map(w => {
        const rise = EXPO(prog(t, w.start - .04, w.start + .12));
        return {w, rise, weight: M.mix(300, 820, COUT(prog(t, w.start - .04, w.start + .22))), dy: (1 - rise) * .3 * sc.size,
          sweep: EMPH.has(w.idx) ? COUT(prog(t, w.start + .04, w.start + .32)) : 0};
      });
      const track = [cp([0, 0]), cp([W, H]), ...anchors(sc.kind, t, sc).map(cp), ...words.slice(0, 8).map(v => cp([v.w.x, v.w.y + v.dy]))];
      return {time: t, k, cam, words, tr: trace(t, W), track};
    },

    draw(s, {base: b, light: l}, env) {
      const {W, H} = env, sc = scenes[s.k], t = s.time, {cam} = s;
      for (const c of [b, l]) c.setTransform(cam.s, 0, 0, cam.s, W / 2 - cam.s * W / 2 + cam.dx, H / 2 - cam.s * H / 2 + cam.dy);

      // The trace: the narrator's voice as the teaser's signal. It lights the room a little.
      const glow = l.createRadialGradient(W / 2, TRACE_Y, 0, W / 2, TRACE_Y, .8 * W);
      glow.addColorStop(0, `rgba(255,106,26,${.04 + .1 * s.tr.energy})`); glow.addColorStop(1, 'rgba(255,106,26,0)');
      l.fillStyle = glow; l.fillRect(-W, -H, 3 * W, 3 * H);
      b.lineJoin = l.lineJoin = 'round'; b.lineCap = l.lineCap = 'round';
      const path = c => { c.beginPath(); s.tr.pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); };
      l.strokeStyle = ACC; l.globalAlpha = .28 + .4 * s.tr.energy; l.lineWidth = 12; path(l); l.globalAlpha = .6; l.lineWidth = 3; path(l); l.globalAlpha = 1;
      b.strokeStyle = ACC; b.lineWidth = 3; path(b);

      // The picture.
      PICS[sc.kind](b, l, t, sc, env);

      // Captions: each word lands when it is said; the stressed word in orange with an underline sweep.
      for (const v of s.words) {
        if (v.rise <= 0) continue;
        const {w} = v, emph = EMPH.has(w.idx), cx = w.x + w.width / 2;
        text(b, w.text, cx, w.y + v.dy, {font: S.font({weight: v.weight, size: sc.size}), color: emph ? ACC : INK, alpha: Math.min(1, v.rise * 1.6)});
        if (v.sweep > 0) { b.fillStyle = ACC; b.fillRect(w.x, w.y + sc.size * .13, w.width * v.sweep, Math.max(3, sc.size * .06)); }
      }

      // Film matter in screen space: dust on twos and a faint exposure flicker.
      b.setTransform(1, 0, 0, 1, 0, 0);
      const k = Math.floor(t * 15);
      b.fillStyle = INK;
      for (let j = 0; j < 12; j++) {
        b.globalAlpha = .1 + .2 * M.hash(k * 53 + j, 4);
        b.beginPath(); b.arc(M.hash(k * 97 + j, 1) * W, M.hash(k * 89 + j, 2) * H, .6 + 1.5 * M.hash(k * 53 + j, 3), 0, M.TAU); b.fill();
      }
      b.globalAlpha = .045 * (.5 + .5 * M.valueNoise(t * 12, 21)); b.fillStyle = '#000'; b.fillRect(0, 0, W, H);
      b.globalAlpha = 1;
    },
  });
})();
