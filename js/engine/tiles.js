// Procedural 16×16 tiles. Each map character is a tile type; texture variation comes from a position hash.
(function () {
  'use strict';
  const TS = 16;
  const SOLID = new Set(['~', 'x', 'r', 'T', '^', '#', 'w', 'f', 'a', 'W', 'c', 'O', 'B', 'd', ' ', 'o', 'S', 'm', 'b', 'h', 'v', 'K', 'L', 'M', 'G']);
  const hash = (x, y, k) => { let h = (x * 374761393 + y * 668265263 + (k || 0) * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const cache = new Map();

  function px(c, color, x, y, w, h) { c.fillStyle = color; c.fillRect(x, y, w || 1, h || 1); }

  function grass(c, x, y) {
    px(c, '#4f7a42', 0, 0, TS, TS);
    for (let i = 0; i < 7; i++) px(c, hash(x, y, i) > 0.5 ? '#5d8a4c' : '#44693a', Math.floor(hash(x, y, i + 9) * 15), Math.floor(hash(x, y, i + 20) * 15), 1, 2);
  }

  const DRAW = {
    '.': grass,
    ',': (c, x, y) => { grass(c, x, y); const cols = ['#e9c46a', '#f4f1e8', '#d16f8a', '#9bd3e8']; for (let i = 0; i < 3; i++) { const fx = 2 + Math.floor(hash(x, y, i + 3) * 11), fy = 2 + Math.floor(hash(x, y, i + 7) * 11); px(c, cols[Math.floor(hash(x, y, i) * 4)], fx, fy, 2, 2); } },
    'R': (c, x, y) => { grass(c, x, y); for (let i = 0; i < 5; i++) { const rx = 1 + Math.floor(hash(x, y, i) * 13); px(c, '#7c8f4a', rx, 4 + (i % 3), 1, 11 - (i % 3)); px(c, '#6b4a2a', rx, 3 + (i % 3), 1, 2); } },
    ':': (c, x, y) => { px(c, '#a08a5c', 0, 0, TS, TS); for (let i = 0; i < 6; i++) px(c, hash(x, y, i) > 0.5 ? '#8d784e' : '#b29d6e', Math.floor(hash(x, y, i + 4) * 15), Math.floor(hash(x, y, i + 8) * 15), 2, 1); },
    '_': (c, x, y) => { px(c, '#c8b27c', 0, 0, TS, TS); for (let i = 0; i < 5; i++) px(c, '#b59f6a', Math.floor(hash(x, y, i) * 15), Math.floor(hash(x, y, i + 5) * 15)); },
    '=': (c) => { px(c, '#8a6038', 0, 0, TS, TS); for (let j = 0; j < TS; j += 4) px(c, '#5e3f22', 0, j, TS, 1); px(c, '#a5764a', 3, 1, 1, 2); px(c, '#a5764a', 11, 9, 1, 2); },
    'p': (c) => { px(c, '#2f5d7c', 0, 0, TS, TS); px(c, '#9a6e40', 3, 0, 10, TS); px(c, '#6e4c2a', 3, 0, 1, TS); px(c, '#6e4c2a', 12, 0, 1, TS); },
    'e': (c) => { px(c, '#b08a5a', 0, 0, TS, TS); for (let i = 0; i < TS; i += 5) px(c, '#8c6a42', i, 0, 1, TS); },
    'x': (c, x, y) => { px(c, '#2f5d7c', 0, 0, TS, TS); px(c, '#6e4c2a', 0, 2, 9 + Math.floor(hash(x, y) * 6), 3); px(c, '#6e4c2a', 0, 9, 5 + Math.floor(hash(x, y, 2) * 8), 3); },
    'z': (c) => { px(c, '#2f5d7c', 0, 0, TS, TS); px(c, '#c8a86a', 0, 4, TS, 1); px(c, '#c8a86a', 0, 11, TS, 1); for (let i = 1; i < TS; i += 3) px(c, '#9a7a4a', i, 5, 2, 6); },
    'r': (c, x, y) => { px(c, '#5a5a68', 0, 0, TS, TS); px(c, '#71717f', 1 + Math.floor(hash(x, y) * 6), 2, 6, 3); px(c, '#71717f', 6, 9 + Math.floor(hash(x, y, 1) * 3), 7, 3); px(c, '#41414c', 0, 15, TS, 1); },
    'T': (c, x, y) => { grass(c, x, y); px(c, '#4f3420', 6, 10, 4, 6); px(c, '#2f4a28', 1, 1, 14, 10); px(c, '#3c5e30', 2, 0, 12, 9); px(c, '#4f7a3e', 4, 2, 5, 3); px(c, '#2f4a28', 0, 4, 16, 4); },
    '^': (c, x, y) => { px(c, '#8c3b2e', 0, 0, TS, TS); for (let j = 0; j < TS; j += 4) { px(c, '#6e2c22', 0, j + 3, TS, 1); for (let i = (j / 4) % 2 ? 0 : 4; i < TS; i += 8) px(c, '#6e2c22', i, j, 1, 3); } },
    '#': (c) => { px(c, '#c4a983', 0, 0, TS, TS); px(c, '#a88d69', 0, 15, TS, 1); px(c, '#d4bb96', 0, 0, TS, 1); },
    'w': (c) => { DRAW['#'](c); px(c, '#3a2a1a', 3, 3, 10, 9); px(c, '#9bd3e8', 4, 4, 8, 7); px(c, '#3a2a1a', 7, 4, 1, 7); px(c, '#e8f6ff', 5, 5, 2, 2); },
    'D': (c) => { DRAW['#'](c); px(c, '#3a2a1a', 2, 1, 12, 15); px(c, '#6e4c2a', 3, 2, 10, 14); px(c, '#e8c24a', 10, 9, 2, 2); },
    'f': (c, x, y) => { grass(c, x, y); px(c, '#7a5232', 0, 5, TS, 2); px(c, '#7a5232', 0, 10, TS, 2); px(c, '#5e3f22', 2, 3, 2, 12); px(c, '#5e3f22', 12, 3, 2, 12); },
    'a': (c, x, y) => { px(c, '#2f5d7c', 0, 0, TS, TS); px(c, '#8a8a96', 0, 0, TS, 9); px(c, '#6a6a76', 0, 8, TS, 2); for (let i = 0; i < TS; i += 5) px(c, '#6a6a76', i + (y % 2) * 2, 0, 1, 8); px(c, '#3a3a46', 6 + Math.floor(hash(x, y) * 4), 2, 1, 6); for (let i = 0; i < TS; i += 4) px(c, (i / 4) % 2 ? '#f4f1e8' : '#c0403a', i, 10, 4, 2); },   // cracked arch, taped off
    'P': (c, x, y) => { px(c, '#9a948a', 0, 0, TS, TS); px(c, '#87817a', 0, 7, TS, 1); px(c, '#87817a', 0, 15, TS, 1); px(c, '#87817a', (y % 2) * 8 + 3, 0, 1, 7); px(c, '#87817a', (y % 2) * 8 + 11 - 8 * (y % 2) * 0, 8, 1, 7); px(c, '#aaa49a', 1 + (x % 3) * 4, 2, 3, 2); },
    'h': (c, x, y) => { grass(c, x, y); px(c, '#2f4a28', 1, 3, 14, 12); px(c, '#3c5e30', 2, 2, 12, 11); px(c, '#4f7a3e', 4, 4, 4, 3); px(c, '#4f7a3e', 9, 7, 3, 3); if (hash(x, y) > 0.6) { px(c, '#e9c46a', 6, 6, 2, 2); px(c, '#f4f1e8', 10, 4, 1, 1); } },
    'v': (c, x, y) => { px(c, '#6b4a2a', 0, 0, TS, TS); for (let j = 1; j < TS; j += 5) { px(c, '#5a3d22', 0, j + 3, TS, 1); for (let i = 1; i < TS; i += 4) { px(c, '#5f8f4a', i, j, 2, 3); px(c, hash(x * 3 + i, y + j) > 0.7 ? '#e07b39' : '#7fb35a', i + 1, j, 1, 1); } } },
    'K': (c, x, y) => { grass(c, x, y); px(c, '#c8a84a', 1, 4, 14, 11); px(c, '#e0c060', 2, 3, 12, 4); px(c, '#a88a3a', 2, 9, 12, 1); px(c, '#a88a3a', 3, 12, 10, 1); },
    'H': (c) => { px(c, '#4a3a4a', 0, 0, TS, TS); for (let j = 0; j < 4; j++) { px(c, '#8a6038', 2 + j, 2 + j * 3, 12 - j * 2, 2); px(c, '#5e3f22', 2 + j, 4 + j * 3, 12 - j * 2, 1); } },
    'L': (c) => { px(c, '#3a3550', 0, 0, TS, TS); px(c, '#8a8a96', 2, 2, 12, 12); px(c, '#ffe9a0', 4, 4, 8, 8); px(c, '#fff8d8', 6, 6, 4, 4); },
    'M': (c) => { px(c, '#4a3a4a', 0, 0, TS, TS); px(c, '#b8d8ef', 3, 1, 10, 13); px(c, '#e8f6ff', 4, 2, 3, 6); px(c, '#5a5a68', 2, 14, 12, 2); },
    'G': (c) => { px(c, '#4a3a4a', 0, 0, TS, TS); px(c, '#8a6a2a', 2, 2, 12, 12); px(c, '#c8a84a', 4, 4, 8, 8); px(c, '#5a4a1a', 7, 1, 2, 14); px(c, '#5a4a1a', 1, 7, 14, 2); px(c, '#3a3550', 6, 6, 4, 4); },
    'o': (c) => { px(c, '#9a948a', 0, 0, TS, TS); px(c, '#5a5a68', 1, 4, 14, 11); px(c, '#7a7a88', 2, 4, 12, 3); px(c, '#1a2a3a', 3, 6, 10, 6); px(c, '#2f5d7c', 4, 8, 8, 3); px(c, '#4f3420', 2, 0, 2, 7); px(c, '#4f3420', 12, 0, 2, 7); px(c, '#8c3b2e', 0, 0, 16, 2); px(c, '#a5764a', 7, 2, 2, 5); },
    'F': (c, x, y) => { px(c, '#7a5a3a', 0, 0, TS, TS); px(c, '#6a4c30', 0, 7, TS, 1); px(c, '#6a4c30', (x * 5) % 16, 0, 1, 7); px(c, '#6a4c30', (x * 5 + 8) % 16, 8, 1, 8); },
    'u': (c) => { px(c, '#8c3b2e', 0, 0, TS, TS); px(c, '#c0603a', 2, 2, 12, 12); px(c, '#8c3b2e', 4, 4, 8, 8); px(c, '#e8c24a', 7, 7, 2, 2); },
    'X': (c) => { px(c, '#7a5a3a', 0, 0, TS, TS); px(c, '#3c5e30', 2, 4, 12, 10); px(c, '#4f7a3e', 3, 5, 10, 8); },
    'W': (c) => { px(c, '#4a3a4a', 0, 0, TS, TS); px(c, '#5a4a5a', 0, 0, TS, 2); px(c, '#3a2a3a', 0, 14, TS, 2); },
    'c': (c) => { px(c, '#7a5232', 0, 0, TS, TS); px(c, '#a5764a', 0, 0, TS, 4); px(c, '#4f3420', 0, 15, TS, 1); },
    'O': (c) => { px(c, '#5a5a68', 0, 0, TS, TS); px(c, '#2a2a34', 3, 5, 10, 8); px(c, '#e07b39', 4, 9, 8, 3); px(c, '#e8c24a', 6, 10, 4, 1); },
    'S': (c) => { px(c, '#5e3f22', 0, 0, TS, TS); px(c, '#3a2a1a', 0, 7, TS, 1); for (let i = 1; i < 15; i += 5) { px(c, '#d8a050', i, 2, 4, 4); px(c, '#c08a3a', i + 1, 10, 4, 4); } },
    'B': (c, x, y) => { px(c, '#4f3420', 0, 0, TS, TS); const cols = ['#c0403a', '#3f6fb0', '#5f8f4a', '#e8c24a', '#7d5ea8']; for (let i = 1; i < 15; i += 2) { px(c, cols[Math.floor(hash(x, y, i) * 5)], i, 2, 1, 5); px(c, cols[Math.floor(hash(x, y, i + 30) * 5)], i, 9, 1, 5); } },
    'd': (c) => { px(c, '#8a6038', 0, 0, TS, TS); px(c, '#a5764a', 0, 0, TS, 3); px(c, '#5e3f22', 0, 13, TS, 3); },
    'm': (c) => { DRAW.W(c); px(c, '#e8dcb8', 2, 2, 12, 10); px(c, '#9bd3e8', 4, 4, 5, 3); px(c, '#5f8f4a', 8, 6, 4, 4); px(c, '#c0403a', 6, 8, 1, 1); },
    'b': (c, x, y) => { grass(c, x, y); px(c, '#3a2a1a', 2, 0, 12, 14); px(c, '#e8dcb8', 3, 1, 10, 8); px(c, '#c0403a', 4, 2, 4, 1); px(c, '#14141c', 4, 4, 7, 1); px(c, '#14141c', 4, 6, 5, 1); px(c, '#3a2a1a', 4, 12, 2, 4); px(c, '#3a2a1a', 10, 12, 2, 4); },
    ' ': (c) => { px(c, '#000', 0, 0, TS, TS); },
  };

  function tileCanvas(ch, x, y) {
    const varies = ['.', ',', 'R', ':', '_', 'x', 'r', 'T', 'f', 'a', 'o', 'F', 'B'].includes(ch);
    const key = ch + (varies ? '|' + (x % 8) + ',' + (y % 8) : '');
    if (cache.has(key)) return cache.get(key);
    const cv = document.createElement('canvas');
    cv.width = TS; cv.height = TS;
    (DRAW[ch] || DRAW['.'])(cv.getContext('2d'), x % 8, y % 8);
    cache.set(key, cv);
    return cv;
  }

  // Water is animated, so it's drawn live.
  function drawWater(ctx, sx, sy, x, y, t) {
    ctx.fillStyle = '#2f5d7c';
    ctx.fillRect(sx, sy, TS, TS);
    const phase = Math.floor(t * 2 + hash(x, y) * 4) % 4;
    ctx.fillStyle = '#4a7fa0';
    ctx.fillRect(sx + ((x * 7 + phase * 3) % 12), sy + 4 + (y % 2) * 6, 4, 1);
    ctx.fillRect(sx + ((x * 3 + phase * 2 + 6) % 12), sy + 10 - (y % 2) * 5, 3, 1);
  }

  function draw(ctx, ch, sx, sy, x, y, t) {
    if (ch === '~') return drawWater(ctx, sx, sy, x, y, t);
    ctx.drawImage(tileCanvas(ch, x, y), sx, sy);
  }

  window.Tiles = { TS, SOLID, draw, hash };
})();
