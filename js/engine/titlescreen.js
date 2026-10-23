// The title screen, drawn the way console RPGs draw theirs: one low-resolution pixel canvas scaled up by a
// whole number, so the scene, the logo, the text and the menu window all share the same chunky pixels.
// Dusk over the marsh, the lighthouse sweeping, fog drifting, Rook on his post. "PRESS Z OR ENTER", then
// a framed menu with a heart cursor.
(function () {
  'use strict';
  const FONT = '"Press Start 2P"';
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  // ── crisp pixel text: render the font, then snap every pixel fully on or off ──
  const textCache = new Map();
  function pixelText(str, size, color) {
    const key = str + '|' + size + '|' + color;
    if (textCache.has(key)) return textCache.get(key);
    const m = document.createElement('canvas').getContext('2d');
    m.font = size + 'px ' + FONT;
    const w = Math.max(1, Math.ceil(m.measureText(str).width)), h = size;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.font = size + 'px ' + FONT; x.textBaseline = 'top'; x.fillStyle = color;
    x.fillText(str, 0, 0);
    const img = x.getImageData(0, 0, w, h), d = img.data;
    for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 110 ? 255 : 0;
    x.putImageData(img, 0, 0);
    textCache.set(key, c);
    return c;
  }
  // Text with a 1-pixel drop shadow, the way every DS menu does it.
  function drawText(c, str, x, y, size, color, shadow) {
    if (shadow !== false) c.drawImage(pixelText(str, size, shadow || '#0b0d14'), Math.round(x) + 1, Math.round(y) + 1);
    c.drawImage(pixelText(str, size, color), Math.round(x), Math.round(y));
  }
  const textW = (str, size) => pixelText(str, size, '#fff').width;

  // ── the logo: outlined, banded gradient, deep shadow ──
  function buildLogo(size) {
    const mask = pixelText('LOWMARSH', size, '#fff');
    const pad = 4, w = mask.width + pad * 2, h = mask.height + pad * 2 + 3;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    const tint = (col) => { const t = document.createElement('canvas'); t.width = mask.width; t.height = mask.height; const tx = t.getContext('2d'); tx.drawImage(mask, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = col; tx.fillRect(0, 0, t.width, t.height); return t; };
    const dark = tint('#0b0d14'), deep = tint('#2a2550');
    for (let dy = 1; dy <= 3; dy++) x.drawImage(deep, pad + Math.min(dy, 2), pad + dy);       // stacked 3D shadow
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) x.drawImage(dark, pad + ox, pad + oy); // outline
    // banded vertical gradient fill
    // paint the bands first, then keep only the letter shapes
    const fill = document.createElement('canvas'); fill.width = mask.width; fill.height = mask.height;
    const fx = fill.getContext('2d');
    const bands = ['#ffffff', '#ffffff', '#eef2ff', '#d3dcfc', '#b4bdf0', '#9198dc', '#7d7fc8'];
    const rows = Math.round(size * 0.875);  // the glyphs fill 7/8 of the em
    bands.forEach((col, i) => { fx.fillStyle = col; fx.fillRect(0, Math.floor(i * rows / bands.length), mask.width, Math.ceil(rows / bands.length) + 1); });
    fx.fillStyle = bands[bands.length - 1]; fx.fillRect(0, rows, mask.width, mask.height - rows);
    fx.globalCompositeOperation = 'destination-in';
    fx.drawImage(mask, 0, 0);
    x.drawImage(fill, pad, pad);
    // a glint along the top edge of each letter
    const img = x.getImageData(0, 0, w, h), d = img.data;
    const at = (px, py) => (py * w + px) * 4;
    for (let py = pad; py < pad + 3; py++) for (let px = pad; px < w - pad; px++) {
      const i = at(px, py), above = at(px, py - 1);
      if (d[i] === 255 && d[i + 1] === 255 && d[i + 2] === 255 && d[above] < 40 && (px + py) % 5 === 0) { d[i] = 255; d[i + 1] = 246; d[i + 2] = 200; }
    }
    x.putImageData(img, 0, 0);
    return c;
  }

  // ── a DS-style window: rounded pixel corners, light rim, navy fill ──
  function windowFrame(c, x, y, w, h) {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    const px = (col, a, b, ww, hh) => { c.fillStyle = col; c.fillRect(a, b, ww, hh); };
    px('#0b0d14', x + 2, y, w - 4, h); px('#0b0d14', x, y + 2, w, h - 4); px('#0b0d14', x + 1, y + 1, w - 2, h - 2);
    px('#e6eefb', x + 3, y + 1, w - 6, 1); px('#e6eefb', x + 3, y + h - 2, w - 6, 1);
    px('#e6eefb', x + 1, y + 3, 1, h - 6); px('#e6eefb', x + w - 2, y + 3, 1, h - 6);
    px('#e6eefb', x + 2, y + 2, 1, 1); px('#e6eefb', x + w - 3, y + 2, 1, 1); px('#e6eefb', x + 2, y + h - 3, 1, 1); px('#e6eefb', x + w - 3, y + h - 3, 1, 1);
    px('#6a78b8', x + 3, y + 2, w - 6, 1); px('#6a78b8', x + 2, y + 3, 1, h - 6);
    px('#19214c', x + 3, y + 3, w - 6, h - 6);
    px('#141a3e', x + 3, y + h - 4, w - 6, 1);
  }

  // ── the static scene layers, rebuilt only when the screen size changes ──
  function buildScene(W, H) {
    const horizon = Math.round(H * (W >= H ? 0.62 : 0.58));
    const layer = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
    // sky: dithered dusk bands
    const sky = layer(), s = sky.getContext('2d');
    const pal = ['#0a0c1f', '#121634', '#1c2048', '#2a2a5c', '#3d3468', '#5a3f70', '#7a4c74'];
    const img = s.createImageData(W, horizon), d = img.data;
    const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const P = pal.map(rgb);
    for (let y = 0; y < horizon; y++) {
      const t = Math.pow(y / horizon, 1.15) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(t)), f = t - i;
      for (let x = 0; x < W; x++) {
        const col = f * 16 > BAYER[y & 3][x & 3] ? P[i + 1] : P[i];
        const k = (y * W + x) * 4; d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
      }
    }
    s.putImageData(img, 0, 0);
    // moon
    const mx = Math.round(W * (W >= H ? 0.1 : 0.14)), my = Math.round(H * (W >= H ? 0.14 : 0.07)), mr = Math.max(6, Math.round(Math.min(W, H) * 0.04));
    for (let y = -mr; y <= mr; y++) for (let x = -mr; x <= mr; x++) {
      const r = Math.hypot(x, y);
      if (r <= mr) { s.fillStyle = r > mr - 1 ? '#d9d2b8' : (x + y > mr * 0.6 ? '#e9e2c6' : '#fff7dc'); s.fillRect(mx + x, my + y, 1, 1); }
      else if (r <= mr + 2 && (x + y) % 2 === 0) { s.fillStyle = 'rgba(255,247,220,.18)'; s.fillRect(mx + x, my + y, 1, 1); }
    }
    s.fillStyle = '#e2d9bb'; s.fillRect(mx - 2, my - 1, 2, 2); s.fillRect(mx + 2, my + 3, 1, 1);
    // far hills
    s.fillStyle = '#20214a';
    for (let x = 0; x < W; x++) { const hh = Math.round(9 + 5 * Math.sin(x * 0.035) + 3 * Math.sin(x * 0.11 + 1)); s.fillRect(x, horizon - hh, 1, hh); }
    s.fillStyle = '#171838';
    for (let x = 0; x < W; x++) { const hh = Math.round(4 + 3 * Math.sin(x * 0.06 + 2) + 2 * Math.sin(x * 0.19)); s.fillRect(x, horizon - hh, 1, hh); }
    // the village on the horizon
    const houses = [];
    let hx = Math.round(W * 0.08);
    while (hx < W * 0.6) {
      const hw = 9 + ((hx * 7) % 6), hh = 7 + ((hx * 13) % 6);
      houses.push([hx, hw, hh]);
      hx += hw + 2 + ((hx * 5) % 5);
    }
    houses.forEach(([x, w, h], n) => {
      s.fillStyle = '#0e0f26';
      s.fillRect(x, horizon - h, w, h);
      for (let r = 0; r < Math.ceil(w / 2) + 1; r++) s.fillRect(x - 1 + r, horizon - h - r, w + 2 - r * 2, 1);
      if (n % 3 === 1) s.fillRect(x + w - 3, horizon - h - 6, 2, 5);           // chimney
    });
    // water
    const wat = s.createImageData(W, H - horizon), wd = wat.data, WP = ['#121a3e', '#0d1330', '#090d22', '#060814'].map(rgb);
    for (let y = 0; y < H - horizon; y++) {
      const t = (y / (H - horizon)) * (WP.length - 1), i = Math.min(WP.length - 2, Math.floor(t)), f = t - i;
      for (let x = 0; x < W; x++) { const col = f * 16 > BAYER[y & 3][x & 3] ? WP[i + 1] : WP[i]; const k = (y * W + x) * 4; wd[k] = col[0]; wd[k + 1] = col[1]; wd[k + 2] = col[2]; wd[k + 3] = 255; }
    }
    s.putImageData(wat, 0, horizon);
    s.fillStyle = '#2a2f5c'; s.fillRect(0, horizon, W, 1);
    // stars
    const stars = [];
    for (let i = 0; i < Math.round(W * H / 700); i++) {
      const x = Math.floor(Tiles.hash(i, 3, 1) * W), y = Math.floor(Tiles.hash(i, 4, 1) * horizon * 0.7);
      if (Math.hypot(x - mx, y - my) > mr + 6) stars.push([x, y, Tiles.hash(i, 5, 1)]);
    }
    const windows = [];
    houses.forEach(([x, w, h], n) => { if (n % 2 === 0 || n % 5 === 1) windows.push([x + 2 + (n % 3), horizon - h + 3, Tiles.hash(n, 9, 2)]); });
    return { sky, horizon, mx, my, stars, windows, lx: Math.round(W * (W >= H ? 0.84 : 0.8)) };
  }

  function mount(cv, opts) {
    const c = cv.getContext('2d');
    let W = 0, H = 0, scale = 1, scene = null, logo = null, logoSize = 24, t = 0, last = performance.now();
    let phase = opts.skipIntro ? 'menu' : 'press', open = opts.skipIntro ? 1 : 0, sel = opts.selected || 0, hoverAcct = false, chosen = -1, chosenAt = 0;
    const items = opts.items;
    const touch = matchMedia('(pointer: coarse)').matches;
    const flies = Array.from({ length: 9 }, (_, i) => ({ x: Tiles.hash(i, 1, 7), y: Tiles.hash(i, 2, 7), p: Tiles.hash(i, 3, 7) * 6 }));

    function resize() {
      const vw = innerWidth, vh = innerHeight;
      scale = Math.floor(Math.min(vw / 240, vh / 220));
      if (scale < 2 && Math.min(vw, vh) >= 360) scale = 2;
      scale = Math.max(1, scale);
      W = Math.ceil(vw / scale); H = Math.ceil(vh / scale);
      cv.width = W; cv.height = H;
      cv.style.width = W * scale + 'px'; cv.style.height = H * scale + 'px';
      c.imageSmoothingEnabled = false;
      scene = buildScene(W, H);
      logoSize = W >= 400 ? 32 : W >= 250 ? 24 : 16;
      logo = buildLogo(logoSize);
    }

    // where things go, recomputed each frame from the current size
    function layout() {
      const portrait = H > W;
      const logoY = Math.round(H * (portrait ? 0.14 : 0.1));
      const rowH = 14, winW = Math.min(W - 12, Math.max(...items.map(it => textW(it.label, 8) + (it.sub ? textW(it.sub, 8) + 14 : 0))) + 40);
      const winH = items.length * rowH + 14;
      const winX = Math.round((W - winW) / 2), winY = Math.round(Math.min(H - winH - 26, logoY + logo.height + (portrait ? 40 : 26)));
      return { portrait, logoY, rowH, winW, winH, winX, winY };
    }

    function frame(now) {
      if (!cv.isConnected) return cleanup();
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (phase === 'menu' && open < 1) open = Math.min(1, open + dt * 7);
      const L = layout();
      // scene
      c.drawImage(scene.sky, 0, 0);
      scene.stars.forEach(([x, y, p]) => { const tw = Math.sin(t * (1 + p * 2) + p * 20); if (tw > -0.3) { c.fillStyle = tw > 0.7 ? '#ffffff' : '#9aa4d6'; c.fillRect(x, y, 1, 1); } });
      // lighthouse beam, then the tower
      const lx = scene.lx, ly = scene.horizon - 34, a = Math.PI + 0.5 * Math.sin(t * 0.5) - 0.25;
      c.save(); c.globalAlpha = 0.13 + 0.04 * Math.sin(t * 3); c.fillStyle = '#fff3c4';
      c.beginPath(); c.moveTo(lx, ly); c.lineTo(lx + Math.cos(a - 0.09) * W, ly + Math.sin(a - 0.09) * W); c.lineTo(lx + Math.cos(a + 0.09) * W, ly + Math.sin(a + 0.09) * W); c.fill(); c.restore();
      c.fillStyle = '#0e0f26'; c.fillRect(lx - 10, scene.horizon - 4, 22, 4); c.fillRect(lx - 7, scene.horizon - 7, 15, 3);
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#9a2f3a' : '#c8c2d8'; c.fillRect(lx - 3 + (i >> 2), scene.horizon - 12 - i * 4, 7 - 2 * (i >> 2), 5); }
      c.fillStyle = '#2d2d3a'; c.fillRect(lx - 3, ly + 2, 7, 1);
      c.fillStyle = '#fff3c4'; c.fillRect(lx - 1, ly - 1, 3, 3);
      c.fillStyle = '#0e0f26'; c.fillRect(lx - 2, ly - 3, 5, 2);
      // village windows flicker
      scene.windows.forEach(([x, y, p]) => { c.fillStyle = Math.sin(t * 0.7 + p * 30) > -0.85 ? '#ffd166' : '#8a6a2a'; c.fillRect(x, y, 2, 2); });
      // water shimmer and reflections
      for (let i = 0; i < 26; i++) {
        const y = scene.horizon + 3 + Math.floor(Tiles.hash(i, 11, 3) * (H - scene.horizon - 6));
        const x = Math.floor((Tiles.hash(i, 12, 3) * W + t * (6 + i % 5)) % W), len = 3 + i % 6;
        c.fillStyle = i % 4 ? '#1f2a5a' : '#2f3c78'; c.fillRect(x, y, len, 1);
      }
      for (let y = scene.horizon + 2; y < H; y += 3) {
        const wob = Math.round(Math.sin(t * 2 + y * 0.6) * 2), len = Math.max(1, 6 - Math.floor((y - scene.horizon) / 8));
        c.fillStyle = '#c9c2a2'; c.fillRect(scene.mx - len + wob, y, len * 2, 1);
        if ((y >> 1) % 2) { c.fillStyle = '#e8d38a'; c.fillRect(lx - 1 + wob, y, 2, 1); }
      }
      // fog banks drifting
      c.save();
      for (let i = 0; i < 7; i++) {
        const fw = 70 + i * 13, fy = scene.horizon - 8 + (i % 3) * 7, fx = ((i * 97 + t * (3 + i)) % (W + fw * 2)) - fw;
        c.globalAlpha = 0.07; c.fillStyle = '#c8d2ee';
        c.fillRect(Math.round(fx), fy, fw, 5); c.fillRect(Math.round(fx) + 8, fy - 2, fw - 16, 2); c.fillRect(Math.round(fx) + 8, fy + 5, fw - 16, 2);
      }
      c.restore();
      // reeds in the foreground
      for (let x = 0; x < W; x += 2) {
        if (x > W * 0.22 && x < W * 0.78) continue;
        const h = 6 + Math.floor(Tiles.hash(x, 21, 4) * 16), sway = Math.round(Math.sin(t * 1.4 + x * 0.3) * (h / 14));
        c.fillStyle = x % 6 ? '#05060f' : '#0b0d1c';
        for (let j = 0; j < h; j++) c.fillRect(x + Math.round(sway * j / h), H - j, 1, 1);
        if (h > 17) { c.fillStyle = '#2a1f1a'; c.fillRect(x + sway, H - h - 2, 2, 3); }
      }
      // Rook on his post
      const px = Math.round(W * 0.88), py = H - 6;
      c.fillStyle = '#1a1210'; c.fillRect(px, py - 18, 3, 24);
      const rk = Sprites.get('rook', 'left');
      c.drawImage(rk, px - 6, py - 18 - rk.height + (Math.sin(t * 2) > 0.92 ? -1 : 0));
      // fireflies
      flies.forEach((f, i) => {
        const x = Math.round((f.x * W + Math.sin(t * 0.6 + f.p) * 10) % W), y = Math.round(scene.horizon + 6 + f.y * (H - scene.horizon - 12) + Math.sin(t * 0.9 + i) * 4);
        if (Math.sin(t * 1.7 + f.p * 3) > 0.1) { c.fillStyle = '#e8ff8a'; c.fillRect(x, y, 1, 1); }
      });

      // logo, gently floating
      c.drawImage(logo, Math.round((W - logo.width) / 2), L.logoY + (Math.sin(t * 1.6) > 0 ? 0 : 1));
      const sub = 'A STORY ABOUT SHOWING YOUR WORKING';
      const subY = L.logoY + logo.height + 4;
      if (textW(sub, 8) <= W - 8) drawText(c, sub, (W - textW(sub, 8)) / 2, subY, 8, '#b7bde0');
      else { const a1 = 'A STORY ABOUT', a2 = 'SHOWING YOUR WORKING'; drawText(c, a1, (W - textW(a1, 8)) / 2, subY, 8, '#b7bde0'); drawText(c, a2, (W - textW(a2, 8)) / 2, subY + 10, 8, '#b7bde0'); }

      // account, top right
      const acct = opts.account();
      const ax = W - textW(acct, 8) - 6, ay = 6;
      drawText(c, acct, ax, ay, 8, hoverAcct ? '#ffd166' : '#e6eefb');
      if (hoverAcct) c.drawImage(Sprites.get('heart'), ax - 10, ay);

      if (phase === 'press') {
        const msg = touch ? 'TAP TO START' : 'PRESS Z OR ENTER';
        if (Math.floor(t * 1.6) % 2 === 0) drawText(c, msg, (W - textW(msg, 8)) / 2, L.winY + 18, 8, '#ffffff');
      } else {
        // the menu window opens from its middle
        const hh = Math.max(6, Math.round(L.winH * open));
        windowFrame(c, L.winX, L.winY + Math.round((L.winH - hh) / 2), L.winW, hh);
        if (open >= 1) {
          items.forEach((it, i) => {
            const y = L.winY + 8 + i * L.rowH;
            const isSel = i === sel, flash = chosen === i && Math.floor((t - chosenAt) * 14) % 2 === 0;
            if (isSel) { c.fillStyle = '#263174'; c.fillRect(L.winX + 4, y - 2, L.winW - 8, L.rowH - 1); }
            drawText(c, it.label, L.winX + 22, y + 1, 8, flash ? '#ffffff' : isSel ? '#ffd166' : '#e6eefb');
            if (it.sub) drawText(c, it.sub, L.winX + L.winW - 8 - textW(it.sub, 8), y + 1, 8, isSel ? '#c9a24a' : '#6f78a8');
            if (isSel) c.drawImage(Sprites.get('heart'), L.winX + 9, y + 1 + (Math.floor(t * 2.2) % 2));
          });
          // what the highlighted option does
          const hint = items[sel].hint || '';
          if (hint) {
            c.fillStyle = 'rgba(5,6,15,.75)'; c.fillRect(0, H - 14, W, 14);
            const hw = textW(hint, 8);
            drawText(c, hint, Math.max(4, (W - hw) / 2), H - 11, 8, '#9aa4d6');
          }
        }
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
      if (k === 'arrowup' || k === 'w') { e.preventDefault(); move(-1); }
      else if (k === 'arrowdown' || k === 's') { e.preventDefault(); move(1); }
      else if (k === 'enter' || k === 'z' || k === ' ') { e.preventDefault(); choose(sel); }
    }
    const toLogical = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; };
    function hit(p) {
      const acct = opts.account(), aw = textW(acct, 8);
      if (p.x >= W - aw - 16 && p.y <= 20) return 'account';
      if (phase !== 'menu' || open < 1) return null;
      const L = layout();
      if (p.x < L.winX || p.x > L.winX + L.winW) return null;
      const i = Math.floor((p.y - L.winY - 7) / L.rowH);
      return i >= 0 && i < items.length ? i : null;
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

  const ready = () => (document.fonts && document.fonts.load ? document.fonts.load('8px ' + FONT).catch(() => {}) : Promise.resolve());
  window.TitleScreen = { mount, ready, clearCache: () => textCache.clear() };
})();
