// The title screen, drawn the way console RPGs draw theirs: one low-resolution pixel canvas scaled up by a
// whole number, so scene, logo, text and menu share one pixel grid.
// The marsh follows the real time of day: dawn, daytime, the golden sunset, dusk and night. Sunrise and sunset
// are worked out from the date and the device's time zone, so it follows the seasons too.
// The logo's O is the lighthouse lamp and Rook perches on the L. Preview any time with ?hour=7.5.
(function () {
  'use strict';
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, k) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * k));
  const lerp = (a, b, k) => a + (b - a) * k;

  const MENU = { family: 'Pixelify Sans', size: 16, weight: 500 };
  const LOGO = [{ family: 'Pixelify Sans', size: 64, weight: 700, spacing: 3 }, { family: 'Pixelify Sans', size: 40, weight: 700, spacing: 2 }, { family: 'Pixelify Sans', size: 32, weight: 700, spacing: 1 }];
  const COLORS = { text: '#fff1d6', sel: '#ffd166', shadow: '#2a1408', dim: '#e9c9a0', sub: '#ffe2b8' };

  // ── the sky through the day ──
  const LOOKS = {
    night: { sky: ['#05081a', '#0a1230', '#10204a', '#183062', '#22427a', '#2e5288', '#3a5e90'], water: ['#1a2c58', '#101c3e', '#0a1228', '#050a18'], hills: ['#1a2a52', '#101c3c'], roof: '#0a1128', line: '#5a7ab4', stars: 1, lights: 1, beam: 1, clouds: 0, glint: '#c9c2a2' },
    dawn: { sky: ['#22305e', '#3e4a84', '#7a6aa0', '#c48aa8', '#f0a8a0', '#ffc8a0', '#ffe0b0'], water: ['#c8908e', '#6a5a86', '#3a3a66', '#22244a'], hills: ['#6a5a86', '#4a4070'], roof: '#3a2e52', line: '#ffe0b8', stars: 0.3, lights: 0.6, beam: 0.4, clouds: 0.6, glint: '#ffd8a8' },
    day: { sky: ['#2a6ec4', '#3a82d0', '#4f96da', '#68aae2', '#86bfe8', '#a6d2ee', '#c8e4f2'], water: ['#5a9ad0', '#3a78b4', '#285c94', '#1a4274'], hills: ['#5a8a6a', '#3e6e56'], roof: '#3a4a5e', line: '#e0f2ff', stars: 0, lights: 0, beam: 0, clouds: 1, glint: '#ffffff' },
    sunset: { sky: ['#1a2448', '#2c2f5e', '#553c70', '#8e4f72', '#c9666a', '#ee8f5c', '#ffc271'], water: ['#a85a6a', '#5a3a62', '#2a2348', '#171633'], hills: ['#5a3a68', '#3a2a55'], roof: '#241a38', line: '#ffcf8a', stars: 0.3, lights: 1, beam: 1, clouds: 0.4, glint: '#ffcf8a' },
    dusk: { sky: ['#0c1230', '#1a1f4a', '#2e2c62', '#4a3a72', '#6a4a7a', '#8a5a80', '#a86a84'], water: ['#5a3a66', '#2e2650', '#1a1838', '#0e0c22'], hills: ['#3a2a5a', '#2a2048'], roof: '#160f2a', line: '#c890a8', stars: 0.7, lights: 1, beam: 1, clouds: 0.1, glint: '#e0b0c0' },
  };
  function blend(a, b, k) {
    const o = {};
    for (const key in a) o[key] = Array.isArray(a[key]) ? a[key].map((c, i) => mix(c, b[key][i], k)) : typeof a[key] === 'number' ? lerp(a[key], b[key], k) : mix(a[key], b[key], k);
    return o;
  }
  // Sunrise and sunset (local clock hours) from the date and time zone. Latitude defaults to the UK's.
  const ZONES = { 'Europe/London': [51.5, -0.1], 'Europe/Dublin': [53.3, -6.3], 'Europe/Paris': [48.9, 2.4], 'America/New_York': [40.7, -74], 'America/Chicago': [41.9, -87.6], 'America/Los_Angeles': [34, -118.2], 'Asia/Kolkata': [28.6, 77.2], 'Asia/Dubai': [25.2, 55.3], 'Australia/Sydney': [-33.9, 151.2], 'Asia/Singapore': [1.3, 103.8], 'Asia/Hong_Kong': [22.3, 114.2] };
  function sunTimes(d) {
    const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset(), jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    const std = -Math.max(jan, jul) / 60, now = -d.getTimezoneOffset() / 60;
    let zone = ''; try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { /* old browser */ }
    const [lat, lon] = ZONES[zone] || [51.5, std * 15];
    const n = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    const dec = 23.44 * Math.sin((2 * Math.PI / 365) * (284 + n)) * Math.PI / 180;
    const phi = lat * Math.PI / 180, alt = -0.833 * Math.PI / 180;                 // the sun's centre at sunrise, with refraction
    const cosw = (Math.sin(alt) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    const half = Math.acos(Math.max(-1, Math.min(1, cosw))) * 12 / Math.PI;      // half the day length, hours
    const B = 2 * Math.PI * (n - 81) / 364, eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);  // minutes
    const noon = 12 + (std * 15 - lon) / 15 + (now - std) - eot / 60;
    return { rise: noon - half, set: noon + half };
  }
  function lookAt(hour, sun) {
    const R = sun.rise, S = sun.set;
    const keys = [[R - 1.5, 'night'], [R - 0.2, 'dawn'], [R + 1.5, 'day'], [S - 2, 'day'], [S - 0.4, 'sunset'], [S + 0.6, 'dusk'], [S + 1.6, 'night']];
    if (hour <= keys[0][0] || hour >= keys[keys.length - 1][0]) return LOOKS.night;
    for (let i = 0; i < keys.length - 1; i++) {
      const [h0, a] = keys[i], [h1, b] = keys[i + 1];
      if (hour >= h0 && hour < h1) return blend(LOOKS[a], LOOKS[b], (hour - h0) / (h1 - h0));
    }
    return LOOKS.night;
  }

  // ── crisp pixel text: render the font, then snap every pixel fully on or off ──
  const textCache = new Map();
  const fontStr = f => (f.weight || 400) + ' ' + f.size + 'px "' + f.family + '"';
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
    let ink = 0; for (let xx = w - 1; xx >= 0 && !ink; xx--) for (let yy = 0; yy < h; yy++) if (d[(yy * w + xx) * 4 + 3]) { ink = xx + 1; break; }
    c.inkW = ink || w;
    textCache.set(key, c);
    return c;
  }
  function drawText(c, str, x, y, f, color, shadow) {
    if (shadow) c.drawImage(pixelText(str, f, shadow), Math.round(x) + 1, Math.round(y) + 1);
    c.drawImage(pixelText(str, f, color), Math.round(x), Math.round(y));
  }
  const textW = (str, f) => pixelText(str, f, '#fff').inkW;

  // ── the logo: outlined, banded amber, a stacked shadow ──
  function buildLogo(f) {
    const mask = pixelText('LOWMARSH', f, '#fff');
    const pad = 4, depth = 3, w = mask.inkW + pad * 2 + depth, h = mask.height + pad * 2 + depth;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    const tint = col => { const t = document.createElement('canvas'); t.width = mask.width; t.height = mask.height; const tx = t.getContext('2d'); tx.drawImage(mask, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = col; tx.fillRect(0, 0, t.width, t.height); return t; };
    const sh = tint('#5a2414'); for (let d = 1; d <= depth; d++) x.drawImage(sh, pad + d, pad + d);
    const o = tint('#2a1408'); for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) if (ox || oy) x.drawImage(o, pad + ox, pad + oy);
    const mi = mask.getContext('2d').getImageData(0, 0, mask.width, mask.height).data;
    let top = mask.height, bot = 0;
    for (let yy = 0; yy < mask.height; yy++) for (let xx = 0; xx < mask.width; xx++) if (mi[(yy * mask.width + xx) * 4 + 3]) { top = Math.min(top, yy); bot = Math.max(bot, yy); }
    const fill = document.createElement('canvas'); fill.width = mask.width; fill.height = mask.height;
    const fx = fill.getContext('2d'), bands = ['#fff6d8', '#ffe7a8', '#ffd27a', '#f6b25a', '#e08a44'], rows = bot - top + 1;
    bands.forEach((col, i) => { fx.fillStyle = col; fx.fillRect(0, top + Math.floor(i * rows / bands.length), mask.width, Math.ceil(rows / bands.length) + 1); });
    fx.globalCompositeOperation = 'destination-in'; fx.drawImage(mask, 0, 0);
    x.drawImage(fill, pad, pad);
    const m = document.createElement('canvas').getContext('2d'); m.font = fontStr(f); if (f.spacing) m.letterSpacing = f.spacing + 'px';
    const wL = m.measureText('L').width, wLO = m.measureText('LO').width;
    c.o = { x: pad + (wL + wLO - (f.spacing || 0)) / 2, y: pad + (top + bot) / 2 };
    c.l = { x: pad + Math.round(wL / 2) - 2, y: pad + top };
    c.inkBot = pad + bot;
    return c;
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
  function buildScene(W, H, look) {
    const horizon = Math.round(H * (W >= H ? 0.6 : 0.5));
    const sky = document.createElement('canvas'); sky.width = W; sky.height = H;
    ditherRows(sky.getContext('2d'), W, 0, horizon, look.sky, 1.25);
    // the land and water go on their own layer, so the sun and moon can sink behind the hills
    const land = document.createElement('canvas'); land.width = W; land.height = H;
    const s = land.getContext('2d');
    look.hills.forEach((col, k) => { s.fillStyle = col; for (let x = 0; x < W; x++) { const hh = Math.round((9 - k * 5) + (5 - k * 2) * Math.sin(x * (0.035 + k * 0.025) + k * 2) + 3 * Math.sin(x * 0.11 + 1)); if (hh > 0) s.fillRect(x, horizon - hh, 1, hh); } });
    const houses = [];
    for (let hx = Math.round(W * 0.06); hx < W * 0.36;) { const hw = 9 + ((hx * 7 + 3) % 6), hh = 7 + ((hx * 13 + 3) % 6); houses.push([hx, hw, hh]); hx += hw + 2 + ((hx * 5) % 5); }
    s.fillStyle = look.roof;
    houses.forEach(([x, w, h], n) => {
      s.fillRect(x, horizon - h, w, h);
      for (let r = 0; r < Math.ceil(w / 2) + 1; r++) s.fillRect(x - 1 + r, horizon - h - r, w + 2 - r * 2, 1);
      if (n % 3 === 1) s.fillRect(x + w - 3, horizon - h - 6, 2, 5);
    });
    ditherRows(s, W, horizon, H, look.water, 0.7);
    s.fillStyle = look.line; s.fillRect(0, horizon, W, 1);
    const windows = houses.filter((_, n) => n % 2 === 0 || n % 5 === 1).map(([x, w, h], n) => [x + 2 + (n % 3), horizon - h + 3, Tiles.hash(n, 9, 2)]);
    const stars = [];
    for (let i = 0; i < Math.round(W * H / 600); i++) stars.push([Math.floor(Tiles.hash(i, 3, 1) * W), Math.floor(Tiles.hash(i, 4, 1) * horizon * 0.8), Tiles.hash(i, 5, 1)]);
    return { sky, land, horizon, windows, stars, lx: Math.round(W * 0.82) };
  }
  function lighthouse(c, lx, base, lamp) {
    c.fillStyle = '#0e0f26'; c.fillRect(lx - 10, base - 4, 22, 4); c.fillRect(lx - 7, base - 7, 15, 3);
    for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#9a2f3a' : '#e4dee8'; c.fillRect(lx - 3 + (i >> 2), base - 12 - i * 4, 7 - 2 * (i >> 2), 5); }
    const ly = base - 34;
    c.fillStyle = '#2d2d3a'; c.fillRect(lx - 3, ly + 2, 7, 1);
    c.fillStyle = lamp > 0.3 ? '#fff3c4' : '#8a8070'; c.fillRect(lx - 1, ly - 1, 3, 3);
    c.fillStyle = '#0e0f26'; c.fillRect(lx - 2, ly - 3, 5, 2);
    return ly;
  }
  function disc(c, cx, cy, r, core, rim) {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const q = Math.hypot(x, y); if (q <= r) { c.fillStyle = q > r - 1 ? rim : core; c.fillRect(cx + x, cy + y, 1, 1); } }
  }
  // a puffy pixel cloud: overlapping round lumps on a flat base, shaded underneath
  function cloud(c, x, y, w, col, shade) {
    const puffs = [[0.22, 4], [0.45, 6], [0.7, 5], [0.88, 3]];
    puffs.forEach(([k, r]) => disc(c, Math.round(x + w * k), y - r + 6, r, col, col));
    c.fillStyle = col; c.fillRect(x, y + 2, w, 5);
    c.fillStyle = shade; c.fillRect(x + 2, y + 6, w - 4, 2);
  }

  function mount(cv, opts) {
    const c = cv.getContext('2d');
    let W = 0, H = 0, scale = 1, scene = null, logo = null, look = null, lookKey = '', t = 0, last = performance.now(), checked = -99;
    let phase = opts.skipIntro ? 'menu' : 'press', open = opts.skipIntro ? 1 : 0, sel = opts.selected || 0, hoverAcct = false, chosen = -1, chosenAt = 0;
    // the side menu (☰, top left): everything around the game that isn't in the story
    const drawer = opts.drawer || [];
    const dPick = drawer.map((d, i) => (d.id ? i : -1)).filter(i => i >= 0);
    let dOpen = !!opts.drawerOpen, dAnim = dOpen ? 1 : 0, dSel = Math.max(0, dPick.indexOf(opts.drawerSel)), hoverIcon = false, dChosen = -1, dScroll = 0, dDrag = null;
    const items = opts.items;
    const touch = matchMedia('(pointer: coarse)').matches;
    const forced = parseFloat(new URLSearchParams(location.search).get('hour'));
    const clock = () => { const d = new Date(); return { hour: isNaN(forced) ? d.getHours() + d.getMinutes() / 60 : forced, sun: sunTimes(d) }; };

    function refreshLook(force) {
      const { hour, sun } = clock();
      look = lookAt(hour, sun);
      look.hour = hour; look.sun = sun;
      const key = look.sky.join() + look.water.join();
      if (force || key !== lookKey) { lookKey = key; scene = buildScene(W, H, look); }
    }
    function resize() {
      const vw = innerWidth, vh = innerHeight;
      scale = vh > vw ? Math.floor(vw / 190) : Math.round(Math.min(vh, vw * 0.75) / 340);
      if (scale < 2 && Math.min(vw, vh) >= 360) scale = 2;
      scale = Math.max(1, scale);
      W = Math.ceil(vw / scale); H = Math.ceil(vh / scale);
      cv.width = W; cv.height = H;
      cv.style.width = W * scale + 'px'; cv.style.height = H * scale + 'px';
      c.imageSmoothingEnabled = false;
      logo = buildLogo(LOGO.find(f => textW('LOWMARSH', f) + 40 <= W) || LOGO[LOGO.length - 1]);
      refreshLook(true);
    }
    function layout() {
      const portrait = H > W, logoY = Math.round(H * 0.1), gap = 16, rowH = 22;
      const widths = items.map(it => textW(it.label, MENU));
      const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1) + 12 * items.length;
      const rects = [];
      if (!portrait && total <= W - 20) {
        let x = Math.round((W - total) / 2); const y = H - 34;
        items.forEach((it, i) => { rects.push({ x: x + 12, y, w: widths[i], h: 16 }); x += widths[i] + 12 + gap; });
      } else {
        const maxW = Math.max(...widths), x = Math.round((W - maxW) / 2) + 6, y0 = H - 14 - items.length * rowH;
        items.forEach((it, i) => rects.push({ x, y: y0 + i * rowH, w: widths[i], h: 16 }));
      }
      return { logoY, subY: logoY + logo.inkBot + 8, rects, pressY: H - 34 };
    }

    opts.clearY = () => { const lay = layout(); return lay.subY + (textW('a story about showing your working', MENU) <= W - 8 ? MENU.size : MENU.size * 2 + 2) + 4; };
    function drawScene() {
      const L = look, hz = scene.horizon, R = L.sun.rise, S = L.sun.set, h = L.hour;
      c.drawImage(scene.sky, 0, 0);
      scene.stars.forEach(([x, y, p]) => { if (p < L.stars && Math.sin(t * (1 + p * 2) + p * 20) > -0.3) { c.fillStyle = p < L.stars * 0.3 ? '#ffffff' : '#a8b4e0'; c.fillRect(x, y, 1, 1); } });
      // the sun crosses the sky from sunrise to sunset; the moon crosses it overnight
      const dayK = (h - R) / (S - R);
      const arc = Math.max(10, hz - (opts.clearY ? opts.clearY() : hz * 0.4) - 14);   // keep sun and moon below the words
      let body = null;
      if (dayK > -0.06 && dayK < 1.06) {
        const k = Math.max(0, Math.min(1, dayK)), r = Math.round(Math.min(W, H) * 0.05);
        const y = Math.round(hz + 4 - Math.sin(Math.PI * Math.max(-0.06, Math.min(1.06, dayK))) * arc);
        const low = 1 - Math.min(1, Math.sin(Math.PI * k) * 2.5);
        body = { x: Math.round(W * (0.14 + 0.72 * Math.max(0, Math.min(1, dayK)))), y, r, core: mix('#fff6d8', '#ffbf6e', low), rim: mix('#ffe9b0', '#ff9a5a', low) };
        disc(c, body.x, body.y, body.r, body.core, body.rim);
      } else {
        const nightLen = 24 - (S - R), nk = (((h - S) % 24) + 24) % 24 / nightLen;
        if (nk > 0 && nk < 1) { body = { x: Math.round(W * (0.86 - 0.72 * nk)), y: Math.round(hz - Math.sin(Math.PI * nk) * arc), r: Math.max(6, Math.round(Math.min(W, H) * 0.04)), core: '#fff7dc', rim: '#d9d2b8' }; disc(c, body.x, body.y, body.r, body.core, body.rim); c.fillStyle = '#e2d9bb'; c.fillRect(body.x - 2, body.y - 1, 2, 2); }
      }
      // drifting clouds
      if (L.clouds > 0.05) for (let i = 0; i < 5; i++) {
        if (Tiles.hash(i, 31, 2) > L.clouds) continue;
        const top = opts.clearY ? opts.clearY() : hz * 0.4, w = 24 + i * 8;
        const x = Math.round(((Tiles.hash(i, 32, 2) * W + t * (1.5 + i * 0.4)) % (W + w * 2)) - w), y = Math.round(i < 2 ? 8 + i * 14 : top + (hz - top) * (0.15 + 0.2 * (i - 2)));
        cloud(c, x, y, w, mix('#ffffff', L.sky[5], 0.35), mix(L.sky[4], '#000000', 0.08));
      }
      c.drawImage(scene.land, 0, 0);
      // the sun or moon on the water
      if (body && body.y < hz - 1) {
        const lowness = 1 - Math.min(1, (hz - body.y) / Math.max(1, arc));          // 1 on the horizon, 0 at the top
        const reach = Math.round((H - hz) * (0.25 + 0.75 * lowness));
        for (let y = hz + 2; y < hz + reach; y += 3) {
          if (Tiles.hash(y, Math.floor(t * 3), 5) < 0.18) continue;                    // broken, glittering lines
          const wob = Math.round(Math.sin(t * 2 + y * 0.6) * 2), len = Math.max(1, Math.round(body.r * (0.6 + lowness)) - Math.floor((y - hz) / 10));
          c.fillStyle = L.glint; c.fillRect(body.x - len + wob, y, len * 2, 1);
        }
      }
      const ly = lighthouse(c, scene.lx, hz, L.beam);
      if (L.beam > 0.05) {
        const a = Math.PI * 0.98 + 0.12 * Math.sin(t * 0.5);
        c.save(); c.globalAlpha = 0.12 * L.beam; c.fillStyle = '#fff3c4';
        c.beginPath(); c.moveTo(scene.lx, ly); c.lineTo(scene.lx + Math.cos(a - 0.08) * W * 0.5, ly + Math.sin(a - 0.08) * W * 0.5); c.lineTo(scene.lx + Math.cos(a + 0.08) * W * 0.5, ly + Math.sin(a + 0.08) * W * 0.5); c.fill(); c.restore();
      }
      scene.windows.forEach(([x, y, p]) => { if (p < L.lights) { c.fillStyle = Math.sin(t * 0.7 + p * 30) > -0.85 ? '#ffd166' : '#a8702a'; c.fillRect(x, y, 2, 2); } });
      // ripples, gulls by day, fog low on the water
      for (let i = 0; i < 30; i++) {
        const y = hz + 3 + Math.floor(Tiles.hash(i, 11, 3) * (H - hz - 6)), x = Math.floor((Tiles.hash(i, 12, 3) * W + t * (6 + i % 5)) % W);
        c.fillStyle = i % 3 ? mix(L.water[1], '#ffffff', 0.18) : mix(L.water[0], '#ffffff', 0.25); c.fillRect(x, y, 3 + i % 6, 1);
      }
      if (L.clouds > 0.5) for (let i = 0; i < 3; i++) {
        const gx = Math.round((Tiles.hash(i, 41, 2) * W + t * (8 + i * 3)) % (W + 20)) - 10, gy = Math.round(hz * (0.3 + 0.1 * i) + Math.sin(t * 2 + i) * 3), up = Math.sin(t * 6 + i) > 0;
        c.fillStyle = '#2a2f3a'; c.fillRect(gx - 2, gy + (up ? -1 : 0), 2, 1); c.fillRect(gx, gy, 1, 1); c.fillRect(gx + 1, gy + (up ? -1 : 0), 2, 1);
      }
      c.save(); c.globalAlpha = 0.08; c.fillStyle = mix(L.sky[6], '#ffffff', 0.4);
      for (let i = 0; i < 6; i++) { const fw = 60 + i * 13, fy = hz - 10 + (i % 3) * 6, fx = Math.round(((i * 97 + t * (3 + i)) % (W + fw * 2)) - fw); c.fillRect(fx, fy, fw, 4); c.fillRect(fx + 8, fy - 2, fw - 16, 2); c.fillRect(fx + 8, fy + 4, fw - 16, 2); }
      c.restore();
      for (let x = 0; x < W; x += 2) {
        if (x > W * 0.2 && x < W * 0.8) continue;
        const rh = 6 + Math.floor(Tiles.hash(x, 21, 4) * 16), sway = Math.round(Math.sin(t * 1.4 + x * 0.3) * (rh / 14));
        c.fillStyle = mix(L.water[3], '#000000', 0.45);
        for (let j = 0; j < rh; j++) c.fillRect(x + Math.round(sway * j / rh), H - j, 1, 1);
        if (rh > 17) { c.fillStyle = '#2a1f1a'; c.fillRect(x + sway, H - rh - 2, 2, 3); }
      }
    }

    function frame(now) {
      if (!cv.isConnected) return cleanup();
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (t - checked > 20) { checked = t; refreshLook(); }
      if (phase === 'menu' && open < 1) open = Math.min(1, open + dt * 6);
      const lay = layout();
      drawScene();

      const lx = Math.round((W - logo.width) / 2), ly = lay.logoY + (Math.sin(t * 1.4) > 0 ? 0 : 1);
      c.drawImage(logo, lx, ly);
      const ox = Math.round(lx + logo.o.x) - 1, oy = Math.round(ly + logo.o.y) - 1, on = Math.sin(t * 2.4) > -0.6;
      c.fillStyle = on ? '#ffe9a0' : '#c9a24a'; c.fillRect(ox - 1, oy, 4, 2); c.fillRect(ox, oy - 1, 2, 4);
      c.fillStyle = on ? '#ffffff' : '#ffe9a0'; c.fillRect(ox, oy, 2, 2);
      const rk = Sprites.get('rook', 'right');
      c.drawImage(rk, lx + logo.l.x - 2, ly + logo.l.y - rk.height + 2 + (Math.sin(t * 1.1) > 0.95 ? -1 : 0));

      const sub = 'a story about showing your working';
      if (textW(sub, MENU) <= W - 8) drawText(c, sub, (W - textW(sub, MENU)) / 2, lay.subY, MENU, COLORS.sub, COLORS.shadow);
      else { const a1 = 'a story about', a2 = 'showing your working'; drawText(c, a1, (W - textW(a1, MENU)) / 2, lay.subY, MENU, COLORS.sub, COLORS.shadow); drawText(c, a2, (W - textW(a2, MENU)) / 2, lay.subY + MENU.size + 2, MENU, COLORS.sub, COLORS.shadow); }

      const acct = opts.account();
      drawText(c, acct, W - textW(acct, MENU) - 6, 5, MENU, hoverAcct ? COLORS.sel : COLORS.dim, COLORS.shadow);

      if (phase === 'press') {
        const msg = touch ? 'Tap to start' : 'Press Z or Enter';
        if (Math.floor(t * 1.6) % 2 === 0) drawText(c, msg, (W - textW(msg, MENU)) / 2, lay.pressY, MENU, COLORS.text, COLORS.shadow);
      } else {
        c.save(); c.globalAlpha = 0.55 * open; c.fillStyle = '#120a18'; c.fillRect(0, Math.min(...lay.rects.map(r => r.y)) - 8, W, H); c.restore();
        if (open >= 1) items.forEach((it, i) => {
          const r = lay.rects[i], isSel = i === sel, flash = chosen === i && Math.floor((t - chosenAt) * 14) % 2 === 0;
          drawText(c, it.label, r.x, r.y, MENU, flash ? '#ffffff' : isSel ? COLORS.sel : COLORS.text, COLORS.shadow);
          if (isSel) { const hrt = Sprites.get('heart'); c.drawImage(hrt, r.x - hrt.width - 5, r.y + Math.round((MENU.size * 0.8 - hrt.height) / 2) + (Math.floor(t * 2.2) % 2)); }
        });
      }
      drawDrawer(dt);
      raf = requestAnimationFrame(frame);
    }

    // ── the side menu ──
    const ICON = { x: 6, y: 6, w: 16, h: 13 };
    function drawerLayout() {
      const pw = Math.min(W - 16, Math.max(150, ...drawer.map(d => (d.id ? textW(d.label, MENU) + (d.soon ? textW('soon', MENU) + 14 : 0) : textW(d.head, MENU)) + 44)));
      // roomy spacing when there's height for it, tighter on short (laptop) screens, and scrolling beyond that
      // pick the roomiest spacing that fits the whole list on screen (so laptops never need to scroll)
      const heads = drawer.filter(d => d.head).length, links = drawer.length - heads;
      const TIERS = [[18, 16, 6], [16, 15, 3], [14, 13, 2], [13, 12, 1]];
      const [rowH, headH, gap] = TIERS.find(([r, h, g]) => 32 + heads * h + (heads - 1) * g + links * r + 6 <= H) || TIERS[TIERS.length - 1];
      const rows = [];
      let y = 32;
      drawer.forEach((d, i) => { if (d.head) { y += i ? gap : 0; rows.push({ i, y, head: true }); y += headH; } else { rows.push({ i, y, h: rowH }); y += rowH; } });
      const maxScroll = Math.max(0, y + 6 - H);
      dScroll = Math.max(0, Math.min(maxScroll, dScroll));
      return { pw, rows, maxScroll, rowH };
    }
    function drawDrawer(dt) {
      dAnim = Math.max(0, Math.min(1, dAnim + (dOpen ? dt : -dt) * 7));
      // the ☰: three chunky pixel lines with a drop shadow
      const col = hoverIcon || dOpen ? COLORS.sel : COLORS.dim;
      for (let i = 0; i < 3; i++) { c.fillStyle = COLORS.shadow; c.fillRect(ICON.x + 1, ICON.y + 1 + i * 5, 14, 3); }
      for (let i = 0; i < 3; i++) { c.fillStyle = col; c.fillRect(ICON.x, ICON.y + i * 5, 14, 3); }
      if (dAnim <= 0) return;
      const D = drawerLayout(), x0 = Math.round(-D.pw + D.pw * (1 - Math.pow(1 - dAnim, 3)));
      c.save(); c.globalAlpha = 0.5 * dAnim; c.fillStyle = '#05060f'; c.fillRect(0, 0, W, H); c.restore();
      // the panel: a warm pixel window, square on the screen edge, rounded on the open side
      const px = (cc, a, b, w, h) => { c.fillStyle = cc; c.fillRect(a, b, w, h); };
      px('#2a1408', x0, 0, D.pw + 2, H);
      px('#fff1d6', x0 + D.pw - 2, 2, 1, H - 4);
      px('#5a3a62', x0 + D.pw - 3, 2, 1, H - 4);
      px('#1e1428', x0, 0, D.pw - 3, H);
      px('#2a1d38', x0, 0, D.pw - 3, 24);
      drawText(c, 'Menu', x0 + 26, 5, MENU, COLORS.sub, COLORS.shadow);
      for (let i = 0; i < 3; i++) { c.fillStyle = COLORS.sel; c.fillRect(x0 + 6, 6 + i * 5, 14, 3); }
      c.save(); c.beginPath(); c.rect(x0, 26, D.pw - 3, H - 26); c.clip();
      const sy = Math.round(dScroll);
      D.rows.forEach(r => {
        const d = drawer[r.i], y = r.y - sy;
        if (r.head) { drawText(c, d.head, x0 + 10, y, MENU, '#a88aa0', COLORS.shadow); c.fillStyle = '#3a2a4a'; c.fillRect(x0 + 10, y + 14, D.pw - 24, 1); return; }
        const isSel = dPick[dSel] === r.i, flash = dChosen === r.i && Math.floor((t - chosenAt) * 14) % 2 === 0;
        if (isSel) { c.fillStyle = '#33244a'; c.fillRect(x0 + 4, y - 2, D.pw - 10, r.h - 1); }
        drawText(c, d.label, x0 + 24, y, MENU, flash ? '#ffffff' : isSel ? COLORS.sel : (d.soon ? '#b9a6b8' : COLORS.text), COLORS.shadow);
        if (d.soon) drawText(c, 'soon', x0 + D.pw - 14 - textW('soon', MENU), y, MENU, '#8a6a88', COLORS.shadow);
        if (isSel) c.drawImage(Sprites.get('heart'), x0 + 10, y + 3 + (Math.floor(t * 2.2) % 2));
      });
      c.restore();
      // little arrows when there's more to scroll to
      const arrow = (cx, cy, up) => { c.fillStyle = COLORS.sel; for (let j = 0; j < 4; j++) c.fillRect(cx - j, cy + (up ? j : -j), j * 2 + 1, 1); };
      if (dScroll > 0) arrow(x0 + D.pw - 12, 29, true);
      if (dScroll < D.maxScroll) arrow(x0 + D.pw - 12, H - 4, false);
    }
    function toggleDrawer(v) { dOpen = v == null ? !dOpen : v; Sfx.select(); }
    function dMove(d, fromPointer) {
      dSel = (dSel + d + dPick.length) % dPick.length; Sfx.move();
      if (fromPointer) return;
      const D = drawerLayout(), row = D.rows.find(r => r.i === dPick[dSel]);          // keep the heart in view
      if (row.y - dScroll < 30) dScroll = row.y - 30;
      if (row.y + row.h - dScroll > H - 6) dScroll = row.y + row.h - H + 6;
      if (dSel === 0) dScroll = 0;
    }
    function dChoose(k) {
      if (dChosen >= 0) return;
      dSel = k; dChosen = dPick[k]; chosenAt = t; Sfx.confirm();
      const id = drawer[dChosen].id;
      setTimeout(() => { dChosen = -1; if (cv.isConnected) opts.onChoose(id, { fromDrawer: true }); }, 300);
    }
    function dHit(p) {
      if (p.x >= ICON.x - 4 && p.x <= ICON.x + ICON.w + 4 && p.y >= ICON.y - 4 && p.y <= ICON.y + ICON.h + 4) return 'icon';
      if (!dOpen) return null;
      const D = drawerLayout();
      if (p.x > D.pw) return 'outside';
      if (p.y < 26) return 'panel';
      const row = D.rows.find(r => !r.head && p.y + dScroll >= r.y - 2 && p.y + dScroll < r.y + r.h - 2);
      return row ? dPick.indexOf(row.i) : 'panel';
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
      if (k === 'm' || (k === 'escape' && dOpen) || (k === 'x' && dOpen)) { e.preventDefault(); return toggleDrawer(k === 'm' ? null : false); }
      if (dOpen) {
        if (k === 'arrowup' || k === 'w') { e.preventDefault(); dMove(-1); }
        else if (k === 'arrowdown' || k === 's') { e.preventDefault(); dMove(1); }
        else if (k === 'enter' || k === 'z' || k === ' ') { e.preventDefault(); dChoose(dSel); }
        return;
      }
      if (phase === 'press') { if (k === 'enter' || k === 'z' || k === ' ') { e.preventDefault(); start(); } return; }
      if (open < 1) return;
      if (k === 'arrowup' || k === 'w' || k === 'arrowleft' || k === 'a') { e.preventDefault(); move(-1); }
      else if (k === 'arrowdown' || k === 's' || k === 'arrowright' || k === 'd') { e.preventDefault(); move(1); }
      else if (k === 'enter' || k === 'z' || k === ' ') { e.preventDefault(); choose(sel); }
    }
    const toLogical = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; };
    function hit(p) {
      if (p.x >= W - textW(opts.account(), MENU) - 14 && p.y <= 22) return 'account';
      if (phase !== 'menu' || open < 1) return null;
      const i = layout().rects.findIndex(r => p.x >= r.x - 16 && p.x <= r.x + r.w + 6 && p.y >= r.y - 4 && p.y <= r.y + r.h + 2);
      return i >= 0 ? i : null;
    }
    function onMove(e) {
      const p = toLogical(e), dh = dHit(p);
      hoverIcon = dh === 'icon';
      if (dOpen && dDrag) { const dy = dDrag.y - p.y; if (Math.abs(dy) > 2) dDrag.moved = true; dScroll = dDrag.s + dy; return; }
      if (dOpen) { if (typeof dh === 'number' && dh !== dSel) dMove(dh - dSel, true); cv.style.cursor = typeof dh === 'number' || dh === 'icon' || dh === 'outside' ? 'pointer' : 'default'; return; }
      if (hoverIcon) { cv.style.cursor = 'pointer'; return; }
      const h = hit(p);
      hoverAcct = h === 'account';
      if (typeof h === 'number' && h !== sel) move(h - sel);
      cv.style.cursor = h != null ? 'pointer' : 'default';
    }
    function onClick(e) {
      if (dDrag && dDrag.moved) { dDrag = null; return; }
      dDrag = null;
      const p = toLogical(e), dh = dHit(p);
      if (dh === 'icon') return toggleDrawer();
      if (dOpen) { if (dh === 'outside') toggleDrawer(false); else if (typeof dh === 'number') dChoose(dh); return; }
      const h = hit(p);
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
    // scroll the side menu with a wheel, a trackpad or a finger
    cv.addEventListener('wheel', e => { if (!dOpen) return; e.preventDefault(); dScroll += e.deltaY / scale * 0.6; }, { passive: false });
    cv.addEventListener('pointerdown', e => { if (dOpen && e.pointerType !== 'mouse') dDrag = { y: toLogical(e).y, s: dScroll, moved: false }; });
    cv.addEventListener('pointerup', () => { if (dDrag && !dDrag.moved) dDrag = null; });
    raf = requestAnimationFrame(frame);
    return { cleanup, start, openDrawer: () => toggleDrawer(true), chooseDrawer: id => { const k = dPick.findIndex(i => drawer[i].id === id); if (k >= 0) { dOpen = true; dAnim = 1; dChoose(k); } }, choose: id => { const i = items.findIndex(it => it.id === id); if (i >= 0) { phase = 'menu'; open = 1; choose(i); } } };
  }

  const FONTS = ['500 16px "Pixelify Sans"', '700 64px "Pixelify Sans"', '700 40px "Pixelify Sans"', '700 32px "Pixelify Sans"'];
  const ready = () => (document.fonts && document.fonts.load ? Promise.all(FONTS.map(f => document.fonts.load(f).catch(() => {}))) : Promise.resolve());
  window.TitleScreen = { mount, ready, clearCache: () => textCache.clear(), sunTimes };
})();
