// Working out problems step by step: the notebook used for story problems, single steps inside encounters,
// and drill / Daily Challenge sessions. The player always writes the working; Rook only guides.
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = UI.esc;

  const TYPE_HINT = {
    num: 'A number — fractions & surds OK: 3/4, 2√3, sqrt(5), -1/2',
    set: 'All the values, separated by commas: 3, -4',
    point: 'A point: (3, -2)',
    vector: 'A vector: 6i - 8j or (6, -8)',
    expr: 'An expression — use ^ for powers: 3x^2 - 4/x',
    integral: 'Indefinite integral — the + c matters!',
    antideriv: 'An expression (no + c needed here)',
    line: 'An equation of a line: x + 2y - 19 = 0, or y = 3x + 1',
  };

  function texInline(tex) {
    if (window.katex) { try { return window.katex.renderToString(tex, { throwOnError: false }); } catch (e) { /* fall through */ } }
    return esc(tex);
  }
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Renders an answer box (or multiple choice) into `host`. onSubmit(value) is called with the raw value.
  function answerBox(host, step, onSubmit, opts) {
    opts = opts || {};
    if (step.type === 'choice') {
      const order = step._order || (step._order = shuffle(step.choices.map((_, i) => i)));
      host.innerHTML = '<div class="choices">' + order.map((ci, k) => '<button class="choice" data-c="' + ci + '"><span class="k">' + (k + 1) + '</span>' + step.choices[ci] + '</button>').join('') + '</div>';
      UI.renderMath(host);
      $$('.choice', host).forEach(b => b.addEventListener('click', () => onSubmit(Number(b.dataset.c))));
      const pop = UI.pushKeys(e => { const n = Number(e.key); if (n >= 1 && n <= order.length) { e.preventDefault(); onSubmit(order[n - 1]); } });
      return { destroy: pop };
    }
    host.innerHTML =
      '<div class="ans-row"><input class="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="your answer to this step…" aria-label="Your answer">' +
      '<button class="btn small primary go">CHECK</button></div>' +
      '<div class="preview"></div><div class="fmt-hint">' + esc(step.type === 'expr' && step.vars ? 'An expression in ' + step.vars.join(', ') : TYPE_HINT[step.type || 'num']) + '</div>';
    const inp = $('.ans', host), pv = $('.preview', host);
    if (opts.draft) inp.value = opts.draft;
    const upd = () => {
      const tex = MathIn.preview(step, inp.value);
      pv.innerHTML = tex == null ? '<span class="muted">…</span>' : tex ? 'reads as: ' + texInline(tex) : '';
      if (opts.onDraft) opts.onDraft(inp.value);
    };
    inp.addEventListener('input', upd);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(inp.value); } e.stopPropagation(); });
    $('.go', host).addEventListener('click', () => onSubmit(inp.value));
    upd();
    setTimeout(() => inp.focus({ preventScroll: true }), 30);
    return { destroy: () => {} };
  }

  // Real exam pace: OCR AS and A level papers both allow 72 seconds a mark (75 marks in 90 minutes, 100 in 120).
  const SEC_PER_MARK = 72;
  const stepTime = s => s.time || SEC_PER_MARK * (s.marks || 1);

  // A countdown bar. Returns { stop, pause, resume, frac, add }.
  function countdown(bar, seconds, onEnd) {
    let left = seconds, limit = seconds, running = true, last = performance.now(), raf, tick = Math.ceil(seconds);
    const loop = now => {
      if (running) {
        left -= (now - last) / 1000;
        if (left <= 5 && Math.ceil(left) < tick) { tick = Math.ceil(left); Sfx.tick(); }
      }
      last = now;
      bar.querySelector('i').style.width = Math.max(0, left / limit * 100) + '%';
      const sec = Math.max(0, Math.ceil(left));
      bar.querySelector('span').textContent = sec >= 60 ? Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') : sec + 's';
      bar.classList.toggle('low', left <= 5);
      if (left <= 0) { running = false; onEnd(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return {
      stop: () => cancelAnimationFrame(raf),
      pause: () => { running = false; },
      resume: () => { running = true; last = performance.now(); },
      frac: () => Math.max(0, left / limit),
      add: s => { left += s; limit = Math.max(limit, left); },
    };
  }

  function stepHeader(q, i) {
    const s = q.steps[i];
    return '<span class="sm">Step ' + (i + 1) + ' of ' + q.steps.length + ' · ' + (s.marks || 1) + ' mark' + ((s.marks || 1) > 1 ? 's' : '') + '</span>' + s.ask;
  }

  // ───────── story problems: the notebook ─────────
  // Unlimited attempts. Rook hints after a slip, and offers to talk you through it after two.
  function story(problem, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      const giver = problem.giver ? Game.CAST[problem.giver] : null;
      const el = UI.panel(
        (opts.quit ? '<div class="nb-bar"><button class="btn small" data-t="quit">◂ ' + esc(opts.quit) + ' <kbd>Esc</kbd></button></div>' : '') +
        '<div class="notebook">' +
        '<div class="nb-head"><span class="nb-tag">' + esc(Game.topicLabel(problem.topic)) + '</span><h2>' + esc(problem.title) + '</h2></div>' +
        (problem.context ? '<div class="nb-context">' + (giver ? '<img src="' + Sprites.portrait(giver.portrait) + '" alt=""><div><b style="color:' + giver.color + '">' + esc(giver.name) + '</b><br>' : '<div>') + Game.fmt(problem.context) + '</div></div>' : '') +
        (problem.diagram ? '<div class="nb-diagram">' + problem.diagram + '</div>' : '') +
        '<div class="nb-prompt">' + problem.prompt + '</div>' +
        '<ol class="working"></ol>' +
        '<div class="nb-dock"><div class="step-ask"></div>' +
        '<div class="nb-input"></div>' +
        '<div class="nb-rook"><img src="' + Sprites.portrait('rook') + '" alt=""><div class="nb-rook-say">Take it one step at a time. I\'ll be right here.</div></div>' +
        '<div class="nb-tools"><button class="btn small" data-t="hint">🐦 Hint</button><button class="btn small" data-t="teach">📖 <span class="lbl">Talk me through it</span><span class="lbl-short">Explain</span></button><button class="btn small" data-t="notes">📒 <span class="lbl">Mira\'s notes</span><span class="lbl-short">Notes</span></button><button class="btn small" data-t="scratch">✏️<span class="lbl"> Scratch pad</span></button></div></div>' +
        '</div>', 'nb-screen');
      let i = 0, wrongs = 0, taught = false, firstTry = 0, draft = '', box = null;
      const rookSay = html => { const r = $('.nb-rook-say', el); r.innerHTML = html; UI.renderMath(r); $('.nb-rook', el).classList.add('said'); };

      function showStep() {
        const s = problem.steps[i];
        window.__step = { problem, i };
        wrongs = 0; taught = false; draft = '';
        $('.step-ask', el).innerHTML = stepHeader(problem, i);
        UI.renderMath($('.step-ask', el));
        if (box) box.destroy();
        box = answerBox($('.nb-input', el), s, submit, { onDraft: v => (draft = v) });
        // on a phone the step sits in a dock at the bottom of the screen, so there's nothing to scroll to
        if (!matchMedia('(max-width: 600px), (max-height: 500px) and (orientation: landscape)').matches) $('.step-ask', el).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      function submit(v) {
        const s = problem.steps[i];
        const res = MathIn.check(s, v);
        if (!res.ok && res.format) { rookSay(esc(res.message)); return; }
        Game.record(problem.topic, res.ok && wrongs === 0 && !taught);
        if (res.ok) {
          Sfx.hit();
          if (wrongs === 0 && !taught) firstTry++;
          const li = document.createElement('li');
          li.className = taught ? 'taught' : 'ok';
          li.innerHTML = s.explain;
          $('.working', el).appendChild(li);
          UI.renderMath(li);
          rookSay(s.rook ? Game.fmt(s.rook) : ['Good.', 'That\'s it.', 'Mira would\'ve nodded at that.', 'Clean working.', 'Yep.'][Math.floor(Math.random() * 5)]);
          i++;
          if (i < problem.steps.length) return showStep();
          if (box) box.destroy();
          $('.step-ask', el).innerHTML = '<span class="sm">Solved</span>' + (problem.done ? Game.fmt(problem.done) : 'Every step written out.');
          UI.renderMath($('.step-ask', el));
          $('.nb-input', el).innerHTML = '<button class="btn primary finish">DONE ▸</button>';
          $('.nb-tools', el).remove();
          Sfx.win();
          const fin = () => { pop(); el.close(); resolve({ firstTry, steps: problem.steps.length }); };
          $('.finish', el).addEventListener('click', fin);
          $('.finish', el).focus();
          const pop = UI.pushKeys(e => { if (e.key === 'Enter' || e.key.toLowerCase() === 'z') { e.preventDefault(); fin(); } });
          return;
        }
        wrongs++;
        Sfx.wrong();
        $('.nb-input', el).classList.remove('shake'); void el.offsetWidth; $('.nb-input', el).classList.add('shake');
        if (res.message) rookSay(esc(res.message) + (wrongs >= 2 ? '<br>Want me to talk you through it?' : ''));
        else if (wrongs === 1) rookSay('Not quite. ' + s.hint);
        else rookSay('Still not it. No shame in it — press <b>Talk me through it</b> and then write it out yourself.');
      }
      el.addEventListener('click', e => {
        const t = e.target.closest('[data-t]');
        if (!t) return;
        const s = problem.steps[i];
        if (t.dataset.t === 'hint') rookSay(s.hint);
        if (t.dataset.t === 'teach') { taught = true; rookSay('Right, watch: ' + s.explain + '<br><i>Now you write it in.</i>'); }
        if (t.dataset.t === 'notes') Game.showLesson(problem.topic);
        if (t.dataset.t === 'scratch') Game.scratch(() => {});
        if (t.dataset.t === 'quit') leave();
      });
      const leave = () => { if (box) box.destroy(); el.close(); resolve({ quit: true }); };
      // Esc leaves too (from anywhere in the notebook, even while typing an answer)
      if (opts.quit) el.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); leave(); } }, true);
      showStep();
      Game.scratchTip && Game.scratchTip();
    });
  }

  // ───────── one step inside an encounter ─────────
  // Resolves { ok, timedOut, frac, message }.
  function oneStep(host, problem, i, opts) {
    return new Promise(resolve => {
      const s = problem.steps[i];
      window.__step = { problem, i };
      const secs = opts.timed ? stepTime(s) + (opts.extra || 0) : 0;
      host.innerHTML = (opts.timed ? '<div class="timer"><i></i><span></span></div>' : '') +
        '<div class="step-ask dark">' + stepHeader(problem, i) + '</div><div class="st-input"></div>' +
        (opts.taught ? '<div class="fb-exp">🐦 ' + s.explain + '</div>' : '') +
        (opts.hint ? '<div class="fb-hint">🐦 ' + s.hint + '</div>' : '');
      UI.renderMath(host);
      let finished = false, clock = null;
      const done = r => { if (finished) return; finished = true; if (clock) clock.stop(); box.destroy(); resolve(r); };
      const box = answerBox($('.st-input', host), s, v => {
        const res = MathIn.check(s, v);
        if (!res.ok && res.format) { const h = $('.fmt-hint', host); if (h) h.textContent = res.message; return; }
        Game.record(problem.topic, res.ok && !opts.taught && !opts.hint);
        done({ ok: res.ok, frac: clock ? clock.frac() : 1, message: res.message });
      });
      if (opts.timed) clock = countdown($('.timer', host), secs, () => done({ ok: false, timedOut: true, frac: 0 }));
      if (opts.clockRef) opts.clockRef(clock);
    });
  }

  // ───────── drills & the Daily Challenge: a full-screen run of questions ─────────
  function session(questions, opts) {
    return new Promise(resolve => {
      const daily = opts.mode === 'daily';
      const el = UI.panel(
        '<div class="sess">' +
        '<div class="sess-top"><button class="btn small" data-q="quit">◂ ' + (opts.mode === 'exam' ? 'hand in' : 'quit') + '</button><div class="sess-title">' + esc(opts.title) + '</div>' + (opts.clock ? '<div class="exam-clock"></div>' : '') + '<div class="qcount"></div><button class="btn small" data-q="scratch">✏️<span class="lbl"> Scratch pad</span></button></div>' +
        (daily ? '<div class="gauge"><div class="gauge-track"><span class="gauge-krill" style="left:0%">🪣</span></div><div class="gauge-depth">0m</div></div><div class="depth-note"></div>' : '') +
        '<div class="notebook"><div class="nb-head"><span class="nb-tag"></span></div><div class="nb-context"></div><div class="nb-prompt"></div><ol class="working"></ol><div class="nb-dock"><div class="step-host"></div></div></div>' +
        '</div>', 'nb-screen');
      const R = { steps: 0, right: 0, depth: 0, grid: [], missed: [], start: Date.now(), hints: 0, marks: 0, byQ: [] };
      let qi = 0, si = 0, qGain = 0, qGot = 0, attempts = 0, hinted = false, clock = null, quit = false, examTimer = null;

      function finishNow() {
        quit = true;
        if (clock) clock.stop();
        clearInterval(examTimer);
        for (let k = qi; k < questions.length; k++) {
          const q = questions[k];
          R.byQ.push({ num: q.num || q.id, got: k === qi ? qGot : 0, of: qMarks(q) });
        }
        el.close();
        R.time = (Date.now() - R.start) / 1000;
        R.depth = Math.round(R.depth);
        resolve(R);
      }
      if (opts.clock) {
        const end = Date.now() + opts.clock * 60000;
        const tickClock = () => {
          const left = Math.max(0, end - Date.now());
          const ce = $('.exam-clock', el);
          if (ce) { ce.textContent = '⏱ ' + Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0'); ce.classList.toggle('low', left < 300000); }
          if (left <= 0) { UI.toast('Time\'s up! Pens down.'); finishNow(); }
        };
        examTimer = setInterval(tickClock, 1000);
        tickClock();
      }

      el.querySelector('[data-q=scratch]').addEventListener('click', () => Game.scratch(() => {}));
      Game.scratchTip && Game.scratchTip();
      el.querySelector('[data-q=quit]').addEventListener('click', () => {
        if (opts.mode === 'exam') { if (confirm('Hand in the paper now? Unanswered questions score 0.')) finishNow(); return; }
        if (confirm('Stop this session?')) { quit = true; clearInterval(examTimer); if (clock) clock.stop(); el.close(); resolve(null); }
      });

      function gauge() {
        if (!daily) return;
        $('.gauge-krill', el).style.left = Math.min(100, R.depth / 7) + '%';
        $('.gauge-depth', el).textContent = Math.round(R.depth) + 'm';
        $('.depth-note', el).textContent = Game.depthNote(R.depth);
      }
      function startQ() {
        const q = questions[qi];
        si = 0; qGain = 0; qGot = 0;
        $('.qcount', el).textContent = 'Q' + (qi + 1) + '/' + questions.length;
        $('.nb-tag', el).textContent = (q.num ? 'Q' + q.num + ' · ' : '') + Game.topicLabel(q.topic) + ' · ' + qMarks(q) + ' marks' + (q.dr ? ' · show detailed reasoning' : '');
        $('.nb-context', el).innerHTML = q.context ? '<div>' + Game.fmt(q.context) + '</div>' : '';
        $('.nb-context', el).style.display = q.context ? '' : 'none';
        $('.nb-prompt', el).innerHTML = q.prompt;
        $('.working', el).innerHTML = '';
        UI.renderMath(el);
        startStep();
      }
      async function startStep() {
        if (quit) return;
        attempts = 0; hinted = false;
        await ask();
      }
      async function ask(extra) {
        const q = questions[qi];
        const host = $('.step-host', el);
        const r = await oneStep(host, q, si, { timed: !!opts.timed, hint: hinted, clockRef: c => (clock = c) });
        if (quit) return;
        const s = q.steps[si], marks = s.marks || 1;
        if (r.ok) {
          Sfx.hit();
          R.right++;
          if (attempts === 0 && !hinted) { qGot += marks; R.marks += marks; }
          if (daily) { const g = 100 * marks / qMarks(q) * (0.5 + 0.5 * r.frac); qGain += g; R.depth += g; Sfx.sink(); gauge(); }
          return advance(attempts ? 'ok' : 'ok');
        }
        attempts++;
        Sfx.wrong();
        if (attempts >= opts.attempts || (daily && r.timedOut)) {
          const label = Game.topicLabel(q.topic) + ' — ' + (q.source || q.id);
          if (!R.missed.includes(label)) R.missed.push(label);
          return advance('miss', r);
        }
        hinted = true; R.hints++;
        host.insertAdjacentHTML('afterbegin', '<div class="fb-title bad">' + (r.timedOut ? '⏱ Time\'s up!' : '✗ Not quite.') + (r.message ? ' ' + esc(r.message) : '') + '</div>');
        await new Promise(res => setTimeout(res, 900));
        ask();
      }
      function advance(kind, r) {
        const q = questions[qi];
        R.steps++;
        const li = document.createElement('li');
        li.className = kind;
        li.innerHTML = q.steps[si].explain;
        $('.working', el).appendChild(li);
        UI.renderMath(li);
        const go = () => {
          si++;
          if (si < q.steps.length) return startStep();
          if (daily) R.grid.push(qGain >= 80 ? '🟦' : qGain >= 50 ? '🟩' : qGain > 0 ? '🟨' : '🟥');
          R.byQ.push({ num: q.num || q.id, got: qGot, of: qMarks(q) });
          qi++;
          if (qi < questions.length) return startQ();
          clearInterval(examTimer);
          el.close();
          R.time = (Date.now() - R.start) / 1000;
          R.depth = Math.round(R.depth);
          resolve(R);
        };
        if (kind === 'miss') {
          const host = $('.step-host', el);
          host.innerHTML = '<div class="fb-title bad">' + (r && r.timedOut ? '⏱ Time\'s up.' : '✗ Here\'s how it goes:') + '</div><div class="fb-exp">' + q.steps[si].explain + '</div><button class="btn small primary nx">NEXT ▸</button>';
          UI.renderMath(host);
          host.querySelector('.nx').addEventListener('click', go);
          host.querySelector('.nx').focus();
        } else setTimeout(go, 450);
      }
      gauge();
      startQ();
    });
  }
  const qMarks = q => q.steps.reduce((t, s) => t + (s.marks || 1), 0);

  window.Solver = { story, oneStep, session, answerBox, countdown, qMarks, stepTime, SEC_PER_MARK };
})();
