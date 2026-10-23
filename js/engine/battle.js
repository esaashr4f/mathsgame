// Undertale-style encounters. You can't hit a problem until it goes away: ACT → "Work it out" solves the
// creature's real problem one step per turn (on an exam-pace clock). Each solved step calms them; slips make
// their attacks fiercer. Once every step is done their name turns yellow and you can SPARE them.
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = UI.esc;
  const BW = 240, BH = 120;

  function run(enc) {
    return new Promise(resolve => {
      const el = UI.panel(
        '<div class="battle">' +
        '<div class="enemy"><canvas class="enemy-sprite"></canvas><div class="bubble hidden"></div></div>' +
        '<div class="enemy-name"></div>' +
        '<details class="blueprint"><summary>📜 ' + esc(enc.problem.title) + ' (tap to read)</summary><div class="bp-body">' + Game.fmt(enc.problem.context || '') + (enc.problem.diagram || '') + '<div class="nb-prompt">' + enc.problem.prompt + '</div><ol class="working"></ol></div></details>' +
        '<div class="btl-box"></div>' +
        '<div class="btl-stats"><span class="pname"></span><span>LV ' + Game.level() + '</span><span>HP</span><div class="hpbar"><i></i></div><span class="hpnum"></span></div>' +
        '<div class="cmds"><button class="cmd" data-c="0">FIGHT</button><button class="cmd" data-c="1">ACT</button><button class="cmd" data-c="2">ITEM</button><button class="cmd" data-c="3">MERCY</button></div>' +
        '</div>', 'battle-screen');
      const box = $('.btl-box', el), bubbleEl = $('.bubble', el), cmds = Array.from(el.querySelectorAll('.cmd'));
      cmds.forEach(c => (c.disabled = true));
      $('.pname', el).textContent = Game.save.name.toUpperCase();

      // enemy sprite, scaled up
      const spr = Sprites.get(enc.sprite, 'down');
      const ec = $('.enemy-sprite', el), scale = enc.scale || 6;
      ec.width = spr.width * scale; ec.height = spr.height * scale;
      const ex = ec.getContext('2d'); ex.imageSmoothingEnabled = false; ex.drawImage(spr, 0, 0, ec.width, ec.height);

      const S = { hp: Game.maxHP(), max: Game.maxHP(), step: 0, slips: 0, anger: 0, talk: 0, spareable: false, hourglass: 0 };
      const steps = enc.problem.steps;

      const updateHP = () => { $('.hpbar i', el).style.width = (100 * S.hp / S.max) + '%'; $('.hpnum', el).textContent = S.hp + ' / ' + S.max; };
      const updateName = () => {
        const n = $('.enemy-name', el);
        n.textContent = enc.name + (S.spareable ? '' : '  ·  problem: ' + S.step + '/' + steps.length + ' steps');
        n.classList.toggle('spare', S.spareable);
      };
      updateHP(); updateName();

      // ── small helpers ──
      const wait = ms => new Promise(r => setTimeout(r, ms));
      function text(lines) {
        lines = [].concat(lines);
        return lines.reduce((p, line) => p.then(() => new Promise(res => {
          box.innerHTML = '<div class="btl-text"></div><div class="dlg-next">▼</div>';
          const t = $('.btl-text', box);
          const full = Game.fmt(line);
          let k = 0, typing = true;
          const tm = setInterval(() => { k++; t.textContent = full.slice(0, k); if (k % 2 === 0) Sfx.blip(380); if (k >= full.length) { clearInterval(tm); typing = false; } }, 22);
          const go = () => { if (typing) { clearInterval(tm); t.textContent = full; typing = false; return; } box.removeEventListener('click', go); pop(); res(); };
          box.addEventListener('click', go);
          const pop = UI.pushKeys(e => { if (['z', 'enter', ' '].includes(e.key.toLowerCase())) { e.preventDefault(); go(); } });
        })), Promise.resolve());
      }
      function bubble(line) {
        if (!line) return Promise.resolve();
        bubbleEl.textContent = Game.fmt(line);
        bubbleEl.classList.remove('hidden');
        Sfx.blip(180);
        return new Promise(res => {
          const done = () => { bubbleEl.classList.add('hidden'); bubbleEl.removeEventListener('click', done); pop(); clearTimeout(tm); res(); };
          const tm = setTimeout(done, 1600 + line.length * 45);
          bubbleEl.addEventListener('click', done);
          const pop = UI.pushKeys(e => { if (['z', 'enter', ' '].includes(e.key.toLowerCase())) { e.preventDefault(); done(); } });
        });
      }
      function rook(line) { return text('🐦 Rook: ' + line); }

      function pickCommand() {
        return new Promise(res => {
          let sel = 0;
          box.innerHTML = '<div class="btl-text">' + esc(Game.fmt(enc.flavor[Math.floor(Math.random() * enc.flavor.length)])) + '</div>';
          const mark = () => cmds.forEach((c, i) => c.classList.toggle('sel', i === sel));
          mark();
          cmds.forEach(c => (c.disabled = false));
          const pick = i => { Sfx.select(); cmds.forEach(c => { c.onclick = null; c.disabled = true; c.classList.remove('sel'); }); pop(); res(i); };
          cmds.forEach((c, i) => (c.onclick = () => pick(i)));
          const pop = UI.pushKeys(e => {
            const k = e.key.toLowerCase();
            if (k === 'arrowright' || k === 'd') { sel = (sel + 1) % 4; mark(); Sfx.blip(600); }
            else if (k === 'arrowleft' || k === 'a') { sel = (sel + 3) % 4; mark(); Sfx.blip(600); }
            else if (['z', 'enter', ' '].includes(k)) { e.preventDefault(); pick(sel); }
          });
        });
      }
      function sub(items) {
        return new Promise(res => {
          box.innerHTML = '<div class="submenu">' + items.map((it, i) => '<button data-i="' + i + '"' + (it.off ? ' class="off"' : '') + '>* ' + esc(it.label) + '</button>').join('') + '<button data-i="-1">← Back</button></div>';
          const btns = Array.from(box.querySelectorAll('button'));
          let sel = 0;
          const mark = () => btns.forEach((b, i) => b.classList.toggle('sel', i === sel));
          mark();
          const pick = i => { Sfx.select(); pop(); res(i); };
          btns.forEach((b, i) => b.addEventListener('click', () => pick(Number(b.dataset.i))));
          const pop = UI.pushKeys(e => {
            const k = e.key.toLowerCase();
            if (k === 'arrowdown' || k === 's') { sel = (sel + 1) % btns.length; mark(); }
            else if (k === 'arrowup' || k === 'w') { sel = (sel - 1 + btns.length) % btns.length; mark(); }
            else if (['z', 'enter', ' '].includes(k)) { e.preventDefault(); pick(Number(btns[sel].dataset.i)); }
            else if (k === 'x' || k === 'escape') pick(-1);
          });
        });
      }

      // ── your turn ──
      async function act() {
        const items = [{ label: 'Check' }, { label: 'Talk' }];
        if (!S.spareable) items.push({ label: 'Work it out (step ' + (S.step + 1) + '/' + steps.length + ')' });
        const i = await sub(items);
        if (i === -1) return 'back';
        if (i === 0) { await text(enc.check); return 'turn'; }
        if (i === 1) {
          const lines = enc.talk[Math.min(S.talk, enc.talk.length - 1)];
          S.talk++;
          for (const [who, line] of lines) await (who === 'enemy' ? bubble(line) : who === 'rook' ? rook(line) : text(line));
          return 'turn';
        }
        return workItOut();
      }

      async function workItOut() {
        const s = steps[S.step];
        $('.blueprint', el).open = true;
        let clock = null;
        const r = await Solver.oneStep(box, enc.problem, S.step, {
          timed: true, extra: S.hourglass * 30, hint: S.slips >= 1, taught: S.slips >= 2, clockRef: c => (clock = c),
        });
        S.hourglass = 0;
        if (r.ok) {
          const li = document.createElement('li');
          li.className = S.slips >= 2 ? 'taught' : 'ok';
          li.innerHTML = s.explain;
          $('.blueprint .working', el).appendChild(li);
          UI.renderMath(li);
          const fast = r.frac > 0.6 && !S.slips;
          (fast ? Sfx.crit : Sfx.hit)();
          ec.classList.remove('hurt'); void ec.offsetWidth; ec.classList.add('hurt');
          S.step++; S.slips = 0;
          S.anger = Math.max(0, S.anger - 1);
          updateName();
          await text(fast ? '* DEEP THINKING! You worked that out in a flash.' : '* You write it out carefully.');
          for (const [who, line] of (s.react || [])) await (who === 'enemy' ? bubble(line) : who === 'rook' ? rook(line) : text(line));
          if (S.step >= steps.length) {
            S.spareable = true;
            updateName();
            await text(enc.spareHint || '* ' + enc.name + ' has calmed down.');
            return 'calm';
          }
          return 'turn';
        }
        S.slips++;
        S.anger++;
        Sfx.wrong();
        await text(r.timedOut ? '* Time\'s up! The moment passes.' : '* That\'s not right.' + (r.message ? ' ' + r.message : ''));
        await rook(S.slips >= 2 ? 'Next turn I\'ll walk you through it — then you write it.' : s.hint.replace(/\$[^$]*\$/g, m => m));
        return 'turn';
      }

      async function item() {
        const inv = Game.save.items;
        const list = [
          { id: 'flapjack', label: 'Fen\'s Flapjack (heal 10) ×' + (inv.flapjack || 0), off: !inv.flapjack },
          { id: 'hourglass', label: 'Moss\'s Hourglass (+30 s next step) ×' + (inv.hourglass || 0), off: !inv.hourglass },
        ];
        const i = await sub(list);
        if (i === -1 || list[i].off) return 'back';
        if (list[i].id === 'flapjack') { inv.flapjack--; S.hp = Math.min(S.max, S.hp + 10); updateHP(); await text('* You eat the flapjack. Still warm. HP restored.'); }
        else { inv.hourglass--; S.hourglass++; await text('* The sand glitters. Your next step gets 30 extra seconds.'); }
        return 'turn';
      }

      async function mercy() {
        const i = await sub([{ label: 'Spare' }, { label: 'Flee' }]);
        if (i === -1) return 'back';
        if (i === 1) { await rook('We\'re not running. Not from this one.'); return 'back'; }
        if (S.spareable) return 'win';
        await text('* ' + enc.name + ' isn\'t ready to listen yet. Their problem still needs solving.');
        return 'turn';
      }

      // ── enemy turn: dodge in the box ──
      function dodge() {
        return new Promise(res => {
          const atk = enc.attacks[Math.min(S.step, enc.attacks.length - 1)];
          const intensity = 1 + S.anger * 0.35;
          $('.blueprint', el).open = false;
          box.innerHTML = '<canvas class="dodge" width="' + BW + '" height="' + BH + '"></canvas><div class="dodge-label">←↑↓→ / WASD / drag to dodge</div>';
          box.scrollIntoView({ block: 'center' });
          const cv = $('canvas', box), cx = cv.getContext('2d');
          const heart = Sprites.get('heart');
          const p = { x: BW / 2, y: BH / 2, inv: 0 };
          const keys = {}, bullets = [];
          const dur = 3800;
          let t = 0, spawnT = 0, last = performance.now(), touch = null, ang = 0;
          const kd = e => { keys[e.key.toLowerCase()] = true; if (e.key.startsWith('Arrow')) e.preventDefault(); };
          const ku = e => { keys[e.key.toLowerCase()] = false; };
          document.addEventListener('keydown', kd);
          document.addEventListener('keyup', ku);
          const pop = UI.pushKeys(() => {});
          const pt = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * BW / r.width, y: (e.clientY - r.top) * BH / r.height }; };
          cv.addEventListener('pointerdown', e => { touch = pt(e); cv.setPointerCapture(e.pointerId); });
          cv.addEventListener('pointermove', e => { if (touch) touch = pt(e); });
          cv.addEventListener('pointerup', () => (touch = null));
          cx.font = '500 11px "Pixelify Sans", monospace';
          const speed = (atk.speed || 60) * intensity, every = (atk.every || 380) / intensity;

          function spawn() {
            const word = atk.bullets[Math.floor(Math.random() * atk.bullets.length)];
            const w = cx.measureText(word).width;
            const b = { word, w, h: 9, t: 0 };
            if (atk.pattern === 'rain') Object.assign(b, { x: Math.random() * (BW - w), y: -10, vx: 0, vy: speed });
            else if (atk.pattern === 'sweep') { const l = Math.random() < 0.5; Object.assign(b, { x: l ? -w : BW, y: 6 + Math.random() * (BH - 12), vx: l ? speed : -speed, vy: 0 }); }
            else if (atk.pattern === 'arc') Object.assign(b, { x: Math.random() * BW, y: BH + 4, vx: (Math.random() - 0.5) * speed, vy: -speed * 1.9, g: speed * 2 });
            else { ang += 0.8; Object.assign(b, { x: BW / 2 - w / 2, y: BH / 2, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, safe: 0.45 }); }
            bullets.push(b);
          }
          function end() {
            document.removeEventListener('keydown', kd);
            document.removeEventListener('keyup', ku);
            pop();
            res();
          }
          function frame(now) {
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            t += dt * 1000; spawnT += dt * 1000;
            if (spawnT > every && t < dur - 400) { spawnT = 0; spawn(); }
            let dx = 0, dy = 0;
            if (keys.arrowleft || keys.a) dx--; if (keys.arrowright || keys.d) dx++;
            if (keys.arrowup || keys.w) dy--; if (keys.arrowdown || keys.s) dy++;
            if (touch) { const ddx = touch.x - p.x, ddy = touch.y - p.y, d = Math.hypot(ddx, ddy); if (d > 2) { dx = ddx / d; dy = ddy / d; } }
            p.x = Math.max(4, Math.min(BW - 4, p.x + dx * 110 * dt));
            p.y = Math.max(4, Math.min(BH - 4, p.y + dy * 110 * dt));
            p.inv = Math.max(0, p.inv - dt);
            cx.fillStyle = '#120a18'; cx.fillRect(0, 0, BW, BH);
            for (let i = bullets.length - 1; i >= 0; i--) {
              const b = bullets[i];
              b.t += dt; if (b.g) b.vy += b.g * dt;
              b.x += b.vx * dt; b.y += b.vy * dt;
              if (b.x < -80 || b.x > BW + 80 || b.y < -40 || b.y > BH + 40) { bullets.splice(i, 1); continue; }
              const live = !(b.safe && b.t < b.safe);
              cx.fillStyle = live ? '#fff1d6' : '#5a3a62';
              cx.fillText(b.word, b.x, b.y);
              if (live && !p.inv && p.x + 3 > b.x && p.x - 3 < b.x + b.w && p.y + 3 > b.y - b.h && p.y - 3 < b.y) {
                S.hp = Math.max(0, S.hp - (enc.atk || 3)); p.inv = 0.8; Sfx.hurt(); updateHP();
                if (S.hp <= 0) t = dur;
              }
            }
            if (!p.inv || Math.floor(p.inv * 10) % 2 === 0) cx.drawImage(heart, Math.round(p.x - 3), Math.round(p.y - 3));
            cx.fillStyle = '#ffd166'; cx.fillRect(0, BH - 2, BW * (1 - t / dur), 2);
            if (t >= dur) return end();
            requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        });
      }

      async function enemyTurn() {
        const lines = S.anger >= 2 ? enc.angry : enc.taunts;
        await bubble(lines[Math.min(S.step, lines.length - 1)]);
        await dodge();
      }

      // ── main loop ──
      (async () => {
        await text(enc.intro);
        for (;;) {
          const c = await pickCommand();
          let r;
          if (c === 0) { await text('* You raise your pencil like a sword.'); await rook(enc.fightLine || 'What are you DOING? You can\'t hit a problem until it goes away.'); r = 'turn'; }
          else if (c === 1) r = await act();
          else if (c === 2) r = await item();
          else r = await mercy();
          if (r === 'back') continue;
          if (r === 'win') break;
          if (r === 'calm') continue;
          await enemyTurn();
          if (S.hp <= 0) {
            box.innerHTML = '<div class="gameover-small">GAME OVER</div>';
            Sfx.hurt();
            await wait(1200);
            await rook('Up you get, ' + Game.save.name + '. Every slip showed you the right working. Again.');
            S.hp = S.max; S.anger = 0; updateHP();
          }
        }
        Sfx.win();
        ec.classList.add('spared');
        await text('* YOU SPARED ' + enc.name.toUpperCase() + '.');
        Game.save.items = Game.save.items;
        el.close();
        resolve('spared');
      })();
    });
  }

  window.Battle = { run };
})();
