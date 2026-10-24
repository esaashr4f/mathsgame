// Maths input engine: parses what the player types (e.g. "2√3", "3x^2 - 4/x", "(3,-2)")
// and checks it against an expected answer. Works in the browser and in Node (tools/validate.js).
(function (root) {
  'use strict';

  const FUNCS = {
    sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
    ln: Math.log, log: Math.log10, exp: Math.exp, abs: Math.abs,
  };
  const CONSTS = { pi: Math.PI, e: Math.E };
  const WORDS = Object.keys(FUNCS).concat(Object.keys(CONSTS)).sort((a, b) => b.length - a.length);

  function normalise(s) {
    return String(s)
      .replace(/[−–—]/g, '-')
      .replace(/[×·]/g, '*')
      .replace(/÷/g, '/')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^(' + [...m].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c) >= 0 ? '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c) : '-').join('') + ')')
      .replace(/½/g, '(1/2)').replace(/¼/g, '(1/4)').replace(/¾/g, '(3/4)').replace(/⅓/g, '(1/3)').replace(/⅔/g, '(2/3)')
      .replace(/\*\*/g, '^')
      .replace(/°/g, '')
      .replace(/[{\[]/g, '(').replace(/[}\]]/g, ')')
      .trim();
  }

  function tokenize(src) {
    const s = normalise(src);
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (c === ' ') { i++; continue; }
      const num = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (num) { out.push({ t: 'num', v: parseFloat(num[1]) }); i += num[1].length; continue; }
      if (/[a-zA-Z]/.test(c)) {
        const lower = s.slice(i).toLowerCase();
        const w = WORDS.find(w => lower.startsWith(w));
        if (w) {
          out.push(FUNCS[w] ? { t: 'fn', v: w } : { t: 'const', v: w });
          i += w.length;
        } else {
          // Variables are single letters, case-sensitive except x/y style letters keep their case.
          out.push({ t: 'var', v: c });
          i++;
        }
        continue;
      }
      if ('+-*/^'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
      if (c === '(' || c === ')') { out.push({ t: c }); i++; continue; }
      throw new Error('Unexpected "' + c + '"');
    }
    // Implicit multiplication: 2x, 3(x+1), x(x-2), (x+1)(x-1), 2sqrt3, 2pi
    const res = [];
    const endsValue = t => t && (t.t === 'num' || t.t === 'var' || t.t === 'const' || t.t === ')');
    const startsValue = t => t && (t.t === 'num' || t.t === 'var' || t.t === 'const' || t.t === 'fn' || t.t === '(');
    for (let k = 0; k < out.length; k++) {
      if (k > 0 && endsValue(out[k - 1]) && startsValue(out[k])) res.push({ t: 'op', v: '*', implicit: true });
      res.push(out[k]);
    }
    return res;
  }

  function parse(src) {
    const toks = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const isOp = (v) => peek() && peek().t === 'op' && peek().v === v;

    function expr() {
      let left = term();
      while (isOp('+') || isOp('-')) {
        const op = toks[p++].v;
        left = { k: 'bin', op, a: left, b: term() };
      }
      return left;
    }
    function term() {
      let left = unary();
      while (isOp('*') || isOp('/')) {
        const op = toks[p++].v;
        left = { k: 'bin', op, a: left, b: unary() };
      }
      return left;
    }
    function unary() {
      if (isOp('-')) { p++; return { k: 'neg', a: unary() }; }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (isOp('^')) { p++; return { k: 'bin', op: '^', a: base, b: unary() }; }
      return base;
    }
    function primary() {
      const t = toks[p];
      if (!t) throw new Error('Answer ends too early');
      if (t.t === 'num') { p++; return { k: 'num', v: t.v }; }
      if (t.t === 'var') { p++; return { k: 'var', v: t.v }; }
      if (t.t === 'const') { p++; return { k: 'const', v: t.v }; }
      if (t.t === '(') {
        p++;
        const e = expr();
        if (!peek() || peek().t !== ')') throw new Error('Missing )');
        p++;
        return { k: 'paren', a: e };
      }
      if (t.t === 'fn') {
        p++;
        // sqrt(3), sqrt3, sin x — without brackets the function takes the next power-level term
        const arg = (peek() && peek().t === '(') ? primary() : power();
        return { k: 'fn', f: t.v, a: arg };
      }
      throw new Error('Unexpected "' + (t.v || t.t) + '"');
    }

    if (!toks.length) throw new Error('Empty answer');
    const tree = expr();
    if (p < toks.length) throw new Error('Unexpected "' + (toks[p].v || toks[p].t) + '"');
    return tree;
  }

  function evaluate(node, vars) {
    switch (node.k) {
      case 'num': return node.v;
      case 'const': return CONSTS[node.v];
      case 'var':
        if (vars && node.v in vars) return vars[node.v];
        if (vars && node.v.toLowerCase() in vars) return vars[node.v.toLowerCase()];
        throw new Error('Unknown letter "' + node.v + '"');
      case 'paren': return evaluate(node.a, vars);
      case 'neg': return -evaluate(node.a, vars);
      case 'fn': return FUNCS[node.f](evaluate(node.a, vars));
      case 'bin': {
        const a = evaluate(node.a, vars), b = evaluate(node.b, vars);
        switch (node.op) {
          case '+': return a + b;
          case '-': return a - b;
          case '*': return a * b;
          case '/': return a / b;
          case '^': return Math.pow(a, b);
        }
      }
    }
    throw new Error('Bad expression');
  }

  function varsIn(node, acc) {
    acc = acc || new Set();
    if (node.k === 'var') acc.add(node.v);
    ['a', 'b'].forEach(c => node[c] && varsIn(node[c], acc));
    return acc;
  }

  // LaTeX preview so the player can see how their typing was understood.
  function toTex(node) {
    switch (node.k) {
      case 'num': return String(node.v);
      case 'const': return node.v === 'pi' ? '\\pi' : 'e';
      case 'var': return node.v;
      case 'paren': return '\\left(' + toTex(node.a) + '\\right)';
      case 'neg': return '-' + toTex(node.a);
      case 'fn':
        if (node.f === 'sqrt') return '\\sqrt{' + toTex(node.a.k === 'paren' ? node.a.a : node.a) + '}';
        if (node.f === 'abs') return '\\left|' + toTex(node.a.k === 'paren' ? node.a.a : node.a) + '\\right|';
        return '\\' + (node.f === 'arcsin' || node.f === 'arccos' || node.f === 'arctan' ? node.f.replace('arc', 'arc') : node.f) + '\\left(' + toTex(node.a.k === 'paren' ? node.a.a : node.a) + '\\right)';
      case 'bin': {
        const strip = n => (n.k === 'paren' ? n.a : n);
        if (node.op === '/') return '\\frac{' + toTex(strip(node.a)) + '}{' + toTex(strip(node.b)) + '}';
        if (node.op === '^') return '{' + toTex(node.a) + '}^{' + toTex(strip(node.b)) + '}';
        if (node.op === '*') {
          const implicitOk = node.b.k === 'var' || node.b.k === 'paren' || node.b.k === 'fn' || node.b.k === 'const' ||
            (node.b.k === 'bin' && node.b.op === '^' && node.b.a.k !== 'num');
          return toTex(node.a) + (implicitOk && node.a.k !== 'bin' ? '' : ' \\times ') + toTex(node.b);
        }
        return toTex(node.a) + ' ' + node.op + ' ' + toTex(node.b);
      }
    }
    return '?';
  }

  // ---------- answer checking ----------

  // "y = 3x + 1", "f'(x) = ...", "dy/dx = 6x", "x = 4" -> right-hand side only
  function stripLhs(s) {
    s = String(s).trim();
    const parts = s.split('=');
    if (parts.length === 2 && !/[<>]/.test(s)) return parts[1].trim();
    return s;
  }

  function stripUnits(s) {
    return String(s).replace(/\s*(m\/s\^?2|m\/s²|m\/s|ms\^-?\d|m\^?[23²³]|cm\^?[23²³]|kg|km|cm|mm|g|N|J|W|m|s|h|metres|meters|metre|seconds|second|secs|newtons|degrees|deg|radians|rad|units|people|apples|fish|days|years|minutes|mins|hours|°C|C)\s*$/i, '').replace(/^\s*[£$€]\s*/, '').trim();
  }

  // What students actually type around an answer: labels ("answer:", "so"), working chains ("4 = 2^2, so 4^(x+1) = 2^(2x+2)"),
  // ≈, a full stop, thousands commas, percentages and mixed numbers. Keep just the final answer.
  function finalAnswer(s, keepCommas) {
    s = String(s).replace(/≈|≃/g, '=').replace(/[.;!]+\s*$/, '').trim();
    const lastPart = stripUnits(s.split('=').pop().trim());
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(lastPart)) s = lastPart.replace(/,/g, '');
    // only treat commas as working when it looks like working ("4 = 2^2, so ..."), never "3, -4" for a single answer
    if (!keepCommas && /=|\b(so|therefore|hence|thus|then)\b/i.test(s)) {
      const parts = s.split(/,\s*(?:so|therefore|hence|thus|then)?\s*/i);
      if (parts.length > 1) s = parts[parts.length - 1];
    }
    s = s.replace(/^.*\b(?:answer|ans|so|therefore|hence|thus|giving|gives)\b\s*:?\s*/i, '').replace(/^.*:\s*/, '');
    if (s.includes('=') && !/[<>]/.test(s)) s = s.split('=').pop();
    s = s.trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
    const mixed = /^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (mixed) s = mixed[1] + '(' + mixed[2] + '+' + mixed[3] + '/' + mixed[4] + ')';
    s = s.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
    return s;
  }
  // "e^2x" and "4^x+1" written without brackets: students usually mean the whole run after ^ is the power.
  const greedyPowers = s => String(s).replace(/\^\s*(-?[^\s()^]+)/g, (m, e) => (/^-?[\d.]+$/.test(e) ? m : '^(' + e + ')'));
  const wantsExact = step => !!(step.exact || /exact|surd|simplest|in the form|as a fraction/i.test(step.ask || ''));
  // "Write 4^(x+1) as a power of 2. Enter the power": also accept the whole power, 2^(2x+2) or (2^2)^(x+1)
  function powerBase(step) { const m = /power of \$?\s*(\d+|x)\s*\$?/i.exec(step.ask || ''); return m ? m[1] : null; }

  function numValue(s) {
    const tree = parse(stripUnits(finalAnswer(stripLhs(s), true)));
    if (varsIn(tree).size) throw new Error('Expected a number, not letters');
    return evaluate(tree, {});
  }

  function closeEnough(given, expected, step) {
    if (!isFinite(given) || !isFinite(expected)) return false;
    if (step && step.strict) return Math.abs(given - expected) < 0.5;
    if (step && step.tol != null && Math.abs(given - expected) <= step.tol + 1e-9) return true;
    const tight = Math.max(1e-6 * Math.abs(expected), 1e-9);
    if (Math.abs(given - expected) <= tight) return true;
    if (step && step.dp != null) return Math.abs(given - expected) <= 0.5 * Math.pow(10, -step.dp) + 1e-9;
    if (step && step.sf != null) {
      const mag = Math.floor(Math.log10(Math.abs(expected) || 1));
      return Math.abs(given - expected) <= 0.5 * Math.pow(10, mag - step.sf + 1) + 1e-9;
    }
    return false;
  }

  function expectedNum(ans) {
    return typeof ans === 'number' ? ans : evaluate(parse(String(ans)), {});
  }

  function splitList(s) {
    return String(s).replace(/^\s*\{|\}\s*$/g, '')
      .replace(/\band\b|\bor\b/gi, ',')
      .split(/[,;]/)
      .map(x => finalAnswer(stripLhs(x.trim()), true))
      .filter(Boolean);
  }

  function matchMultiset(givenVals, expectedVals, step) {
    if (givenVals.length !== expectedVals.length) return false;
    const used = new Array(expectedVals.length).fill(false);
    return givenVals.every(g => {
      const idx = expectedVals.findIndex((e, k) => !used[k] && closeEnough(g, e, step));
      if (idx < 0) return false;
      used[idx] = true;
      return true;
    });
  }

  const SAMPLE_POINTS = [0.37, 1.13, 2.71, -0.83, 3.3, 0.61, -1.7, 4.2];

  function sameFunction(givenTree, expectedTree, varNames, upToConstant) {
    let valid = 0, offset = null;
    for (let k = 0; k < SAMPLE_POINTS.length; k++) {
      const vars = {};
      varNames.forEach((v, j) => { vars[v] = SAMPLE_POINTS[(k + j * 3) % SAMPLE_POINTS.length] + j * 0.29; });
      let e, g;
      try { e = evaluate(expectedTree, vars); } catch (err) { return false; }
      if (!isFinite(e)) continue;
      g = evaluate(givenTree, vars); // throws for unknown letters -> caught by caller
      if (!isFinite(g)) return false;
      let diff = g - e;
      if (upToConstant) {
        if (offset === null) offset = diff;
        diff -= offset;
      }
      if (Math.abs(diff) > 1e-6 * Math.max(1, Math.abs(e))) return false;
      valid++;
    }
    return valid >= 4;
  }

  function parsePoint(s) {
    const m = /^\s*\(?\s*([^,]+?)\s*,\s*([^,]+?)\s*\)?\s*$/.exec(stripLhs(s));
    if (!m) throw new Error('Write a point like (3, -2)');
    return [numValue(m[1]), numValue(m[2])];
  }

  function tryNum(s) { try { const t = parse(stripUnits(s)); return varsIn(t).size ? null : evaluate(t, {}); } catch (e) { return null; } }
  // The whole power typed instead of just the exponent, e.g. 2^(2x+2) when asked for the power of 2.
  function powerForm(step, s, wantNum) {
    const base = powerBase(step);
    if (!base) return false;
    try {
      for (const src of [s, greedyPowers(s)]) {
        const tree = parse(src);
        const vars = step.vars || ['x'];
        const ans = parse(String(step.answer));
        let valid = 0;
        for (const x of [0.37, 1.13, 2.71, 0.61]) {
          const env = { x };
          const g = evaluate(tree, env), b = base === 'x' ? x : Number(base);
          const e = evaluate(ans, env);
          if (!isFinite(g) || g <= 0) { valid = -99; break; }
          if (Math.abs(Math.log(g) / Math.log(b) - e) > 1e-6 * Math.max(1, Math.abs(e))) { valid = -99; break; }
          valid++;
        }
        if (valid >= 4 && /\^/.test(src)) return true;
      }
    } catch (e) { /* not a power */ }
    return false;
  }

  /**
   * Check a player's input against a step definition.
   * Returns { ok, message? , code? } — message explains format problems or known slip-ups.
   */
  function check(step, input) {
    const r = checkOne(step, input);
    // a question can list other answers that also deserve the mark (e.g. another valid form or a second solution)
    if (!r.ok && step.accept) for (const a of step.accept) { const r2 = checkOne(Object.assign({}, step, { answer: a, accept: null }), input); if (r2.ok) return r2; }
    return r;
  }
  function checkOne(step, input) {
    const raw = String(input == null ? '' : input).trim();
    if (step.type === 'choice') return { ok: Number(input) === step.answer };
    if (!raw) return { ok: false, message: 'Type an answer first.', format: true };

    try {
      switch (step.type || 'num') {
        case 'num': {
          if (step.exact && /\d\.\d/.test(raw) && !/\./.test(String(step.answer))) {
            // a decimal that is exactly right (5.875 for 47/8) is exact; a rounded one isn't
            const given = numValue(finalAnswer(raw));
            if (closeEnough(given, expectedNum(step.answer), {})) return { ok: true };
            const close = closeEnough(given, expectedNum(step.answer), { sf: 3 });
            return { ok: false, message: close ? 'Right value, but the question wants an exact answer (surds/fractions, no decimals).' : undefined, code: close ? 'inexact' : undefined };
          }
          const want = expectedNum(step.answer);
          let v;
          try { v = numValue(finalAnswer(raw)); } catch (err) {
            const alt = tryNum(greedyPowers(finalAnswer(raw)));
            if (alt != null && closeEnough(alt, want, step)) return { ok: true };
            const pw = powerForm(step, finalAnswer(raw), want);
            if (pw) return { ok: true };
            throw err;
          }
          if (step.range) return { ok: v >= step.range[0] && v <= step.range[1] };
          if (closeEnough(v, want, step)) return { ok: true };
          const alt = tryNum(greedyPowers(finalAnswer(raw)));
          if (alt != null && closeEnough(alt, want, step)) return { ok: true };
          // not asked for an exact answer: 3 significant figures (or better) is fine, as in the exam
          if (!wantsExact(step) && step.dp == null && step.sf == null && closeEnough(v, want, { sf: 3 })) return { ok: true };
          // A rounded decimal of the right value isn't a maths slip: say so, and let them try again.
          if (/\d\.\d/.test(raw) && step.dp == null && step.sf == null && closeEnough(v, want, { sf: 3 }))
            return { ok: false, format: true, code: 'rounded', message: 'Very close: is that rounded? Give the exact value (a fraction or surd is fine, like 5/8 or 2√5), or more decimal places.' };
          return { ok: false };
        }
        case 'set': {
          const given = splitList(raw).map(numValue);
          const expected = step.answer.map(expectedNum);
          const ok = matchMultiset(given, expected, step);
          if (!ok && given.length < expected.length && given.every(g => expected.some(e => closeEnough(g, e, step))))
            return { ok: false, message: 'Correct so far — but there ' + (expected.length - given.length === 1 ? 'is another value' : 'are more values') + '. Separate them with commas.', code: 'missing' };
          return { ok };
        }
        case 'tuple': {
          const given = splitList(raw).map(numValue);
          const expected = step.answer.map(expectedNum);
          return { ok: given.length === expected.length && given.every((g, k) => closeEnough(g, expected[k], step)) };
        }
        case 'point': {
          const [x, y] = parsePoint(raw);
          const [ex, ey] = step.answer.map(expectedNum);
          const ok = closeEnough(x, ex, step) && closeEnough(y, ey, step);
          if (!ok && closeEnough(x, ey, step) && closeEnough(y, ex, step)) return { ok: false, message: 'Coordinates swapped? Points are (x, y).', code: 'swapped' };
          return { ok };
        }
        case 'vector': {
          let comps;
          if (raw.includes(',')) comps = parsePoint(raw.replace(/[<⟨]/g, '(').replace(/[>⟩]/g, ')'));
          else {
            const tree = parse(stripLhs(raw).replace(/\bi\b/g, 'i'));
            const at = (i, j) => evaluate(tree, { i, j, k: 0 });
            const c0 = at(0, 0);
            comps = [at(1, 0) - c0, at(0, 1) - c0];
            if (Math.abs(c0) > 1e-9) return { ok: false, message: 'Every term needs an i or j.' };
          }
          const exp = step.answer.map(expectedNum);
          return { ok: comps.every((c, k) => closeEnough(c, exp[k], step)) };
        }
        case 'line': {
          // Any equation of the same straight line: x + 2y - 19 = 0, 2y = 19 - x, y = -x/2 + 9.5 ...
          const sides = String(raw).split('=');
          if (sides.length > 2) return { ok: false };
          const given = parse(sides.length === 2 ? '(' + sides[0] + ')-(' + sides[1] + ')' : sides[0]);
          const unknown = [...varsIn(given)].filter(v => !['x', 'y'].includes(v.toLowerCase()));
          if (unknown.length) return { ok: false, message: 'Use x and y only.', format: true };
          const expected = parse(step.answer);
          let ratio = null, valid = 0;
          for (let k = 0; k < SAMPLE_POINTS.length; k++) {
            const v = { x: SAMPLE_POINTS[k], y: SAMPLE_POINTS[(k + 3) % SAMPLE_POINTS.length] + 0.29 };
            const e = evaluate(expected, v), g = evaluate(given, v);
            if (Math.abs(e) < 1e-9) continue;
            if (ratio === null) ratio = g / e;
            if (!isFinite(ratio) || Math.abs(ratio) < 1e-9 || Math.abs(g - ratio * e) > 1e-6 * Math.max(1, Math.abs(g))) return { ok: false };
            valid++;
          }
          return { ok: valid >= 4 };
        }
        case 'expr':
        case 'antideriv':
        case 'integral': {
          let s = finalAnswer(stripLhs(raw));
          if (step.type === 'integral') {
            const withoutC = s.replace(/\s*\+\s*[cCkK]\s*$/, '').replace(/^\s*[cCkK]\s*\+\s*/, '');
            if (withoutC === s) {
              const t = parse(s);
              if (sameFunction(t, parse(step.answer), step.vars || ['x'], true))
                return { ok: false, message: 'So close — you forgot the + c! An indefinite integral is a whole family of curves.', code: 'plusc' };
              return { ok: false };
            }
            s = withoutC;
          }
          const vars = step.vars || ['x'];
          const tree = parse(s);
          const unknown = [...varsIn(tree)].filter(v => !vars.includes(v) && !vars.includes(v.toLowerCase()));
          if (unknown.length) return { ok: false, message: 'Your answer uses "' + unknown[0] + '" — this answer should only use ' + vars.join(', ') + '.', format: true };
          if (step.forbid && step.forbid.some(f => new RegExp(f).test(normalise(s))))
            return { ok: false, message: step.forbidMessage || 'Equivalent, but not simplified into the form asked for.', code: 'form' };
          if (sameFunction(tree, parse(step.answer), vars, step.type !== 'expr')) return { ok: true };
          try { if (sameFunction(parse(greedyPowers(s)), parse(step.answer), vars, step.type !== 'expr')) return { ok: true }; } catch (e) { /* not that either */ }
          if (powerForm(step, s)) return { ok: true };
          return { ok: false };
        }
      }
    } catch (err) {
      const working = /=.*=|,\s*so\b|\bso\b|\btherefore\b/i.test(raw);
      return { ok: false, message: working ? 'Type just the final answer to this step (your working can go on the scratch pad).' : 'Couldn\'t read that: ' + err.message + '.', format: true };
    }
    return { ok: false };
  }

  function preview(step, input) {
    if (!input || !String(input).trim()) return '';
    try {
      if (step.type === 'set' || step.type === 'tuple') return splitList(input).map(x => toTex(parse(x))).join(',\\; ');
      if (step.type === 'point' || (step.type === 'vector' && input.includes(','))) {
        const m = /^\s*\(?\s*([^,]+?)\s*,\s*([^,]+?)\s*\)?\s*$/.exec(stripLhs(input));
        return m ? '\\left(' + toTex(parse(m[1])) + ',\\ ' + toTex(parse(m[2])) + '\\right)' : '';
      }
      if (step.type === 'line') return String(input).split('=').map(x => toTex(parse(x))).join(' = ');
      return toTex(parse(stripUnits(finalAnswer(stripLhs(input)))));
    } catch (e) {
      return null;
    }
  }

  const api = { parse, evaluate, check, preview, toTex, normalise };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathIn = api;
})(typeof window !== 'undefined' ? window : globalThis);
