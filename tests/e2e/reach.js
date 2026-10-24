// Where can the player actually walk? Flood-fill with the game's own collision, per chapter state.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
const fs = require('fs');
const base = { rook: true, plank: true, arrived: true, metMayor: true, fenDone: true };
const states = [
  ['ch1-start', { chapter: 1, ...base }, [50, 56]],
  ['ch1-rope', { chapter: 1, ...base, ropeFixed: true, wickDone: true }, [50, 30]],
  ['ch1-hob', { chapter: 1, ...base, ropeFixed: true, hobDone: true }, [50, 30]],
  ['ch1-bridge-out', { chapter: 1, ...base, blueprint: true }, [50, 30]],
  ['ch2', { chapter: 2, ...base, blueprint: true, ropeFixed: true, brambleSpared: true, eastOpen: true, ropeFixed: true }, [50, 30]],
  ['ch3', { chapter: 3, ...base, brambleSpared: true, eastOpen: true, lightOn: true, ottolineSpared: true, ropeFixed: true }, [50, 30]],
  ['ch4-flood', { chapter: 4, ...base, brambleSpared: true, eastOpen: true, lightOn: true, strixSpared: true, westOpen: true, ropeFixed: true }, [50, 30]],
  ['ch4-pump', { chapter: 4, ...base, brambleSpared: true, eastOpen: true, lightOn: true, strixSpared: true, westOpen: true, pumpOn: true, ropeFixed: true }, [50, 30]],
  ['ch5', { chapter: 5, ...base, brambleSpared: true, eastOpen: true, lightOn: true, strixSpared: true, westOpen: true, drained: true, ropeFixed: true }, [50, 30]],
  ['ch6', { chapter: 6, ...base, brambleSpared: true, eastOpen: true, lightOn: true, westOpen: true, drained: true, lockOpen: true, bridgeBuilt: true, marshOpen: true, ropeFixed: true }, [50, 30]],
];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(600);
  for (const [name, flags, start] of states) {
    await p.evaluate(f => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 50, y: 30, dir: 'up', flags: Object.assign({ fogLevel: 0 }, f), items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })), flags);
    await p.reload(); await p.waitForTimeout(600);
    await p.evaluate(() => Game.titleChoose('cont')); await p.waitForTimeout(600);
    const res = await p.evaluate(([sx, sy]) => {
      World.load('world', sx, sy, 'down');
      World.entities.forEach(e => { e.wander = 0; });
      const W = World.width * 16, H = World.height * 16, S = 2;
      const nx = W / S, ny = H / S, seen = new Uint8Array(nx * ny);
      const startX = sx * 16 + 8, startY = sy * 16 + 14;
      const q = [[Math.round(startX / S), Math.round(startY / S)]];
      seen[q[0][1] * nx + q[0][0]] = 1;
      while (q.length) {
        const [x, y] = q.pop();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const X = x + dx, Y = y + dy;
          if (X < 0 || Y < 0 || X >= nx || Y >= ny || seen[Y * nx + X]) continue;
          if (World.blocked(X * S, Y * S)) continue;
          seen[Y * nx + X] = 1; q.push([X, Y]);
        }
      }
      // which talkable things can't be talked to from anywhere you can stand?
      const stranded = [];
      for (const e of World.entities.filter(e => e.talk && !e.hidden)) {
        let ok = false;
        const x0 = Math.floor((e.px - 48) / S), x1 = Math.ceil((e.px + 48) / S), y0 = Math.floor((e.py - 64) / S), y1 = Math.ceil((e.py + 48) / S);
        for (let y = y0; y <= y1 && !ok; y++) for (let x = x0; x <= x1 && !ok; x++) {
          if (x < 0 || y < 0 || x >= nx || y >= ny || !seen[y * nx + x]) continue;
          World.player.x = x * S; World.player.y = y * S;
          for (const d of ['up', 'down', 'left', 'right']) { World.player.dir = d; if (World.facingEntity() === e) { ok = true; break; } }
        }
        if (!ok) stranded.push(e.id + '@' + (e.x) + ',' + (e.y));
      }
      // tile-level reachability: a tile counts if the player's feet can stand anywhere in it
      const tiles = [];
      for (let ty = 0; ty < World.height; ty++) { let row = ''; for (let tx = 0; tx < World.width; tx++) { let r = false; for (let yy = 0; yy < 8 && !r; yy++) for (let xx = 0; xx < 8 && !r; xx++) r = !!seen[(ty * 8 + yy) * nx + tx * 8 + xx]; row += r ? '1' : '0'; } tiles.push(row); }
      // render the whole map with the reachable area tinted
      World.setView(W, H); World.cam.x = 0; World.cam.y = 0; const fog = World.fog; World.fog = 0;
      const upd = World.updateCamera; World.updateCamera = () => {}; World.draw();
      const c = World.ctx; c.fillStyle = 'rgba(255,40,80,0.28)';
      for (let ty = 0; ty < World.height; ty++) for (let tx = 0; tx < World.width; tx++) if (tiles[ty][tx] === '1') c.fillRect(tx * 16, ty * 16, 16, 16);
      c.strokeStyle = 'rgba(255,255,255,0.15)'; c.lineWidth = 1;
      c.fillStyle = '#fff'; c.font = '9px monospace';
      for (let tx = 0; tx < World.width; tx += 10) { c.fillRect(tx * 16, 0, 1, H); c.fillText(tx, tx * 16 + 2, 10); }
      for (let ty = 0; ty < World.height; ty += 10) { c.fillRect(0, ty * 16, W, 1); c.fillText(ty, 2, ty * 16 + 10); }
      const img = World.canvas.toDataURL('image/png');
      World.updateCamera = upd; World.fog = fog;
      return { tiles, img, stranded };
    }, start);
    fs.writeFileSync('shots/reach-' + name + '.png', Buffer.from(res.img.split(',')[1], 'base64'));
    fs.writeFileSync('reach-' + name + '.txt', res.tiles.join('\n'));
    const R = (x0, y0, x1, y1) => { let n = 0; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (res.tiles[y] && res.tiles[y][x] === '1') n++; return n; };
    const at = (x, y) => res.tiles[y] && res.tiles[y][x] === '1';
    const want = {
      'gull point (lighthouse door)': [84, 20], 'Nell on the beach': [84, 31], 'Old Jan': [78, 23],
      'the meadows road west of the log': [20, 27], 'Rowan (flood bank)': [20, 30], 'lockhouse door': [9, 49], 'Cog at the lock': [14, 52],
      'the Still': [8, 21], 'the gorge meadow': [50, 8],
      'south bank (over the bridge)': [70, 66], 'Windmill Hill': [59, 77], "Pike's pond": [36, 71], "Bea's orchard": [81, 75], 'the cove': [82, 47],
    };
    const got = Object.entries(want).map(([k, [x, y]]) => (at(x, y) ? '✓ ' : '· ') + k).join(' | ');
    console.log(name.padEnd(15), got);
    console.log(''.padEnd(15), 'cannot talk to:', res.stranded.join(', ') || 'none');
    console.log(''.padEnd(15), 'east(x>=77):', R(77, 0, 99, 71), ' west(x<=27,y>=26):', R(0, 26, 27, 71), ' marsh(x<22,y12-24):', R(0, 12, 21, 24), ' north(y<=2):', R(0, 0, 99, 2), ' total:', res.tiles.join('').split('1').length - 1);
  }
  await b.close();
})();
