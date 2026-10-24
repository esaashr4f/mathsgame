// Lowmarsh. One continuous overworld plus interiors. Story flags open the world up:
// the ferry plank (prologue), the rope crossing (ch1), the fog on the east road (ch2), the town hall (ch3),
// the fallen tree and the flood (ch4), the lock (ch5) and the marsh (finale).
(function () {
  'use strict';
  const S = name => (G, e) => (window.SCRIPTS[name] || window.SCRIPTS._missing)(G, e);
  const H = (x, y) => Tiles.hash(x, y, 77);

  function grid(w, h, ch) { return Array.from({ length: h }, () => Array(w).fill(ch)); }
  function rect(g, x, y, w, h, ch) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i >= 0 && i < g[j].length) g[j][i] = ch; }
  function set(g, x, y, ch) { if (g[y] && x >= 0 && x < g[y].length) g[y][x] = ch; }
  function house(g, x, y, w, h, door) {
    const roof = Math.ceil(h / 2) + (h > 5 ? 0 : 0);
    rect(g, x, y, w, roof, '^');
    rect(g, x, y + roof, w, h - roof, '#');
    for (let i = x + 1; i < x + w - 1; i += 2) set(g, i, y + roof, 'w');
    (Array.isArray(door) ? door : [door]).forEach(d => set(g, x + d, y + h - 1, 'D'));
  }
  function scatter(g, ch, n, x, y, w, h, seed, on) {
    for (let k = 0; k < n; k++) {
      const i = x + Math.floor(Tiles.hash(k, seed, 3) * w), j = y + Math.floor(Tiles.hash(seed, k, 5) * h);
      if (g[j] && g[j][i] === (on || '.')) g[j][i] = ch;
    }
  }
  const rows = g => g.map(r => r.join(''));
  const door = (x, y, map, tx, ty, dir) => ({ x, y, run: G => G.go(map, tx, ty, dir || 'up') });

  // Custom-drawn props
  // The ferry hull sits under the deck tiles (x 45–54, rows 58–59); the cabin is a separate prop.
  function drawFerry(c, sx, sy) {
    const left = sx - 80, right = sx + 80, top = sy - 30, bottom = sy + 2;
    c.fillStyle = '#7e2a26'; c.fillRect(left - 4, bottom, right - left + 8, 8);
    c.fillStyle = '#5e1f1c'; c.fillRect(left, bottom + 8, right - left, 3);
    c.fillStyle = '#4f3420'; c.fillRect(left - 4, top - 3, right - left + 8, 3); c.fillRect(left - 4, top, 3, bottom - top); c.fillRect(right + 1, top, 3, bottom - top);
    c.fillStyle = '#f4f1e8'; c.fillRect(right - 10, bottom + 2, 8, 4);
  }
  function drawCabin(c, sx, sy) {
    c.fillStyle = '#e8e2d0'; c.fillRect(sx - 14, sy - 30, 28, 26);
    c.fillStyle = '#9bd3e8'; c.fillRect(sx - 10, sy - 26, 8, 6); c.fillRect(sx + 2, sy - 26, 8, 6);
    c.fillStyle = '#2b3a55'; c.fillRect(sx - 16, sy - 34, 32, 5);
    c.fillStyle = '#1a1a24'; c.fillRect(sx + 6, sy - 46, 4, 12);
    c.fillStyle = '#c0403a'; c.fillRect(sx + 10, sy - 46, 8, 5);
    c.fillStyle = '#6e4c2a'; c.fillRect(sx - 4, sy - 14, 8, 10);
  }
  function drawLighthouse(lit) {
    return (c, sx, sy, t) => {
      c.fillStyle = '#5a5a68'; c.fillRect(sx - 14, sy - 6, 28, 6);
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#c0403a' : '#f4f1e8'; c.fillRect(sx - 10 + i, sy - 18 - i * 10, 20 - i * 2, 12); }
      c.fillStyle = '#1a1a24'; c.fillRect(sx - 3, sy - 14, 6, 10);
      c.fillStyle = '#2d2d3a'; c.fillRect(sx - 7, sy - 80, 14, 3);
      c.fillStyle = lit ? '#ffe9a0' : '#3a3550'; c.fillRect(sx - 5, sy - 92, 10, 12);
      c.fillStyle = '#1a1a24'; c.fillRect(sx - 6, sy - 96, 12, 4); c.fillRect(sx - 1, sy - 100, 2, 4);
      if (lit) {
        const a = t * 1.2, len = 120;
        c.save(); c.globalAlpha = 0.18; c.fillStyle = '#fff6c8';
        c.beginPath(); c.moveTo(sx, sy - 86); c.lineTo(sx + Math.cos(a) * len - Math.sin(a) * 18, sy - 86 + Math.sin(a) * len * 0.5 + Math.cos(a) * 9); c.lineTo(sx + Math.cos(a) * len + Math.sin(a) * 18, sy - 86 + Math.sin(a) * len * 0.5 - Math.cos(a) * 9); c.fill();
        c.restore();
      }
    };
  }
  function drawStall(color) {
    return (c, sx, sy) => {
      c.fillStyle = '#5e3f22'; c.fillRect(sx - 14, sy - 26, 2, 26); c.fillRect(sx + 12, sy - 26, 2, 26);
      for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#f4f1e8' : color; c.fillRect(sx - 16 + i * 5, sy - 30, 5, 7); }
      c.fillStyle = '#8a6038'; c.fillRect(sx - 14, sy - 10, 28, 8);
      c.fillStyle = '#e8c24a'; c.fillRect(sx - 10, sy - 13, 4, 3); c.fillStyle = '#c0403a'; c.fillRect(sx - 4, sy - 13, 4, 3); c.fillStyle = '#5f8f4a'; c.fillRect(sx + 3, sy - 13, 5, 3);
    };
  }
  function drawFogWall(c, sx, sy, t) {
    for (let i = 0; i < 9; i++) {
      const x = sx + Math.sin(t * 0.7 + i) * 6 - 8 + (i % 3) * 6, y = sy - 10 - i * 7 + Math.cos(t + i) * 2;
      const g = c.createRadialGradient(x, y, 0, x, y, 16);
      g.addColorStop(0, 'rgba(230,236,244,0.9)'); g.addColorStop(1, 'rgba(230,236,244,0)');
      c.fillStyle = g; c.fillRect(x - 16, y - 16, 32, 32);
    }
  }
  function drawLog(c, sx, sy) {
    c.fillStyle = '#4f3420'; c.fillRect(sx - 8, sy - 34, 14, 36);
    c.fillStyle = '#7a5232'; c.fillRect(sx - 6, sy - 34, 4, 36);
    c.fillStyle = '#3c5e30'; c.fillRect(sx - 12, sy - 40, 10, 8); c.fillRect(sx + 2, sy - 6, 8, 6);
  }
  function drawGate(open) {
    return (c, sx, sy) => {
      c.fillStyle = '#41414c'; c.fillRect(sx - 10, sy - 72, 4, 76); c.fillRect(sx + 6, sy - 72, 4, 76);
      if (!open) { c.fillStyle = '#5e3f22'; c.fillRect(sx - 6, sy - 66, 12, 66); c.fillStyle = '#3a2a1a'; for (let y = 60; y > 0; y -= 12) c.fillRect(sx - 6, sy - y, 12, 2); }
      c.fillStyle = '#8a8a96'; c.fillRect(sx - 14, sy - 78, 28, 6);
      c.fillStyle = '#c0403a'; c.fillRect(sx - 2, sy - 84, 4, 6);
    };
  }
  function drawWindpump(on) {
    return (c, sx, sy, t) => {
      c.fillStyle = '#5e3f22'; c.fillRect(sx - 7, sy - 40, 14, 40);
      c.fillStyle = '#7a5232'; c.fillRect(sx - 5, sy - 40, 4, 40);
      c.fillStyle = '#3a2a1a'; c.fillRect(sx - 3, sy - 10, 6, 10);
      c.fillStyle = '#41414c'; c.fillRect(sx - 9, sy - 46, 18, 6);
      c.save(); c.translate(sx, sy - 44); c.rotate(on ? t * 2.4 : 0.4);
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.fillStyle = '#3a2a1a'; c.fillRect(-1, 0, 2, 26);
        c.fillStyle = on || i % 2 ? '#e8e2d0' : 'rgba(232,226,208,0.35)'; c.fillRect(2, 6, 6, 20);
      }
      c.restore();
      if (on) { c.fillStyle = '#9bd3e8'; c.fillRect(sx + 7, sy - 6, 6 + Math.sin(t * 6) * 2, 3); }
    };
  }
  function drawBoat(c, sx, sy, t) {
    const b = Math.sin(t * 2) * 1.5;
    c.fillStyle = '#5e3f22'; c.fillRect(sx - 14, sy - 6 + b, 28, 6);
    c.fillStyle = '#8a6038'; c.fillRect(sx - 16, sy - 9 + b, 32, 3);
    c.fillStyle = '#41414c'; c.fillRect(sx + 9, sy - 15 + b, 5, 7);
    c.fillStyle = '#c0403a'; c.fillRect(sx - 12, sy - 4 + b, 24, 1);
  }
  function drawStill(c, sx, sy, t) {
    c.save(); c.globalAlpha = 0.6 + 0.2 * Math.sin(t * 2);
    c.strokeStyle = '#c77dff'; c.lineWidth = 2;
    c.beginPath(); c.ellipse(sx, sy - 6, 22, 9, 0, 0, Math.PI * 2); c.stroke();
    c.restore();
    c.fillStyle = '#6a6a76'; [[-24, -8], [22, -8], [0, -18], [0, 4]].forEach(([dx, dy]) => c.fillRect(sx + dx - 3, sy + dy - 8, 6, 10));
  }

  // ───────────────────────── THE OVERWORLD ─────────────────────────
  const W = 100, Hh = 72;
  window.MAPS.world = {
    name: 'Lowmarsh',
    build(f) {
      const g = grid(W, Hh, '.');
      // north gorge + river
      rect(g, 0, 0, W, 3, '~');
      rect(g, 0, 3, W, 1, 'r');
      if (f.bridgeBuilt) rect(g, 48, 0, 4, 4, '='); else { rect(g, 48, 0, 4, 2, 'x'); rect(g, 48, 2, 4, 2, '='); }
      // gorge meadow
      scatter(g, ',', 50, 0, 4, 92, 6, 11);
      scatter(g, 'T', 26, 0, 4, 44, 6, 12);
      scatter(g, 'T', 26, 56, 4, 36, 6, 13);
      // the stream between the gorge and the village
      rect(g, 0, 10, 92, 2, '~');
      rect(g, 37, 10, 3, 2, 'a');
      if (f.ropeFixed) rect(g, 41, 10, 2, 2, 'z');   // Moss's crossing, beside the cracked arch
      // east sea + beach
      rect(g, 92, 0, 8, Hh, '~');
      rect(g, 88, 12, 4, 42, '_');
      // south: the river Wend
      rect(g, 0, 52, 92, 2, '_');
      rect(g, 0, 54, 92, Hh - 54, '~');
      scatter(g, 'R', 40, 0, 50, 46, 3, 14);
      scatter(g, 'R', 30, 54, 50, 34, 3, 15);
      // jetty + ferry
      rect(g, 49, 50, 2, 7, '=');
      if (f.plank) rect(g, 49, 57, 2, 1, 'p');
      rect(g, 45, 58, 10, 2, 'e');
      // village paths
      rect(g, 49, 12, 2, 38, ':');
      rect(g, 22, 26, 66, 2, ':');
      rect(g, 30, 42, 40, 2, ':');
      rect(g, 36, 19, 1, 7, ':'); rect(g, 63, 19, 1, 7, ':');
      rect(g, 36, 37, 1, 5, ':'); rect(g, 64, 37, 1, 5, ':'); rect(g, 44, 42, 1, 0, ':');
      // houses
      house(g, 33, 14, 8, 5, 3);      // bakery, door (36,18)
      house(g, 44, 12, 12, 7, [5, 6]); // town hall, doors (49,18),(50,18)
      house(g, 60, 14, 7, 5, 3);      // Mira's workshop, door (63,18)
      house(g, 33, 32, 7, 5, 3);      // clinic, door (36,36)
      house(g, 61, 32, 7, 5, 3);      // Wick's cottage, door (64,36)
      house(g, 41, 37, 6, 4, 2);      // Moss's house, door (43,40)
      house(g, 53, 37, 6, 4, 2);      // a cottage, door (55,40)
      set(g, 43, 41, ':'); set(g, 55, 41, ':');
      // gardens, fences, flowers
      rect(g, 31, 20, 1, 5, 'f'); rect(g, 41, 20, 1, 5, 'f');
      scatter(g, ',', 40, 31, 28, 38, 13, 21);
      scatter(g, ',', 30, 56, 20, 12, 5, 22);
      rect(g, 66, 38, 6, 1, 'f');
      rect(g, 44, 20, 16, 10, 'P');   // the village square
      rect(g, 49, 20, 2, 10, 'P');
      set(g, 53, 23, 'o');            // the well
      rect(g, 44, 31, 2, 1, 'h'); rect(g, 31, 30, 1, 1, 'h');
      rect(g, 66, 19, 3, 1, 'h'); rect(g, 57, 19, 1, 1, 'h'); rect(g, 32, 19, 1, 1, 'h');
      rect(g, 56, 44, 10, 5, 'v'); rect(g, 56, 44, 10, 1, 'f');   // Gran Ivy's allotments
      set(g, 67, 45, 'K'); set(g, 68, 47, 'K');
      rect(g, 30, 46, 8, 3, 'v');                                    // a vegetable patch
      rect(g, 72, 30, 3, 2, 'h'); rect(g, 71, 16, 2, 2, 'h');
      // village edge trees
      scatter(g, 'T', 30, 28, 12, 4, 40, 31);
      scatter(g, 'T', 30, 70, 12, 3, 13, 32);
      scatter(g, 'T', 18, 70, 29, 6, 22, 33);
      scatter(g, 'T', 12, 30, 44, 40, 6, 34);
      // east cliff road to Gull Point
      rect(g, 74, 12, 14, 1, 'r'); rect(g, 74, 42, 14, 1, 'r');
      scatter(g, 'r', 22, 74, 13, 14, 12, 41);
      scatter(g, 'r', 22, 74, 30, 14, 12, 42);
      rect(g, 76, 26, 12, 2, ':');
      rect(g, 80, 15, 8, 11, '.'); scatter(g, ',', 14, 80, 15, 8, 11, 43);
      rect(g, 83, 18, 4, 1, ':'); rect(g, 84, 18, 2, 8, ':');
      // Gull Point's landward cliff: the only way in is the road (fogged until chapter 2), not round the back
      rect(g, 74, 13, 1, 12, 'r'); rect(g, 74, 29, 1, 13, 'r');
      rect(g, 88, 42, 4, 1, 'r');                     // rocks across the beach below the point
      // west: meadows, the lock, the marsh
      scatter(g, 'T', 22, 0, 12, 28, 40, 51);
      scatter(g, ',', 40, 0, 30, 28, 20, 52);
      const flooded = f.chapter >= 4 && !f.drained;
      if (flooded) {
        // The Wend has burst its banks: the meadows are a lake with two islands.
        rect(g, 1, 31, 26, 11, '~'); rect(g, 14, 42, 13, 8, '~'); rect(g, 0, 50, 27, 4, '~');
        rect(g, 15, 32, 9, 8, '.');                       // Rowan's farm, now an island
        rect(g, 8, 31, 2, 11, f.pumpOn ? '=' : '~');      // the causeway shows once the pump runs
        rect(g, 3, 42, 10, 8, '.');                       // lockhouse island
      } else {
        rect(g, 8, 28, 2, 16, ':');
        rect(g, 2, 32, 5, 3, 'v'); rect(g, 12, 41, 3, 2, 'K');
      }
      rect(g, 0, 26, 30, 2, ':');
      rect(g, 8, 28, 2, 3, ':');
      house(g, 5, 44, 7, 5, 4);       // lockhouse, door (9,48)
      rect(g, 9, 49, 1, 3, ':');
      house(g, 16, 33, 7, 5, 3);      // Rowan's farmhouse, door (19,37)
      rect(g, 19, 38, 1, 2, ':');
      rect(g, 0, 12, 22, 14, 'R');
      rect(g, 2, 14, 6, 4, '~'); rect(g, 13, 19, 5, 3, '~'); rect(g, 3, 22, 4, 2, '~');
      rect(g, 6, 18, 5, 4, ',');
      rect(g, 10, 22, 2, 4, ':');
      // the west woods: the meadows are only reached along the road, past the fallen tree (until chapter 4)
      rect(g, 22, 25, 7, 1, 'T');
      rect(g, 29, 28, 1, 24, 'T'); rect(g, 29, 52, 1, 2, 'r');
      // the marsh edge: a wall of trees, with two fogged gaps
      rect(g, 1, 25, 21, 1, 'T'); rect(g, 10, 25, 2, 1, ':');
      rect(g, 22, 12, 1, 13, 'T'); rect(g, 22, 18, 1, 2, ':'); rect(g, 23, 18, 3, 2, ':');
      // map edges
      rect(g, 0, 4, 1, 48, 'T');

      const E = [];
      // ── the ferry (prologue)
      E.push({ id: 'ferry', x: 49.5, y: 59, draw: drawFerry, solid: false, under: true });
      E.push({ id: 'cabin', x: 45.5, y: 58.4, draw: drawCabin, w: 14, tall: 30 });
      E.push({ id: 'gull', x: 47.5, y: 58.6, sprite: 'gull', talk: S('gull'), dir: 'right' });
      if (!f.rook) E.push({ id: 'rookPerch', x: 52.5, y: 58.3, sprite: 'rook', talk: S('rookFirst'), solid: false, bob: 1 });
      E.push({ id: 'crates', x: 51, y: 51, sprite: 'crate', talk: S('crates') });
      E.push({ id: 'barrel1', x: 48, y: 51, sprite: 'barrel', talk: S('barrel') });
      E.push({ id: 'net', x: 46, y: 52, sprite: 'net', talk: S('net'), solid: false });
      // ── village people
      if (!(f.chapter >= 3)) E.push({ id: 'mayor', x: 51, y: 24, sprite: 'mayor', talk: S('mayor') });
      E.push({ id: 'board', x: 46, y: 22, sprite: 'board', talk: S('board'), tall: 12, w: 7 });
      E.push({ id: 'stall1', x: 57, y: 23, draw: drawStall('#3f6fb0'), talk: S('stall'), w: 12, tall: 30 });
      E.push({ id: 'stall2', x: 61, y: 23, draw: drawStall('#c0403a'), talk: S('stall2'), w: 12, tall: 30 });
      E.push({ id: 'tomas', x: 57, y: 21.9, sprite: 'villager', solid: false });
      E.push({ id: 'moss', x: f.ropeFixed ? 39 : 42, y: 12, sprite: 'moss', talk: S('moss') });
      E.push({ id: 'wick', x: 60, y: 28, sprite: 'wick', talk: S('wick'), wander: 2 });
      E.push({ id: 'lamp1', x: 47, y: 26, sprite: 'lamp', talk: S('lamp'), w: 3, tall: 12 });
      E.push({ id: 'lamp2', x: 52, y: 41, sprite: 'lamp', talk: S('lamp'), w: 3, tall: 12 });
      E.push({ id: 'lamp3', x: 66, y: 25, sprite: 'lamp', talk: S('lamp'), w: 3, tall: 12 });
      E.push({ id: 'lamp4', x: 34, y: 25, sprite: 'lamp', talk: S('lamp'), w: 3, tall: 12 });
      E.push({ id: 'kid1', x: 44, y: 30, sprite: 'kid', talk: S('kid1'), wander: 3 });
      E.push({ id: 'villager2', x: 39, y: 27, sprite: 'villager2', talk: S('villager2'), wander: 2 });
      E.push({ id: 'cat', x: 55, y: 30, sprite: 'cat', talk: S('cat'), wander: 4, speed: 14 });
      E.push({ id: 'pots', x: 61, y: 19, sprite: 'pot', talk: S('pots') });
      E.push({ id: 'pots2', x: 62, y: 19, sprite: 'pot', talk: S('pots') });
      E.push({ id: 'pots3', x: 65, y: 19, sprite: 'pot', talk: S('flowerpot') });
      E.push({ id: 'bench1', x: 45, y: 28.6, sprite: 'bench', talk: S('bench'), solid: false });
      E.push({ id: 'flowerbox1', x: 34, y: 19, sprite: 'flowerbox', talk: S('flowers'), solid: false });
      E.push({ id: 'sign1', x: 40, y: 13, sprite: 'sign', talk: S('signGorge') });
      E.push({ id: 'sign2', x: 71, y: 25, sprite: 'sign', talk: S('signEast') });
      E.push({ id: 'sign3', x: 30, y: 25, sprite: 'sign', talk: S('signWest') });
      E.push({ id: 'archSign', x: 38, y: 12.4, sprite: 'sign', talk: S('arch') });
      E.push({ id: 'duck1', x: 20, y: 54.3, sprite: 'duck', wander: 5, swim: true, talk: S('duck'), solid: false });
      E.push({ id: 'duck2', x: 70, y: 54.3, sprite: 'duck', wander: 5, swim: true, talk: S('duck'), solid: false });
      E.push({ id: 'duck3', x: 30, y: 10.5, sprite: 'duck', wander: 4, swim: true, talk: S('duck'), solid: false });
      // ── gorge
      E.push({ id: 'bramble', x: 49.5, y: f.brambleSpared ? 5 : 3, sprite: 'bramble', talk: S('bramble'), w: 8, tall: 20, hidden: f.chapter === 4 && !f.drained });
      // ── east road & Gull Point
      if (!f.eastOpen) for (let y = 25; y <= 28; y++) E.push({ id: 'fogE' + y, x: 74, y, draw: drawFogWall, talk: S('fogWall'), w: 8, h: 12 });
      E.push({ id: 'lighthouse', x: 85, y: 18, draw: drawLighthouse(!!f.lightOn), talk: S('lighthouseDoor'), w: 10, tall: 40 });
      E.push({ id: 'nell', x: 85, y: 30, sprite: 'nell', talk: S('nell') });
      E.push({ id: 'net2', x: 82, y: 31, sprite: 'net', talk: S('net'), solid: false });
      E.push({ id: 'boat', x: 89, y: 34, sprite: 'barrel', talk: S('barrel') });
      E.push({ id: 'gull1', x: 86, y: 14, sprite: 'seagull', wander: 6, fly: true, speed: 30, solid: false });
      E.push({ id: 'gull2', x: 80, y: 36, sprite: 'seagull', wander: 6, fly: true, speed: 30, solid: false });
      E.push({ id: 'jan', x: 78, y: 22, sprite: 'jan', talk: S('jan') });
      E.push({ id: 'pebble', x: 82, y: 24, sprite: 'kid', talk: S('kidKite'), wander: 2 });
      // ── clinic, cottages, allotments
      E.push({ id: 'ivy', x: 55, y: 45, sprite: 'ivy', talk: S('ivy') });   // at her allotment gate
      E.push({ id: 'kid2', x: 40, y: 45, sprite: 'kid', talk: S('kid2'), wander: 3 });
      // ── west
      if (!f.westOpen) E.push({ id: 'log', x: 29, y: 27, draw: drawLog, talk: S('log'), w: 8, h: 26, tall: 30 });
      E.push({ id: 'lockgate', x: 16, y: 57, draw: drawGate(!!f.lockOpen), talk: S('lockgate'), solid: false, h: 52, tall: 70 });
      E.push({ id: 'cog', x: f.lockOpen ? 12 : 15, y: 51, sprite: 'cog', talk: S('cog'), w: 7, tall: 18 });
      E.push({ id: 'sluice', x: 18, y: 51, sprite: 'sign', talk: S('sluice') });
      // ── the marsh (finale): Mira's scattered thoughts
      [[1, 17, 14], [2, 4, 19], [3, 14, 23]].forEach(([n, x, y]) => E.push({ id: 'echo' + n, x, y, sprite: 'mira', talk: S('echo' + n), alpha: 0.45, bob: 2, solid: false, hidden: !(f.marshOpen && !f['echo' + n + 'Done']) }));
      E.push({ id: 'wendSerpent', x: 10.8, y: 38, sprite: 'wend', talk: S('wend'), w: 9, tall: 14, bob: 2, hidden: !(f.chapter >= 4 && !f.drained) });
      // ── the meadows (chapter 4)
      const ch4 = f.chapter === 4 && !f.drained;
      E.push({ id: 'windpump', x: 4, y: 29.5, draw: drawWindpump(!!f.pumpOn), talk: S('windpump'), w: 8, tall: 56 });
      E.push({ id: 'gauge', x: 23, y: 30, sprite: 'sign', talk: S('gauge') });
      E.push({ id: 'rowan', x: f.drained ? 17 : 20, y: f.drained ? 39 : 29.4, sprite: 'rowan', talk: S('rowan'), hidden: !(f.chapter >= 4) });
      E.push({ id: 'brambleW', x: 27, y: 29.5, sprite: 'bramble', talk: S('brambleWest'), w: 8, tall: 20, hidden: !ch4 });
      E.push({ id: 'launch', x: 10.6, y: 34.6, draw: drawBoat, talk: S('launch'), w: 8, solid: false, under: true, hidden: !(ch4 && f.pumpOn) });
      E.push({ id: 'launch2', x: 13.6, y: 35.6, draw: drawBoat, talk: S('launchBack'), w: 8, solid: false, under: true, hidden: !(ch4 && f.launchDone) });
      E.push({ id: 'tansy', x: f.drained ? 20 : 21, y: f.drained ? 39.5 : 38.5, sprite: 'tansy', talk: S('tansy'), hidden: !(f.chapter >= 4) });
      E.push({ id: 'goat1', x: 14, y: 40, sprite: 'goat', talk: S('goat'), wander: 2, speed: 8 });
      E.push({ id: 'goat2', x: 23, y: 36, sprite: 'goat', talk: S('goat'), wander: 2, speed: 8 });
      E.push({ id: 'goat3', x: 16, y: 32, sprite: 'goat', talk: S('goat'), wander: 2, speed: 8 });
      E.push({ id: 'stake', x: 23, y: 32.4, sprite: 'sign', talk: S('surveyStake') });
      if (!f.marshOpen) [[10, 25], [11, 25], [22, 18], [22, 19]].forEach(([x, y]) => E.push({ id: 'fogW' + x + '_' + y, x, y, draw: drawFogWall, talk: S('fogMarsh'), w: 8, h: 12 }));
      E.push({ id: 'still', x: 8.5, y: 20, draw: drawStill, talk: S('still'), w: 14, solid: false, under: true });
      if (f.chapter >= 6 && !f.miraFreed) E.push({ id: 'miraFog', x: 8.5, y: 18.5, sprite: 'mira', talk: S('miraFogged'), alpha: 0.7 });
      return {
        rows: rows(g),
        fog: f.fogLevel != null ? f.fogLevel : 0.55,
        entities: E.filter(e => !e.hidden),
        triggers: [
          door(36, 18, 'bakery', 6, 8),
          { x: 49, y: 18, run: G => window.SCRIPTS.townhallDoor(G, 49) }, { x: 50, y: 18, run: G => window.SCRIPTS.townhallDoor(G, 50) },
          door(63, 18, 'workshop', 6, 8),
          door(36, 36, 'clinic', 5, 7),
          door(64, 36, 'wickhouse', 4, 6),
          door(43, 40, 'mosshouse', 4, 6), door(55, 40, 'cottage', 4, 6),
          door(9, 48, 'lockhouse', 5, 7),
          { x: 84, y: 19, w: 2, run: S('lighthouseDoor') },
          { x: 47, y: 46, w: 6, run: S('arriveVillage'), when: f => f.rook && !f.arrived },
          { x: 44, y: 4, w: 12, h: 3, run: S('gorgeApproach'), when: f => !f.brambleSpared },
          { x: 48, y: 0, w: 4, run: S('crossBridge'), when: f => f.bridgeBuilt },
          { x: 80, y: 26, h: 2, run: S('arriveGullPoint'), when: f => f.eastOpen && !f.gullPointSeen },
          { x: 24, y: 26, h: 5, run: S('arriveMeadows'), when: f => f.westOpen && !f.meadowsSeen },
          { x: 19, y: 37, run: G => (G.flag('drained') ? G.go('farmhouse', 5, 7, 'up') : SC.farmDoor(G)) },
          { x: 12, y: 18, h: 6, run: S('enterStill'), when: f => f.marshOpen && !f.stillSeen },
          { x: 10, y: 24, w: 2, run: S('enterStill'), when: f => f.marshOpen && !f.stillSeen },
        ],
      };
    },
  };

  // ───────────────────────── INTERIORS ─────────────────────────
  function room(w, h, floor) {
    const g = grid(w, h, floor || 'F');
    rect(g, 0, 0, w, 2, 'W');
    rect(g, 0, 0, 1, h, 'W'); rect(g, w - 1, 0, 1, h, 'W');
    rect(g, 0, h - 1, w, 1, 'W');
    return g;
  }
  const exit = (x, y, tx, ty) => ({ x, y, run: G => G.go('world', tx, ty, 'down') });

  window.MAPS.bakery = {
    name: "Fen's Bakery", rook: true,
    build(f) {
      const g = room(13, 10);
      rect(g, 2, 2, 3, 1, 'S'); rect(g, 8, 2, 2, 1, 'O'); rect(g, 10, 2, 2, 1, 'S');
      rect(g, 2, 5, 9, 1, 'c'); set(g, 6, 5, 'F');
      rect(g, 4, 7, 5, 1, 'u');
      set(g, 6, 9, 'X');
      return {
        rows: rows(g), fog: 0.05,
        entities: [
          { id: 'fen', x: 4, y: 4, sprite: 'fen', talk: S('fen') },
          { id: 'oven', x: 8.5, y: 2.8, sprite: 'page', talk: S('ovenPage'), hidden: !!f.pageQuadratics, solid: false, w: 4 },
          { id: 'bread', x: 3, y: 2.8, sprite: 'page', talk: S('bread'), hidden: true },
        ].filter(e => !e.hidden),
        triggers: [exit(6, 9, 36, 19)],
      };
    },
  };

  window.MAPS.workshop = {
    name: "Mira's Workshop", rook: true,
    build(f) {
      const g = room(13, 10);
      rect(g, 1, 2, 4, 1, 'B'); rect(g, 8, 2, 4, 1, 'B'); set(g, 6, 1, 'm');
      rect(g, 4, 4, 5, 1, 'd');
      set(g, 6, 9, 'X');
      return {
        rows: rows(g), fog: 0,
        entities: [
          { id: 'desk', x: 6, y: 4, sprite: 'page', talk: S('miraDesk'), solid: false, w: 10 },
          { id: 'miraHome', x: 7.5, y: 5.5, sprite: 'mira', talk: S('miraHome'), hidden: !f.miraFreed },
          { id: 'photo', x: 10, y: 4, sprite: 'page', talk: S('photo'), solid: false },
          { id: 'mapwall', x: 6, y: 2, sprite: 'page', talk: S('mapWall'), hidden: true },
          { id: 'stand', x: 2, y: 4, sprite: 'lamp', talk: S('theodoliteStand') },
          { id: 'shelf', x: 3, y: 2.6, sprite: 'page', talk: S('shelf'), solid: false, hidden: true },
        ].filter(e => !e.hidden),
        triggers: [exit(6, 9, 63, 19)],
      };
    },
  };

  window.MAPS.townhall = {
    name: 'Town Hall & Archive', rook: true,
    build(f) {
      const g = room(18, 12);
      rect(g, 1, 2, 5, 1, 'B'); rect(g, 12, 2, 5, 1, 'B');
      rect(g, 1, 5, 1, 4, 'B'); rect(g, 16, 5, 1, 4, 'B');
      rect(g, 6, 4, 6, 1, 'd');
      rect(g, 7, 7, 4, 3, 'u');
      set(g, 8, 11, 'X'); set(g, 9, 11, 'X');
      return {
        rows: rows(g), fog: 0,
        entities: [
          { id: 'pim', x: 9, y: 3, sprite: 'pim', talk: S('pim') },
          { id: 'mayorIn', x: 13, y: 6, sprite: 'mayor', talk: S('mayorHall'), hidden: f.chapter < 3 },
          { id: 'ledger', x: 3, y: 2.6, sprite: 'page', talk: S('ledger'), solid: false },
          { id: 'register', x: 14, y: 2.6, sprite: 'page', talk: S('register'), solid: false },
          { id: 'radar', x: 2, y: 6, sprite: 'page', talk: S('radar'), solid: false },
          { id: 'venn', x: 15, y: 6, sprite: 'page', talk: S('venn'), solid: false },
          { id: 'strix', x: 9, y: 6, sprite: 'owl', talk: S('strix'), w: 7, hidden: !(f.chapter >= 3 && !f.strixSpared) },
        ].filter(e => !e.hidden),
        triggers: [exit(8, 11, 49, 19), exit(9, 11, 50, 19)],
      };
    },
  };

  window.MAPS.clinic = {
    name: "Dr Sorrel's Clinic", rook: true,
    build(f) {
      const g = room(11, 9);
      rect(g, 1, 2, 3, 1, 'B'); rect(g, 7, 2, 3, 1, 'S');
      rect(g, 3, 4, 5, 1, 'c');
      set(g, 5, 8, 'X');
      return {
        rows: rows(g), fog: 0.05,
        entities: [{ id: 'sorrel', x: 5, y: 3, sprite: 'sorrel', talk: S('sorrel') }, { id: 'jars', x: 8, y: 2.8, sprite: 'page', talk: S('jars'), solid: false }],
        triggers: [exit(5, 8, 36, 37)],
      };
    },
  };

  window.MAPS.wickhouse = {
    name: "Wick's Cottage", rook: true,
    build() {
      const g = room(9, 8);
      rect(g, 1, 2, 2, 1, 'B'); set(g, 6, 2, 'O');
      set(g, 4, 7, 'X');
      return {
        rows: rows(g), fog: 0.05,
        entities: [{ id: 'lamps', x: 6, y: 4, sprite: 'lamp', talk: S('wickLamps') }, { id: 'wickbook', x: 2, y: 2.8, sprite: 'page', talk: S('wickBook'), solid: false }],
        triggers: [exit(4, 7, 64, 37)],
      };
    },
  };

  // Moss's house: his mum Hazel, a kitchen that smells of turnip soup, and (later) a driftwood boat
  window.MAPS.mosshouse = {
    name: "Moss's House", rook: true,
    build(f) {
      const g = room(9, 8);
      set(g, 1, 2, 'O'); rect(g, 6, 2, 2, 1, 'S');
      rect(g, 3, 4, 3, 1, 'c');
      set(g, 4, 7, 'X');
      const E = [
        { id: 'hazel', x: 2, y: 4, sprite: 'hazel', talk: S('hazel') },
        { id: 'soup', x: 1, y: 2.8, sprite: 'page', talk: S('mossSoup'), solid: false },
        { id: 'toyshelf', x: 6.5, y: 2.8, sprite: 'page', talk: S('mossShelf'), solid: false },
      ];
      return { rows: rows(g), fog: 0.05, entities: E, triggers: [exit(4, 7, 43, 41)] };
    },
  };

  // the cottage with the note on the door: Mr Dozer has gone to bed until the fog lifts
  window.MAPS.cottage = {
    name: 'The Quiet Cottage', rook: true,
    build(f) {
      const g = room(9, 8);
      rect(g, 1, 2, 2, 1, 'B'); set(g, 6, 2, 'O');
      rect(g, 5, 4, 3, 2, 'u');
      set(g, 4, 7, 'X');
      const E = [
        { id: 'dozer', x: f.miraFreed ? 3 : 6, y: f.miraFreed ? 4 : 4.4, sprite: 'dozer', talk: S('dozer') },
        { id: 'clock', x: 1.5, y: 2.8, sprite: 'page', talk: S('dozerClock'), solid: false },
      ];
      return { rows: rows(g), fog: 0.05, entities: E, triggers: [exit(4, 7, 55, 41)] };
    },
  };

  // Rowan's farmhouse, once the flood has gone down
  window.MAPS.farmhouse = {
    name: "Rowan's Farmhouse", rook: true,
    build(f) {
      const g = room(11, 9);
      set(g, 2, 2, 'O'); rect(g, 7, 2, 3, 1, 'S');
      rect(g, 3, 4, 4, 1, 'c');
      set(g, 5, 8, 'X');
      const E = [
        { id: 'goatphoto', x: 8, y: 2.8, sprite: 'page', talk: S('goatPhoto'), solid: false },
        { id: 'kettle', x: 2, y: 2.8, sprite: 'page', talk: S('kettle'), solid: false },
        { id: 'farmcat', x: 8, y: 6, sprite: 'cat', talk: S('cat'), wander: 2, speed: 10 },
      ];
      return { rows: rows(g), fog: 0.05, entities: E, triggers: [exit(5, 8, 19, 38)] };
    },
  };

  window.MAPS.lockhouse = {
    name: 'The Lockhouse', rook: true,
    build(f) {
      const g = room(11, 9);
      rect(g, 1, 2, 4, 1, 'B'); rect(g, 7, 2, 3, 1, 'd');
      set(g, 5, 8, 'X');
      return {
        rows: rows(g), fog: 0.1,
        entities: [{ id: 'lockLog', x: 8, y: 3, sprite: 'page', talk: S('lockLog'), solid: false }, { id: 'winch', x: 3, y: 4, sprite: 'barrel', talk: S('winch') },
          { id: 'dilys', x: 6, y: 5, sprite: 'dilys', talk: S('dilys'), hidden: !f.drained }].filter(e => !e.hidden),
        triggers: [exit(5, 8, 9, 49)],
      };
    },
  };

  window.MAPS.lighthouse = {
    name: 'Gull Point Lighthouse', rook: true,
    build(f) {
      const g = room(11, 10);
      rect(g, 1, 2, 2, 1, 'B'); rect(g, 4, 2, 3, 1, 'G'); set(g, 8, 2, 'H'); set(g, 9, 2, 'W');
      set(g, 5, 9, 'X');
      return {
        rows: rows(g), fog: 0.1, dark: f.lightOn ? 0 : 0.3,
        entities: [
          { id: 'ottoline', x: 7.5, y: 4, sprite: 'ottoline', talk: S('ottoline'), alpha: 0.8, bob: 2, hidden: !!f.gearsDone },
          { id: 'gears', x: 5, y: 2.9, sprite: 'page', talk: S('gears'), solid: false, w: 12 },
          { id: 'logbook', x: 2, y: 2.9, sprite: 'page', talk: S('keeperLog'), solid: false },
        ].filter(e => !e.hidden),
        triggers: [exit(5, 9, 85, 20), { x: 8, y: 2, run: S('stairs') }],
      };
    },
  };

  window.MAPS.lamproom = {
    name: 'The Lamp Room', rook: true,
    build(f) {
      const g = room(13, 11);
      set(g, 6, 5, 'L');
      set(g, 2, 2, 'M'); set(g, 10, 2, 'M');
      rect(g, 1, 3, 1, 6, 'W'); rect(g, 11, 3, 1, 6, 'W');
      set(g, 6, 10, 'H');
      return {
        rows: rows(g), fog: 0.05, dark: f.lightOn ? 0 : 0.4,
        entities: [
          { id: 'lamp', x: 6, y: 5, sprite: 'page', talk: S('lamp'), solid: false, hidden: true },
          { id: 'lampCore', x: 6, y: 5.6, draw: () => {}, talk: S('lampCore'), w: 8 },
          { id: 'shutters', x: 3, y: 4, sprite: 'page', talk: S('shutters'), solid: false },
          { id: 'frame', x: 9, y: 4, sprite: 'page', talk: S('lensFrame'), solid: false },
          { id: 'mirrors', x: 6, y: 2.6, sprite: 'page', talk: S('mirrors'), solid: false },
          { id: 'ottolineTop', x: 6, y: 7.5, sprite: 'ottoline', talk: S('ottolineTop'), alpha: 0.8, bob: 2, hidden: !!f.ottolineSpared },
          { id: 'ottolineAfter', x: 4, y: 6, sprite: 'ottoline', talk: S('ottolineAfter'), alpha: 0.85, bob: 2, hidden: !f.ottolineSpared },
        ].filter(e => !e.hidden),
        triggers: [{ x: 6, y: 10, run: G => G.go('lighthouse', 7, 2, 'down') }],
      };
    },
  };
})();
