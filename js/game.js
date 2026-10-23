// THE DESCENT — game engine: screens, dialogue, battles, dodge phases, practice, Daily Dive.
(function () {
  'use strict';

  const app = document.getElementById('app');
  const overlay = document.getElementById('overlay');
  const ZONES = window.ZONES, QUESTIONS = window.QUESTIONS, STORY = window.STORY, CHARS = window.CHARACTERS;

  // ───────────── utilities ─────────────
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => String(s).replace(/\{name\}/g, esc(S.name || 'Krill'));
  const shuffle = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd || Math.random)() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const zoneById = id => ZONES.find(z => z.id === id);
  const zoneIndex = z => ZONES.indexOf(z);
  const qMarks = q => q.steps.reduce((t, s) => t + (s.marks || 1), 0);

  function renderMath(el) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(el, {
          delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
          throwOnError: false,
        });
      } catch (e) { /* leave raw TeX visible */ }
    }
  }
  function texInline(tex) {
    if (window.katex) {
      try { return window.katex.renderToString(tex, { throwOnError: false }); } catch (e) { /* fall through */ }
    }
    return esc(tex);
  }

  function seeded(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) { h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let a = h >>> 0;
    return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const DIVE_EPOCH = Date.UTC(2026, 9, 23);
  const diveNumber = () => Math.floor((Date.parse(todayStr() + 'T00:00:00Z') - DIVE_EPOCH) / 86400000) + 1;

  // ───────────── save ─────────────
  const SAVE_KEY = 'the-descent-save-v1';
  const freshSave = () => ({
    name: '', prologueSeen: false, cleared: {}, ranks: {}, stats: {}, daily: {},
    examDate: '2027-05-13', sound: true, timedPractice: false, seenBossIntro: {},
  });
  let S = freshSave();
  try { S = Object.assign(freshSave(), JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) { /* private mode */ }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  Sfx.setEnabled(S.sound);

  const level = () => 1 + Object.keys(S.cleared).length;
  const maxHP = () => 16 + 4 * level();
  const isUnlocked = z => zoneIndex(z) === 0 || !!S.cleared[ZONES[zoneIndex(z) - 1].id];
  const currentDepth = () => ZONES.filter(z => S.cleared[z.id]).reduce((d, z) => Math.max(d, z.depth), 0);
  const daysLeft = () => Math.max(0, Math.ceil((Date.parse(S.examDate + 'T09:00:00') - Date.now()) / 86400000));

  function record(zoneId, ok) {
    const st = S.stats[zoneId] || (S.stats[zoneId] = { right: 0, wrong: 0 });
    ok ? st.right++ : st.wrong++;
  }
  const accuracy = id => { const st = S.stats[id]; return st && st.right + st.wrong ? st.right / (st.right + st.wrong) : null; };

  function setLight() {
    const d = currentDepth();
    document.getElementById('sea').style.setProperty('--light', String(Math.max(0.15, 1 - d / 800)));
  }

  function show(html, cls) {
    overlay.innerHTML = '';
    app.innerHTML = '<div class="screen ' + (cls || '') + '">' + html + '</div>';
    window.scrollTo(0, 0);
    renderMath(app);
    return app.firstElementChild;
  }

  function on(root, handlers) {
    root.addEventListener('click', e => {
      const t = e.target.closest('[data-a]');
      if (t && handlers[t.dataset.a]) { Sfx.select(); handlers[t.dataset.a](t.dataset.v, t); }
    });
  }

  // ───────────── dialogue (Undertale-style typewriter) ─────────────
  function dialogue(lines, done, opts) {
    opts = opts || {};
    let i = 0, typing = null, full = '';
    overlay.innerHTML =
      '<div class="dlg-wrap ' + (opts.dark ? 'dark' : '') + '">' +
      '<button class="btn small dlg-skip">skip ▸▸</button>' +
      '<div class="dlg"><div class="dlg-portrait"></div><div style="flex:1"><div class="dlg-name"></div><div class="dlg-text"></div></div><div class="dlg-next">▼</div></div></div>';
    const wrap = $('.dlg-wrap', overlay), portrait = $('.dlg-portrait', overlay), nameEl = $('.dlg-name', overlay), textEl = $('.dlg-text', overlay);

    function speaker(id) {
      if (id === 'boss' && opts.boss) return { name: fmt(opts.boss.name), icon: opts.boss.icon, color: opts.boss.color, blip: 180 };
      const c = CHARS[id] || CHARS.narrator;
      return { name: fmt(c.name), icon: c.icon, color: c.color, blip: c.blip };
    }
    function showLine() {
      const [who, text] = lines[i];
      const sp = speaker(who);
      portrait.textContent = sp.icon;
      nameEl.textContent = sp.name;
      nameEl.style.color = sp.color;
      full = fmt(text).replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      textEl.textContent = '';
      let k = 0;
      clearInterval(typing);
      typing = setInterval(() => {
        k++;
        textEl.textContent = full.slice(0, k);
        if (k % 2 === 0 && full[k - 1] !== ' ') Sfx.blip(sp.blip);
        if (k >= full.length) { clearInterval(typing); typing = null; }
      }, 28);
    }
    function advance() {
      if (typing) { clearInterval(typing); typing = null; textEl.textContent = full; return; }
      i++;
      if (i >= lines.length) return finish();
      showLine();
    }
    let closed = false;
    function finish() {
      closed = true;
      clearInterval(typing);
      document.removeEventListener('keydown', key);
      overlay.innerHTML = '';
      done && done();
    }
    function key(e) {
      if (['Enter', ' ', 'z', 'Z'].includes(e.key)) { e.preventDefault(); advance(); }
      if (e.key === 'Escape') finish();
    }
    wrap.addEventListener('click', e => { if (e.target.closest('.dlg-skip')) finish(); else advance(); });
    setTimeout(() => { if (!closed) document.addEventListener('keydown', key); }, 0); // don't catch the key that opened us
    if (!lines.length) return finish();
    showLine();
  }

  function splash(text, sub, done) {
    const el = document.createElement('div');
    el.className = 'splash';
    el.innerHTML = '<b>' + esc(text) + (sub ? '<i>' + esc(sub) + '</i>' : '') + '</b>';
    document.body.appendChild(el);
    Sfx.crit();
    setTimeout(() => { el.remove(); done && done(); }, 1300);
  }

  // ───────────── title & intro ─────────────
  function title() {
    setLight();
    const el = show(
      '<h1 class="logo">THE DESCENT<small>BATHYS · AS MATHS</small></h1>' +
      '<p class="tagline">to go up, you must go down</p>' +
      '<div class="title-menu">' +
      (S.prologueSeen ? '<button class="btn primary" data-a="cont">▶ CONTINUE — ' + esc(S.name) + '</button>' : '') +
      '<button class="btn ' + (S.prologueSeen ? '' : 'primary') + '" data-a="new">▼ ' + (S.prologueSeen ? 'NEW GAME' : 'BEGIN DESCENT') + ' ▼</button>' +
      '<button class="btn" data-a="daily">DAILY DIVE #' + diveNumber() + '</button>' +
      '<button class="btn" data-a="practice">PRACTICE</button>' +
      '</div><div class="krill-bob">🦐</div>' +
      '<p class="foot">An A-level maths RPG. Every boss believes a classic mistake — beat it with your working.</p>',
      'title-screen');
    on(el, {
      cont: hub,
      new: () => {
        if (S.prologueSeen && !confirm('Start a new game? Your progress will be erased.')) return;
        const keep = { examDate: S.examDate, sound: S.sound, daily: S.daily };
        S = Object.assign(freshSave(), keep);
        persist();
        nameEntry();
      },
      daily: dailyIntro,
      practice: () => { if (!S.name) S.name = 'Krill'; practiceSelect(); },
    });
  }

  function nameEntry() {
    const el = show(
      '<h2>Name the fallen student.</h2>' +
      '<input id="nm" maxlength="12" autocomplete="off" spellcheck="false" placeholder="…">' +
      '<div><button class="btn primary" data-a="go">DONE</button></div>',
      'name-screen');
    const inp = $('#nm', el);
    inp.focus();
    const go = () => {
      const n = inp.value.trim();
      if (!n) { inp.focus(); return; }
      S.name = n;
      persist();
      dialogue(STORY.prologue, () => { S.prologueSeen = true; persist(); hub(); }, { dark: true });
    };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    on(el, { go });
  }

  // ───────────── hub: the Tide Room ─────────────
  function lumenReading() {
    const open = ZONES.find(z => isUnlocked(z) && !S.cleared[z.id]);
    const played = ZONES.filter(z => S.stats[z.id] && S.stats[z.id].right + S.stats[z.id].wrong >= 4);
    const weakest = played.sort((a, b) => accuracy(a.id) - accuracy(b.id))[0];
    if (weakest && accuracy(weakest.id) < 0.7)
      return 'Your weakest current is <b>' + esc(weakest.topic) + '</b> (' + Math.round(accuracy(weakest.id) * 100) + '% accurate). Practise it before it drags you under.';
    if (open && open.final) return 'The Hadal Gate stands open below you. Everything you have learned, all at once.';
    if (open) return 'The current pulls you toward <b>' + esc(open.name) + '</b>. ' + esc(open.boss.name) + ' guards ' + esc(open.system) + '.';
    return 'You have reached the trench floor. Keep your skills sharp — the full A level lies deeper still.';
  }

  function hub() {
    setLight();
    const today = S.daily[todayStr()];
    const cleared = Object.keys(S.cleared).length;
    const el = show(
      '<div class="hub-head">' +
      '<div class="cal"><div class="cal-num">' + daysLeft() + '</div><div>days until<br>the Gate opens</div></div>' +
      '<div class="who"><div>🦐 ' + esc(S.name) + ' &nbsp; LV ' + level() + ' &nbsp; HP ' + maxHP() + '</div>' +
      '<div class="muted">depth ' + currentDepth() + 'm · ' + cleared + '/' + ZONES.length + ' districts freed</div></div>' +
      '</div>' +
      '<h2 class="p5"><span>THE TIDE ROOM</span></h2>' +
      '<div class="lumen-say">🏮 ' + lumenReading() + '</div>' +
      '<div class="hub-grid">' +
      '<button class="card" data-a="map"><div class="ic">🌊</div><h3>Descend</h3><p>Story mode. Explore Bathys, face the guardians, free the districts.</p><span class="badge">' + currentDepth() + 'm</span></button>' +
      '<button class="card" data-a="practice"><div class="ic">🎯</div><h3>Practice</h3><p>Any topic, any time. No clock, no damage — full worked solutions.</p></button>' +
      '<button class="card" data-a="daily"><div class="ic">⏱️</div><h3>Daily Dive</h3><p>7 problems · 25 s a step · same for everyone. How deep can you go?</p><span class="badge">' + (today ? today.depth + 'm' : '#' + diveNumber()) + '</span></button>' +
      '<button class="card" data-a="codex"><div class="ic">📖</div><h3>Codex</h3><p>Elder Theta\'s lessons: every method, worked example, and trap.</p></button>' +
      '<button class="card" data-a="settings"><div class="ic">📅</div><h3>Calendar</h3><p>Set your exam date, sound, save data.</p></button>' +
      '<button class="card" data-a="title"><div class="ic">🚪</div><h3>Surface</h3><p>Back to the title screen.</p></button>' +
      '</div>');
    on(el, { map: depthMap, practice: practiceSelect, daily: dailyIntro, codex, settings, title });
  }

  // ───────────── the depth map ─────────────
  function depthMap() {
    let rows = '';
    ZONES.forEach(z => {
      const unlocked = isUnlocked(z), done = S.cleared[z.id];
      const state = !unlocked ? 'locked' : done ? 'done' : 'open';
      rows +=
        '<button class="zone-row ' + state + '" data-a="zone" data-v="' + z.id + '"' + (unlocked ? '' : ' aria-disabled="true"') + '>' +
        '<span class="dm">' + z.depth + 'm</span>' +
        '<span class="zi">' + (unlocked ? fmt(z.boss.icon) : '❔') + '</span>' +
        '<span class="zt"><div class="zn">' + esc(z.name) + '</div>' +
        '<div class="zs">' + esc(z.topic) + ' · ' + esc(z.paper) + (unlocked ? ' · ' + esc(fmt(z.boss.name)) : '') + '</div>' +
        '<div class="znote">' + esc(z.depthNote) + '</div></span>' +
        '<span class="zr">' + (done ? (S.ranks[z.id] || '✓') : unlocked ? '▼' : '🔒') + '</span></button>';
    });
    const el = show(
      '<button class="btn small back" data-a="back">◂ Tide Room</button>' +
      '<h2 class="p5"><span>DESCEND</span></h2>' +
      '<div class="depth-map"><div class="surface">SURFACE · 0m</div>' + rows + '</div>');
    on(el, {
      back: hub,
      zone: id => { const z = zoneById(id); if (isUnlocked(z)) zoneScreen(z); },
    });
  }

  function zoneScreen(z) {
    const n = QUESTIONS.filter(q => q.zone === z.id).length;
    const el = show(
      '<button class="btn small back" data-a="back">◂ Depth map</button>' +
      '<div class="muted pixel">' + z.depth + 'm · ' + esc(z.paper) + '</div>' +
      '<h2 class="p5"><span>' + esc(z.name) + '</span></h2>' +
      '<div class="panel zone-hero" style="--c:' + z.boss.color + '">' +
      '<div class="big">' + fmt(z.boss.icon) + '</div>' +
      '<div style="flex:1;min-width:220px"><h2>' + esc(fmt(z.boss.name)) + '</h2><div class="muted">' + esc(z.boss.title) + ' · guards ' + esc(z.system) + '</div>' +
      '<div class="misc"><b>Believes:</b> ' + fmt(z.boss.misconception) + '</div>' +
      '<div class="realworld"><b>Why it matters:</b> ' + z.realWorld + '</div></div></div>' +
      '<p class="muted">Topic: <b>' + esc(z.topic) + '</b> · ' + (z.final ? 'mixed questions from every district' : n + ' problems in this district') +
      (S.cleared[z.id] ? ' · best rank <b style="color:var(--yellow)">' + (S.ranks[z.id] || '✓') + '</b>' : '') + '</p>' +
      '<div class="row">' +
      '<button class="btn" data-a="lesson">📖 THETA\'S LESSON</button>' +
      '<button class="btn primary" data-a="fight">⚔ FACE ' + esc(fmt(z.boss.name)).toUpperCase() + '</button>' +
      (z.final ? '' : '<button class="btn" data-a="practice">🎯 PRACTISE</button>') +
      '</div>');
    on(el, {
      back: depthMap,
      lesson: () => lesson(z, () => zoneScreen(z)),
      fight: () => startBoss(z),
      practice: () => startPractice([z.id]),
    });
  }

  function lesson(z, back) {
    const el = show(
      '<button class="btn small back" data-a="back">◂ Back</button>' +
      '<div class="muted pixel">🐢 Elder Theta\'s lesson</div>' +
      '<h2 class="p5"><span>' + esc(z.topic) + '</span></h2>' +
      '<div class="panel lesson">' + z.lesson + '</div>' +
      '<div class="realworld">' + z.realWorld + '</div>' +
      '<div class="row" style="margin-top:14px">' +
      '<button class="btn" data-a="back">◂ BACK</button>' +
      (z.final ? '' : '<button class="btn primary" data-a="practice">🎯 PRACTISE THIS</button>') + '</div>');
    on(el, { back, practice: () => startPractice([z.id]) });
  }

  function codex() {
    let cards = '';
    ZONES.forEach(z => {
      cards += '<button class="card" data-a="open" data-v="' + z.id + '"><div class="ic">' + fmt(z.boss.icon) + '</div><h3>' + esc(z.topic) + '</h3><p>' + esc(z.paper) + ' · ' + esc(z.name) + '</p></button>';
    });
    const el = show('<button class="btn small back" data-a="back">◂ Tide Room</button><h2 class="p5"><span>CODEX</span></h2><div class="hub-grid">' + cards + '</div>');
    on(el, { back: hub, open: id => lesson(zoneById(id), codex) });
  }

  function settings() {
    const el = show(
      '<button class="btn small back" data-a="back">◂ Tide Room</button>' +
      '<h2 class="p5"><span>CALENDAR</span></h2>' +
      '<div class="panel">' +
      '<p class="pixel">🏮 "When does the Gate open? Tell me the date of your first AS exam."</p>' +
      '<input type="date" id="exam" value="' + esc(S.examDate) + '" class="ans" style="max-width:220px">' +
      '<p class="muted">' + daysLeft() + ' days left. Check your exam board\'s timetable for the exact date.</p>' +
      '<label class="toggle"><input type="checkbox" id="snd"' + (S.sound ? ' checked' : '') + '> Sound effects</label>' +
      '<hr style="border-color:var(--line);margin:18px 0">' +
      '<button class="btn danger small" data-a="reset">Erase save data</button></div>');
    $('#exam', el).addEventListener('change', e => { if (e.target.value) { S.examDate = e.target.value; persist(); settings(); } });
    $('#snd', el).addEventListener('change', e => { S.sound = e.target.checked; Sfx.setEnabled(S.sound); persist(); });
    on(el, {
      back: hub,
      reset: () => { if (confirm('Erase everything? This cannot be undone.')) { S = freshSave(); persist(); title(); } },
    });
  }

  // ───────────── practice ─────────────
  function practiceSelect() {
    let cards = '';
    ZONES.filter(z => !z.final).forEach(z => {
      const acc = accuracy(z.id), n = QUESTIONS.filter(q => q.zone === z.id).length;
      cards += '<div class="topic"><div class="tn">' + fmt(z.boss.icon) + ' ' + esc(z.topic) + '</div>' +
        '<div class="ts">' + esc(z.paper) + ' · ' + n + ' problems' + (acc == null ? '' : ' · ' + Math.round(acc * 100) + '% accuracy') + '</div>' +
        '<div class="acc"><i style="width:' + Math.round((acc || 0) * 100) + '%"></i></div>' +
        '<div class="row"><button class="btn small" data-a="lesson" data-v="' + z.id + '">Lesson</button>' +
        '<button class="btn small primary" data-a="go" data-v="' + z.id + '">Practise</button></div></div>';
    });
    const el = show(
      '<button class="btn small back" data-a="back">◂ Back</button>' +
      '<h2 class="p5"><span>PRACTICE</span></h2>' +
      '<p class="muted">No damage, no pressure — hints are free and every step comes with Elder Theta\'s working.</p>' +
      '<div class="row" style="margin-bottom:14px"><label class="toggle"><input type="checkbox" id="tm"' + (S.timedPractice ? ' checked' : '') + '> Krillion timer (25 s a step)</label>' +
      '<button class="btn small" data-a="mixed">🔀 Mixed — everything</button>' +
      '<button class="btn small" data-a="weak">🩹 Weakest topics</button></div>' +
      '<div class="topic-grid">' + cards + '</div>');
    $('#tm', el).addEventListener('change', e => { S.timedPractice = e.target.checked; persist(); });
    on(el, {
      back: () => (S.prologueSeen ? hub() : title()),
      lesson: id => lesson(zoneById(id), practiceSelect),
      go: id => startPractice([id]),
      mixed: () => startPractice(ZONES.filter(z => !z.final).map(z => z.id), 8),
      weak: () => {
        const ranked = ZONES.filter(z => !z.final).map(z => ({ z, a: accuracy(z.id) })).sort((x, y) => (x.a == null ? 0.5 : x.a) - (y.a == null ? 0.5 : y.a));
        startPractice(ranked.slice(0, 3).map(r => r.z.id), 6);
      },
    });
  }

  function startPractice(zoneIds, limit) {
    let qs = shuffle(QUESTIONS.filter(q => zoneIds.includes(q.zone)));
    if (limit) qs = qs.slice(0, limit);
    battle({
      mode: 'practice', zone: zoneIds.length === 1 ? zoneById(zoneIds[0]) : null, questions: qs,
      timed: S.timedPractice, attempts: 3,
      onEnd: r => results(r, practiceSelect),
    });
  }

  // ───────────── story bosses ─────────────
  function pickBossQuestions(z) {
    if (z.final) {
      const byZone = shuffle(ZONES.filter(x => !x.final));
      return byZone.slice(0, 6).map(x => shuffle(QUESTIONS.filter(q => q.zone === x.id))[0]);
    }
    return shuffle(QUESTIONS.filter(q => q.zone === z.id)).slice(0, 3);
  }

  function startBoss(z) {
    const boss = Object.assign({}, z.boss, { name: fmt(z.boss.name) });
    const go = () => splash('SHOW YOUR WORKING!', boss.name + ' blocks the way', () => battle({
      mode: 'boss', zone: z, boss, questions: pickBossQuestions(z), timed: true, attempts: 2,
      onEnd: r => {
        if (r.dead) return gameOver(z);
        const first = !S.cleared[z.id];
        S.cleared[z.id] = true;
        if (!S.ranks[z.id] || 'SABC'.indexOf(r.rank) < 'SABC'.indexOf(S.ranks[z.id])) S.ranks[z.id] = r.rank;
        persist();
        setLight();
        Sfx.win();
        dialogue(z.boss.defeat, () => results(r, () => {
          const after = first && STORY.afterClear[z.id];
          const next = z.final ? ending : depthMap;
          after ? dialogue(after, next) : next();
        }), { boss });
      },
    }));
    if (!S.seenBossIntro[z.id]) {
      S.seenBossIntro[z.id] = true;
      persist();
      dialogue(z.boss.intro, go, { boss });
    } else go();
  }

  function gameOver(z) {
    Sfx.hurt();
    const el = show(
      '<h1>GAME OVER</h1>' +
      '<p style="font-size:26px">' + esc(S.name) + '! You can\'t sink like this...</p>' +
      '<p style="font-size:22px" class="muted">🐡 "Every wrong answer showed you the right working. Read Theta\'s lesson and try again — you\'re closer than you think."</p>' +
      '<div class="row" style="justify-content:center;margin-top:24px">' +
      '<button class="btn primary" data-a="retry">TRY AGAIN</button>' +
      '<button class="btn" data-a="lesson">📖 LESSON</button>' +
      '<button class="btn" data-a="hub">TIDE ROOM</button></div>', 'gameover');
    on(el, { retry: () => startBoss(z), lesson: () => lesson(z, () => zoneScreen(z)), hub });
  }

  function ending() {
    const el = show(
      '<h1 class="logo">AS GATE OPEN</h1>' +
      '<p class="tagline">700m · the trench floor</p>' +
      '<div class="panel pixel" style="max-width:640px;margin:0 auto 20px">You freed every district of Bathys — indices, quadratics, graphs, circles, binomials, trig, logs, calculus, vectors, data, probability, kinematics and forces.<br><br>Below the Gate, the trench keeps going. The Hadal Deep — the full A level — is waiting for your past papers.</div>' +
      '<button class="btn primary" data-a="hub">RETURN TO THE TIDE ROOM</button>', 'title-screen');
    on(el, { hub });
  }

  // ───────────── Daily Dive (Krillion mode) ─────────────
  function dailyQuestions(seed) {
    const rnd = seeded(seed);
    const zones = shuffle(ZONES.filter(z => !z.final), rnd).slice(0, 7);
    return zones.map(z => shuffle(QUESTIONS.filter(q => q.zone === z.id), rnd)[0]);
  }

  function dailyIntro() {
    if (!S.name) S.name = 'Krill';
    const today = S.daily[todayStr()];
    const el = show(
      '<button class="btn small back" data-a="back">◂ Back</button>' +
      '<h2 class="p5"><span>THE DAILY DIVE</span></h2>' +
      '<div class="pixel muted">dive #' + diveNumber() + '</div>' +
      '<ul class="howto">' +
      '<li>7 problems a day. same for everyone.</li>' +
      '<li>25 seconds a step. one shot each.</li>' +
      '<li>fast, clean working sinks you deeper.</li>' +
      '<li>each problem is worth up to 100 metres. 700 is the trench.</li>' +
      '<li>one dive per day. no second chances.</li></ul>' +
      (today
        ? '<div class="panel" style="text-align:center"><div class="pixel">today\'s dive: <b style="color:var(--yellow)">' + today.depth + 'm</b></div><div class="share">' + esc(shareText(today)) + '</div>' +
          '<div class="row" style="justify-content:center"><button class="btn small" data-a="copy">Copy result</button><button class="btn small" data-a="endless">∞ Endless dive</button></div></div>'
        : '<div class="row"><button class="btn primary" data-a="go">▼ BEGIN DESCENT ▼</button><button class="btn" data-a="endless">∞ ENDLESS DIVE</button></div>'));
    on(el, {
      back: () => (S.prologueSeen ? hub() : title()),
      go: () => runDive(todayStr(), true),
      endless: () => runDive('endless-' + Date.now(), false),
      copy: () => copyText(shareText(today)),
    });
  }

  function runDive(seed, isDaily) {
    splash('DIVE!', isDaily ? 'dive #' + diveNumber() : 'endless', () => battle({
      mode: 'daily', questions: dailyQuestions(seed), timed: true, attempts: 1,
      onEnd: r => {
        if (isDaily) {
          S.daily[todayStr()] = { depth: r.depth, grid: r.grid, n: diveNumber() };
          persist();
        }
        results(r, dailyIntro, isDaily ? shareText(S.daily[todayStr()]) : null);
      },
    }));
  }

  function shareText(d) {
    return 'THE DESCENT · dive #' + d.n + '\n' + d.depth + 'm ' + (d.depth >= 700 ? '🦑 TRENCH FLOOR' : '') + '\n' + d.grid;
  }
  function copyText(t) {
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => alert('Copied!'), () => prompt('Copy this:', t));
    else prompt('Copy this:', t);
  }

  // ───────────── results ─────────────
  function results(r, next, share) {
    const el = show(
      '<h2 class="p5"><span>' + (r.mode === 'daily' ? 'DIVE LOG' : r.mode === 'boss' ? 'HEART CHANGED' : 'SESSION COMPLETE') + '</span></h2>' +
      (r.mode === 'daily'
        ? '<div class="rank" style="font-size:110px">' + r.depth + 'm</div><div class="depth-note">' + esc(depthNoteFor(r.depth)) + '</div>'
        : '<div class="rank">' + r.rank + '</div>') +
      '<div class="stat-grid">' +
      '<div><b>' + r.correct + '/' + r.steps + '</b><span>steps right</span></div>' +
      '<div><b>' + Math.round(r.pct * 100) + '%</b><span>' + (r.mode === 'boss' ? 'damage dealt' : 'score') + '</span></div>' +
      '<div><b>' + r.hints + '</b><span>hints used</span></div>' +
      '<div><b>' + r.taught + '</b><span>steps taught</span></div>' +
      '<div><b>' + fmtTime(r.time) + '</b><span>time</span></div></div>' +
      (share ? '<div class="share">' + esc(share) + '</div><button class="btn small" data-a="copy">Copy result</button> ' : '') +
      (r.missed.length ? '<div class="panel" style="text-align:left;margin-top:14px"><b>Review these:</b><ul>' + r.missed.map(m => '<li>' + m + '</li>').join('') + '</ul></div>' : '') +
      '<div class="row" style="justify-content:center;margin-top:18px"><button class="btn primary" data-a="next">CONTINUE ▸</button></div>', 'results');
    on(el, { next, copy: () => copyText(share) });
  }
  const fmtTime = s => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');

  // Krillion-style depth markers, built from the zones' notes.
  function depthNoteFor(d) {
    const z = ZONES.slice().reverse().find(x => x.depth <= d + 25);
    return z ? z.depthNote.replace(/──/g, '').trim() : 'still near the surface';
  }

  // ───────────── BATTLE ─────────────
  const TYPE_HINT = {
    num: 'Number — fractions & surds OK: 3/4, 2√3, sqrt(5), -1/2',
    set: 'All the values, comma-separated: 3, -4',
    point: 'A point: (3, -2)',
    vector: 'A vector: 6i - 8j or (6, -8)',
    expr: 'An expression. Use ^ for powers: 3x^2 - 4/x',
    integral: 'Indefinite integral — the + c matters!',
    antideriv: 'An expression (no + c needed here)',
  };
  const STEP_TIME = 25;

  function battle(cfg) {
    const z = cfg.zone;
    const boss = cfg.boss || null;
    const hpOn = cfg.mode === 'boss';
    const B = {
      qi: 0, si: 0, hp: maxHP(), hpMax: maxHP(),
      dealt: 0, max: 0, items: { snack: 3, pearl: 2 },
      stepRecs: [], hints: 0, taught: 0, missed: [], start: Date.now(),
      qScores: [], depth: 0, over: false,
    };
    B.max = cfg.questions.reduce((t, q) => t + qMarks(q) * 10, 0);
    let st = null;            // current step state
    let timer = null;          // { limit, left, last, raf, running }
    let keyHandler = null;

    const zoneIdx = z ? zoneIndex(z) : 3;

    const el = show(
      '<div class="b-top">' +
      (cfg.mode === 'daily'
        ? '<div class="gauge"><div class="gauge-track"><span class="gauge-krill" style="left:0%">🦐</span></div><div class="gauge-depth">0m</div></div>'
        : boss
          ? '<div class="boss-sprite" style="--c:' + boss.color + '">' + boss.icon + '</div><div class="boss-info"><div class="boss-name">' + esc(boss.name) + '<small>' + esc(boss.title) + '</small></div><div class="bar"><i style="width:100%"></i></div></div>'
          : '<div class="boss-sprite" style="--c:#9ad1ff">🐢</div><div class="boss-info"><div class="boss-name">Practice<small>' + esc(z ? z.topic : 'Mixed topics') + '</small></div><div class="muted" style="font-size:13px">Elder Theta is watching. No damage — mistakes are just lessons.</div></div>') +
      '<div class="qcount"></div><button class="btn small" data-a="quit" title="Leave">✕</button></div>' +
      (cfg.mode === 'daily' ? '<div class="depth-note"></div>' : '') +
      '<div class="q-card"><div class="q-context"></div><div class="q-prompt"></div><div class="q-meta"></div><ol class="working"></ol><div class="step-ask"></div></div>' +
      '<div class="ubox"><div class="timer"><i></i><span></span></div><div class="box-inner"></div>' +
      '<div class="b-stats"><span>' + esc(S.name).toUpperCase() + '</span><span>LV ' + level() + '</span>' +
      (hpOn ? '<span>HP</span><div class="bar hp"><i></i></div><span class="hp-num"></span>' : '') + '</div>' +
      '<div class="cmds">' +
      '<button class="cmd" data-a="fight">FIGHT</button><button class="cmd" data-a="act">ACT</button>' +
      '<button class="cmd" data-a="item">ITEM</button><button class="cmd" data-a="mercy">MERCY</button></div></div>',
      'battle');

    const box = $('.box-inner', el);
    const timerEl = $('.timer', el);
    if (!cfg.timed) timerEl.classList.add('hidden');

    on(el, {
      quit: () => { if (confirm('Leave this ' + (cfg.mode === 'boss' ? 'battle' : 'session') + '?')) { cleanup(); cfg.mode === 'daily' ? dailyIntro() : cfg.mode === 'boss' ? zoneScreen(z) : practiceSelect(); } },
      fight: () => { if (st && st.phase === 'answer') submit(); else if (st && st.phase === 'menu') answerUI(); },
      act: actMenu,
      item: itemMenu,
      mercy: mercyMenu,
    });

    function cleanup() {
      B.over = true;
      stopTimer();
      if (keyHandler) document.removeEventListener('keydown', keyHandler);
    }

    function updateHP() {
      if (!hpOn) return;
      $('.bar.hp > i', el).style.width = (100 * B.hp / B.hpMax) + '%';
      $('.hp-num', el).textContent = B.hp + ' / ' + B.hpMax;
    }
    function updateBoss() {
      if (!boss) return;
      $('.boss-info .bar > i', el).style.width = Math.max(0, 100 * (1 - B.dealt / (B.max * 0.85))) + '%';
    }
    function updateGauge() {
      if (cfg.mode !== 'daily') return;
      $('.gauge-krill', el).style.left = Math.min(100, B.depth / 7) + '%';
      $('.gauge-depth', el).textContent = Math.round(B.depth) + 'm';
      $('.depth-note', el).textContent = depthNoteFor(B.depth);
    }
    function setCmds(enabled) {
      const daily = cfg.mode === 'daily';
      $('[data-a=fight]', el).disabled = !enabled;
      $('[data-a=act]', el).disabled = !enabled || daily;
      $('[data-a=item]', el).disabled = !enabled || daily || (!hpOn && !cfg.timed);
      $('[data-a=mercy]', el).disabled = !enabled || daily;
    }

    // ── timer (Krillion clock) ──
    function startTimer(seconds) {
      stopTimer();
      if (!cfg.timed) return;
      timer = { limit: seconds, left: seconds, last: performance.now(), running: true, lastTick: Math.ceil(seconds) };
      const loop = now => {
        if (!timer || B.over) return;
        if (timer.running) {
          timer.left -= (now - timer.last) / 1000;
          if (timer.left <= 5 && Math.ceil(timer.left) < timer.lastTick) { timer.lastTick = Math.ceil(timer.left); Sfx.tick(); }
        }
        timer.last = now;
        const frac = Math.max(0, timer.left / timer.limit);
        $('i', timerEl).style.width = (frac * 100) + '%';
        $('span', timerEl).textContent = Math.max(0, Math.ceil(timer.left)) + 's';
        timerEl.classList.toggle('low', timer.left <= 5);
        if (timer.left <= 0) { timer.running = false; onTimeout(); return; }
        timer.raf = requestAnimationFrame(loop);
      };
      timer.raf = requestAnimationFrame(loop);
    }
    function pauseTimer() { if (timer) timer.running = false; }
    function resumeTimer() { if (timer && timer.left > 0) { timer.running = true; timer.last = performance.now(); } }
    function stopTimer() { if (timer) { cancelAnimationFrame(timer.raf); timer = null; } }
    const timeFrac = () => (timer ? Math.max(0, timer.left / timer.limit) : 1);

    // ── question flow ──
    function startQuestion() {
      const q = cfg.questions[B.qi];
      B.si = 0;
      B.qEarned = 0;
      $('.qcount', el).textContent = 'Q' + (B.qi + 1) + '/' + cfg.questions.length;
      $('.q-context', el).innerHTML = q.context ? fmt(q.context) : '';
      $('.q-prompt', el).innerHTML = q.prompt;
      const qz = zoneById(q.zone);
      $('.q-meta', el).textContent = '[' + qMarks(q) + ' marks] · ' + qz.topic + (q.source ? ' · ' + q.source : '');
      $('.working', el).innerHTML = '';
      $('.q-card', el).dataset.qid = q.id;
      renderMath($('.q-card', el));
      startStep();
    }

    function startStep() {
      const q = cfg.questions[B.qi], step = q.steps[B.si];
      st = { step, q, attempts: 0, hinted: false, taught: false, phase: 'answer', t0: Date.now() };
      const ask = $('.step-ask', el);
      $('.q-card', el).dataset.step = B.si;
      ask.innerHTML = '<span class="sm">Step ' + (B.si + 1) + ' of ' + q.steps.length + ' · ' + (step.marks || 1) + ' mark' + ((step.marks || 1) > 1 ? 's' : '') + '</span>' + step.ask;
      renderMath(ask);
      startTimer(step.time || STEP_TIME);
      answerUI();
    }

    function flavorLine() {
      if (boss) return fmt(boss.flavor[Math.floor(Math.random() * boss.flavor.length)]);
      if (cfg.mode === 'daily') return '* The water darkens. Keep sinking.';
      return '* Elder Theta adjusts her spectacles.';
    }

    function answerUI(message) {
      st.phase = 'answer';
      setCmds(true);
      const step = st.step;
      if (step.type === 'choice') {
        const order = st.order || (st.order = shuffle(step.choices.map((_, i) => i)));
        box.innerHTML = '<div class="flavor">' + esc(message || flavorLine()) + '</div><div class="choices">' +
          order.map((ci, k) => '<button class="choice" data-c="' + ci + '"><span class="k">' + (k + 1) + '</span>' + step.choices[ci] + '</button>').join('') + '</div>';
        renderMath(box);
        $$('.choice', box).forEach(b => b.addEventListener('click', () => submit(Number(b.dataset.c))));
        $('[data-a=fight]', el).disabled = true;
        const first = $('.choice', box);
        if (first) first.focus({ preventScroll: true });
      } else {
        box.innerHTML = '<div class="flavor">' + esc(message || flavorLine()) + '</div>' +
          '<div class="ans-row"><input class="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="your answer" aria-label="Your answer"></div>' +
          '<div class="preview"></div><div class="fmt-hint">' + esc(step.type === 'expr' && step.vars ? 'An expression in ' + step.vars.join(', ') : TYPE_HINT[step.type || 'num']) + '</div>';
        const inp = $('.ans', box), pv = $('.preview', box);
        if (st.draft) inp.value = st.draft;
        const upd = () => {
          st.draft = inp.value;
          const tex = MathIn.preview(step, inp.value);
          pv.innerHTML = tex == null ? '<span class="muted">…</span>' : tex ? 'reads as: ' + texInline(tex) : '';
        };
        inp.addEventListener('input', upd);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
        upd();
        inp.focus({ preventScroll: true });
      }
    }

    function submit(choiceVal) {
      if (!st || st.phase !== 'answer') return;
      const step = st.step;
      const input = step.type === 'choice' ? choiceVal : ($('.ans', box) || {}).value;
      if (step.type === 'choice' && input === undefined) return;
      const res = MathIn.check(step, input);
      if (!res.ok && res.format) { answerUI('* ' + res.message); return; }
      if (res.ok) correct();
      else wrong(res.message);
    }

    function correct() {
      st.phase = 'done';
      const frac = timeFrac();
      pauseTimer();
      setCmds(false);
      const step = st.step, marks = step.marks || 1;
      record(st.q.zone, !st.taught && st.attempts === 0);
      // damage & score
      let mult = st.taught ? 0 : st.hinted ? 0.5 : 1;
      if (st.attempts > 0) mult *= 0.6;
      const fast = cfg.timed && frac > 0.6 && mult === 1;
      if (fast) mult *= 1.25;
      const dmg = Math.round(marks * 10 * mult);
      B.dealt += dmg;
      B.stepRecs.push({ ok: !st.taught, first: st.attempts === 0 && !st.taught });
      const qTotal = qMarks(st.q);
      if (cfg.mode === 'daily') {
        const gain = 100 * marks / qTotal * (0.5 + 0.5 * frac);
        B.qEarned += gain;
        B.depth += gain;
        Sfx.sink();
        updateGauge();
      }
      addWorking(st.taught ? 'taught' : 'ok');
      if (dmg > 0) popDamage(fast ? 'DEEP HIT! ' + dmg : (boss ? dmg : '+' + marks + ' mark' + (marks > 1 ? 's' : '')), fast);
      fast ? Sfx.crit() : Sfx.hit();
      updateBoss();
      const pip = !boss ? null : fast ? '🐡 "WHOA. That was fast!"' : st.attempts ? '🐡 "Got there! That\'s what matters."' : null;
      box.innerHTML = '<div class="feedback"><div class="fb-title good">' + (st.taught ? '✎ Written out.' : fast ? '★ CRITICAL WORKING!' : '✓ Correct!') + '</div>' +
        (pip ? '<div class="pixel">' + pip + '</div>' : '') + '</div>';
      setTimeout(nextStep, fast ? 900 : 750);
    }

    function wrong(message, timedOut) {
      st.attempts++;
      pauseTimer();
      setCmds(false);
      st.phase = 'feedback';
      Sfx.wrong();
      const maxAttempts = cfg.attempts;
      const out = st.attempts >= maxAttempts || timedOut && cfg.mode === 'daily';
      const after = () => {
        if (B.over) return;
        if (out) return reveal(message, timedOut);
        box.innerHTML = '<div class="feedback"><div class="fb-title bad">' + (timedOut ? '⏱ Time\'s up!' : '✗ Not quite.') + '</div>' +
          (message ? '<div>' + esc(message) + '</div>' : '') +
          '<div class="fb-hint">🐡 Hint: ' + st.step.hint + '</div>' +
          '<div class="muted">' + (maxAttempts - st.attempts) + ' attempt' + (maxAttempts - st.attempts > 1 ? 's' : '') + ' left on this step.</div>' +
          '<div class="row" style="margin-top:8px"><button class="btn small primary" data-x="retry">TRY AGAIN</button></div></div>';
        st.hinted = true;
        renderMath(box);
        const btn = $('[data-x=retry]', box);
        btn.addEventListener('click', () => {
          if (timedOut) startTimer(12);
          else resumeTimer();
          answerUI();
        });
        btn.focus();
      };
      if (hpOn) dodge(after);
      else after();
    }

    function reveal(message, timedOut) {
      st.phase = 'done';
      const step = st.step;
      record(st.q.zone, false);
      B.stepRecs.push({ ok: false });
      const miss = esc(zoneById(st.q.zone).topic) + ' — question ' + esc(st.q.id);
      if (!B.missed.includes(miss)) B.missed.push(miss);
      addWorking('miss');
      box.innerHTML = '<div class="feedback"><div class="fb-title bad">' + (timedOut ? '⏱ Time\'s up.' : '✗ The current carries you on.') + '</div>' +
        (message ? '<div>' + esc(message) + '</div>' : '') +
        '<div class="fb-exp">🐢 Here\'s the working: ' + step.explain + '</div>' +
        '<div class="row" style="margin-top:8px"><button class="btn small primary" data-x="next">CONTINUE ▸</button></div></div>';
      renderMath(box);
      const btn = $('[data-x=next]', box);
      btn.addEventListener('click', nextStep);
      btn.focus();
    }

    function onTimeout() {
      if (!st || (st.phase !== 'answer' && st.phase !== 'menu')) return;
      wrong('', true);
    }

    function addWorking(kind) {
      const li = document.createElement('li');
      li.className = kind;
      li.innerHTML = st.step.explain;
      $('.working', el).appendChild(li);
      renderMath(li);
    }

    function popDamage(text, crit) {
      const host = $('.boss-sprite', el) || $('.gauge-depth', el);
      if (!host) return;
      host.classList.remove('hit');
      void host.offsetWidth;
      if (boss) host.classList.add('hit');
      const p = document.createElement('div');
      p.className = 'dmg-pop' + (crit ? ' crit' : '');
      p.textContent = text;
      host.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }

    function nextStep() {
      if (B.over) return;
      const q = cfg.questions[B.qi];
      B.si++;
      if (B.si < q.steps.length) return startStep();
      if (cfg.mode === 'daily') {
        B.qScores.push(B.qEarned);
      }
      B.qi++;
      if (B.qi < cfg.questions.length) {
        stopTimer();
        if (boss && Math.random() < 0.6) {
          box.innerHTML = '<div class="flavor">' + esc(fmt(boss.flavor[B.qi % boss.flavor.length])) + '</div>';
          setTimeout(() => !B.over && startQuestion(), 900);
        } else startQuestion();
        return;
      }
      finish(false);
    }

    function finish(dead) {
      cleanup();
      const steps = B.stepRecs.length;
      const correctN = B.stepRecs.filter(r => r.ok).length;
      const pct = cfg.mode === 'daily' ? B.depth / 700 : Math.min(1, B.dealt / B.max);
      const rank = pct >= 0.9 ? 'S' : pct >= 0.72 ? 'A' : pct >= 0.5 ? 'B' : 'C';
      const grid = B.qScores.map(s => (s >= 80 ? '🟦' : s >= 50 ? '🟩' : s > 0 ? '🟨' : '🟥')).join('');
      persist();
      cfg.onEnd({
        mode: cfg.mode, dead, rank, pct, steps, correct: correctN, hints: B.hints, taught: B.taught,
        time: (Date.now() - B.start) / 1000, depth: Math.round(B.depth), grid, missed: B.missed,
      });
    }

    // ── ACT / ITEM / MERCY ──
    function submenu(title, items) {
      if (!st || st.phase !== 'answer') return;
      st.phase = 'menu';
      box.innerHTML = '<div class="flavor">' + esc(title) + '</div><div class="submenu">' +
        items.map((it, k) => '<button data-k="' + k + '"' + (it.disabled ? ' disabled style="opacity:.35"' : '') + '>' + esc(it.label) + '</button>').join('') +
        '<button data-k="back">Back</button></div>';
      $$('.submenu button', box).forEach(b => b.addEventListener('click', () => {
        Sfx.select();
        if (b.dataset.k === 'back') return answerUI();
        const it = items[Number(b.dataset.k)];
        if (!it.disabled) it.run();
      }));
      const f = $('.submenu button', box);
      if (f) f.focus();
    }
    function message(html, back) {
      st.phase = 'menu';
      box.innerHTML = '<div class="feedback">' + html + '<div class="row" style="margin-top:8px"><button class="btn small primary" data-x="ok">OK</button></div></div>';
      renderMath(box);
      const b = $('[data-x=ok]', box);
      b.addEventListener('click', back || (() => answerUI()));
      b.focus();
    }

    function actMenu() {
      const items = [];
      if (boss) items.push({ label: '* Check', run: () => message('<div class="fb-title">' + esc(boss.check) + '</div><div class="fb-hint">Misconception: ' + boss.misconception + '</div>') });
      items.push({
        label: '* Ask Pip for a hint' + (boss ? ' (halves damage)' : ''),
        run: () => { if (!st.hinted) { st.hinted = true; B.hints++; } message('<div class="fb-hint">🐡 ' + st.step.hint + '</div>'); },
      });
      const z2 = zoneById(st.q.zone);
      items.push({ label: '* Peek at Theta\'s notes (' + z2.topic + ')', run: () => { pauseTimer(); message('<div class="lesson" style="max-height:45vh;overflow:auto">' + z2.lesson + '</div>', () => { resumeTimer(); answerUI(); }); } });
      submenu('* What will you do?', items);
    }

    function itemMenu() {
      const items = [];
      if (hpOn) items.push({
        label: '* Kelp Snack — heal 8 HP (×' + B.items.snack + ')', disabled: !B.items.snack || B.hp >= B.hpMax,
        run: () => { B.items.snack--; B.hp = Math.min(B.hpMax, B.hp + 8); updateHP(); message('<div class="fb-title good">* You ate the Kelp Snack. Crunchy. HP restored.</div>'); },
      });
      if (cfg.timed) items.push({
        label: '* Time Pearl — +15 seconds (×' + B.items.pearl + ')', disabled: !B.items.pearl,
        run: () => { B.items.pearl--; if (timer) { timer.left += 15; timer.limit = Math.max(timer.limit, timer.left); } message('<div class="fb-title good">* The pearl glows. Time slows around you.</div>'); },
      });
      submenu('* Your pockets:', items);
    }

    function mercyMenu() {
      submenu('* Spare yourself the struggle?', [{
        label: '* Ask Elder Theta to teach this step (no damage)',
        run: () => {
          st.taught = true;
          B.taught++;
          pauseTimer();
          message('<div class="fb-title">🐢 Watch closely, ' + esc(S.name) + '.</div><div class="fb-exp">' + st.step.explain + '</div><div class="muted">Now enter it yourself — writing it out is how it sticks.</div>');
        },
      }]);
    }

    // ── the enemy turn: Undertale-style dodge ──
    function dodge(done) {
      st.phase = 'dodge';
      const W = 300, H = 180;
      box.innerHTML = '<canvas class="dodge" width="' + W + '" height="' + H + '"></canvas><div class="dodge-label">' + esc(boss.name) + ' attacks! ←↑↓→ / WASD / drag</div>';
      const cv = $('canvas', box), cx = cv.getContext('2d');
      const p = { x: W / 2, y: H / 2, inv: 0 };
      const keys = {};
      const bullets = [];
      const dur = 4200;
      const speed = 70 + zoneIdx * 7;
      const every = Math.max(150, 420 - zoneIdx * 18);
      const atk = 2 + Math.floor(zoneIdx / 2);
      let t = 0, spawnT = 0, last = performance.now(), touch = null, angle = 0, ended = false;
      const pattern = boss.pattern === 'chaos' ? null : boss.pattern;
      cx.font = '15px VT323, monospace';

      const kd = e => { keys[e.key.toLowerCase()] = true; if (e.key.startsWith('Arrow')) e.preventDefault(); };
      const ku = e => { keys[e.key.toLowerCase()] = false; };
      document.addEventListener('keydown', kd);
      document.addEventListener('keyup', ku);
      const pt = e => { const r = cv.getBoundingClientRect(); const s = e.touches ? e.touches[0] : e; return { x: (s.clientX - r.left) * W / r.width, y: (s.clientY - r.top) * H / r.height }; };
      cv.addEventListener('pointerdown', e => { touch = pt(e); cv.setPointerCapture(e.pointerId); });
      cv.addEventListener('pointermove', e => { if (touch) touch = pt(e); });
      cv.addEventListener('pointerup', () => { touch = null; });

      function spawn() {
        const kind = pattern || ['rain', 'sweep', 'arc', 'ring', 'wave', 'spiral'][Math.floor(Math.random() * 6)];
        const text = boss.bullets[Math.floor(Math.random() * boss.bullets.length)].replace('{name}', S.name);
        const w = cx.measureText(text).width;
        const b = { text, w, h: 12, kind, t: 0 };
        if (kind === 'rain') Object.assign(b, { x: Math.random() * (W - w), y: -12, vx: 0, vy: speed });
        else if (kind === 'sweep' || kind === 'wave') {
          const left = Math.random() < 0.5;
          Object.assign(b, { x: left ? -w : W, y: 10 + Math.random() * (H - 20), vx: left ? speed : -speed, vy: 0, y0: 0 });
          b.y0 = b.y;
        } else if (kind === 'arc') Object.assign(b, { x: Math.random() * W, y: H + 5, vx: (Math.random() - 0.5) * speed, vy: -speed * 2.1, g: speed * 2.2 });
        else if (kind === 'ring') {
          const a = Math.random() * Math.PI * 2;
          Object.assign(b, { x: W / 2 + Math.cos(a) * 200 - w / 2, y: H / 2 + Math.sin(a) * 160, vx: -Math.cos(a) * speed, vy: -Math.sin(a) * speed * 0.8 });
        } else if (kind === 'spiral') {
          angle += 0.9;
          Object.assign(b, { x: W / 2 - w / 2, y: H / 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, safe: 0.5 });
        }
        bullets.push(b);
      }

      function end() {
        if (ended) return;
        ended = true;
        document.removeEventListener('keydown', kd);
        document.removeEventListener('keyup', ku);
        if (B.hp <= 0) { finish(true); return; }
        done();
      }

      function frame(now) {
        if (B.over) return end();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        t += dt * 1000;
        spawnT += dt * 1000;
        if (spawnT > every && t < dur - 500) { spawnT = 0; spawn(); }
        // move player
        const sp = 150;
        let dx = 0, dy = 0;
        if (keys.arrowleft || keys.a) dx -= 1;
        if (keys.arrowright || keys.d) dx += 1;
        if (keys.arrowup || keys.w) dy -= 1;
        if (keys.arrowdown || keys.s) dy += 1;
        if (touch) { const ddx = touch.x - p.x, ddy = touch.y - p.y, d = Math.hypot(ddx, ddy); if (d > 3) { dx = ddx / d; dy = ddy / d; } }
        p.x = Math.max(8, Math.min(W - 8, p.x + dx * sp * dt));
        p.y = Math.max(8, Math.min(H - 8, p.y + dy * sp * dt));
        p.inv = Math.max(0, p.inv - dt);
        // bullets
        cx.fillStyle = '#000';
        cx.fillRect(0, 0, W, H);
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.t += dt;
          if (b.g) b.vy += b.g * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (b.kind === 'wave') b.y = b.y0 + Math.sin(b.t * 5) * 22;
          if (b.x < -80 || b.x > W + 80 || b.y < -60 || b.y > H + 60) { bullets.splice(i, 1); continue; }
          cx.fillStyle = b.safe && b.t < b.safe ? '#555' : '#fff';
          cx.fillText(b.text, b.x, b.y);
          const hitbox = !(b.safe && b.t < b.safe);
          if (hitbox && !p.inv && p.x + 4 > b.x && p.x - 4 < b.x + b.w && p.y + 4 > b.y - b.h && p.y - 4 < b.y) {
            B.hp = Math.max(0, B.hp - atk);
            p.inv = 0.8;
            Sfx.hurt();
            updateHP();
            if (B.hp <= 0) { t = dur; }
          }
        }
        // the player's soul: a krill
        if (!p.inv || Math.floor(p.inv * 10) % 2 === 0) {
          cx.font = '16px serif';
          cx.fillText('🦐', p.x - 9, p.y + 6);
          cx.font = '15px VT323, monospace';
        }
        cx.fillStyle = '#ff8c1a';
        cx.fillRect(0, H - 3, W * (1 - t / dur), 3);
        if (t >= dur) return end();
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    // global keys: 1-4 for choices
    keyHandler = e => {
      if (!st || st.phase !== 'answer' || st.step.type !== 'choice') return;
      const n = Number(e.key);
      if (n >= 1 && n <= st.step.choices.length) {
        const btn = $$('.choice', box)[n - 1];
        if (btn) btn.click();
      }
    };
    document.addEventListener('keydown', keyHandler);

    updateHP();
    updateBoss();
    updateGauge();
    if (!cfg.questions.length) { box.textContent = 'No questions here yet.'; return; }
    startQuestion();
  }

  // ───────────── boot ─────────────
  title();
})();
