// Dialogue boxes, choices, menus, toasts, fades and title cards. All return promises so story scripts read top to bottom.
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Only the most recent UI element receives keys.
  const handlers = [];
  document.addEventListener('keydown', e => {
    const a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return;
    const h = handlers[handlers.length - 1];
    if (h && !e.repeat) h(e);
  });
  const pushKeys = h => { handlers.push(h); return () => { const i = handlers.indexOf(h); if (i >= 0) handlers.splice(i, 1); }; };
  const isOk = e => ['z', 'enter', ' '].includes(e.key.toLowerCase());

  function layer() { return document.getElementById('ui'); }

  function renderMath(el) {
    if (window.renderMathInElement) {
      try { window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false }); } catch (e) { /* raw */ }
    }
  }

  // One line of dialogue. speaker: { name, portrait, color, blip } or null for narration.
  function say(speaker, text) {
    return new Promise(resolve => {
      const box = document.createElement('div');
      box.className = 'dlg';
      const hasMath = text.includes('$');
      box.innerHTML =
        (speaker && speaker.portrait ? '<img class="dlg-face" alt="" src="' + Sprites.portrait(speaker.portrait) + '">' : '') +
        '<div class="dlg-body">' + (speaker && speaker.name ? '<div class="dlg-name" style="color:' + (speaker.color || '#fff') + '">' + esc(speaker.name) + '</div>' : '') +
        '<div class="dlg-text"></div></div><div class="dlg-next">▼</div>';
      layer().appendChild(box);
      const textEl = $('.dlg-text', box);
      let k = 0, timer = null;
      const full = text;
      const finishTyping = () => {
        clearInterval(timer); clearTimeout(timer); timer = null;
        if (hasMath) { textEl.innerHTML = esc(full); renderMath(textEl); } else textEl.textContent = full;
        box.classList.add('done');
      };
      const tick = () => {
        k++;
        textEl.textContent = full.slice(0, k);
        const ch = full[k - 1];
        if (k % 2 === 0 && ch && ch !== ' ') Sfx.blip(speaker ? speaker.blip : 420);
        if (k >= full.length) return finishTyping();
        // a short beat after sentences, like Undertale
        if (/[.!?,]/.test(ch) && full[k] === ' ') { clearInterval(timer); timer = setTimeout(() => { timer = setInterval(tick, 26); }, ch === ',' ? 70 : 160); }
      };
      if (hasMath) finishTyping();
      else timer = setInterval(tick, 26);
      const advance = () => {
        if (timer !== null) return finishTyping();
        pop();
        box.remove();
        resolve();
      };
      box.addEventListener('click', advance);
      const pop = pushKeys(e => { if (isOk(e)) { e.preventDefault(); advance(); } else if (e.key.toLowerCase() === 'x' && timer !== null) finishTyping(); });
    });
  }

  // Undertale-style choice list. Returns the chosen index.
  function choose(options, prompt) {
    return new Promise(resolve => {
      const box = document.createElement('div');
      box.className = 'dlg choice-box';
      box.innerHTML = (prompt ? '<div class="dlg-text">' + esc(prompt) + '</div>' : '') +
        '<div class="opts">' + options.map((o, i) => '<button data-i="' + i + '">' + esc(o) + '</button>').join('') + '</div>';
      layer().appendChild(box);
      const btns = Array.from(box.querySelectorAll('button'));
      let sel = 0;
      const mark = () => btns.forEach((b, i) => b.classList.toggle('sel', i === sel));
      mark();
      const pick = i => { Sfx.select(); pop(); box.remove(); resolve(i); };
      btns.forEach((b, i) => { b.addEventListener('click', () => pick(i)); b.addEventListener('mouseenter', () => { sel = i; mark(); }); });
      const pop = pushKeys(e => {
        const k = e.key.toLowerCase();
        if (k === 'arrowdown' || k === 'arrowright' || k === 's' || k === 'd') { sel = (sel + 1) % btns.length; mark(); Sfx.blip(600); e.preventDefault(); }
        else if (k === 'arrowup' || k === 'arrowleft' || k === 'w' || k === 'a') { sel = (sel - 1 + btns.length) % btns.length; mark(); Sfx.blip(600); e.preventDefault(); }
        else if (isOk(e)) { e.preventDefault(); pick(sel); }
      });
    });
  }

  // A full-screen panel (menus, notebook, etc). Returns a close() function; onClose fires on Esc/X.
  function panel(html, cls, onClose) {
    const el = document.createElement('div');
    el.className = 'panel-screen ' + (cls || '');
    el.innerHTML = html;
    document.getElementById('screens').appendChild(el);
    renderMath(el);
    let pop = () => {};
    const close = () => { pop(); el.remove(); };
    if (onClose) pop = pushKeys(e => { const k = e.key.toLowerCase(); if (k === 'escape' || k === 'x' || k === 'c') { e.preventDefault(); close(); onClose(); } });
    else pop = pushKeys(() => {});
    el.close = close;
    return el;
  }

  function toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    layer().appendChild(t);
    Sfx.select();
    setTimeout(() => t.remove(), 2600);
  }

  function fade(toBlack, ms) {
    const f = document.getElementById('fader');
    f.style.transitionDuration = (ms || 400) + 'ms';
    f.classList.toggle('on', toBlack);
    return new Promise(r => setTimeout(r, ms || 400));
  }

  // Full-screen narration over the dusk, one line at a time (used for the prologue and big moments).
  function narrate(lines) {
    return new Promise(async resolve => {
      const el = document.createElement('div');
      el.className = 'narrate';
      document.getElementById('screens').appendChild(el);
      for (const line of lines) {
        el.innerHTML = '<div class="nl"></div><div class="dlg-next">▼</div>';
        const nl = el.querySelector('.nl');
        await new Promise(res => {
          let k = 0, done = false;
          const tm = setInterval(() => { k++; nl.textContent = line.slice(0, k); if (k % 2 === 0) Sfx.blip(380); if (k >= line.length) { clearInterval(tm); done = true; } }, 32);
          const go = () => { if (!done) { clearInterval(tm); nl.textContent = line; done = true; return; } el.removeEventListener('click', go); pop(); res(); };
          el.addEventListener('click', go);
          const pop = pushKeys(e => { if (isOk(e)) { e.preventDefault(); go(); } });
        });
      }
      el.remove();
      resolve();
    });
  }

  function card(title, sub, button) {
    return new Promise(resolve => {
      const el = document.createElement('div');
      el.className = 'chapter-card';
      // a window rising out of the dusk: a small kicker, the title in amber like the logo, a heart.
      // card('CHAPTER 4', 'THE RISING') reads as "Chapter 4" over "The Rising".
      const tc = t => String(t).toLowerCase().replace(/(^|\s|-)([a-z])/g, (_, a, c) => a + c.toUpperCase());
      const ch = /^CHAPTER (\d+)$/i.exec(title.trim());
      const kicker = ch && sub ? 'Chapter ' + ch[1] : 'Lowmarsh', big = ch && sub ? tc(sub) : tc(title), small = ch && sub ? '' : sub || '';
      el.innerHTML = '<div class="cc-win win"><div class="cc-kicker">' + esc(kicker) + '</div><div class="cc-title">' + esc(big) + '</div>' +
        (small ? '<div class="cc-sub">' + esc(small) + '</div>' : '') + '<div class="cc-heart"></div>' +
        '<button class="btn primary">' + esc(button || 'Continue ▸') + '</button></div>';
      document.getElementById('screens').appendChild(el);
      Sfx.win();
      const done = () => { pop(); el.remove(); resolve(); };
      el.querySelector('button').addEventListener('click', done);
      const pop = pushKeys(e => { if (isOk(e)) { e.preventDefault(); done(); } });
    });
  }

  window.UI = { say, choose, panel, toast, fade, narrate, card, pushKeys, renderMath, esc };
})();
