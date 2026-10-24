// Tiny WebAudio sound kit: text blips, hits, hurts. No audio files needed.
window.Sfx = (function () {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, slide) {
    if (!enabled) return;
    const c = ac();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.05, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  }

  return {
    setEnabled(v) { enabled = v; },
    blip(pitch) { tone(pitch || 440, 0.045, 'square', 0.025); },
    select() { tone(660, 0.06, 'square', 0.04); },
    move() { tone(520, 0.035, 'square', 0.03); },
    confirm() { tone(784, 0.05, 'square', 0.045); setTimeout(() => tone(1175, 0.09, 'square', 0.045), 55); },
    hit() { tone(220, 0.12, 'sawtooth', 0.06, 80); },
    crit() { tone(880, 0.08, 'square', 0.05); setTimeout(() => tone(1320, 0.12, 'square', 0.05), 70); },
    hurt() { tone(140, 0.2, 'sawtooth', 0.07, 60); },
    wrong() { tone(200, 0.18, 'triangle', 0.06, 120); },
    tick() { tone(1000, 0.03, 'sine', 0.03); },
    win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'square', 0.04), i * 110)); },
    sink() { tone(300, 0.5, 'sine', 0.04, 90); },
  };
})();

// Background music. Tracks are optional: list the files you have in audio/music/music.js and they play;
// anything missing falls back to a related track, or silence. Each place asks for a slot by name.
window.Music = (function () {
  const files = window.LOWMARSH_MUSIC || {};
  // what each slot falls back to when its own track hasn't been added
  const FALLBACK = {
    title: ['title', 'village'], study: ['study', 'title'],
    village: ['village'], gorge: ['gorge', 'wilds', 'village'], coast: ['coast', 'wilds', 'village'],
    meadows: ['meadows', 'wilds', 'village'], marsh: ['marsh', 'wilds'], flood: ['flood', 'meadows', 'wilds', 'village'],
    home: ['home', 'village'], townhall: ['townhall', 'home', 'village'], lighthouse: ['lighthouse', 'coast', 'home'], lock: ['lock', 'home'],
    encounter: ['encounter'], finale: ['finale', 'encounter'],
  };
  let vol = 0.5, cur = null, area = null;
  const overrides = [];
  const resolve = slot => { for (const s of (FALLBACK[slot] || [slot])) if (files[s]) return files[s]; return null; };
  function fade(el, to, ms, done) {
    const from = el.volume, t0 = performance.now();
    clearInterval(el._fade);
    el._fade = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k >= 1) { clearInterval(el._fade); if (done) done(); }
    }, 40);
  }
  function apply() {
    const slot = overrides.length ? overrides[overrides.length - 1] : area;
    const file = slot ? resolve(slot) : null;
    if (cur && cur.file === file) return;
    const old = cur;
    if (old) fade(old.el, 0, 900, () => old.el.pause());
    cur = null;
    if (!file || vol <= 0) return;
    const el = new Audio('audio/music/' + file);
    el.loop = true; el.volume = 0;
    cur = { file, el };
    start();
  }
  // Browsers only allow sound after the player has clicked or pressed something; try again then.
  function start() {
    if (!cur || !cur.el.paused || document.hidden) return;
    const el = cur.el;
    el.play().then(() => fade(el, vol, 900)).catch(() => {});
  }
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, start, true));
  document.addEventListener('visibilitychange', () => { if (!cur) return; if (document.hidden) cur.el.pause(); else start(); });

  return {
    get tracks() { return Object.keys(files).length; },
    get playing() { return cur ? cur.file : null; },
    // the music for where you are (the title, a place in the world)
    area(slot) { if (slot !== area) { area = slot; apply(); } },
    // music that takes over for a while (an encounter, a story moment); null means silence
    push(slot) { overrides.push(slot); apply(); },
    pop() { overrides.pop(); apply(); },
    setVolume(v) {
      vol = v;
      if (cur) { if (vol <= 0) { const old = cur; cur = null; fade(old.el, 0, 300, () => old.el.pause()); } else fade(cur.el, vol, 200); }
      else apply();
    },
  };
})();
