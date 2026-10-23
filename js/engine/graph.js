// Graphs: SVG plots of functions (for diagrams, graph-choice questions and calculus visuals) and an interactive
// grapher the player can use while working. svg() is pure string-building so data files and Node can use it.
(function (root) {
  'use strict';
  const MathIn = root.MathIn || (typeof require !== 'undefined' ? require('../math.js') : null);
  const COLORS = ['#3f6fb0', '#c0403a', '#2a9d6a', '#b07fc8', '#e07b39'];

  function compile(expr) {
    const tree = MathIn.parse(expr);
    return x => { try { return MathIn.evaluate(tree, { x }); } catch (e) { return NaN; } };
  }

  const fmtNum = v => (Math.abs(v) < 1e-9 ? '0' : Number.isInteger(v) ? String(v) : String(+v.toFixed(2)));

  /**
   * opts: { w, h, x:[min,max], y:[min,max], fns:[{f, color, dash, label}], points:[{x,y,label,color}],
   *         shade:{f, a, b, color}, vlines:[{x,label}], hlines:[{y,label}], ticks:true, plain:false, labels:{x:'x',y:'y'} }
   */
  function svg(o) {
    const W = o.w || 280, H = o.h || 200, pad = o.plain ? 6 : 18;
    const [x0, x1] = o.x || [-5, 5], [y0, y1] = o.y || [-5, 5];
    const sx = x => pad + (x - x0) / (x1 - x0) * (W - 2 * pad);
    const sy = y => H - pad - (y - y0) / (y1 - y0) * (H - 2 * pad);
    let s = '<svg class="graph" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="' + (o.bg || '#fffdf6') + '"/>';
    // grid + ticks
    if (o.ticks !== false && !o.plain) {
      const step = v => { const r = (v[1] - v[0]) / 8; const p = Math.pow(10, Math.floor(Math.log10(r))); return [1, 2, 5, 10].map(m => m * p).find(m => m >= r); };
      const gx = o.xstep || step([x0, x1]), gy = o.ystep || step([y0, y1]);
      for (let x = Math.ceil(x0 / gx) * gx; x <= x1 + 1e-9; x += gx) {
        s += '<line x1="' + sx(x) + '" y1="' + sy(y0) + '" x2="' + sx(x) + '" y2="' + sy(y1) + '" stroke="#e6e0cf" stroke-width="1"/>';
        if (Math.abs(x) > 1e-9 && y0 <= 0 && y1 >= 0) s += '<text x="' + sx(x) + '" y="' + (sy(0) + 11) + '" font-size="8" text-anchor="middle" fill="#8a826e">' + fmtNum(x) + '</text>';
      }
      for (let y = Math.ceil(y0 / gy) * gy; y <= y1 + 1e-9; y += gy) {
        s += '<line x1="' + sx(x0) + '" y1="' + sy(y) + '" x2="' + sx(x1) + '" y2="' + sy(y) + '" stroke="#e6e0cf" stroke-width="1"/>';
        if (Math.abs(y) > 1e-9 && x0 <= 0 && x1 >= 0) s += '<text x="' + (sx(0) - 3) + '" y="' + (sy(y) + 3) + '" font-size="8" text-anchor="end" fill="#8a826e">' + fmtNum(y) + '</text>';
      }
    }
    // shaded area under a curve
    if (o.shade) {
      const f = compile(o.shade.f), n = 80;
      let d = 'M' + sx(o.shade.a) + ',' + sy(0);
      for (let i = 0; i <= n; i++) { const x = o.shade.a + (o.shade.b - o.shade.a) * i / n; const y = Math.max(y0, Math.min(y1, f(x))); d += 'L' + sx(x).toFixed(1) + ',' + sy(y).toFixed(1); }
      d += 'L' + sx(o.shade.b) + ',' + sy(0) + 'Z';
      s += '<path d="' + d + '" fill="' + (o.shade.color || 'rgba(63,111,176,0.25)') + '"/>';
    }
    // axes
    const ax = Math.max(x0, Math.min(x1, 0)), ay = Math.max(y0, Math.min(y1, 0));
    s += '<line x1="' + sx(x0) + '" y1="' + sy(ay) + '" x2="' + sx(x1) + '" y2="' + sy(ay) + '" stroke="#3a3550" stroke-width="1.3"/>';
    s += '<line x1="' + sx(ax) + '" y1="' + sy(y0) + '" x2="' + sx(ax) + '" y2="' + sy(y1) + '" stroke="#3a3550" stroke-width="1.3"/>';
    if (!o.plain) {
      s += '<text x="' + (W - pad + 4) + '" y="' + (sy(ay) + 4) + '" font-size="10" font-style="italic" fill="#3a3550">' + ((o.labels && o.labels.x) || 'x') + '</text>';
      s += '<text x="' + (sx(ax) + 4) + '" y="' + (pad - 6) + '" font-size="10" font-style="italic" fill="#3a3550">' + ((o.labels && o.labels.y) || 'y') + '</text>';
    }
    (o.hlines || []).forEach(l => {
      s += '<line x1="' + sx(x0) + '" y1="' + sy(l.y) + '" x2="' + sx(x1) + '" y2="' + sy(l.y) + '" stroke="' + (l.color || '#2a9d6a') + '" stroke-dasharray="4 3" stroke-width="1.2"/>';
      if (l.label) s += '<text x="' + (sx(x1) - 2) + '" y="' + (sy(l.y) - 3) + '" font-size="9" text-anchor="end" fill="' + (l.color || '#2a9d6a') + '">' + l.label + '</text>';
    });
    (o.vlines || []).forEach(l => {
      s += '<line x1="' + sx(l.x) + '" y1="' + sy(y0) + '" x2="' + sx(l.x) + '" y2="' + sy(y1) + '" stroke="' + (l.color || '#b07fc8') + '" stroke-dasharray="4 3" stroke-width="1.2"/>';
      if (l.label) s += '<text x="' + (sx(l.x) + 3) + '" y="' + (pad + 8) + '" font-size="9" fill="' + (l.color || '#b07fc8') + '">' + l.label + '</text>';
    });
    // curves
    (o.fns || []).forEach((fn, k) => {
      const f = compile(fn.f), n = 360, span = y1 - y0;
      let d = '', pen = false, prev = null;
      const xa = fn.domain ? fn.domain[0] : x0, xb = fn.domain ? fn.domain[1] : x1;
      for (let i = 0; i <= n; i++) {
        const x = xa + (xb - xa) * i / n, y = f(x);
        const bad = !isFinite(y) || y > y1 + span * 2 || y < y0 - span * 2 || (prev !== null && Math.abs(y - prev) > span * 1.5);
        if (bad) { pen = false; prev = isFinite(y) ? y : null; continue; }
        const cy = Math.max(y0 - span * 0.05, Math.min(y1 + span * 0.05, y));
        d += (pen ? 'L' : 'M') + sx(x).toFixed(1) + ',' + sy(cy).toFixed(1);
        pen = true; prev = y;
      }
      s += '<path d="' + d + '" fill="none" stroke="' + (fn.color || COLORS[k % COLORS.length]) + '" stroke-width="' + (fn.width || 2) + '"' + (fn.dash ? ' stroke-dasharray="5 4"' : '') + ' stroke-linejoin="round"/>';
      if (fn.label) s += '<text x="' + (W - pad - 2) + '" y="' + (pad + 10 + k * 12) + '" font-size="10" text-anchor="end" fill="' + (fn.color || COLORS[k % COLORS.length]) + '">' + fn.label + '</text>';
    });
    (o.segments || []).forEach(g => {
      s += '<line x1="' + sx(g.a[0]) + '" y1="' + sy(g.a[1]) + '" x2="' + sx(g.b[0]) + '" y2="' + sy(g.b[1]) + '" stroke="' + (g.color || '#3a3550') + '" stroke-width="' + (g.width || 2) + '"' + (g.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
      if (g.label) s += '<text x="' + ((sx(g.a[0]) + sx(g.b[0])) / 2 + 4) + '" y="' + ((sy(g.a[1]) + sy(g.b[1])) / 2 - 4) + '" font-size="10" fill="' + (g.color || '#3a3550') + '">' + g.label + '</text>';
    });
    (o.circles || []).forEach(c => {
      const rx = Math.abs(sx(c.r) - sx(0)), ry = Math.abs(sy(c.r) - sy(0));
      s += '<ellipse cx="' + sx(c.cx) + '" cy="' + sy(c.cy) + '" rx="' + rx + '" ry="' + ry + '" fill="' + (c.fill || 'none') + '" stroke="' + (c.color || '#c0403a') + '" stroke-width="2"/>';
    });
    (o.points || []).forEach(p => {
      s += '<circle cx="' + sx(p.x) + '" cy="' + sy(p.y) + '" r="3.2" fill="' + (p.color || '#c0403a') + '" stroke="#fff" stroke-width="1"/>';
      if (p.label) s += '<text x="' + (sx(p.x) + (p.dx || 5)) + '" y="' + (sy(p.y) + (p.dy || -5)) + '" font-size="10" fill="#14141c">' + p.label + '</text>';
    });
    return s + '</svg>';
  }

  // A small sketch for graph-choice questions: no numbers, just the shape.
  const sketch = (f, x, y, extra) => svg(Object.assign({ w: 150, h: 110, x, y, fns: [{ f, color: '#14141c', width: 2 }], ticks: false, plain: true }, extra || {}));

  // ───────── interactive grapher (browser only) ─────────
  function tool(host, preset) {
    host.innerHTML =
      '<div class="grapher"><div class="gr-inputs"></div>' +
      '<div class="row"><button class="btn small" data-g="add">+ curve</button>' +
      '<label class="gr-range">x from <input data-r="x0" value="-5"> to <input data-r="x1" value="5"></label>' +
      '<label class="gr-range">y from <input data-r="y0" value="-5"> to <input data-r="y1" value="5"></label></div>' +
      '<div class="gr-plot"></div><div class="gr-read muted">Tap the graph to read off coordinates.</div></div>';
    const inputs = host.querySelector('.gr-inputs'), plot = host.querySelector('.gr-plot');
    const fns = (preset && preset.length ? preset : ['x^2 - 2x - 3']).slice();
    const range = () => { const v = k => parseFloat(host.querySelector('[data-r=' + k + ']').value); const r = { x: [v('x0'), v('x1')], y: [v('y0'), v('y1')] }; return r.x[0] < r.x[1] && r.y[0] < r.y[1] ? r : { x: [-5, 5], y: [-5, 5] }; };
    function draw() {
      const r = range();
      const ok = fns.filter(f => { try { MathIn.parse(f); return f.trim(); } catch (e) { return false; } });
      plot.innerHTML = svg({ w: 320, h: 230, x: r.x, y: r.y, fns: ok.map((f, i) => ({ f, color: COLORS[i % COLORS.length] })) });
      const el = plot.querySelector('svg');
      el.addEventListener('click', e => {
        const b = el.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width * 320, py = (e.clientY - b.top) / b.height * 230;
        const x = r.x[0] + (px - 18) / (320 - 36) * (r.x[1] - r.x[0]);
        const vals = ok.map((f, i) => '<span style="color:' + COLORS[i % COLORS.length] + '">y = ' + fmtNum(compile(f)(x)) + '</span>');
        host.querySelector('.gr-read').innerHTML = 'x = ' + fmtNum(x) + ' → ' + vals.join(' · ');
      });
    }
    function rows() {
      inputs.innerHTML = fns.map((f, i) => '<div class="gr-row"><span style="color:' + COLORS[i % COLORS.length] + '">y =</span><input class="ans" data-i="' + i + '" value="' + f.replace(/"/g, '&quot;') + '"><button class="btn small" data-del="' + i + '">✕</button></div>').join('');
      inputs.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => { fns[+inp.dataset.i] = inp.value; draw(); }));
      inputs.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => { fns.splice(+b.dataset.del, 1); rows(); draw(); }));
      inputs.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e => e.stopPropagation()));
    }
    host.querySelector('[data-g=add]').addEventListener('click', () => { fns.push(''); rows(); });
    host.querySelectorAll('[data-r]').forEach(i => { i.addEventListener('input', draw); i.addEventListener('keydown', e => e.stopPropagation()); });
    rows(); draw();
  }

  const api = { svg, sketch, tool };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Graph = api;
})(typeof window !== 'undefined' ? window : globalThis);
