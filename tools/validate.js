#!/usr/bin/env node
// Validates the question bank and the answer checker.
//   node tools/validate.js
// Fails (exit 1) if any canonical answer is rejected, a known-wrong answer is accepted, or data is malformed.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const MathIn = require(path.join(root, 'js/math.js'));

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['js/data/characters.js', 'js/data/story.js', 'js/data/zones.js', 'js/data/questions.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
}
const { ZONES, QUESTIONS, STORY } = sandbox.window;

let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗ ' + msg); };

// ---------- checker unit tests ----------
const cases = [
  // [step, input, expectedOk]
  [{ type: 'num', answer: '2*sqrt(3)' }, '2√3', true],
  [{ type: 'num', answer: '2*sqrt(3)' }, '2sqrt3', true],
  [{ type: 'num', answer: '2*sqrt(3)' }, 'sqrt12', true],
  [{ type: 'num', answer: '2*sqrt(3)', exact: true }, '3.464', false],
  [{ type: 'num', answer: 0.5 }, '1/2', true],
  [{ type: 'num', answer: 0.5 }, 'x = 0.5', true],
  [{ type: 'num', answer: 6180 }, '6180 N', true],
  [{ type: 'num', answer: 'ln4/0.2', dp: 2 }, '6.93', true],
  [{ type: 'num', answer: 'ln4/0.2', dp: 2 }, '6.9', false],
  [{ type: 'num', answer: 11.025, sf: 3 }, '11.0', true],
  [{ type: 'num', answer: 11.025, sf: 3 }, '11.2', false],
  [{ type: 'expr', answer: '3x^2-4/x' }, '3x²-4x^-1', true],
  [{ type: 'expr', answer: '3x^2-4/x' }, '3x^2 - 4x^(-1)', true],
  [{ type: 'expr', answer: '3x^2-4/x' }, '3x^2+4/x', false],
  [{ type: 'expr', answer: 'x^2-1' }, '(x+1)(x-1)', true],
  [{ type: 'expr', answer: '-3x/4+13/2' }, 'y = 6.5 - 0.75x', true],
  [{ type: 'expr', answer: 'sqrt(x)' }, 'x^(1/2)', true],
  [{ type: 'expr', answer: '2x' }, '2y', false],
  [{ type: 'integral', answer: '2x^3' }, '2x^3 + c', true],
  [{ type: 'integral', answer: '2x^3' }, '2x^3', false],
  [{ type: 'antideriv', answer: '2x^3' }, '2x^3 + 7', true],
  [{ type: 'set', answer: [3, -4] }, '-4, 3', true],
  [{ type: 'set', answer: [3, -4] }, 'x = 3 or x = -4', true],
  [{ type: 'set', answer: [3, -4] }, '3', false],
  [{ type: 'point', answer: [3, -2] }, '(3,-2)', true],
  [{ type: 'point', answer: [3, -2] }, '(-2, 3)', false],
  [{ type: 'vector', answer: [6, -8] }, '6i - 8j', true],
  [{ type: 'vector', answer: [6, -8] }, '(6, -8)', true],
  [{ type: 'vector', answer: [6, -8] }, '6i + 8j', false],
  [{ type: 'choice', answer: 2 }, 2, true],
  [{ type: 'choice', answer: 2 }, 1, false],
];
console.log('Checker tests');
for (const [step, input, want] of cases) {
  const got = MathIn.check(step, input).ok;
  if (got !== want) fail(`${JSON.stringify(step)} with "${input}" → ${got}, expected ${want}`);
}

// ---------- data validation ----------
console.log('Question bank');
const zoneIds = new Set(ZONES.map(z => z.id));
const ids = new Set();

function canonicalInput(step) {
  const a = step.answer;
  switch (step.type) {
    case 'choice': return a;
    case 'set': return a.join(', ');
    case 'point': case 'vector': return '(' + a.join(', ') + ')';
    case 'integral': return a + ' + c';
    default: {
      if (step.exact || typeof a !== 'number') return String(a);
      return String(a);
    }
  }
}

for (const q of QUESTIONS) {
  const where = q.id || '(no id)';
  if (!q.id) fail('question missing id');
  if (ids.has(q.id)) fail(`${where}: duplicate id`);
  ids.add(q.id);
  if (!zoneIds.has(q.zone)) fail(`${where}: unknown zone "${q.zone}"`);
  if (!q.prompt) fail(`${where}: missing prompt`);
  if (!Array.isArray(q.steps) || !q.steps.length) { fail(`${where}: no steps`); continue; }
  q.steps.forEach((s, i) => {
    const at = `${where} step ${i + 1}`;
    if (!s.ask) fail(`${at}: missing ask`);
    if (!s.explain) fail(`${at}: missing explain`);
    if (!s.hint) fail(`${at}: missing hint`);
    const type = s.type || 'num';
    if (type === 'choice') {
      if (!Array.isArray(s.choices) || s.answer == null || s.answer >= s.choices.length) fail(`${at}: bad choice data`);
      return;
    }
    const res = MathIn.check(s, canonicalInput(s));
    if (!res.ok) fail(`${at}: canonical answer "${canonicalInput(s)}" rejected ${res.message ? '(' + res.message + ')' : ''}`);
    // A clearly wrong answer must not pass.
    if (type === 'num') {
      const wrong = MathIn.check(s, String(MathIn.evaluate(MathIn.parse(String(s.answer)), {}) + 1));
      if (wrong.ok) fail(`${at}: answer+1 accepted`);
    }
  });
}

for (const z of ZONES) {
  const n = QUESTIONS.filter(q => q.zone === z.id).length;
  if (!z.final && n < 2) fail(`zone ${z.id} has only ${n} questions`);
  if (!z.boss || !z.boss.intro || !z.boss.defeat) fail(`zone ${z.id} boss missing dialogue`);
}
if (!STORY.prologue.length) fail('missing prologue');

const totalMarks = QUESTIONS.reduce((t, q) => t + q.steps.reduce((m, s) => m + (s.marks || 1), 0), 0);
console.log(`  ${QUESTIONS.length} questions, ${QUESTIONS.reduce((t, q) => t + q.steps.length, 0)} steps, ${totalMarks} marks across ${ZONES.length} zones`);

if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log('\nAll good ✓');
