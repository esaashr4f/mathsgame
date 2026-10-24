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

// Background music. Tracks are listed in audio/music/music.js; anything missing falls back to a related
// track, or silence. Each place asks for a slot by name. Played through Web Audio so loops are seamless:
// a track with `loop`/`start` is played as back-to-back repeats of its loop section, each blended into the
// next over a few milliseconds; a plain file name just loops the whole file.
window.Music = (function () {
  const files = window.LOWMARSH_MUSIC || {};
  // what each slot falls back to when its own track hasn't been added
  const FALLBACK = {
    title: ['title', 'village'], study: ['study', 'title'],
    village: ['village'], gorge: ['gorge', 'wilds', 'village'], coast: ['coast', 'wilds', 'village'],
    meadows: ['meadows', 'wilds', 'village'], southbank: ['southbank', 'meadows', 'wilds', 'village'], marsh: ['marsh', 'wilds'], flood: ['flood', 'meadows', 'wilds', 'village'],
    home: ['home', 'village'], townhall: ['townhall', 'home', 'village'], lighthouse: ['lighthouse', 'coast', 'home'], lock: ['lock', 'home'],
    encounter: ['encounter'], finale: ['finale', 'encounter'],
  };
  const XF = 0.08;          // seconds each repeat overlaps the next
  const FADE = 1.2;         // seconds to fade between tracks
  const LEVEL = 0.35;       // the music sits well under the game: 100% on the slider plays at 35% of the recording
  let vol = 0.5, area = null, ctx = null, master = null, cur = null;
  const overrides = [], buffers = {}, loading = {};
  const entry = slot => { for (const s of (FALLBACK[slot] || [slot])) if (files[s]) return typeof files[s] === 'string' ? { file: files[s] } : files[s]; return null; };

  function audio() {
    if (ctx) return ctx;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = vol * LEVEL;
    master.connect(ctx.destination);
    return ctx;
  }
  function load(file) {
    if (buffers[file]) return Promise.resolve(buffers[file]);
    if (!loading[file]) {
      loading[file] = fetch('audio/music/' + file).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(b => new Promise((res, rej) => audio().decodeAudioData(b, res, rej)))
        .then(buf => (buffers[file] = buf))
        .catch(() => { delete loading[file]; return null; });
    }
    return loading[file];
  }

  // One playing track: a gain node, and its repeats scheduled a little ahead of time.
  function play(e, buf) {
    const c = audio(), out = c.createGain();
    out.gain.setValueAtTime(0, c.currentTime);
    out.gain.linearRampToValueAtTime(1, c.currentTime + FADE);
    out.connect(master);
    const t = { file: e.file, out, sources: [], timer: 0, stopped: false };
    if (!e.loop) {
      const src = c.createBufferSource();
      src.buffer = buf; src.loop = true; src.connect(out); src.start();
      t.sources.push(src);
      return t;
    }
    const L = e.loop, S = e.start || 0;
    let next = c.currentTime + 0.05, first = true;
    const schedule = () => {
      if (t.stopped) return;
      while (next < c.currentTime + 3) {
        const g = c.createGain(), src = c.createBufferSource();
        src.buffer = buf; src.connect(g); g.connect(out);
        const begin = first ? next : next - XF / 2;
        const from = first ? S : S - XF / 2;
        // fade in over the overlap (not on the very first repeat), fade out over the next overlap
        g.gain.setValueAtTime(first ? 1 : 0, begin);
        if (!first) g.gain.linearRampToValueAtTime(1, next + XF / 2);
        g.gain.setValueAtTime(1, next + L - XF / 2);
        g.gain.linearRampToValueAtTime(0, next + L + XF / 2);
        src.start(begin, from, L + XF + (first ? XF / 2 : 0));
        src.onended = () => { t.sources = t.sources.filter(x => x !== src); };
        t.sources.push(src);
        next += L; first = false;
      }
      t.timer = setTimeout(schedule, 1000);
    };
    schedule();
    return t;
  }
  function stop(t, secs) {
    if (!t) return;
    t.stopped = true; clearTimeout(t.timer);
    const now = ctx.currentTime;
    t.out.gain.cancelScheduledValues(now);
    t.out.gain.setValueAtTime(t.out.gain.value, now);
    t.out.gain.linearRampToValueAtTime(0, now + secs);
    t.sources.forEach(s => { try { s.stop(now + secs + 0.05); } catch (err) { /* already stopped */ } });
  }

  let want = null;
  function apply() {
    const slot = overrides.length ? overrides[overrides.length - 1] : area;
    const e = slot && vol > 0 ? entry(slot) : null;
    want = e ? e.file : null;
    if (cur && cur.file === want) return;
    if (cur) { stop(cur, FADE); cur = null; }
    if (!e || !audio()) return;
    load(e.file).then(buf => {
      if (!buf || want !== e.file || (cur && cur.file === e.file)) return;
      cur = play(e, buf);
      if (ctx.state !== 'running') resume();
    });
  }
  // Browsers only start sound after the player has clicked or pressed something.
  function resume() { if (ctx && ctx.state !== 'running' && !document.hidden) ctx.resume().catch(() => {}); }
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, resume, true));
  document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend().catch(() => {}); else resume(); });

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
      if (master) master.gain.setTargetAtTime(Math.max(v * LEVEL, 0.0001), ctx.currentTime, 0.1);
      apply();
    },
  };
})();
