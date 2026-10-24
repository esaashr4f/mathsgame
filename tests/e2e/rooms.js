const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
const fs = require('fs');
const states = {
  ch1: { chapter: 1, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true },
  ch3: { chapter: 3, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, brambleSpared: true, eastOpen: true, lightOn: true, ottolineSpared: true, ropeFixed: true, hallOpen: true },
  ch5: { chapter: 5, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, brambleSpared: true, eastOpen: true, lightOn: true, strixSpared: true, westOpen: true, drained: true, ropeFixed: true, hallOpen: true },
  ch6: { chapter: 6, rook: true, plank: true, arrived: true, brambleSpared: true, eastOpen: true, lightOn: true, westOpen: true, drained: true, lockOpen: true, bridgeBuilt: true, marshOpen: true, ropeFixed: true, hallOpen: true },
};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(600);
  for (const [st, flags] of Object.entries(states)) {
    await p.evaluate(f => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 50, y: 30, dir: 'up', flags: Object.assign({ fogLevel: 0 }, f), items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })), flags);
    await p.reload(); await p.waitForTimeout(500);
    await p.evaluate(() => Game.titleChoose('cont')); await p.waitForTimeout(500);
    const out = await p.evaluate(() => {
      const report = [];
      const flood = (sx, sy) => {
        const W = World.width * 16, H = World.height * 16, S = 2, nx = W / S, ny = H / S, seen = new Uint8Array(nx * ny);
        const q = [[Math.round(sx / S), Math.round(sy / S)]];
        if (World.blocked(sx, sy)) return { seen, nx, ny, S, startBlocked: true };
        seen[q[0][1] * nx + q[0][0]] = 1;
        while (q.length) { const [x, y] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= nx || Y >= ny || seen[Y * nx + X] || World.blocked(X * S, Y * S)) continue; seen[Y * nx + X] = 1; q.push([X, Y]); } }
        return { seen, nx, ny, S };
      };
      const trigReach = (R, t) => { for (let ty = t.y; ty < t.y + (t.h || 1); ty++) for (let tx = t.x; tx < t.x + (t.w || 1); tx++) for (let yy = 0; yy < 8; yy++) for (let xx = 0; xx < 8; xx++) if (R.seen[(ty * 8 + yy) * R.nx + tx * 8 + xx]) return true; return false; };
      for (const m of Object.keys(MAPS)) {
        // enter the room the way the game does: find the world door leading here, else use its exit trigger
        World.load(m, 1, 1, 'down');
        World.entities.forEach(e => { e.wander = 0; });
        let start = null;
        if (m === 'world') start = [50 * 16 + 8, 30 * 16 + 14];
        else {
          // stand one tile above the exit trigger (exits are on the bottom wall)
          const ex = World.triggers[0];
          if (ex) start = [ex.x * 16 + 8, (ex.y - 1) * 16 + 14];
        }
        if (!start) { report.push(m + ': no way in found'); continue; }
        const R = flood(start[0], start[1]);
        if (R.startBlocked) { report.push(m + ': the entry spot is blocked'); continue; }
        // talkable?
        const bad = [];
        for (const e of World.entities.filter(e => e.talk && !e.hidden)) {
          let ok = false;
          for (let y = Math.floor((e.py - 64) / 2); y <= Math.ceil((e.py + 48) / 2) && !ok; y++) for (let x = Math.floor((e.px - 48) / 2); x <= Math.ceil((e.px + 48) / 2) && !ok; x++) {
            if (x < 0 || y < 0 || x >= R.nx || y >= R.ny || !R.seen[y * R.nx + x]) continue;
            World.player.x = x * 2; World.player.y = y * 2;
            for (const d of ['up', 'down', 'left', 'right']) { World.player.dir = d; if (World.facingEntity() === e) { ok = true; break; } }
          }
          if (!ok) bad.push(e.id);
        }
        // triggers (doors) that can't be stepped on, among the ones active now
        const badT = World.triggers.filter(t => (!t.when || t.when(World.flags()))).filter(t => !trigReach(R, t)).map(t => t.x + ',' + t.y);
        // people standing on something solid (roofs, walls, water), unless they fly or swim
        const onSolid = World.entities.filter(e => !e.hidden && e.sprite && !e.fly && !e.swim && Tiles.SOLID.has(World.tile(Math.floor(e.px / 16), Math.floor((e.py - 2) / 16)))).map(e => e.id + '(' + World.tile(Math.floor(e.px / 16), Math.floor((e.py - 2) / 16)) + ')');
        if (bad.length || badT.length || onSolid.length) report.push(m + ':' + (bad.length ? ' cannot talk to ' + bad.join(', ') + '.' : '') + (badT.length ? ' unreachable doors/triggers at ' + badT.join(' ') + '.' : '') + (onSolid.length ? ' standing on solid tiles: ' + onSolid.join(', ') + '.' : ''));
      }
      return report;
    });
    console.log('== ' + st); console.log(out.join('\n') || 'all fine');
  }
  await b.close();
})();
