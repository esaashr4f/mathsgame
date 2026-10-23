// The overworld: input, tile maps, movement and collision, NPCs, triggers, camera, the companion and the fog.
(function () {
  'use strict';
  const TS = Tiles.TS;
  // The view in game pixels. 384×288 on a desktop; on a phone it takes the screen's shape (see World.setView).
  let VW = 384, VH = 288;

  // ───────── input ─────────
  const keys = {};
  const KEYMAP = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
  const typing = () => { const a = document.activeElement; return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA'); };
  document.addEventListener('keydown', e => {
    if (typing()) return;
    const k = KEYMAP[e.key.toLowerCase()];
    if (k) { keys[k] = true; if (e.key.startsWith('Arrow')) e.preventDefault(); }
    if (!World.active || World.locked || e.repeat) return;
    const key = e.key.toLowerCase();
    if (key === 'z' || key === 'enter' || key === ' ') { e.preventDefault(); World.interact(); }
    if (key === 'c' || key === 'escape' || key === 'x') { e.preventDefault(); window.Game && Game.openMenu(); }
    if (key === 'r' || key === 'q') { e.preventDefault(); window.Game && Game.askRook(); }
  });
  document.addEventListener('keyup', e => { const k = KEYMAP[e.key.toLowerCase()]; if (k) keys[k] = false; });
  window.addEventListener('blur', () => Object.keys(keys).forEach(k => (keys[k] = false)));

  // ───────── fog layer ─────────
  let fogCanvas = null;
  function makeFog() {
    const c = document.createElement('canvas');
    c.width = 768; c.height = 576;
    const x = c.getContext('2d');
    for (let i = 0; i < 60; i++) {
      const fx = Tiles.hash(i, 1) * c.width, fy = Tiles.hash(i, 2) * c.height, r = 30 + Tiles.hash(i, 3) * 70;
      const g = x.createRadialGradient(fx, fy, 0, fx, fy, r);
      g.addColorStop(0, 'rgba(225,232,240,0.55)');
      g.addColorStop(1, 'rgba(225,232,240,0)');
      x.fillStyle = g;
      x.fillRect(fx - r, fy - r, r * 2, r * 2);
    }
    return c;
  }

  const World = {
    canvas: null, ctx: null, active: false, locked: false,
    mapId: null, map: null, rows: [], entities: [], triggers: [],
    player: { x: 0, y: 0, dir: 'down', moving: false, frame: 0, ft: 0 },
    trail: [], cam: { x: 0, y: 0 }, t: 0, lastTrigger: null, last: 0, onFrame: null,

    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;
      fogCanvas = makeFog();
      const loop = now => {
        const dt = Math.min(0.05, (now - this.last) / 1000 || 0);
        this.last = now;
        if (this.active) { this.update(dt); this.draw(); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    // Resize the view (in game pixels). The canvas is scaled up by CSS.
    setView(w, h) {
      w = Math.round(w); h = Math.round(h);
      if (w === VW && h === VH) return;
      VW = w; VH = h;
      this.canvas.width = w; this.canvas.height = h;
      this.ctx.imageSmoothingEnabled = false;
      if (this.map) { this.updateCamera(); this.draw(); }
    },
    get view() { return { w: VW, h: VH }; },

    flags() { return Game.save.flags; },

    load(mapId, tx, ty, dir) {
      this.mapId = mapId;
      this.map = MAPS[mapId];
      this.player.x = tx * TS + TS / 2;
      this.player.y = ty * TS + TS - 2;
      if (dir) this.player.dir = dir;
      this.trail = [];
      this.refresh();
      this.lastTrigger = this.triggerAt(this.player.x, this.player.y);
      this.updateCamera();
    },

    // Rebuild tiles/NPCs from story flags (e.g. a plank appears once you've solved the gangplank problem).
    refresh() {
      const built = this.map.build(this.flags());
      this.rows = built.rows;
      this.fog = built.fog || 0;
      this.dark = built.dark || 0;
      this.entities = (built.entities || []).map(e => Object.assign({ dir: 'down', solid: true, w: 6, h: 5 }, e, {
        px: e.x * TS + TS / 2, py: e.y * TS + TS - 2,
      }));
      this.triggers = built.triggers || [];
      this.width = Math.max(...this.rows.map(r => r.length));
      this.height = this.rows.length;
    },

    tile(tx, ty) {
      if (ty < 0 || ty >= this.rows.length || tx < 0 || tx >= (this.rows[ty] || '').length) return ' ';
      return this.rows[ty][tx];
    },

    blocked(x, y, ignore) {
      const pts = [[x - 5, y - 4], [x + 5, y - 4], [x - 5, y], [x + 5, y]];
      for (const [px, py] of pts) {
        if (Tiles.SOLID.has(this.tile(Math.floor(px / TS), Math.floor(py / TS)))) return true;
      }
      for (const e of this.entities) {
        if (!e.solid || e === ignore) continue;
        if (Math.abs(x - e.px) < 5 + e.w && y > e.py - e.h - 4 && y - 4 < e.py) return true;
      }
      return false;
    },

    triggerAt(x, y) {
      const tx = Math.floor(x / TS), ty = Math.floor((y - 2) / TS);
      return this.triggers.find(t => tx >= t.x && tx < t.x + (t.w || 1) && ty >= t.y && ty < t.y + (t.h || 1)) || null;
    },

    update(dt) {
      this.t += dt;
      const p = this.player;
      p.moving = false;
      if (!this.locked) {
        let dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
        if (dx || dy) {
          if (Math.abs(dx) >= Math.abs(dy) && dx) p.dir = dx > 0 ? 'right' : 'left';
          else if (dy) p.dir = dy > 0 ? 'down' : 'up';
          const len = Math.hypot(dx, dy), sp = 78 * dt;
          const nx = p.x + dx / len * sp, ny = p.y + dy / len * sp;
          if (!this.blocked(nx, p.y)) p.x = nx;
          if (!this.blocked(p.x, ny)) p.y = ny;
          p.moving = true;
        }
        const trig = this.triggerAt(p.x, p.y);
        if (trig && trig !== this.lastTrigger && (!trig.when || trig.when(this.flags()))) {
          this.lastTrigger = trig;
          this.run(trig.run);
        } else if (!trig) this.lastTrigger = null;
      }
      if (p.moving) {
        p.ft += dt;
        if (p.ft > 0.16) { p.ft = 0; p.frame = 1 - p.frame; }
        const last = this.trail[this.trail.length - 1];
        if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 1.5) this.trail.push({ x: p.x, y: p.y, dir: p.dir });
        if (this.trail.length > 60) this.trail.shift();
      } else p.frame = 0;
      this.entities.forEach(e => e.wander && this.wanderStep(e, dt));
      this.updateCamera();
      if (this.onFrame) this.onFrame(dt);
    },

    // Ambient life: villagers, cats and ducks potter about near home.
    wanderStep(e, dt) {
      if (!e.home) e.home = { x: e.px, y: e.py };
      e.wt = (e.wt || Math.random() * 2) - dt;
      if (e.wt <= 0) {
        e.wt = 1.5 + Math.random() * 3;
        const r = e.wander * Tiles.TS;
        e.target = Math.random() < 0.35 ? null : { x: e.home.x + (Math.random() * 2 - 1) * r, y: e.home.y + (Math.random() * 2 - 1) * r };
      }
      if (!e.target || (this.locked && !e.fly)) return;
      const dx = e.target.x - e.px, dy = e.target.y - e.py, d = Math.hypot(dx, dy);
      if (d < 1) { e.target = null; return; }
      const sp = (e.speed || 18) * dt, nx = e.px + dx / d * sp, ny = e.py + dy / d * sp;
      const tileOk = (x, y) => { const ch = this.tile(Math.floor(x / Tiles.TS), Math.floor((y - 2) / Tiles.TS)); return e.fly ? true : e.swim ? ch === '~' : !Tiles.SOLID.has(ch); };
      const nearPlayer = Math.hypot(nx - this.player.x, ny - this.player.y) < 14;
      if (tileOk(nx, ny) && (e.fly || !nearPlayer)) {
        if (Math.abs(dx) > Math.abs(dy)) e.dir = dx > 0 ? 'right' : 'left'; else e.dir = dy > 0 ? 'down' : 'up';
        e.px = nx; e.py = ny; e.step = (e.step || 0) + dt;
      } else e.target = null;
    },

    updateCamera() {
      const p = this.player, mw = this.width * TS, mh = this.height * TS;
      this.cam.x = mw <= VW ? (mw - VW) / 2 : Math.max(0, Math.min(mw - VW, p.x - VW / 2));
      this.cam.y = mh <= VH ? (mh - VH) / 2 : Math.max(0, Math.min(mh - VH, p.y - VH / 2));
    },

    facingEntity() {
      const p = this.player;
      const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir];
      const fx = p.x + d[0] * 13, fy = p.y - 3 + d[1] * 13;
      return this.entities.find(e => e.talk && Math.abs(fx - e.px) < 7 + e.w && fy > e.py - e.h - 10 && fy < e.py + 6);
    },

    interact() {
      const e = this.facingEntity();
      if (e) {
        // NPCs turn to face you.
        const opp = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (Sprites.isPerson(e.sprite)) e.dir = opp[this.player.dir];
        this.run(G => e.talk(G, e));
      }
    },

    async run(fn) {
      if (this.locked) return;
      this.locked = true;
      Object.keys(keys).forEach(k => (keys[k] = false));
      // A side quest you walk away from ends the conversation early (Game.LEAVE); nothing is lost.
      try { await fn(Game.G); } catch (err) { if (err !== Game.LEAVE) console.error(err); else if (Game.leftQuest) Game.leftQuest(); }
      if (Game.afterScript) { try { await Game.afterScript(); } catch (err) { console.error(err); } }
      this.locked = false;
    },

    rookPos() {
      const tr = this.trail;
      const p = tr.length > 16 ? tr[tr.length - 16] : tr[0] || { x: this.player.x - 12, y: this.player.y };
      return { x: p.x, y: p.y, dir: this.player.x >= p.x ? 'right' : 'left' };
    },

    draw() {
      const c = this.ctx, cam = this.cam;
      c.fillStyle = '#000';
      c.fillRect(0, 0, VW, VH);
      const x0 = Math.floor(cam.x / TS), y0 = Math.floor(cam.y / TS);
      for (let ty = y0; ty <= y0 + VH / TS + 1; ty++) {
        for (let tx = x0; tx <= x0 + VW / TS + 1; tx++) {
          const ch = this.tile(tx, ty);
          if (ch === ' ' && (ty < 0 || ty >= this.height)) continue;
          Tiles.draw(c, ch, Math.round(tx * TS - cam.x), Math.round(ty * TS - cam.y), tx, ty, this.t);
        }
      }
      // ground-level props (ferry hull, the Still) first, then y-sorted actors
      this.entities.filter(e => e.under && !e.hidden).forEach(e => this.drawEntity(e));
      const actors = this.entities.filter(e => !e.hidden && !e.under).map(e => ({ y: e.py, draw: () => this.drawEntity(e) }));
      const p = this.player;
      actors.push({ y: p.y, draw: () => this.drawSprite(Sprites.get('player', p.dir, p.moving ? p.frame : 0), p.x, p.y + (p.moving && p.frame ? -1 : 0)) });
      if (this.flags().rook && this.map.rook !== false) {
        const r = this.rookPos();
        const flap = Math.floor(this.t * 6) % 2;
        actors.push({ y: r.y - 1, draw: () => this.drawSprite(Sprites.get(flap && p.moving ? 'rook2' : 'rook', r.dir), r.x, r.y - 9 + Math.sin(this.t * 3) * 1.5) });
      }
      actors.sort((a, b) => a.y - b.y).forEach(a => a.draw());
      // "!" over whoever you're facing
      const f = !this.locked && this.facingEntity();
      if (f) {
        const sx = Math.round(f.px - cam.x), sy = Math.round(f.py - (f.tall || 18) - cam.y - 6 + Math.sin(this.t * 6));
        c.fillStyle = '#fff'; c.fillRect(sx - 4, sy - 7, 9, 9);
        c.fillStyle = '#14141c'; c.fillRect(sx, sy - 5, 1, 4); c.fillRect(sx, sy, 1, 1);
      }
      if (this.fog > 0) {
        c.globalAlpha = this.fog;
        const fw = fogCanvas.width, fh = fogCanvas.height;
        const ox = (this.t * 6 + cam.x * 0.5) % fw, oy = (cam.y * 0.5) % fh;
        for (let y = -oy; y < VH; y += fh) for (let x = -ox; x < VW; x += fw) c.drawImage(fogCanvas, x, y);
        c.globalAlpha = 1;
      }
      if (this.dark > 0) { c.fillStyle = 'rgba(10,10,30,' + this.dark + ')'; c.fillRect(0, 0, VW, VH); }
    },

    drawSprite(img, x, y) {
      this.ctx.drawImage(img, Math.round(x - img.width / 2 - this.cam.x), Math.round(y - img.height - this.cam.y));
    },

    drawEntity(e) {
      if (e.draw) return e.draw(this.ctx, Math.round(e.px - this.cam.x), Math.round(e.py - this.cam.y), this.t);
      const bob = e.bob ? Math.sin(this.t * 2 + e.px) * (e.bob === true ? 1 : e.bob) : 0;
      const walking = e.target && e.wander && Sprites.isPerson(e.sprite);
      const dir = Sprites.isPerson(e.sprite) ? e.dir : (e.dir === 'left' ? 'left' : 'right');
      if (e.alpha) this.ctx.globalAlpha = e.alpha * (0.85 + 0.15 * Math.sin(this.t * 3));
      this.drawSprite(Sprites.get(e.sprite, dir, walking ? Math.floor(this.t * 6) % 2 : 0), e.px, e.py + bob);
      this.ctx.globalAlpha = 1;
    },

    entity(id) { return this.entities.find(e => e.id === id); },

    // Walk an entity (or the player) to a tile, x first then y.
    walk(id, tx, ty, speed) {
      const who = id === 'player' ? this.player : this.entity(id);
      if (!who) return Promise.resolve();
      const xk = id === 'player' ? 'x' : 'px', yk = id === 'player' ? 'y' : 'py';
      const target = { x: tx * TS + TS / 2, y: ty * TS + TS - 2 };
      const sp = speed || 60;
      return new Promise(res => {
        const prev = this.onFrame;
        this.onFrame = dt => {
          prev && prev(dt);
          let dx = target.x - who[xk], dy = target.y - who[yk];
          if (Math.abs(dx) > 0.5) { who.dir = dx > 0 ? 'right' : 'left'; who[xk] += Math.sign(dx) * Math.min(Math.abs(dx), sp * dt); }
          else if (Math.abs(dy) > 0.5) { who.dir = dy > 0 ? 'down' : 'up'; who[yk] += Math.sign(dy) * Math.min(Math.abs(dy), sp * dt); }
          if (id === 'player') {
            who.moving = true; who.ft += dt; if (who.ft > 0.16) { who.ft = 0; who.frame = 1 - who.frame; }
            const last = this.trail[this.trail.length - 1];
            if (!last || Math.hypot(last.x - who.x, last.y - who.y) > 1.5) this.trail.push({ x: who.x, y: who.y });
          }
          if (Math.abs(target.x - who[xk]) <= 0.5 && Math.abs(target.y - who[yk]) <= 0.5) {
            this.onFrame = prev;
            if (id === 'player') who.moving = false;
            res();
          }
        };
      });
    },
  };

  window.World = World;
  window.MAPS = window.MAPS || {};
})();
