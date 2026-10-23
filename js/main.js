// LOWMARSH — the game shell: saving, the script API used by the story, menus, Mira's notebook,
// the scratch pad and grapher, drills, the Daily Challenge, Past Paper mode and accounts.
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = UI.esc;

  // ───────── save ─────────
  // Each signed-in account has its own save; signed out, you play on the device's guest save.
  const KEY = 'lowmarsh-save-v1';
  const fresh = () => ({
    name: '', started: false, map: 'world', x: 50, y: 58, dir: 'up',
    flags: { chapter: 0, fogLevel: 0.55 }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {},
    sound: true, timedDrills: false, paperFilter: { board: 'OCR', level: 'AS' },
  });
  const saveKey = () => { const a = Auth.current(); return a ? KEY + ':' + a.uid : KEY; };
  let S = fresh();
  function loadSave() {
    S = fresh();
    try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(saveKey())) || {}); } catch (e) { /* private mode */ }
    Sfx.setEnabled(S.sound);
  }
  loadSave();
  const persist = () => { try { localStorage.setItem(saveKey(), JSON.stringify(S)); } catch (e) { /* ignore */ } };
  // One-off tips (shared by every save on this device).
  const tipsKey = 'lowmarsh-tips';
  const seenTip = k => { try { return (JSON.parse(localStorage.getItem(tipsKey)) || {})[k]; } catch (e) { return false; } };
  const markTip = k => { try { const t = JSON.parse(localStorage.getItem(tipsKey)) || {}; t[k] = 1; localStorage.setItem(tipsKey, JSON.stringify(t)); } catch (e) { /* ignore */ } };

  const fmt = s => String(s).replace(/\{name\}/g, esc(S.name || 'you'));
  const fmtPlain = s => String(s).replace(/\{name\}/g, S.name || 'you');
  const topic = id => window.TOPICS.find(t => t.id === id);
  const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const diveNumber = () => Math.floor((Date.parse(todayStr() + 'T00:00:00Z') - Date.UTC(2026, 9, 23)) / 86400000) + 1;
  const shuffle = (a, rnd) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd || Math.random)() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function seeded(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } let a = h >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // All practice questions: the drill bank plus every past paper.
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
    hud.innerHTML = '<button class="hud-menu" title="Menu (C or Esc)">☰ MENU <kbd>C</kbd></button><span class="hud-loc">' + esc(World.map.name) + '</span>' + (obj ? '<span class="hud-obj">📜 ' + esc(fmtPlain(obj)) + '</span>' : '');
  }

  // ───────── title & new game ─────────
  function screen(html, cls) {
    World.active = false;
    World.locked = false;
    document.body.classList.remove('in-world');
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

  // The title screen: a pixel-art canvas (js/engine/titlescreen.js) whose sky follows the real time of day,
  // "Press Z or Enter", then a menu with a heart cursor. A hidden list of real buttons mirrors it for screen readers.
  let titleSel = null, titleSeen = false, titleUI = null;
  function title() {
    const items = (S.started ? [{ id: 'cont', label: 'Continue' }] : [])
      .concat([{ id: 'new', label: 'New Game' }, { id: 'papers', label: 'Past Papers' }, { id: 'drills', label: 'Drills' }, { id: 'daily', label: 'Daily Challenge' }, { id: 'settings', label: 'Settings' }]);
    const el = screen('<canvas class="title-cv" aria-hidden="true"></canvas>' +
      '<nav class="sr-only" aria-label="Main menu">' + items.map(it => '<button data-a="' + it.id + '">' + esc(it.label) + '</button>').join('') +
      '<button data-a="account">' + (Auth.current() && Auth.current().username ? 'Profile' : 'Log in') + '</button></nav>', 'canvas-title');
    const actions = {
      cont: () => startWorld(),
      new: () => {
        if (S.started && !confirm('Start a new story? Your story progress will be erased (practice stats are kept).')) return;
        const keep = { stats: S.stats, daily: S.daily, papers: S.papers, sound: S.sound, paperFilter: S.paperFilter };
        S = Object.assign(fresh(), keep); persist();
        nameEntry();
      },
      papers: () => papersMenu(title),
      drills: () => drillsMenu(title),
      daily: () => dailyIntro(title),
      settings: () => settings(title),
      account: () => (Auth.current() && Auth.current().username ? profile(title) : login(title)),
    };
    on(el, actions);
    if (titleUI) titleUI.cleanup();
    titleUI = null;
    TitleScreen.ready().then(() => {
      if (!el.contains($('.title-cv', el))) return;
      TitleScreen.clearCache();
      titleUI = TitleScreen.mount($('.title-cv', el), {
        items, skipIntro: titleSeen,
        selected: Math.max(0, items.findIndex(it => it.id === titleSel)),
        account: () => (Auth.current() && Auth.current().username ? Auth.current().username : 'Log in'),
        onSelect: i => { titleSel = items[i].id; },
        onChoose: id => { titleSeen = true; if (id !== 'account') titleSel = id; actions[id](); },
      });
    });
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
    document.body.classList.add('in-world');
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
      '<div class="menu-box"><div class="menu-head"><div><b>' + esc(S.name) + '</b> · LV ' + level() + ' · HP ' + maxHP() + '</div><div class="muted">Chapter ' + (S.flags.chapter || 0) + (Auth.current() && Auth.current().username ? ' · signed in as ' + esc(Auth.current().username) : '') + '</div></div>' +
      '<div class="menu-grid">' +
      '<button data-a="rook">🐦 Ask Rook</button><button data-a="notebook">📖 Mira\'s Notebook</button>' +
      '<button data-a="scratch">✏️ Scratch Pad</button><button data-a="grapher">📈 Grapher</button>' +
      '<button data-a="formulae">📐 Formula Book</button><button data-a="items">🎒 Items</button>' +
      '<button data-a="jobs">📋 Side Quests</button>' + (Auth.current() && Auth.current().username ? '<button data-a="account">👤 Profile</button>' : '<button data-a="account">🔑 Log in</button>') +
      '<button data-a="drills">🎯 Drills</button><button data-a="papers">📝 Past Papers</button>' +
      '<button data-a="daily">⏱ Daily Challenge</button><button data-a="save">💾 Save</button>' +
      '<button data-a="settings">⚙ Settings</button>' +
      '</div><div class="menu-foot"><button class="btn small" data-a="close">◂ back to the game (Esc)</button><button class="btn small primary" data-a="title">🚪 Save & exit to main menu</button></div></div>', 'menu-screen', () => (World.locked = false));
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
      account: sub(back => (Auth.current() && Auth.current().username ? profile(back) : login(back))),
      drills: sub(back => drillsMenu(back, true)),
      papers: sub(back => papersMenu(back, true)),
      daily: sub(back => dailyIntro(back, true)),
      save: () => { G.save(); UI.toast('Saved.'); },
      settings: sub(back => settings(back, true)),
      title: () => { G.save(); el.close(); World.locked = false; UI.toast('Saved.'); title(); },
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

  // Panels opened from the pause menu or the title screen. `host` = [castId, line]: someone from Lowmarsh
  // introduces the screen in a little dialogue box, the way they would in the game.
  function hostBox(host) {
    if (!host) return '';
    const c = window.CAST[host[0]];
    return '<div class="host"><img src="' + Sprites.portrait(c.portrait) + '" alt=""><div><b style="color:' + c.color + '">' + esc(fmtPlain(c.name)) + '</b><p>' + fmt(host[1]) + '</p></div></div>';
  }
  function overlayPanel(html, back, cls, host) {
    const el = UI.panel('<div class="sheet ' + (cls || '') + '"><button class="btn small sheet-close" data-a="back">◂ back</button>' + hostBox(host) + html + '</div>', 'sheet-screen', () => back());
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
    const el = overlayPanel('<h2 class="p5"><span>MIRA\'S NOTEBOOK</span></h2>' + (story ? '<p class="muted">' + S.pages.length + ' of ' + T.length + ' pages found. Pages turn up as the story goes on, but you can study every topic in Drills.</p>' : '') + '<div class="nb-pages">' + cards + '</div>', back);
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
    markTip('scratch');
    const el = overlayPanel('<h2 class="p5"><span>SCRATCH PAD</span></h2><p class="muted">A sheet of paper for your working, like the back of an exam paper. Draw with a mouse, finger or stylus. It keeps what you write until you clear it.</p>' +
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

  // The first time someone meets a problem, point out the scratch pad button.
  function scratchTip() {
    if (seenTip('scratch')) return;
    setTimeout(() => {
      const btns = document.querySelectorAll('[data-t=scratch], [data-q=scratch]');
      const b = btns[btns.length - 1];
      if (!b || document.querySelector('.tip-bubble')) return;
      const tip = document.createElement('div');
      tip.className = 'tip-bubble';
      tip.innerHTML = '<b>✏️ New here?</b> This is your <b>scratch pad</b>: a blank sheet for your working. Draw on it with your mouse, finger or stylus, then come back and type the answer. <button class="btn small">Got it</button>';
      b.insertAdjacentElement('afterend', tip);
      tip.querySelector('button').addEventListener('click', () => { markTip('scratch'); tip.remove(); });
    }, 400);
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
      (jobs.length ? '<ul class="item-list job-list">' + open.concat(done).map(li).join('') + '</ul>' : '<p class="muted">Nobody needs anything yet. Give it time.</p>'), back);
  }

  function settings(back) {
    const a = Auth.current();
    const el = overlayPanel('<h2 class="p5"><span>SETTINGS</span></h2>' +
      '<label class="toggle"><input type="checkbox" id="snd"' + (S.sound ? ' checked' : '') + '> Sound effects</label>' +
      '<hr><p class="muted">' + (a && a.username ? 'Signed in as <b>' + esc(a.username) + '</b>.' : 'Not signed in. Your progress is saved on this device.') + '</p>' +
      '<hr><p class="muted">Controls: arrows/WASD move · Z/Enter talk & confirm · C/Esc menu · R ask Rook. On phones use the on-screen pad.</p>' +
      '<button class="btn danger small" data-a="wipe">Erase ALL save data</button>', back);
    $('#snd', el).addEventListener('change', e => { S.sound = e.target.checked; Sfx.setEnabled(S.sound); persist(); });
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
    const el = overlayPanel('<h2 class="p5"><span>DRILLS</span></h2>' +
      '<div class="row" style="margin-bottom:12px"><label class="toggle"><input type="checkbox" id="tm"' + (S.timedDrills ? ' checked' : '') + '> ⏱ Exam timing (72 s a mark, like the real paper)</label>' +
      '<button class="btn small" data-a="mixed">🔀 Mixed</button><button class="btn small" data-a="weak">🩹 Weakest topics</button></div><div class="topic-grid">' + cards + '</div>', back, '',
      ['rook', 'Every topic, every past-paper question, one step at a time. Pick the one that scares you most. That\'s the one worth doing.']);
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

  // ───────── the Daily Challenge (down the old Lowmarsh well) ─────────
  // A new set every day, the same for everyone: today's date seeds which 7 topics and which questions.
  function streak() {
    let n = 0;
    for (let d = new Date(); ; d.setDate(d.getDate() - 1)) {
      const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (S.daily[k]) n++; else if (n || k !== todayStr()) break;
    }
    return n;
  }
  function dailyIntro(back) {
    const today = S.daily[todayStr()];
    const mid = new Date(); mid.setHours(24, 0, 0, 0);
    const mins = Math.ceil((mid - Date.now()) / 60000);
    const st = streak();
    const el = overlayPanel('<h2 class="p5"><span>DAILY CHALLENGE</span></h2><div class="pixel muted">#' + diveNumber() + ' · down the old Lowmarsh well' + (st ? ' · 🔥 ' + st + '-day streak' : '') + '</div>' +
      '<ul class="howto"><li>7 problems, a new set every day, the same for everyone.</li><li>Every step gets real exam time: 72 seconds a mark.</li><li>One shot per step. Fast, clean working sinks you deeper.</li><li>Up to 100 m a problem. 700 m is the bottom.</li></ul>' +
      (today ? '<div class="share">' + esc(shareText(today)) + '</div><p class="pixel muted">Next challenge in ' + Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm.</p><div class="row"><button class="btn small" data-a="copy">Copy result</button><button class="btn small" data-a="endless">∞ Endless practice</button></div>'
        : '<div class="row"><button class="btn primary" data-a="go">▼ START TODAY\'S CHALLENGE ▼</button><button class="btn" data-a="endless">∞ ENDLESS</button></div>'), back, '',
      ['moss', today ? 'You got ' + today.depth + ' metres down today! Come back tomorrow. New problems every morning, I\'ve checked.' : 'The old well! Seven problems, the same ones for everyone today. I dropped a pebble down it once. Never heard it land.']);
    const run = async (seed, isDaily) => {
      el.close();
      const rnd = seeded(seed);
      const T = shuffle(window.TOPICS, rnd).slice(0, 7);
      const qs = T.map(t => shuffle(allQuestions().filter(q => q.topic === t.id), rnd)[0]).filter(Boolean);
      const R = await Solver.session(qs, { mode: 'daily', title: isDaily ? 'Daily Challenge #' + diveNumber() : 'Endless practice', timed: true, attempts: 1 });
      if (!R) return back();
      if (isDaily) { S.daily[todayStr()] = { depth: R.depth, grid: R.grid.join(''), n: diveNumber() }; }
      persist();
      results(R, 'daily', back, isDaily ? shareText(S.daily[todayStr()]) : null);
    };
    on(el, { back: () => { el.close(); back(); }, go: () => run(todayStr(), true), endless: () => run('e' + Date.now(), false), copy: () => copy(shareText(today)) });
  }
  const shareText = d => 'LOWMARSH · daily #' + d.n + '\n' + d.depth + 'm' + (d.depth >= 700 ? ' · THE BOTTOM' : '') + '\n' + d.grid;
  const copy = t => { if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => UI.toast('Copied!'), () => prompt('Copy:', t)); else prompt('Copy:', t); };

  // ───────── Past Papers ─────────
  const BOARDS = [['OCR', 'OCR'], ['Edexcel', 'Edexcel — coming soon'], ['AQA', 'AQA — coming soon']];
  const LEVELS = [['AS', 'AS'], ['A', 'A Level'], ['both', 'Both']];
  function papersMenu(back) {
    const f = S.paperFilter || (S.paperFilter = { board: 'OCR', level: 'AS' });
    const lvl = p => p.level || 'AS';
    const list = window.PAPERS.filter(p => (p.board || 'OCR') === f.board && (f.level === 'both' || lvl(p) === f.level));
    const groups = [];
    list.forEach(p => {
      const name = (lvl(p) === 'AS' ? 'AS' : 'A Level') + ' · ' + p.paper;
      let g = groups.find(x => x.name === name);
      if (!g) groups.push(g = { name, papers: [] });
      g.papers.push(p);
    });
    const card = p => {
      const best = S.papers[p.id];
      const total = p.questions.reduce((t, q) => t + q.marks, 0);
      const parts = p.title.replace(/^OCR\s+/, '').split(/\s+—\s+/);
      return '<div class="paper-card"><div class="pc-when">' + esc(parts[1] || parts[0]) + '</div><div class="pc-code">' + esc(parts[1] ? parts[0] : '') + ' · ' + total + ' marks · ' + p.minutes + ' min' + (best != null ? ' · <span class="best">best ' + best + '/' + total + '</span>' : '') + '</div>' +
        '<div class="pc-btns"><button class="btn small primary" data-a="exam" data-v="' + p.id + '">⏱ Exam conditions</button><button class="btn small" data-a="guided" data-v="' + p.id + '">🐦 Guided</button><button class="btn small" data-a="list" data-v="' + p.id + '">☰ Pick a question</button></div></div>';
    };
    const comingSoon = '<div class="empty-box">A Level papers are on their way. Mira\'s still copying them out.</div>';
    const body = groups.map(g => '<h3 class="group-head">' + esc(g.name) + '</h3><div class="paper-grid">' + g.papers.map(card).join('') + '</div>').join('') +
      (f.level !== 'AS' && !list.some(p => lvl(p) === 'A') ? (f.level === 'both' ? '<h3 class="group-head">A Level</h3>' : '') + comingSoon : '');
    const el = overlayPanel('<h2 class="p5"><span>PAST PAPERS</span></h2>' +
      '<div class="pp-controls"><label class="pp-board">Exam board <select id="board">' + BOARDS.map(([v, l]) => '<option value="' + v + '"' + (v === f.board ? ' selected' : '') + (v !== 'OCR' ? ' disabled' : '') + '>' + l + '</option>').join('') + '</select></label>' +
      '<div class="seg" role="group" aria-label="Level">' + LEVELS.map(([v, l]) => '<button data-a="lvl" data-v="' + v + '" class="' + (v === f.level ? 'on' : '') + '">' + l + '</button>').join('') + '</div></div>' +
      '<div class="pp-modes"><span><b>⏱ Exam conditions</b> a real clock, one try per step, marked like the mark scheme</span><span><b>🐦 Guided</b> no clock, hints, Rook talks you through it</span><span><b>☰ Pick a question</b> just the one you want</span></div>' +
      body, back, 'papers-sheet', ['strix', 'The Exam Hall. Phones away, pens out. Every paper here is real and every mark counts. Hoo.']);
    $('#board', el).addEventListener('change', e => { f.board = e.target.value; persist(); el.close(); papersMenu(back); });
    on(el, {
      back: () => { el.close(); back(); },
      lvl: v => { f.level = v; persist(); el.close(); papersMenu(back); },
      exam: id => { el.close(); runPaper(id, () => papersMenu(back)); },
      guided: id => { el.close(); guidedPaper(window.PAPERS.find(p => p.id === id).questions, 0, () => papersMenu(back)); },
      list: id => { el.close(); paperList(id, back); },
    });
  }

  function paperList(id, back) {
    const p = window.PAPERS.find(x => x.id === id);
    const el = overlayPanel('<h2 class="p5"><span>' + esc(p.title.replace(/^OCR\s+/, '')) + '</span></h2><div class="q-list">' + p.questions.map((q, i) => '<button data-a="q" data-v="' + i + '"><b>Q' + esc(q.num) + '</b> <span class="muted">[' + q.marks + '] ' + esc(topic(q.topic).name) + '</span>' + (S.solved[q.id] ? ' ✓' : '') + '</button>').join('') + '</div>', () => papersMenu(back));
    on(el, { back: () => { el.close(); papersMenu(back); }, q: i => { el.close(); guidedPaper(p.questions, +i, () => paperList(id, back), true); } });
  }

  async function guidedPaper(qs, i, back, single) {
    const q = qs[i];
    const r = await Solver.story(Object.assign({}, q, { title: q.source.replace(/^OCR\s+/, ''), giver: null }), { quit: single ? 'back to the questions' : 'back to past papers' });
    if (r && r.quit) return back();
    S.solved[q.id] = true; persist();
    if (!single && i + 1 < qs.length) {
      const next = await new Promise(res => {
        const el = UI.panel('<div class="sheet"><button class="btn small sheet-close" data-a="n">◂ back to past papers</button><h2 class="p5"><span>Next: Q' + esc(qs[i + 1].num) + '</span></h2><div class="row"><button class="btn primary" data-a="y">CONTINUE ▸</button></div></div>', 'sheet-screen');
        on(el, { y: () => { el.close(); res(true); }, n: () => { el.close(); res(false); } });
      });
      if (next) return guidedPaper(qs, i + 1, back);
    }
    back();
  }

  async function runPaper(id, back) {
    const p = window.PAPERS.find(x => x.id === id);
    const R = await Solver.session(p.questions, { mode: 'exam', title: p.title.replace(/^OCR\s+/, ''), timed: false, attempts: 1, clock: p.minutes });
    if (!R) return back();
    const total = p.questions.reduce((t, q) => t + q.marks, 0);
    S.papers[id] = Math.max(S.papers[id] || 0, R.marks);
    persist();
    results(R, 'exam', back, null, total);
  }

  // ───────── accounts: log in, sign up, choose a username, profile ─────────
  const GOOGLE_G = '<svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"/></svg>';
  const APPLE = '<svg viewBox="0 0 17 20" width="16" height="18" aria-hidden="true"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM11.6 3c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>';
  function authPanel(inner, back) {
    const el = UI.panel('<div class="auth"><button class="btn small sheet-close" data-a="back">◂ back</button><div class="auth-logo">LOWMARSH</div>' + inner + '</div>', 'sheet-screen auth-screen', () => back());
    el.addEventListener('keydown', e => e.stopPropagation());
    return el;
  }
  // After signing in: give the account its own save (bringing the guest save with it the first time).
  function afterSignIn() {
    const k = saveKey();
    try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(S)); } catch (e) { /* ignore */ }
    loadSave();
    UI.toast('Signed in as ' + Auth.current().username);
    title();
  }
  function login(back, mode) {
    mode = mode || 'in';
    const up = mode === 'up';
    const el = authPanel(
      '<div class="tabs"><button data-a="tab" data-v="in" class="' + (up ? '' : 'on') + '">SIGN IN</button><button data-a="tab" data-v="up" class="' + (up ? 'on' : '') + '">SIGN UP</button></div>' +
      '<button class="sso" data-a="sso" data-v="google">' + GOOGLE_G + '<span>Continue with Google</span></button>' +
      '<button class="sso apple" data-a="sso" data-v="apple">' + APPLE + '<span>Continue with Apple</span></button>' +
      '<div class="or"><span>or</span></div>' +
      '<form class="auth-form" novalidate>' +
      (up ? '<label>Email<input name="id" type="email" autocomplete="email" required></label><label>Password<input name="pw" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm password<input name="pw2" type="password" autocomplete="new-password" required></label>'
        : '<label>Email or username<input name="id" autocomplete="username" required></label><label>Password<input name="pw" type="password" autocomplete="current-password" required></label>') +
      '<button class="btn primary" type="submit">' + (up ? 'CREATE ACCOUNT ▸' : 'SIGN IN ▸') + '</button></form>' +
      '<p class="swap">' + (up ? 'Already have an account? <button data-a="tab" data-v="in">Sign in</button>' : 'New to Lowmarsh? <button data-a="tab" data-v="up">Sign up</button>') + '</p>' +
      '<div class="host auth-rook"><img src="' + Sprites.portrait('rook') + '" alt=""><div><b style="color:#b8c0ff">Rook</b><p class="say">' + (up ? 'An account keeps your story, your stats and your streak together.' : 'Welcome back. I kept your seat warm. Metaphorically.') + '</p></div></div>' +
      (Auth.configured ? '' : '<p class="muted small-note">Accounts are kept on this device for now.</p>'), back);
    const say = t => { $('.say', el).textContent = t; };
    const done = () => { el.close(); Auth.current().username ? afterSignIn() : chooseUsername(back); };
    on(el, {
      back: () => { el.close(); back(); },
      tab: v => { el.close(); login(back, v); },
      sso: async v => { try { await Auth.signInWith(v); done(); } catch (e) { say(e.message); } },
    });
    $('form', el).addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        if (up) {
          if (fd.get('pw') !== fd.get('pw2')) return say('Those passwords don\'t match.');
          await Auth.signUp(fd.get('id'), fd.get('pw'));
        } else await Auth.signIn(fd.get('id'), fd.get('pw'));
        done();
      } catch (err) { say(err.message); }
    });
    setTimeout(() => { const i = $('input', el); if (i) i.focus(); }, 50);
  }
  function chooseUsername(back, editing) {
    const cur = Auth.current();
    const el = authPanel('<h2 class="auth-h">' + (editing ? 'Change your username' : 'Choose a username') + '</h2><p class="muted">This is the name other players see. You can change it later.</p>' +
      '<form class="auth-form" novalidate><label>Username<input name="u" maxlength="16" autocomplete="off" spellcheck="false" value="' + esc(cur.username || (S.name || '').replace(/[^A-Za-z0-9_]/g, '')) + '"></label><div class="u-check"></div>' +
      '<button class="btn primary" type="submit">THAT\'S ME ▸</button></form>', back);
    const inp = $('input', el), chk = $('.u-check', el);
    const check = () => { const err = inp.value ? Auth.validUsername(inp.value) : ''; chk.textContent = err || (inp.value ? '✓ Available' : ''); chk.className = 'u-check ' + (err ? 'bad' : 'ok'); };
    inp.addEventListener('input', check); check();
    on(el, { back: () => { el.close(); if (!editing && !Auth.current().username) Auth.signOut(); back(); } });
    $('form', el).addEventListener('submit', e => {
      e.preventDefault();
      try { Auth.setUsername(inp.value); el.close(); editing ? profile(back) : afterSignIn(); } catch (err) { chk.textContent = err.message; chk.className = 'u-check bad'; }
    });
    setTimeout(() => inp.focus(), 50);
  }
  function profile(back) {
    const a = Auth.current();
    const jobs = window.SCRIPTS.jobs ? window.SCRIPTS.jobs(S.flags) : [];
    const papersDone = Object.keys(S.papers).length;
    const st = Object.values(S.stats).reduce((t, x) => ({ r: t.r + x.right, w: t.w + x.wrong }), { r: 0, w: 0 });
    const via = { google: 'Google', apple: 'Apple', email: 'email' }[a.provider] || a.provider;
    const el = authPanel('<div class="profile-head"><img src="' + Sprites.portrait('player') + '" alt=""><div><h2 class="auth-h">' + esc(a.username) + '</h2><p class="muted">Signed in with ' + esc(via) + (a.email ? ' · ' + esc(a.email) : '') + '</p></div></div>' +
      '<div class="stat-grid"><div><b>' + (S.started ? 'Ch ' + (S.flags.chapter || 0) : '—') + '</b><span>story</span></div><div><b>LV ' + level() + '</b><span>level</span></div>' +
      '<div><b>' + S.pages.length + '/15</b><span>notebook pages</span></div><div><b>' + jobs.filter(j => j.done).length + '/' + jobs.length + '</b><span>side quests</span></div>' +
      '<div><b>' + papersDone + '</b><span>papers sat</span></div><div><b>' + streak() + '</b><span>day streak</span></div>' +
      '<div><b>' + (st.r + st.w ? Math.round(100 * st.r / (st.r + st.w)) + '%' : '—') + '</b><span>steps right first time</span></div></div>' +
      '<div class="row"><button class="btn small" data-a="rename">✎ Change username</button><button class="btn small danger" data-a="out">Log out</button></div>', back);
    on(el, {
      back: () => { el.close(); back(); },
      rename: () => { el.close(); chooseUsername(back, true); },
      out: async () => { await Auth.signOut(); el.close(); loadSave(); UI.toast('Signed out.'); title(); },
    });
  }

  // ───────── results ─────────
  function results(R, mode, back, share, total) {
    const pct = mode === 'daily' ? R.depth / 700 : mode === 'exam' ? R.marks / total : R.right / Math.max(1, R.steps);
    const el = overlayPanel('<div class="results"><h2 class="p5"><span>' + (mode === 'daily' ? 'CHALLENGE LOG' : mode === 'exam' ? 'PAPER MARKED' : 'DRILL COMPLETE') + '</span></h2>' +
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
    record, level, maxHP, depthNote, openMenu, askRook, persist, scratch, grapher, scratchTip,
    titleChoose: id => (titleUI ? titleUI.choose(id) : null),
    daily: back => dailyIntro(back), drills: back => drillsMenu(back), papers: back => papersMenu(back), notebook: back => notebook(back, true),
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.Game.CAST = window.CAST;
    World.init(document.getElementById('game'));
    touchControls();
    document.getElementById('scratchBtn').addEventListener('click', () => { if (!World.locked) { World.locked = true; scratch(() => { World.locked = false; }); } });
    document.getElementById('hud').addEventListener('click', e => { if (e.target.closest('.hud-menu')) openMenu(); });
    title();
  });
})();
