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
