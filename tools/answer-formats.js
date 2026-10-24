#!/usr/bin/env node
// Every correct answer, written every reasonable way a student might type it, through the real checker.
//   node tools/answer-formats.js          summary + the first failures of each kind
//   node tools/answer-formats.js --all    every failure
// Exits 1 if any reasonable correct answer is rejected.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const MathIn = require(path.join(root, 'js/math.js'));
const sandbox = { window: {}, console };
sandbox.window.MathIn = MathIn;
sandbox.window.Graph = require(path.join(root, 'js/engine/graph.js'));
sandbox.Graph = sandbox.window.Graph;
vm.createContext(sandbox);
const load = f => vm.runInContext('(function(window){' + fs.readFileSync(path.join(root, f), 'utf8') + '\n})(window)', sandbox, { filename: f });
['js/data/topics.js', 'js/data/questions.js', 'js/data/papers.js', 'js/data/papers2.js', 'js/data/papers3.js', 'js/story/cast.js'].forEach(load);
Object.assign(sandbox, sandbox.window);
fs.readdirSync(path.join(root, 'js/story')).filter(f => /^ch\d|^finale|^sides/.test(f)).sort().forEach(f => { load('js/story/' + f); Object.assign(sandbox, sandbox.window); });
const { QUESTIONS, PAPERS, STORY_PROBLEMS } = sandbox.window;

const steps = [];
QUESTIONS.forEach(q => q.steps.forEach((s, i) => steps.push({ where: q.id + '#' + (i + 1), s })));
PAPERS.forEach(p => p.questions.forEach(q => q.steps.forEach((s, i) => steps.push({ where: q.id + '#' + (i + 1), s }))));
Object.values(STORY_PROBLEMS).forEach(q => q.steps.forEach((s, i) => steps.push({ where: q.id + '#' + (i + 1), s })));

const val = a => (typeof a === 'number' ? a : MathIn.evaluate(MathIn.parse(String(a)), {}));
const fmt = (x, sf) => { const v = Number(x.toPrecision(sf)); return String(v); };
const isInt = v => Math.abs(v - Math.round(v)) < 1e-9;
function frac(v) {
  for (let q = 1; q <= 400; q++) { const p = Math.round(v * q); if (Math.abs(p / q - v) < 1e-9) return [p, q]; }
  return null;
}
const wantsExact = s => s.exact || /exact|surd|simplest|in the form|as a fraction/i.test(s.ask || '');

// ways of writing one number
function numberForms(a, s) {
  const v = val(a), out = new Set();
  const S = String(a);
  out.add(S);
  if (isInt(v)) out.add(String(Math.round(v)));
  const f = frac(v);
  if (f && f[1] !== 1) { out.add(f[0] + '/' + f[1]); out.add(f[0] + ' / ' + f[1]); if (f[0] < 0) out.add('−' + -f[0] + '/' + f[1]); }
  if (!isInt(v) && f && String(v).length < 8) out.add(String(v));
  if (/^\d*\*?sqrt\(?\d+\)?$|^\d*√\d+$/.test(S)) {
    out.add(S.replace(/sqrt\(?(\d+)\)?/g, '√$1').replace(/\*/g, ''));
    out.add(S.replace(/√(\d+)/g, 'sqrt($1)'));
  }
  if (s.dp != null) out.add(v.toFixed(s.dp));
  else if (s.sf != null) out.add(fmt(v, s.sf));
  else if (!wantsExact(s) && !isInt(v) && !(f && String(v).length < 8)) { out.add(fmt(v, 3)); out.add(fmt(v, 4)); out.add(fmt(v, 6)); }
  return [...out];
}

