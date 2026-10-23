// LOWMARSH — the game shell: saving, the script API used by the story, menus, Mira's notebook,
// the scratch pad and grapher, drills, the Daily Dive and Past Paper mode.
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = UI.esc;

  // ───────── save ─────────
  const KEY = 'lowmarsh-save-v1';
  const fresh = () => ({
    name: '', started: false, map: 'world', x: 50, y: 58, dir: 'up',
    flags: { chapter: 0, fogLevel: 0.55 }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {},
    examDate: '2027-05-13', sound: true, timedDrills: false,
  });
  let S = fresh();
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* private mode */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  Sfx.setEnabled(S.sound);

  const fmt = s => String(s).replace(/\{name\}/g, esc(S.name || 'you'));
  const fmtPlain = s => String(s).replace(/\{name\}/g, S.name || 'you');
  const topic = id => window.TOPICS.find(t => t.id === id);
  const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const diveNumber = () => Math.floor((Date.parse(todayStr() + 'T00:00:00Z') - Date.UTC(2026, 9, 23)) / 86400000) + 1;
  const daysLeft = () => Math.max(0, Math.ceil((Date.parse(S.examDate + 'T09:00:00') - Date.now()) / 86400000));
  const shuffle = (a, rnd) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd || Math.random)() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function seeded(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } let a = h >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // All practice questions: the drill bank plus both past papers.
  const allQuestions = () => window.QUESTIONS.concat(window.PAPERS.flatMap(p => p.questions));

  const DEPTHS = [[0, 'the well mouth — daylight'], [100, 'the bucket rope ends here'], [200, 'old coins glint in the dark'], [300, 'the water is cold and very still'], [400, 'roots of the old oak reach this far'], [500, 'someone carved initials here: M.H.'], [600, 'the deep spring — Lowmarsh\'s water starts here'], [700, 'the bottom. A perfect dive.']];

  // ───────── the script API used by the story files ─────────
  function speaker(who) {
    if (!who) return null;
    const c = window.CAST[who] || { name: who, portrait: null, color: '#fff', blip: 440 };
    return { name: fmtPlain(c.name), portrait: c.portrait, color: c.color, blip: c.blip };
  }
  const G = {
    async say(who, ...lines) { for (const l of lines) await UI.say(speaker(who), fmtPlain(l)); },
    async talk(seq) { for (const [who, line] of seq) await G.say(who, line); },
    rook: (...l) => G.say('rook', ...l),
    me: (...l) => G.say('you', ...l),
    narr: (...l) => G.say(null, ...l),
    async ask(who, line, options) { await G.say(who, line); return UI.choose(options.map(fmtPlain)); },
    choose: (options, prompt) => UI.choose(options.map(fmtPlain), prompt && fmtPlain(prompt)),
    flag: k => S.flags[k],
    set(k, v) { S.flags[k] = v === undefined ? true : v; persist(); },
    give(item, n) { S.items[item] = (S.items[item] || 0) + (n || 1); persist(); UI.toast('Got ' + ITEMS[item].name + (n > 1 ? ' ×' + n : '') + '!'); },
    has: item => (S.items[item] || 0) > 0,
    page(id) {
      if (S.pages.includes(id)) return;
      S.pages.push(id); persist();
      UI.toast('📖 Found a page of Mira\'s notebook: ' + topic(id).name);
    },
    toast: t => UI.toast(fmtPlain(t)),
    wait: ms => new Promise(r => setTimeout(r, ms)),
    fade: (on, ms) => UI.fade(on, ms),
    async go(map, x, y, dir) {
      Sfx.select();
      await UI.fade(true, 220);
      World.load(map, x, y, dir);
      S.map = map; S.x = x; S.y = y; S.dir = dir || 'down'; persist();
      updateHud();
      await UI.fade(false, 220);
    },
    walk: (id, x, y, sp) => World.walk(id, x, y, sp),
    face(id, dir) { const e = id === 'player' ? World.player : World.entity(id); if (e) e.dir = dir; },
    refresh() { World.refresh(); updateHud(); },
    save() { const p = World.player; S.map = World.mapId; S.x = Math.floor(p.x / 16); S.y = Math.floor((p.y - 2) / 16); S.dir = p.dir; persist(); },
    card: (t, s, b) => UI.card(t, s, b),
    narrate: lines => UI.narrate(lines.map(fmtPlain)),
    async solve(problem) {
      const r = await Solver.story(problem);
      S.solved[problem.id] = true; persist();
      return r;
    },
    battle: enc => Battle.run(enc),
    graph(opts, caption) {
      return new Promise(res => {
        const el = UI.panel('<div class="notebook graph-show"><div class="nb-diagram">' + Graph.svg(Object.assign({ w: 320, h: 220 }, opts)) + '</div><p>' + (caption || '') + '</p><button class="btn primary">OK ▸</button></div>', 'nb-screen');
        const done = () => { el.close(); res(); };
        $('button', el).addEventListener('click', done);
        $('button', el).focus();
      });
    },
    hud: updateHud,
    shake() { const f = document.getElementById('frame'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); },
    get save_() { return S; },
  };

  const ITEMS = {
    flapjack: { name: "Fen's Flapjack", desc: 'Heals 10 HP in an encounter. Still warm, somehow.' },
    hourglass: { name: "Moss's Hourglass", desc: '+15 seconds on your next step in an encounter.' },
    key: { name: 'Workshop Key', desc: 'Mira\'s key. It was under the third flowerpot. Of course it was.' },
    blueprint: { name: "Mira's Bridge Blueprint", desc: 'The original bridge design, in Mira\'s handwriting.' },
    lens: { name: 'Lens Notes', desc: 'Ottoline\'s notes on the lighthouse lens.' },
    census: { name: 'Census Page', desc: 'Mira\'s census entry: "Location: the Still."' },
    soup: { name: "Fen's Soup Flask", desc: 'Leek and potato, 100 °C when it left the bakery. For Tansy.' },
    cable: { name: 'Steel Cable', desc: 'Forty metres of good steel cable from the lock.' },
  };

  // ───────── HUD + objective ─────────
  function updateHud() {
    const hud = document.getElementById('hud');
    if (!World.active) { hud.innerHTML = ''; return; }
    const obj = window.SCRIPTS.objective ? window.SCRIPTS.objective(S.flags) : '';
    hud.innerHTML = '<span class="hud-loc">' + esc(World.map.name) + '</span>' + (obj ? '<span class="hud-obj">📜 ' + esc(fmtPlain(obj)) + '</span>' : '');
  }

  // ───────── title & new game ─────────
  function screen(html, cls) {
    World.active = false;
    document.getElementById('frame').classList.add('hidden');
    document.getElementById('touch').classList.add('hidden');
    const s = document.getElementById('title');
    s.className = 'title-screen ' + (cls || '');
    s.innerHTML = html;
    s.classList.remove('hidden');
    UI.renderMath(s);
    return s;
  }
  function on(el, handlers) {
    el.onclick = e => { const t = e.target.closest('[data-a]'); if (t && handlers[t.dataset.a]) { Sfx.select(); handlers[t.dataset.a](t.dataset.v, t); } };
  }

  function title() {
    const el = screen(
      '<div class="logo">LOWMARSH<small>a story about showing your working</small></div>' +
      '<canvas class="title-canvas" width="200" height="80" aria-hidden="true"></canvas>' +
      '<div class="title-menu">' +
      (S.started ? '<button class="btn primary" data-a="cont">▶ CONTINUE — ' + esc(S.name) + '</button>' : '') +
      '<button class="btn ' + (S.started ? '' : 'primary') + '" data-a="new">' + (S.started ? 'NEW GAME' : '▶ NEW GAME') + '</button>' +
      '<button class="btn" data-a="papers">📝 PAST PAPERS (OCR)</button>' +
      '<button class="btn" data-a="drills">🎯 DRILLS & NOTEBOOK</button>' +
      '<button class="btn" data-a="daily">⏱ DAILY DIVE #' + diveNumber() + '</button>' +
      '<button class="btn small" data-a="settings">⚙ settings</button>' +
      '</div><p class="foot">OCR AS Level Mathematics A (H230) · ' + daysLeft() + ' days to your exam</p>');
    drawTitleScene($('.title-canvas', el));
    on(el, {
      cont: () => startWorld(),
      new: () => {
        if (S.started && !confirm('Start a new story? Your story progress will be erased (practice stats are kept).')) return;
        const keep = { stats: S.stats, daily: S.daily, papers: S.papers, examDate: S.examDate, sound: S.sound };
        S = Object.assign(fresh(), keep); persist();
        nameEntry();
      },
      papers: () => papersMenu(title),
      drills: () => drillsMenu(title),
      daily: () => dailyIntro(title),
      settings: () => settings(title),
    });
  }

  // A little pixel scene for the title: the dark lighthouse, the sea, and Rook on a post.
  function drawTitleScene(cv) {
    const c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    let t = 0;
    const frame = () => {
      if (!cv.isConnected) return;
      t += 0.03;
      c.clearRect(0, 0, 200, 80);
      c.fillStyle = '#16324f'; c.fillRect(0, 58, 200, 22);
      for (let i = 0; i < 12; i++) { c.fillStyle = '#2f5d7c'; c.fillRect((i * 23 + Math.floor(t * 8)) % 200, 62 + (i % 3) * 5, 6, 1); }
      c.fillStyle = '#41414c'; c.fillRect(20, 52, 40, 8);
      for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? '#c0403a' : '#d8d2c4'; c.fillRect(32 + i, 44 - i * 8, 16 - i * 2, 9); }
      c.fillStyle = '#2d2d3a'; c.fillRect(34, 8, 12, 3);
      const flick = Math.sin(t * 3) > 0.2;
      c.fillStyle = flick ? '#ffe9a0' : '#5a5060'; c.fillRect(36, 0, 8, 8);
      if (flick) { c.globalAlpha = 0.12; c.fillStyle = '#fff6c8'; c.beginPath(); c.moveTo(40, 4); c.lineTo(200, -10 + Math.sin(t) * 20); c.lineTo(200, 26 + Math.sin(t) * 20); c.fill(); c.globalAlpha = 1; }
      c.fillStyle = '#4f3420'; c.fillRect(150, 44, 4, 20);
      c.drawImage(Sprites.get('rook', 'left'), 146, 34 + Math.round(Math.sin(t * 2)));
      requestAnimationFrame(frame);
    };
    frame();
  }

  function nameEntry() {
    const el = screen('<div class="name-screen"><h2>What\'s your name?</h2><input id="nm" maxlength="12" autocomplete="off" spellcheck="false"><div><button class="btn primary" data-a="go">THAT\'S ME</button></div></div>');
    const inp = $('#nm', el);
    inp.focus();
    const go = async () => {
      const n = inp.value.trim();
      if (!n) return inp.focus();
      S.name = n; persist();
      el.classList.add('hidden');
      await window.SCRIPTS.prologueNarration(G);
      S.started = true; S.map = 'world'; S.x = 50; S.y = 58; S.dir = 'up'; persist();
      startWorld(true);
    };
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); go(); } });
    on(el, { go });
  }

  function startWorld(fresh) {
    document.getElementById('title').classList.add('hidden');
    document.getElementById('frame').classList.remove('hidden');
    if (matchMedia('(pointer: coarse)').matches) document.getElementById('touch').classList.remove('hidden');
    World.load(S.map, S.x, S.y, S.dir);
    World.active = true;
    updateHud();
    if (fresh) World.run(G => window.SCRIPTS.prologue(G));
  }

  // ───────── pause menu ─────────
  function openMenu() {
    if (World.locked) return;
    World.locked = true;
    const el = UI.panel(
      '<div class="menu-box"><div class="menu-head"><div><b>' + esc(S.name) + '</b> · LV ' + level() + ' · HP ' + maxHP() + '</div><div class="muted">Chapter ' + (S.flags.chapter || 0) + ' · ' + daysLeft() + ' days to your exam</div></div>' +
      '<div class="menu-grid">' +
      '<button data-a="rook">🐦 Ask Rook</button><button data-a="notebook">📖 Mira\'s Notebook</button>' +
      '<button data-a="scratch">✏️ Scratch Pad</button><button data-a="grapher">📈 Grapher</button>' +
      '<button data-a="formulae">📐 Formula Book</button><button data-a="items">🎒 Items</button>' +
      '<button data-a="jobs">📋 Side Quests</button>' +
      '<button data-a="drills">🎯 Drills</button><button data-a="papers">📝 Past Papers</button>' +
      '<button data-a="daily">⏱ Daily Dive</button><button data-a="save">💾 Save</button>' +
      '<button data-a="settings">⚙ Settings</button><button data-a="title">🚪 Title Screen</button>' +
      '</div><button class="btn small" data-a="close">close (Esc)</button></div>', 'menu-screen', () => (World.locked = false));
    const close = () => { el.close(); World.locked = false; };
    const sub = fn => () => { el.close(); fn(() => { World.locked = false; }); };
    on(el, {
      close,
      rook: () => { close(); askRook(); },
      notebook: sub(back => notebook(back, true)),
      scratch: sub(back => scratch(back)),
      grapher: sub(back => grapher(back)),
      formulae: sub(back => formulae(back)),
      items: sub(back => itemsView(back)),
      jobs: sub(back => jobsView(back)),
      drills: sub(back => drillsMenu(back, true)),
      papers: sub(back => papersMenu(back, true)),
      daily: sub(back => dailyIntro(back, true)),
      save: () => { G.save(); UI.toast('Saved.'); },
      settings: sub(back => settings(back, true)),
      title: () => { G.save(); el.close(); World.locked = false; title(); },
    });
  }

  function askRook() {
    if (World.locked) return;
    World.run(async G2 => {
      if (!S.flags.rook) return G2.narr('* There\'s nobody to ask. Yet.');
      const lines = window.SCRIPTS.rookHint(S.flags);
      await G2.say('rook', ...lines);
    });
  }

  // Panels opened from the pause menu or the title screen.
  function overlayPanel(html, back, cls) {
    const el = UI.panel('<div class="sheet ' + (cls || '') + '"><button class="btn small sheet-close" data-a="back">◂ back</button>' + html + '</div>', 'sheet-screen', () => back());
    on(el, { back: () => { el.close(); back(); } });
    return el;
  }

  function notebook(back, story) {
    const T = window.TOPICS;
    const found = t => !story || S.pages.includes(t.id);
    const cards = T.map(t => {
      const acc = accuracy(t.id);
      return found(t)
        ? '<button class="nb-page" data-a="open" data-v="' + t.id + '"><b>' + esc(t.name) + '</b><span>' + esc(t.spec) + ' · ' + esc(t.paper) + (acc == null ? '' : ' · ' + Math.round(acc * 100) + '%') + '</span></button>'
        : '<div class="nb-page missing"><b>— missing page —</b><span>' + esc(t.spec) + '</span></div>';
    }).join('');
    const el = overlayPanel('<h2 class="p5"><span>MIRA\'S NOTEBOOK</span></h2>' + (story ? '<p class="muted">' + S.pages.length + ' of ' + T.length + ' pages found. Pages turn up as the story goes on — but you can study every topic in Drills.</p>' : '') + '<div class="nb-pages">' + cards + '</div>', back);
    on(el, { back: () => { el.close(); back(); }, open: id => { el.close(); showLesson(id, () => notebook(back, story)); } });
  }

  function showLesson(id, back) {
    const t = topic(id);
    const closeOnly = !back;
    const el = UI.panel('<div class="sheet lesson-sheet"><button class="btn small sheet-close" data-a="back">◂ back</button><div class="muted pixel">Mira\'s notebook · ' + esc(t.spec) + '</div><h2 class="p5"><span>' + esc(t.name) + '</span></h2><div class="lesson">' + t.lesson + '</div><div class="realworld">🌍 ' + t.use + '</div>' +
      '<div class="row"><button class="btn primary" data-a="drill">🎯 Practise ' + esc(t.name) + '</button></div></div>', 'sheet-screen lesson-screen', () => back && back());
    on(el, {
      back: () => { el.close(); back && back(); },
      drill: () => { el.close(); runDrill([id], null, back || (() => {})); },
    });
    if (closeOnly) $('[data-a=drill]', el).remove();
  }

  // ───────── scratch pad & grapher ─────────
  let scratchImage = null;
  function scratch(back) {
    const el = overlayPanel('<h2 class="p5"><span>SCRATCH PAD</span></h2><p class="muted">Write your working with a finger, stylus or mouse. It stays here while you play.</p>' +
      '<div class="row scratch-tools"><button class="btn small" data-t="pen">✏️ pen</button><button class="btn small" data-t="red">🔴 red</button><button class="btn small" data-t="eraser">🧽 eraser</button><button class="btn small" data-t="clear">🗑 clear</button></div>' +
      '<canvas class="scratch" width="900" height="1100"></canvas>', back, 'scratch-sheet');
    const cv = $('canvas', el), c = cv.getContext('2d');
    const paper = () => { c.fillStyle = '#fffdf6'; c.fillRect(0, 0, cv.width, cv.height); c.strokeStyle = '#dfe8f2'; c.lineWidth = 1; for (let y = 40; y < cv.height; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(cv.width, y); c.stroke(); } };
    paper();
    if (scratchImage) c.putImageData(scratchImage, 0, 0);
    let tool = 'pen', drawing = false, last = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    cv.addEventListener('pointerdown', e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => {
      if (!drawing) return;
      const p = pos(e);
      c.lineCap = 'round';
      c.strokeStyle = tool === 'eraser' ? '#fffdf6' : tool === 'red' ? '#c0403a' : '#1a1a24';
      c.lineWidth = tool === 'eraser' ? 26 : 3;
      c.beginPath(); c.moveTo(last.x, last.y); c.lineTo(p.x, p.y); c.stroke();
      last = p;
    });
    const end = () => { if (drawing) { drawing = false; scratchImage = c.getImageData(0, 0, cv.width, cv.height); } };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointerleave', end);
    el.addEventListener('click', e => {
      const t = e.target.closest('[data-t]');
      if (!t) return;
      if (t.dataset.t === 'clear') { paper(); scratchImage = null; } else tool = t.dataset.t;
      el.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', b === t && t.dataset.t !== 'clear'));
    });
  }

  function grapher(back, preset) {
    const el = overlayPanel('<h2 class="p5"><span>GRAPHER</span></h2><p class="muted">Type any function of x. Use it to check sketches, find intersections, or see what a derivative looks like next to its curve.</p><div class="gr-host"></div>', back);
    Graph.tool($('.gr-host', el), preset);
  }

  function formulae(back) {
    overlayPanel('<h2 class="p5"><span>FORMULA BOOK</span></h2><div class="lesson">' +
      '<p class="muted">What the OCR AS formula booklet gives you (everything else you must learn).</p>' +
      '<h3>Binomial series</h3><p>$(a+b)^n = a^n + {}^nC_1 a^{n-1}b + {}^nC_2 a^{n-2}b^2 + \\dots + {}^nC_r a^{n-r}b^r + \\dots + b^n$, &nbsp; ${}^nC_r = \\dfrac{n!}{r!(n-r)!}$</p>' +
      '<h3>Differentiation from first principles</h3><p>$f\'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$</p>' +
      '<h3>Standard deviation</h3><p>$\\sqrt{\\dfrac{\\sum (x - \\bar x)^2}{n}} = \\sqrt{\\dfrac{\\sum x^2}{n} - \\bar x^2}$ &nbsp; or with frequencies $\\sqrt{\\dfrac{\\sum f x^2}{\\sum f} - \\bar x^2}$</p>' +
      '<h3>The binomial distribution</h3><p>If $X \\sim B(n, p)$ then $P(X = x) = \\binom{n}{x}p^x(1-p)^{n-x}$. Mean $np$, variance $np(1-p)$.</p>' +
      '<h3>Kinematics</h3><p>$v = u + at$ &nbsp; $s = ut + \\tfrac12 at^2$ &nbsp; $s = \\tfrac12(u+v)t$ &nbsp; $v^2 = u^2 + 2as$ &nbsp; $s = vt - \\tfrac12 at^2$</p>' +
      '<h3>Not given — learn these!</h3><ul><li>Quadratic formula, discriminant, completing the square</li><li>Laws of indices and logs; $\\frac{d}{dx}e^{kx} = ke^{kx}$</li><li>Sine rule, cosine rule, area $= \\tfrac12 ab \\sin C$; $\\sin^2 + \\cos^2 = 1$, $\\tan = \\frac{\\sin}{\\cos}$</li><li>Circle $(x-a)^2 + (y-b)^2 = r^2$; perpendicular gradients $m_1 m_2 = -1$</li><li>$\\int x^n dx = \\frac{x^{n+1}}{n+1} + c$</li></ul>' +
      '</div>', back);
  }

  function itemsView(back) {
    const list = Object.keys(S.items).filter(k => S.items[k] > 0);
    overlayPanel('<h2 class="p5"><span>ITEMS</span></h2>' + (list.length ? '<ul class="item-list">' + list.map(k => '<li><b>' + esc(ITEMS[k].name) + '</b> ×' + S.items[k] + '<br><span class="muted">' + esc(ITEMS[k].desc) + '</span></li>').join('') + '</ul>' : '<p class="muted">Your pockets are empty. Two jumpers and a phone with no signal.</p>'), back);
  }

  function jobsView(back) {
    const jobs = window.SCRIPTS.jobs ? window.SCRIPTS.jobs(S.flags) : [];
    const open = jobs.filter(j => !j.done), done = jobs.filter(j => j.done);
    const li = j => '<li class="' + (j.done ? 'job-done' : '') + '"><b>' + (j.done ? '✓ ' : '◇ ') + esc(fmtPlain(j.title)) + '</b><br><span class="muted">' + esc(fmtPlain(j.where)) + '</span></li>';
    overlayPanel('<h2 class="p5"><span>SIDE QUESTS</span></h2><p class="muted">Optional problems around Lowmarsh. Real exam questions, every one. ' + done.length + ' of ' + jobs.length + ' done.</p>' +
      (jobs.length ? '<ul class="item-list">' + open.concat(done).map(li).join('') + '</ul>' : '<p class="muted">Nobody needs anything yet. Give it time.</p>'), back);
  }

  function settings(back) {
    const el = overlayPanel('<h2 class="p5"><span>SETTINGS</span></h2>' +
      '<p>When is your first OCR AS exam?</p><input type="date" class="ans" id="exam" value="' + esc(S.examDate) + '" style="max-width:220px">' +
      '<p class="muted">' + daysLeft() + ' days to go. Check the OCR timetable for your exact date.</p>' +
      '<label class="toggle"><input type="checkbox" id="snd"' + (S.sound ? ' checked' : '') + '> Sound effects</label>' +
      '<hr><p class="muted">Controls: arrows/WASD move · Z/Enter talk & confirm · C/Esc menu · R ask Rook. On phones use the on-screen pad.</p>' +
      '<button class="btn danger small" data-a="wipe">Erase ALL save data</button>', back);
    $('#exam', el).addEventListener('change', e => { if (e.target.value) { S.examDate = e.target.value; persist(); } });
    $('#snd', el).addEventListener('change', e => { S.sound = e.target.checked; Sfx.setEnabled(S.sound); persist(); });
    $('#exam', el).addEventListener('keydown', e => e.stopPropagation());
    el.querySelector('[data-a=wipe]').addEventListener('click', () => { if (confirm('Erase everything, including practice stats?')) { S = fresh(); persist(); location.reload(); } });
  }

  // ───────── drills ─────────
  function drillsMenu(back) {
    const T = window.TOPICS, all = allQuestions();
    const cards = T.map(t => {
      const n = all.filter(q => q.topic === t.id).length, acc = accuracy(t.id);
      return '<div class="topic"><div class="tn">' + esc(t.name) + '</div><div class="ts">' + esc(t.spec) + ' · ' + n + ' questions' + (acc == null ? '' : ' · ' + Math.round(acc * 100) + '%') + '</div>' +
        '<div class="acc"><i style="width:' + Math.round((acc || 0) * 100) + '%"></i></div>' +
        '<div class="row"><button class="btn small" data-a="lesson" data-v="' + t.id + '">📖 Notes</button><button class="btn small primary" data-a="go" data-v="' + t.id + '">Practise</button></div></div>';
    }).join('');
    const el = overlayPanel('<h2 class="p5"><span>DRILLS</span></h2><p class="muted">Every topic, every past-paper question, step by step.</p>' +
      '<div class="row" style="margin-bottom:12px"><label class="toggle"><input type="checkbox" id="tm"' + (S.timedDrills ? ' checked' : '') + '> Krillion timer (25 s a step)</label>' +
      '<button class="btn small" data-a="mixed">🔀 Mixed</button><button class="btn small" data-a="weak">🩹 Weakest topics</button></div><div class="topic-grid">' + cards + '</div>', back);
    $('#tm', el).addEventListener('change', e => { S.timedDrills = e.target.checked; persist(); });
    on(el, {
      back: () => { el.close(); back(); },
      lesson: id => { el.close(); showLesson(id, () => drillsMenu(back)); },
      go: id => { el.close(); runDrill([id], null, () => drillsMenu(back)); },
      mixed: () => { el.close(); runDrill(T.map(t => t.id), 8, () => drillsMenu(back)); },
      weak: () => {
        el.close();
        const ranked = T.map(t => ({ id: t.id, a: accuracy(t.id) })).sort((x, y) => (x.a == null ? 0.5 : x.a) - (y.a == null ? 0.5 : y.a));
        runDrill(ranked.slice(0, 3).map(r => r.id), 6, () => drillsMenu(back));
      },
    });
  }

  async function runDrill(topics, limit, back) {
    let qs = shuffle(allQuestions().filter(q => topics.includes(q.topic)));
    if (limit) qs = qs.slice(0, limit);
    if (!qs.length) return back();
    const R = await Solver.session(qs, { mode: 'drill', title: topics.length === 1 ? topic(topics[0]).name : 'Mixed drill', timed: S.timedDrills, attempts: 3 });
    persist();
    if (R) results(R, 'drill', back); else back();
  }

  // ───────── Daily Dive ─────────
  function dailyIntro(back) {
    const today = S.daily[todayStr()];
    const el = overlayPanel('<h2 class="p5"><span>THE DAILY DIVE</span></h2><div class="pixel muted">dive #' + diveNumber() + ' — down the old Lowmarsh well</div>' +
      '<ul class="howto"><li>7 problems a day. Same for everyone.</li><li>25 seconds a step. One shot each.</li><li>Fast, clean working sinks you deeper.</li><li>Each problem is worth up to 100 m. 700 m is the bottom.</li><li>One dive per day.</li></ul>' +
      (today ? '<div class="share">' + esc(shareText(today)) + '</div><div class="row"><button class="btn small" data-a="copy">Copy result</button><button class="btn small" data-a="endless">∞ Endless dive</button></div>'
        : '<div class="row"><button class="btn primary" data-a="go">▼ DIVE ▼</button><button class="btn" data-a="endless">∞ ENDLESS</button></div>'), back);
    const run = async (seed, isDaily) => {
      el.close();
      const rnd = seeded(seed);
      const T = shuffle(window.TOPICS, rnd).slice(0, 7);
      const qs = T.map(t => shuffle(allQuestions().filter(q => q.topic === t.id), rnd)[0]).filter(Boolean);
      const R = await Solver.session(qs, { mode: 'daily', title: isDaily ? 'Daily Dive #' + diveNumber() : 'Endless Dive', timed: true, attempts: 1 });
      if (!R) return back();
      if (isDaily) { S.daily[todayStr()] = { depth: R.depth, grid: R.grid.join(''), n: diveNumber() }; }
      persist();
      results(R, 'daily', back, isDaily ? shareText(S.daily[todayStr()]) : null);
    };
    on(el, { back: () => { el.close(); back(); }, go: () => run(todayStr(), true), endless: () => run('e' + Date.now(), false), copy: () => copy(shareText(today)) });
  }
  const shareText = d => 'LOWMARSH · dive #' + d.n + '\n' + d.depth + 'm' + (d.depth >= 700 ? ' · THE BOTTOM' : '') + '\n' + d.grid;
  const copy = t => { if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => UI.toast('Copied!'), () => prompt('Copy:', t)); else prompt('Copy:', t); };

  // ───────── Past Papers ─────────
  function papersMenu(back) {
    const cards = window.PAPERS.map(p => {
      const best = S.papers[p.id];
      const total = p.questions.reduce((t, q) => t + q.marks, 0);
      return '<div class="topic"><div class="tn">' + esc(p.title) + '</div><div class="ts">' + esc(p.paper) + ' · ' + total + ' marks · ' + p.minutes + ' min' + (best ? ' · best ' + best + '/' + total : '') + '</div>' +
        '<div class="row"><button class="btn small primary" data-a="exam" data-v="' + p.id + '">⏱ Exam conditions</button><button class="btn small" data-a="guided" data-v="' + p.id + '">🐦 Guided</button><button class="btn small" data-a="list" data-v="' + p.id + '">☰ Pick a question</button></div></div>';
    }).join('');
    const el = overlayPanel('<h2 class="p5"><span>PAST PAPERS</span></h2><p class="muted"><b>Exam conditions</b>: 90-minute clock, one attempt per step, marked like the mark scheme. <b>Guided</b>: hints, Rook\'s walkthroughs and Mira\'s notes, no clock.</p><div class="topic-grid">' + cards + '</div>', back);
    on(el, {
      back: () => { el.close(); back(); },
      exam: id => { el.close(); runPaper(id, back); },
      guided: id => { el.close(); guidedPaper(window.PAPERS.find(p => p.id === id).questions, 0, back); },
      list: id => { el.close(); paperList(id, back); },
    });
  }

  function paperList(id, back) {
    const p = window.PAPERS.find(x => x.id === id);
    const el = overlayPanel('<h2 class="p5"><span>' + esc(p.title) + '</span></h2><div class="q-list">' + p.questions.map((q, i) => '<button data-a="q" data-v="' + i + '"><b>Q' + esc(q.num) + '</b> <span class="muted">[' + q.marks + '] ' + esc(topic(q.topic).name) + '</span>' + (S.solved[q.id] ? ' ✓' : '') + '</button>').join('') + '</div>', () => papersMenu(back));
    on(el, { back: () => { el.close(); papersMenu(back); }, q: i => { el.close(); guidedPaper(p.questions, +i, () => paperList(id, back), true); } });
  }

  async function guidedPaper(qs, i, back, single) {
    const q = qs[i];
    await Solver.story(Object.assign({ title: q.source, giver: null }, q));
    S.solved[q.id] = true; persist();
    if (!single && i + 1 < qs.length) {
      const next = await new Promise(res => {
        const el = UI.panel('<div class="sheet"><h2>Next: Q' + esc(qs[i + 1].num) + '</h2><div class="row"><button class="btn primary" data-a="y">CONTINUE ▸</button><button class="btn" data-a="n">stop here</button></div></div>', 'sheet-screen');
        on(el, { y: () => { el.close(); res(true); }, n: () => { el.close(); res(false); } });
      });
      if (next) return guidedPaper(qs, i + 1, back);
    }
    back();
  }

  async function runPaper(id, back) {
    const p = window.PAPERS.find(x => x.id === id);
    const R = await Solver.session(p.questions, { mode: 'exam', title: p.title, timed: false, attempts: 1, clock: p.minutes });
    if (!R) return back();
    const total = p.questions.reduce((t, q) => t + q.marks, 0);
    S.papers[id] = Math.max(S.papers[id] || 0, R.marks);
    persist();
    results(R, 'exam', back, null, total);
  }

  // ───────── results ─────────
  function results(R, mode, back, share, total) {
    const pct = mode === 'daily' ? R.depth / 700 : mode === 'exam' ? R.marks / total : R.right / Math.max(1, R.steps);
    const el = overlayPanel('<div class="results"><h2 class="p5"><span>' + (mode === 'daily' ? 'DIVE LOG' : mode === 'exam' ? 'PAPER MARKED' : 'DRILL COMPLETE') + '</span></h2>' +
      (mode === 'daily' ? '<div class="rank">' + R.depth + 'm</div><div class="depth-note">' + esc(depthNote(R.depth)) + '</div>' : mode === 'exam' ? '<div class="rank">' + R.marks + '<small>/' + total + '</small></div>' : '<div class="rank">' + (pct >= 0.9 ? 'S' : pct >= 0.72 ? 'A' : pct >= 0.5 ? 'B' : 'C') + '</div>') +
      '<div class="stat-grid"><div><b>' + R.right + '/' + R.steps + '</b><span>steps right</span></div><div><b>' + Math.round(pct * 100) + '%</b><span>score</span></div><div><b>' + R.hints + '</b><span>hints</span></div><div><b>' + Math.floor(R.time / 60) + ':' + String(Math.round(R.time % 60)).padStart(2, '0') + '</b><span>time</span></div></div>' +
      (R.byQ && R.byQ.length ? '<table class="tbl marks"><tr><th>Q</th><th>marks</th></tr>' + R.byQ.map(b => '<tr><td>' + esc(b.num) + '</td><td>' + b.got + ' / ' + b.of + '</td></tr>').join('') + '</table>' : '') +
      (share ? '<div class="share">' + esc(share) + '</div><button class="btn small" data-a="copy">Copy result</button>' : '') +
      (R.missed.length ? '<div class="panel"><b>Go over these again:</b><ul>' + R.missed.map(m => '<li>' + esc(m) + '</li>').join('') + '</ul></div>' : '') +
      '</div>', back);
    on(el, { back: () => { el.close(); back(); }, copy: () => copy(share) });
  }

  // ───────── stats ─────────
  function record(topicId, ok) {
    if (!topicId) return;
    const st = S.stats[topicId] || (S.stats[topicId] = { right: 0, wrong: 0 });
    ok ? st.right++ : st.wrong++;
    persist();
  }
  const accuracy = id => { const st = S.stats[id]; return st && st.right + st.wrong ? st.right / (st.right + st.wrong) : null; };
  const level = () => 1 + Object.keys(S.solved).length / 3 | 0;
  const maxHP = () => 16 + 2 * Math.min(level(), 20);
  const depthNote = d => DEPTHS.slice().reverse().find(x => x[0] <= d + 1)[1];

  // ───────── touch controls ─────────
  function touchControls() {
    const t = document.getElementById('touch');
    const send = (type, key) => document.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
    t.querySelectorAll('[data-k]').forEach(b => {
      const key = b.dataset.k;
      const isMove = key.startsWith('Arrow');
      b.addEventListener('pointerdown', e => { e.preventDefault(); send('keydown', key); if (!isMove) send('keyup', key); });
      if (isMove) ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => send('keyup', key)));
    });
  }

  window.Game = {
    get save() { return S; },
    CAST: null, G, ITEMS, fmt, topicLabel: id => (topic(id) ? topic(id).name : ''), topic, showLesson,
    record, level, maxHP, depthNote, openMenu, askRook, persist, scratch, grapher,
    daily: back => dailyIntro(back), drills: back => drillsMenu(back), papers: back => papersMenu(back), notebook: back => notebook(back, true),
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.Game.CAST = window.CAST;
    World.init(document.getElementById('game'));
    touchControls();
    document.getElementById('scratchBtn').addEventListener('click', () => scratch(() => {}));
    title();
  });
})();
