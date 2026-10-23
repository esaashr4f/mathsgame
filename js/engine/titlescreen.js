// The title screen, drawn the way console RPGs draw theirs: one low-resolution pixel canvas scaled up by a
// whole number, so scene, logo, text and menu share one pixel grid. Three looks, picked with ?title=…:
//   cozy    — warm sunset over the marsh, a bottom menu bar (Stardew-ish)
//   minimal — black, a lone lighthouse, small white text (Undertale-ish)
//   ds      — moonlit marsh, a compact framed menu window (DS RPG-ish)
// The logo's O is the lighthouse lamp, Rook perches on the L, and fog curls through the letters.
(function () {
  'use strict';
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

  // ── crisp pixel text: render the font, then snap every pixel fully on or off ──
  const textCache = new Map();
  function fontStr(f) { return (f.weight || 400) + ' ' + f.size + 'px "' + f.family + '"'; }
  function pixelText(str, f, color) {
    const key = str + '|' + fontStr(f) + '|' + (f.spacing || 0) + '|' + color;
    if (textCache.has(key)) return textCache.get(key);
    const m = document.createElement('canvas').getContext('2d');
    m.font = fontStr(f); if (f.spacing) m.letterSpacing = f.spacing + 'px';
    const w = Math.max(1, Math.ceil(m.measureText(str).width) + 2), h = Math.ceil(f.size * 1.25);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.font = fontStr(f); if (f.spacing) x.letterSpacing = f.spacing + 'px';
    x.textBaseline = 'top'; x.fillStyle = color;
    x.fillText(str, 0, 0);
    const img = x.getImageData(0, 0, w, h), d = img.data;
    for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 110 ? 255 : 0;
    x.putImageData(img, 0, 0);
    c.inkW = measureInk(img, w, h);
    textCache.set(key, c);
    return c;
  }
  function measureInk(img, w, h) { let r = 0; for (let x = w - 1; x >= 0 && !r; x--) for (let y = 0; y < h; y++) if (img.data[(y * w + x) * 4 + 3]) { r = x + 1; break; } return r || w; }
  function drawText(c, str, x, y, f, color, shadow) {
    if (shadow) c.drawImage(pixelText(str, f, shadow), Math.round(x) + 1, Math.round(y) + 1);
    c.drawImage(pixelText(str, f, color), Math.round(x), Math.round(y));
  }
  const textW = (str, f) => pixelText(str, f, '#fff').inkW;

  // ── the logo ──
  function buildLogo(L) {
    const f = L.font, word = 'LOWMARSH';
    const mask = pixelText(word, f, '#fff');
    const pad = 4, depth = L.depth || 0, w = mask.inkW + pad * 2 + depth, h = mask.height + pad * 2 + depth;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    const tint = col => { const t = document.createElement('canvas'); t.width = mask.width; t.height = mask.height; const tx = t.getContext('2d'); tx.drawImage(mask, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = col; tx.fillRect(0, 0, t.width, t.height); return t; };
    if (depth) { const sh = tint(L.shadow); for (let d = 1; d <= depth; d++) x.drawImage(sh, pad + d, pad + d); }
    if (L.outline) { const o = tint(L.outline); for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) if (ox || oy) x.drawImage(o, pad + ox, pad + oy); }
    // the ink rows of the glyphs, so the colour bands follow the letters rather than the em box
    const mi = mask.getContext('2d').getImageData(0, 0, mask.width, mask.height).data;
    let top = mask.height, bot = 0;
    for (let yy = 0; yy < mask.height; yy++) for (let xx = 0; xx < mask.width; xx++) if (mi[(yy * mask.width + xx) * 4 + 3]) { top = Math.min(top, yy); bot = Math.max(bot, yy); }
    const fill = document.createElement('canvas'); fill.width = mask.width; fill.height = mask.height;
    const fx = fill.getContext('2d'), bands = L.bands, rows = bot - top + 1;
    bands.forEach((col, i) => { fx.fillStyle = col; fx.fillRect(0, top + Math.floor(i * rows / bands.length), mask.width, Math.ceil(rows / bands.length) + 1); });
    fx.globalCompositeOperation = 'destination-in'; fx.drawImage(mask, 0, 0);
    x.drawImage(fill, pad, pad);
    // where the O and the top of the L are, for the lamp and the crow
    const m = document.createElement('canvas').getContext('2d'); m.font = fontStr(f); if (f.spacing) m.letterSpacing = f.spacing + 'px';
    const wL = m.measureText('L').width, wLO = m.measureText('LO').width;
    c.o = { x: pad + (wL + wLO - (f.spacing || 0)) / 2, y: pad + (top + bot) / 2 };
    c.l = { x: pad + Math.round(wL / 2) - 2, y: pad + top };
    c.inkTop = pad + top; c.inkBot = pad + bot;
    return c;
  }

  // ── a DS-style window ──
  function windowFrame(c, x, y, w, h, fillCol) {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    const px = (col, a, b, ww, hh) => { c.fillStyle = col; c.fillRect(a, b, ww, hh); };
    px('#0b0d14', x + 2, y, w - 4, h); px('#0b0d14', x, y + 2, w, h - 4); px('#0b0d14', x + 1, y + 1, w - 2, h - 2);
    px('#e6eefb', x + 3, y + 1, w - 6, 1); px('#e6eefb', x + 3, y + h - 2, w - 6, 1);
    px('#e6eefb', x + 1, y + 3, 1, h - 6); px('#e6eefb', x + w - 2, y + 3, 1, h - 6);
    [[2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3]].forEach(([a, b]) => px('#e6eefb', x + a, y + b, 1, 1));
    px('#6a78b8', x + 3, y + 2, w - 6, 1); px('#6a78b8', x + 2, y + 3, 1, h - 6);
    px(fillCol || '#19214c', x + 3, y + 3, w - 6, h - 6);
  }

  // ── scenery ──
  function ditherRows(ctx, W, y0, y1, pal, curve) {
    const P = pal.map(rgb), img = ctx.createImageData(W, y1 - y0), d = img.data;
    for (let y = 0; y < y1 - y0; y++) {
      const t = Math.pow(y / Math.max(1, y1 - y0 - 1), curve || 1) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(t)), f = t - i;
      for (let x = 0; x < W; x++) { const col = f * 16 > BAYER[y & 3][x & 3] ? P[i + 1] : P[i]; const k = (y * W + x) * 4; d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255; }
    }
    ctx.putImageData(img, 0, y0);
  }
  function disc(s, cx, cy, r, core, rim) {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const q = Math.hypot(x, y); if (q <= r) { s.fillStyle = q > r - 1 ? rim : core; s.fillRect(cx + x, cy + y, 1, 1); } }
  }
  function village(s, W, horizon, x0, x1, roof, seed) {
    const houses = [];
    let hx = Math.round(x0);
    while (hx < x1) {
      const hw = 9 + ((hx * 7 + seed) % 6), hh = 7 + ((hx * 13 + seed) % 6);
      houses.push([hx, hw, hh]);
      hx += hw + 2 + ((hx * 5) % 5);
    }
    houses.forEach(([x, w, h], n) => {
      s.fillStyle = roof;
      s.fillRect(x, horizon - h, w, h);
      for (let r = 0; r < Math.ceil(w / 2) + 1; r++) s.fillRect(x - 1 + r, horizon - h - r, w + 2 - r * 2, 1);
      if (n % 3 === 1) s.fillRect(x + w - 3, horizon - h - 6, 2, 5);
    });
    return houses.filter((_, n) => n % 2 === 0 || n % 5 === 1).map(([x, w, h], n) => [x + 2 + (n % 3), horizon - h + 3, Tiles.hash(n, 9, 2)]);
  }
  function hills(s, W, horizon, cols) {
    cols.forEach((col, k) => { s.fillStyle = col; for (let x = 0; x < W; x++) { const hh = Math.round((9 - k * 5) + (5 - k * 2) * Math.sin(x * (0.035 + k * 0.025) + k * 2) + 3 * Math.sin(x * 0.11 + 1)); if (hh > 0) s.fillRect(x, horizon - hh, 1, hh); } });
  }
  function lighthouse(c, lx, base, t, lit) {
    c.fillStyle = '#0e0f26'; c.fillRect(lx - 10, base - 4, 22, 4); c.fillRect(lx - 7, base - 7, 15, 3);
    for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#9a2f3a' : '#c8c2d8'; c.fillRect(lx - 3 + (i >> 2), base - 12 - i * 4, 7 - 2 * (i >> 2), 5); }
    const ly = base - 34;
    c.fillStyle = '#2d2d3a'; c.fillRect(lx - 3, ly + 2, 7, 1);
    c.fillStyle = lit ? '#fff3c4' : '#5a5060'; c.fillRect(lx - 1, ly - 1, 3, 3);
    c.fillStyle = '#0e0f26'; c.fillRect(lx - 2, ly - 3, 5, 2);
    return ly;
  }
  function beam(c, lx, ly, a, W, alpha, col) {
    c.save(); c.globalAlpha = alpha; c.fillStyle = col;
    c.beginPath(); c.moveTo(lx, ly); c.lineTo(lx + Math.cos(a - 0.08) * W, ly + Math.sin(a - 0.08) * W); c.lineTo(lx + Math.cos(a + 0.08) * W, ly + Math.sin(a + 0.08) * W); c.fill(); c.restore();
  }
  function reeds(c, W, H, t, from, to, col) {
    for (let x = 0; x < W; x += 2) {
      if (x > W * from && x < W * to) continue;
      const h = 6 + Math.floor(Tiles.hash(x, 21, 4) * 16), sway = Math.round(Math.sin(t * 1.4 + x * 0.3) * (h / 14));
      c.fillStyle = col;
      for (let j = 0; j < h; j++) c.fillRect(x + Math.round(sway * j / h), H - j, 1, 1);
      if (h > 17) { c.fillStyle = '#2a1f1a'; c.fillRect(x + sway, H - h - 2, 2, 3); }
    }
  }
  function shimmer(c, W, H, horizon, t, cols) {
    for (let i = 0; i < 30; i++) {
      const y = horizon + 3 + Math.floor(Tiles.hash(i, 11, 3) * (H - horizon - 6));
      const x = Math.floor((Tiles.hash(i, 12, 3) * W + t * (6 + i % 5)) % W), len = 3 + i % 6;
      c.fillStyle = cols[i % cols.length]; c.fillRect(x, y, len, 1);
    }
  }
  function reflection(c, x, horizon, H, t, col, maxLen) {
    for (let y = horizon + 2; y < H; y += 3) {
      const wob = Math.round(Math.sin(t * 2 + y * 0.6) * 2), len = Math.max(1, maxLen - Math.floor((y - horizon) / 9));
      c.fillStyle = col; c.fillRect(x - len + wob, y, len * 2, 1);
    }
  }
  function fogBands(c, W, y, t, col, alpha, n) {
    c.save(); c.globalAlpha = alpha; c.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const fw = 60 + i * 13, fy = y + (i % 3) * 6, fx = Math.round(((i * 97 + t * (3 + i)) % (W + fw * 2)) - fw);
      c.fillRect(fx, fy, fw, 4); c.fillRect(fx + 8, fy - 2, fw - 16, 2); c.fillRect(fx + 8, fy + 4, fw - 16, 2);
    }
    c.restore();
  }

  // ── the three looks ──
  const THEMES = {
    cozy: {
      res: 340, menuFont: { family: 'Pixelify Sans', size: 16, weight: 500 }, small: { family: 'Pixelify Sans', size: 16, weight: 500 },
      logo: { font: { family: 'Pixelify Sans', size: 64, weight: 700, spacing: 3 }, small: { family: 'Pixelify Sans', size: 40, weight: 700, spacing: 2 }, bands: ['#fff6d8', '#ffe7a8', '#ffd27a', '#f6b25a', '#e08a44'], outline: '#2a1408', shadow: '#5a2414', depth: 3 },
      colors: { text: '#fff1d6', sel: '#ffd166', shadow: '#2a1408', dim: '#e9c9a0', sub: '#ffe2b8' },
      build(W, H) {
        const horizon = Math.round(H * (W >= H ? 0.6 : 0.5));
        const sky = document.createElement('canvas'); sky.width = W; sky.height = H; const s = sky.getContext('2d');
        ditherRows(s, W, 0, horizon, ['#1a2448', '#2c2f5e', '#553c70', '#8e4f72', '#c9666a', '#ee8f5c', '#ffc271'], 1.25);
        const sx = Math.round(W * 0.5), sy = horizon - 2, sr = Math.round(Math.min(W, H) * 0.07);
        for (let y = -sr; y <= 0; y++) for (let x = -sr; x <= sr; x++) { const q = Math.hypot(x, y); if (q <= sr) { s.fillStyle = y > -sr * 0.35 ? '#ffd58a' : '#ffe9b0'; if ((y & 1) && y > -sr * 0.5) s.fillStyle = '#ffbf6e'; s.fillRect(sx + x, sy + y, 1, 1); } }
        hills(s, W, horizon, ['#5a3a68', '#3a2a55']);
        const windows = village(s, W, horizon, W * 0.06, W * 0.36, '#241a38', 3);
        ditherRows(s, W, horizon, H, ['#a85a6a', '#5a3a62', '#2a2348', '#171633'], 0.7);
        s.fillStyle = '#ffcf8a'; s.fillRect(0, horizon, W, 1);
        return { sky, horizon, windows, sx, lx: Math.round(W * 0.82) };
      },
      draw(c, W, H, t, sc) {
        c.drawImage(sc.sky, 0, 0);
        for (let i = 0; i < 14; i++) { const x = Math.floor(Tiles.hash(i, 3, 9) * W), y = Math.floor(Tiles.hash(i, 4, 9) * sc.horizon * 0.3); if (Math.sin(t * 1.3 + i) > 0) { c.fillStyle = '#fff3e0'; c.fillRect(x, y, 1, 1); } }
        const ly = lighthouse(c, sc.lx, sc.horizon, t, true);
        beam(c, sc.lx, ly, Math.PI * 0.98 + 0.12 * Math.sin(t * 0.5), W * 0.5, 0.12, '#fff3c4');
        sc.windows.forEach(([x, y, p]) => { c.fillStyle = Math.sin(t * 0.7 + p * 30) > -0.85 ? '#ffd166' : '#a8702a'; c.fillRect(x, y, 2, 2); });
        shimmer(c, W, H, sc.horizon, t, ['#d98a6a', '#8a4e6a', '#ffb07a']);
        reflection(c, sc.sx, sc.horizon, H, t, '#ffcf8a', 14);
        fogBands(c, W, sc.horizon - 10, t, '#ffd9c4', 0.08, 6);
        reeds(c, W, H, t, 0.2, 0.8, '#120c1c');
      },
      layout(W, H, logo, items) {
        const portrait = H > W, logoY = Math.round(H * 0.1);
        const f = this.menuFont, gap = 16, rowH = 22;
        const widths = items.map(it => textW(it.label, f));
        const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1) + 12 * items.length;
        const rects = [];
        if (!portrait && total <= W - 20) {
          let x = Math.round((W - total) / 2); const y = H - 34;
          items.forEach((it, i) => { rects.push({ x: x + 12, y, w: widths[i], h: 16 }); x += widths[i] + 12 + gap; });
        } else {
          const maxW = Math.max(...widths), x = Math.round((W - maxW) / 2) + 6, y0 = H - 14 - items.length * rowH;
          items.forEach((it, i) => rects.push({ x, y: y0 + i * rowH, w: widths[i], h: 16 }));
        }
        return { logoY, subY: logoY + logo.inkBot + 8, rects, pressY: H - 34, bar: true };
      },
    },

    minimal: {
      res: 260, menuFont: { family: 'Tiny5', size: 10 }, small: { family: 'Tiny5', size: 10 },
      logo: { font: { family: 'Silkscreen', size: 32, spacing: 3 }, small: { family: 'Silkscreen', size: 24, spacing: 2 }, bands: ['#ffffff'], outline: null, shadow: '#3a3a4a', depth: 0 },
      colors: { text: '#ffffff', sel: '#ffd166', shadow: null, dim: '#808080', sub: '#a0a0a0' },
      build(W, H) { return { horizon: Math.round(H * 0.5) }; },
      draw(c, W, H, t) {
        c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
        // a lone lighthouse far below, and a sea of fog
        const lx = Math.round(W / 2), base = Math.round(H * 0.9), on = Math.sin(t * 2.2) > -0.2;
        const ly = lighthouse(c, lx, base, t, on);
        if (on) { beam(c, lx, ly, Math.PI + 0.25 * Math.sin(t * 0.6), W * 0.35, 0.07, '#ffffff'); beam(c, lx, ly, 0.25 * Math.sin(t * 0.6 + 1), W * 0.35, 0.05, '#ffffff'); }
        fogBands(c, W, base - 4, t, '#9aa0b8', 0.09, 8);
      },
      layout(W, H, logo, items) {
        const logoY = Math.round(H * 0.2), rowH = 15, f = this.menuFont;
        const maxW = Math.max(...items.map(it => textW(it.label, f)));
        const x = Math.round((W - maxW) / 2) + 6, y0 = logoY + logo.inkBot + 40;
        return { logoY, subY: logoY + logo.inkBot + 8, rects: items.map((it, i) => ({ x, y: y0 + i * rowH, w: textW(it.label, f), h: 10 })), pressY: y0 + 14 };
      },
    },

    ds: {
      res: 240, menuFont: { family: 'Silkscreen', size: 8 }, small: { family: 'Silkscreen', size: 8 },
      logo: { font: { family: 'Jersey 10', size: 48, spacing: 1 }, small: { family: 'Jersey 10', size: 32, spacing: 1 }, bands: ['#ffffff', '#e4f0ff', '#b8d2ff', '#8ab0f6', '#5e86e0', '#4466c8'], outline: '#0a1430', shadow: '#0a1430', depth: 3 },
      colors: { text: '#e6eefb', sel: '#ffd166', shadow: '#0b0d14', dim: '#7f8cc0', sub: '#b7c4ee' },
      build(W, H) {
        const horizon = Math.round(H * (W >= H ? 0.6 : 0.5));
        const sky = document.createElement('canvas'); sky.width = W; sky.height = H; const s = sky.getContext('2d');
        ditherRows(s, W, 0, horizon, ['#060a1e', '#0b1636', '#122452', '#1c3870', '#2c5290', '#4a74ac'], 1.2);
        const mx = Math.round(W * 0.84), my = Math.round(H * 0.17), mr = Math.max(6, Math.round(Math.min(W, H) * 0.045));
        disc(s, mx, my, mr, '#fff7dc', '#d9d2b8'); s.fillStyle = '#e2d9bb'; s.fillRect(mx - 2, my - 1, 2, 2); s.fillRect(mx + 2, my + 3, 1, 1);
        hills(s, W, horizon, ['#16264e', '#0e1a3a']);
        const windows = village(s, W, horizon, W * 0.08, W * 0.42, '#0a1128', 7);
        ditherRows(s, W, horizon, H, ['#183060', '#0e1d40', '#081228', '#050a18'], 0.8);
        s.fillStyle = '#5a7ab4'; s.fillRect(0, horizon, W, 1);
        const stars = [];
        for (let i = 0; i < Math.round(W * H / 500); i++) { const x = Math.floor(Tiles.hash(i, 3, 1) * W), y = Math.floor(Tiles.hash(i, 4, 1) * horizon * 0.75); if (Math.hypot(x - mx, y - my) > mr + 5) stars.push([x, y, Tiles.hash(i, 5, 1)]); }
        return { sky, horizon, windows, stars, mx, lx: Math.round(W * 0.66) };
      },
      draw(c, W, H, t, sc) {
        c.drawImage(sc.sky, 0, 0);
        sc.stars.forEach(([x, y, p]) => { const tw = Math.sin(t * (1 + p * 2) + p * 20); if (tw > -0.3) { c.fillStyle = tw > 0.7 ? '#ffffff' : '#8aa0d8'; c.fillRect(x, y, 1, 1); } });
        const ly = lighthouse(c, sc.lx, sc.horizon, t, true);
        beam(c, sc.lx, ly, Math.PI * 1.02 + 0.18 * Math.sin(t * 0.5), W * 0.6, 0.12, '#fff3c4');
        sc.windows.forEach(([x, y, p]) => { c.fillStyle = Math.sin(t * 0.7 + p * 30) > -0.85 ? '#ffd166' : '#8a6a2a'; c.fillRect(x, y, 2, 2); });
        shimmer(c, W, H, sc.horizon, t, ['#1f3a74', '#2f5498']);
        reflection(c, sc.mx, sc.horizon, H, t, '#c9c2a2', 6);
        reflection(c, sc.lx, sc.horizon, H, t + 1, '#e8d38a', 2);
        fogBands(c, W, sc.horizon - 8, t, '#c8d6f4', 0.07, 7);
        reeds(c, W, H, t, 0.18, 0.82, '#03050d');
        const px = Math.round(W * 0.9), py = H - 6;
        c.fillStyle = '#1a1210'; c.fillRect(px, py - 18, 3, 24);
        const rk = Sprites.get('rook', 'left'); c.drawImage(rk, px - 6, py - 18 - rk.height);
      },
      layout(W, H, logo, items) {
        const logoY = Math.round(H * 0.09), rowH = 13, f = this.menuFont;
        const winW = Math.max(...items.map(it => textW(it.label, f))) + 40, winH = items.length * rowH + 12;
        const winX = Math.round((W - winW) / 2), winY = Math.round(Math.max(logoY + logo.height + 22, H - winH - 12));
        return { logoY, subY: logoY + logo.inkBot + 8, win: { x: winX, y: winY, w: winW, h: winH }, rects: items.map((it, i) => ({ x: winX + 22, y: winY + 7 + i * rowH, w: winW - 30, h: rowH - 2 })), pressY: winY + 20 };
      },
    },
  };

  function mount(cv, opts) {
    const theme = THEMES[opts.variant] || THEMES.cozy;
    const C = theme.colors;
    const c = cv.getContext('2d');
    let W = 0, H = 0, scale = 1, scene = null, logo = null, t = 0, last = performance.now();
    let phase = opts.skipIntro ? 'menu' : 'press', open = opts.skipIntro ? 1 : 0, sel = opts.selected || 0, hoverAcct = false, chosen = -1, chosenAt = 0;
    const items = opts.items;
    const touch = matchMedia('(pointer: coarse)').matches;

    function resize() {
      const vw = innerWidth, vh = innerHeight;
      scale = vh > vw ? Math.floor(vw / 190) : Math.round(Math.min(vh, vw * 0.75) / theme.res);
      if (scale < 2 && Math.min(vw, vh) >= 360) scale = 2;
      scale = Math.max(1, scale);
      W = Math.ceil(vw / scale); H = Math.ceil(vh / scale);
      cv.width = W; cv.height = H;
      cv.style.width = W * scale + 'px'; cv.style.height = H * scale + 'px';
      c.imageSmoothingEnabled = false;
      scene = theme.build(W, H);
      // the biggest logo that leaves a comfortable margin either side
      const sizes = [theme.logo.font, theme.logo.small].concat([0.75, 0.5].map(k => Object.assign({}, theme.logo.small, { size: Math.round(theme.logo.small.size * k / 8) * 8 || 8 })));
      logo = buildLogo(Object.assign({}, theme.logo, { font: sizes.find(f => textW('LOWMARSH', f) + 40 <= W) || sizes[sizes.length - 1] }));
    }
    const L = () => theme.layout(W, H, logo, items);

    function frame(now) {
      if (!cv.isConnected) return cleanup();
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (phase === 'menu' && open < 1) open = Math.min(1, open + dt * 6);
      const lay = L();
      theme.draw(c, W, H, t, scene);

      // logo: the lamp in the O, Rook on the L, fog curling through the letters
      const lx = Math.round((W - logo.width) / 2), ly = lay.logoY + (Math.sin(t * 1.4) > 0 ? 0 : 1);
      c.drawImage(logo, lx, ly);
      const ox = Math.round(lx + logo.o.x) - 1, oy = Math.round(ly + logo.o.y) - 1, on = Math.sin(t * 2.4) > -0.6;
      c.fillStyle = on ? '#ffe9a0' : '#c9a24a'; c.fillRect(ox - 1, oy, 4, 2); c.fillRect(ox, oy - 1, 2, 4);
      c.fillStyle = on ? '#ffffff' : '#ffe9a0'; c.fillRect(ox, oy, 2, 2);
      const rk = Sprites.get('rook', 'right');
      c.drawImage(rk, lx + logo.l.x - 2, ly + logo.l.y - rk.height + 2 + (Math.sin(t * 1.1) > 0.95 ? -1 : 0));

      const sub = 'a story about showing your working';
      const sw = textW(sub, theme.small);
      if (sw <= W - 8) drawText(c, sub, (W - sw) / 2, lay.subY, theme.small, C.sub, C.shadow);
      else { const a1 = 'a story about', a2 = 'showing your working'; drawText(c, a1, (W - textW(a1, theme.small)) / 2, lay.subY, theme.small, C.sub, C.shadow); drawText(c, a2, (W - textW(a2, theme.small)) / 2, lay.subY + theme.small.size + 2, theme.small, C.sub, C.shadow); }

      // account, small and quiet
      const acct = opts.account(), aw = textW(acct, theme.small);
      drawText(c, acct, W - aw - 6, 5, theme.small, hoverAcct ? C.sel : C.dim, C.shadow);

      if (phase === 'press') {
        const msg = touch ? 'TAP TO START' : opts.variant === 'minimal' ? '[PRESS Z OR ENTER]' : 'PRESS Z OR ENTER';
        const mf = theme.menuFont;
        if (Math.floor(t * 1.6) % 2 === 0) drawText(c, msg, (W - textW(msg, mf)) / 2, lay.pressY, mf, opts.variant === 'minimal' ? '#808080' : C.text, C.shadow);
      } else {
        if (lay.win) { const hh = Math.max(6, Math.round(lay.win.h * open)); windowFrame(c, lay.win.x, lay.win.y + Math.round((lay.win.h - hh) / 2), lay.win.w, hh); }
        if (lay.bar) { c.save(); c.globalAlpha = 0.55 * open; c.fillStyle = '#120a18'; c.fillRect(0, Math.min(...lay.rects.map(r => r.y)) - 8, W, H); c.restore(); }
        if (open >= 1) items.forEach((it, i) => {
          const r = lay.rects[i], isSel = i === sel, flash = chosen === i && Math.floor((t - chosenAt) * 14) % 2 === 0;
          if (isSel && lay.win) { c.fillStyle = '#263174'; c.fillRect(lay.win.x + 4, r.y - 2, lay.win.w - 8, r.h + 1); }
          drawText(c, it.label, r.x, r.y, theme.menuFont, flash ? '#ffffff' : isSel ? C.sel : C.text, C.shadow);
          if (isSel) { const hrt = Sprites.get('heart'); c.drawImage(hrt, r.x - hrt.width - 5, r.y + Math.round((theme.menuFont.size * 0.8 - hrt.height) / 2) + (Math.floor(t * 2.2) % 2)); }
        });
      }
      raf = requestAnimationFrame(frame);
    }

    // ── input ──
    function move(d) { sel = (sel + d + items.length) % items.length; Sfx.move(); opts.onSelect && opts.onSelect(sel); }
    function choose(i) {
      if (chosen >= 0) return;
      sel = i; chosen = i; chosenAt = t; Sfx.confirm();
      opts.onSelect && opts.onSelect(sel);
      setTimeout(() => { chosen = -1; if (cv.isConnected) opts.onChoose(items[i].id); }, 380);
    }
    function start() { phase = 'menu'; Sfx.confirm(); }
    function onKey(e) {
      if (!cv.isConnected) return cleanup();
      if (document.getElementById('title').classList.contains('hidden') || document.querySelector('.panel-screen') || (document.activeElement && document.activeElement.tagName === 'INPUT')) return;
      const k = e.key.toLowerCase();
      if (phase === 'press') { if (k === 'enter' || k === 'z' || k === ' ') { e.preventDefault(); start(); } return; }
      if (open < 1) return;
      if (k === 'arrowup' || k === 'w' || k === 'arrowleft' || k === 'a') { e.preventDefault(); move(-1); }
      else if (k === 'arrowdown' || k === 's' || k === 'arrowright' || k === 'd') { e.preventDefault(); move(1); }
      else if (k === 'enter' || k === 'z' || k === ' ') { e.preventDefault(); choose(sel); }
    }
    const toLogical = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; };
    function hit(p) {
      const aw = textW(opts.account(), theme.small);
      if (p.x >= W - aw - 14 && p.y <= 22) return 'account';
      if (phase !== 'menu' || open < 1) return null;
      const i = L().rects.findIndex(r => p.x >= r.x - 16 && p.x <= r.x + r.w + 6 && p.y >= r.y - 4 && p.y <= r.y + r.h + 2);
      return i >= 0 ? i : null;
    }
    function onMove(e) {
      const h = hit(toLogical(e));
      hoverAcct = h === 'account';
      if (typeof h === 'number' && h !== sel) move(h - sel);
      cv.style.cursor = h != null ? 'pointer' : 'default';
    }
    function onClick(e) {
      const h = hit(toLogical(e));
      if (h === 'account') { Sfx.select(); return opts.onChoose('account'); }
      if (phase === 'press') return start();
      if (typeof h === 'number') choose(h);
    }
    function cleanup() {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey, true);
      removeEventListener('resize', resize);
    }
    let raf = 0;
    resize();
    addEventListener('resize', resize);
    document.addEventListener('keydown', onKey, true);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('click', onClick);
    raf = requestAnimationFrame(frame);
    return { cleanup, start, choose: id => { const i = items.findIndex(it => it.id === id); if (i >= 0) { phase = 'menu'; open = 1; choose(i); } } };
  }

  const FONTS = ['500 16px "Pixelify Sans"', '700 64px "Pixelify Sans"', '700 40px "Pixelify Sans"', '10px "Tiny5"', '8px "Silkscreen"', '32px "Silkscreen"', '48px "Jersey 10"'];
  const ready = () => (document.fonts && document.fonts.load ? Promise.all(FONTS.map(f => document.fonts.load(f).catch(() => {}))) : Promise.resolve());
  window.TitleScreen = { mount, ready, clearCache: () => textCache.clear(), variants: Object.keys(THEMES) };
})();