function variants(s) {
  const t = s.type || 'num', a = s.answer, out = [];
  const add = (x, why) => out.push([x, why]);
  if (t === 'num') {
    numberForms(a, s).forEach(n => {
      add(n, 'plain');
      add(' ' + n + ' ', 'spaces');
      add('x = ' + n, 'x = …');
      add('= ' + n, '= …');
      add('answer: ' + n, 'answer: …');
      add(n + '.', 'full stop');
    });
    const v = val(a);
    if (v >= 1000 && isInt(v)) { add(Math.round(v).toLocaleString('en-GB'), 'thousands comma'); }
    if (/ m$| m\b|metres|distance|length|height/.test(s.ask || '') && !/\//.test(String(a))) add(String(a) + ' m', 'units m');
  } else if (t === 'set' || t === 'tuple') {
    const forms = a.map(x => numberForms(x, s)[0]);
    const order = t === 'set' ? [forms, forms.slice().reverse()] : [forms];
    order.forEach(f => {
      add(f.join(', '), 'commas'); add(f.join(','), 'commas tight'); add(f.join('; '), 'semicolons');
      if (t === 'set') { add(f.join(' or '), 'or'); add(f.join(' and '), 'and'); add(f.map(x => 'x = ' + x).join(', '), 'x = …, x = …'); add(f.map(x => 'x=' + x).join(' or '), 'x=… or x=…'); add('{' + f.join(', ') + '}', 'braces'); }
    });
  } else if (t === 'point') {
    const [x, y] = a.map(n => numberForms(n, s)[0]);
    add('(' + x + ', ' + y + ')', '(x, y)'); add('(' + x + ',' + y + ')', '(x,y)'); add(x + ', ' + y, 'no brackets');
    add('x = ' + x + ', y = ' + y, 'x = …, y = …'); add('( ' + x + ' , ' + y + ' )', 'spaced');
  } else if (t === 'vector') {
    const [x, y] = a.map(n => numberForms(n, s)[0]);
    const ij = (x, y) => (val(x) === 0 ? '' : x + 'i') + (val(y) === 0 ? '' : (val(y) < 0 ? ' - ' + String(y).replace(/^-/, '') : (val(x) === 0 ? '' : ' + ') + y) + 'j');
    add(ij(x, y), 'ai + bj'); add(ij(x, y).replace(/ /g, ''), 'ai+bj tight'); add('(' + x + ', ' + y + ')', '(a, b)');
    add(ij(x, y).replace(/(\d)([ij])/g, '$1 $2'), 'a i + b j');
  } else if (t === 'expr' || t === 'antideriv' || t === 'integral') {
    const c = t === 'integral' ? ' + c' : '';
    add(a + c, 'as written'); add(String(a).replace(/\s/g, '') + c.replace(/ /g, ''), 'no spaces');
    add('y = ' + a + c, 'y = …');
    if (/x/.test(a)) add('f(x) = ' + a + c, 'f(x) = …');
    add(String(a).replace(/\^2/g, '²') + c, 'x²');
    add(String(a).replace(/\*/g, '×') + c, '×');
    if (t === 'integral') { add(a + ' + C', '+ C'); add(a + '+c', '+c'); add(a + ' + k', '+ k'); }
  } else if (t === 'line') {
    add(a + ' = 0', '… = 0'); add(String(a).replace(/\s/g, '') + '=0', 'tight');
  }
  return out;
}

const fails = [];
let tried = 0;
for (const { where, s } of steps) {
  if (s.type === 'choice') continue;
  for (const [input, why] of variants(s)) {
    tried++;
    let r;
    try { r = MathIn.check(s, input); } catch (e) { r = { ok: false, message: 'THREW ' + e.message }; }
    if (!r.ok) fails.push({ where, type: s.type || 'num', answer: s.answer, input, why, msg: r.message || '' });
  }
}
// ── and the other way round: typical mistakes must still be marked wrong ──
const wrongs = [];
let wrongTried = 0;
function mistakes(s) {
  const t = s.type || 'num', a = s.answer, out = [];
  try {
    if (t === 'num') {
      const v = val(a);
      [v * 2, v + 1, -v || 1, v / 10 || 7, v === 0 ? 1 : 1 / v].forEach(w => { if (Math.abs(w - v) > Math.max(1e-6, 0.01 * Math.abs(v))) out.push(String(Number(w.toPrecision(6)))); });
      if (v !== 0) out.push(v + ', ' + (v + 3));
    } else if (t === 'set') { const v = a.map(val); if (!v.every(x => v.some(y => Math.abs(y + x) < 1e-9))) out.push(v.map(x => -x).join(', ')); out.push(String(v[0])); if (v.length > 1) out.push(v.map(x => x + 1).join(', ')); }
    else if (t === 'point') { const v = a.map(val); out.push('(' + (v[0] + 1) + ', ' + v[1] + ')'); if (v[0] !== v[1]) out.push('(' + v[1] + ', ' + v[0] + ')'); }
    else if (t === 'vector') { const v = a.map(val); out.push((v[0] + 1) + 'i + ' + v[1] + 'j'); out.push('(' + -v[0] + ', ' + v[1] + ')'); }
    else if (t === 'expr' || t === 'antideriv') { out.push('(' + a + ')*2'); out.push('(' + a + ')+x'); out.push('-(' + a + ')'); }
    else if (t === 'integral') { out.push(a); out.push('(' + a + ')*2 + c'); }
    else if (t === 'line') { out.push('(' + a + ')+1 = 0'); }
  } catch (e) { /* skip */ }
  return out.filter(m => !(t === 'num' && s.range));
}
for (const { where, s } of steps) {
  if (s.type === 'choice') continue;
  for (const input of mistakes(s)) {
    wrongTried++;
    let r;
    try { r = MathIn.check(s, input); } catch (e) { r = { ok: false }; }
    if (r.ok) wrongs.push({ where, answer: s.answer, input });
  }
}
console.log(`${wrongTried} typical wrong answers tried, ${wrongs.length} wrongly accepted`);
wrongs.slice(0, process.argv.includes('--all') ? 1e9 : 12).forEach(f => console.log(`   ${f.where}  answer ${JSON.stringify(f.answer)}  typed "${f.input}"`));

const byWhy = {};
fails.forEach(f => { (byWhy[f.type + ': ' + f.why] = byWhy[f.type + ': ' + f.why] || []).push(f); });
console.log(`${steps.length} steps, ${tried} correct answers tried, ${fails.length} rejected`);
Object.entries(byWhy).sort((a, b) => b[1].length - a[1].length).forEach(([k, list]) => {
  console.log(`\n${k}: ${list.length}`);
  list.slice(0, process.argv.includes('--all') ? 1e9 : 4).forEach(f => console.log(`   ${f.where}  answer ${JSON.stringify(f.answer)}  typed "${f.input}"  ${f.msg}`));
});
process.exit(fails.length || wrongs.length ? 1 : 0);
